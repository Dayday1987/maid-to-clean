// This file goes in /api for Vercel

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Cleaning Service",
          },
          unit_amount: 1000,
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.origin}/dashboard/payment-success.html`,
    cancel_url: `${req.headers.origin}/dashboard/payments.html`,
  });

  res.json({ id: session.id });
}
