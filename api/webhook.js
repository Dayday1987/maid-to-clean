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

      console.log("Payment recorded successfully");
    } catch (err) {
      console.error("Database update error:", err);
    }
  }

  res.status(200).json({ received: true });
}
