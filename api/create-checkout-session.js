// File: /api/create-checkout-session.js

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // server-only key
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: "Missing appointmentId" });
    }

    // Fetch appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select("id, quoted_price, user_id, status")
      .eq("id", appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // 🔒 SECURITY: Only allow approved appointments
    if (appointment.status !== "approved") {
      return res
        .status(400)
        .json({ error: "Appointment not approved for payment" });
    }

    // Fetch user email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", appointment.user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Cleaning Service Booking",
            },
            unit_amount: Math.round(appointment.quoted_price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointment_id: appointment.id,
        user_id: appointment.user_id,
      },
      success_url: `${process.env.BASE_URL}/dashboard/payment-success.html`,
      cancel_url: `${process.env.BASE_URL}/dashboard/payments.html`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
