// File: /api/stripe-webhook.js

import Stripe from "stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // IMPORTANT: service role key
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const appointmentId = session.metadata.appointment_id;
    const userId = session.metadata.user_id;

    try {
      // Get appointment and user details for email
      const { data: appointment } = await supabase
        .from("appointments")
        .select("*, services (name), users (email, full_name)")
        .eq("id", appointmentId)
        .single();

      // Update appointment
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
      if (appointment) {
        try {
          await fetch(`${process.env.BASE_URL}/api/notify-booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerEmail: appointment.users?.email || session.customer_email,
              customerName: appointment.users?.full_name || '',
              serviceName: appointment.services?.name || 'Cleaning Service',
              appointmentDate: new Date(appointment.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
              appointmentTime: appointment.appointment_time,
              type: 'payment_confirmed'
            })
          });
        } catch (emailErr) {
          console.error('Payment confirmation email failed:', emailErr);
        }
      }

      console.log("Payment recorded successfully");
    } catch (err) {
      console.error("Database update error:", err);
    }
  }

  res.status(200).json({ received: true });
}
