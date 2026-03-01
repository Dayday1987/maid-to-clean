// SUPABASE CONFIGURATION
// Replace with your environment variables

const SUPABASE_URL = "YOUR_SUPABASE_URL"; // <!-- SUPABASE_URL -->
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // <!-- SUPABASE_ANON_KEY -->

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// STRIPE CONFIGURATION
const STRIPE_PUBLIC_KEY = "YOUR_STRIPE_PUBLIC_KEY"; // <!-- STRIPE_SECRET_KEY -->
const stripe = Stripe(STRIPE_PUBLIC_KEY);
