// File: /api/create-checkout-session.js

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BASE_URL } = process.env;

  // ✅ Validate environment variables
  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !BASE_URL) {
    console.error("Missing required env vars:", {
      STRIPE_SECRET_KEY: !!STRIPE_SECRET_KEY,
      SUPABASE_URL: !!SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
      BASE_URL: !!BASE_URL,
    });
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: "Missing appointmentId" });
    }

    // Fetch appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select("id, quoted_price, user_id, status")
      .eq("id", appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error("Appointment fetch error:", appointmentError);
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== "approved") {
      return res.status(400).json({ error: "Appointment not approved for payment" });
    }

    if (!appointment.quoted_price || appointment.quoted_price <= 0) {
      return res.status(400).json({ error: "Invalid appointment price" });
    }

    // Fetch user email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
      appointment.user_id
    );

    if (userError || !userData?.user) {
      console.error("User fetch error:", userError);
      return res.status(404).json({ error: "User not found" });
    }

    const customerEmail = userData.user.email;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Cleaning Service Booking" },
            unit_amount: Math.round(appointment.quoted_price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointment_id: appointment.id,
        user_id: appointment.user_id,
      },
      success_url: `${BASE_URL}/dashboard/payment-success.html`,
      cancel_url: `${BASE_URL}/dashboard/payments.html`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Checkout session creation error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
