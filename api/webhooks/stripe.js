import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Vercel needs this to read the "raw" body from Stripe for security verification
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Verify the request actually came from Stripe
    const buf = await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(Buffer.from(data)));
    });

    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the "checkout.session.completed" event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { appointment_id } = session.metadata;

    // UPDATE SUPABASE
    const { error } = await supabase
      .from("payments")
      .insert({
        appointment_id: appointment_id,
        user_id: session.metadata.user_id,
        amount: session.amount_total / 100,
        status: "paid",
        stripe_session_id: session.id
      });

    if (error) console.error("Database update error:", error);
  }

  res.json({ received: true });
}
