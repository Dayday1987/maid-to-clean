// File: /api/stripe-webhook.js

import Stripe from "stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

// Initialize Stripe and Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // ✅ Match exactly the keys used in checkout session creation
        const appointmentId = session.metadata.appointment_id;
        const userId = session.metadata.user_id;

        if (!appointmentId || !userId) {
          console.warn("Webhook missing metadata:", session.metadata);
          return res.status(400).send("Missing appointment_id or user_id in metadata");
        }

        // Fetch appointment with related user and service info
        const { data: appointment, error: appointmentError } = await supabase
          .from("appointments")
          .select("*, services(name), users(email, full_name)")
          .eq("id", appointmentId)
          .single();

        if (appointmentError || !appointment) {
          console.error("Appointment fetch failed:", appointmentError);
          return res.status(404).send("Appointment not found");
        }

        // Update appointment status
        await supabase
          .from("appointments")
          .update({ status: "paid" })
          .eq("id", appointmentId);

        // Insert payment record
        await supabase.from("payments").insert([
          {
            user_id: userId,
            appointment_id: appointmentId,
            amount: session.amount_total / 100,
            status: "paid",
            stripe_session_id: session.id,
          },
        ]);

        // Send payment confirmation email
        try {
          await fetch(`${process.env.BASE_URL}/api/notify-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerEmail: appointment.users?.email || session.customer_email,
              customerName: appointment.users?.full_name || "",
              serviceName: appointment.services?.name || "Cleaning Service",
              appointmentDate: new Date(appointment.appointment_date).toLocaleDateString(
                "en-US",
                { weekday: "long", month: "long", day: "numeric", year: "numeric" }
              ),
              appointmentTime: appointment.appointment_time,
              type: "payment_confirmed",
            }),
          });
        } catch (emailErr) {
          console.error("Payment confirmation email failed:", emailErr);
        }

        console.log(`✅ Payment processed for appointment ${appointmentId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    res.status(500).send("Internal server error");
  }
}
