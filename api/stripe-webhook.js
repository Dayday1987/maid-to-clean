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
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🔥 THIS is the important part
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const appointmentId = session.metadata.appointmentId;

    console.log("Payment completed for:", appointmentId);

    // ✅ Update payment status
    await supabase
      .from("payments")
      .update({ status: "paid" })
      .eq("appointment_id", appointmentId);
  }

  res.status(200).json({ received: true });
}
