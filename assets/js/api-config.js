// SUPABASE CONFIGURATION
// Replace with your environment variables

const SUPABASE_URL = "https://lihyhtcjrmkivmbvgnqp.supabase.co"; // <!-- SUPABASE_URL -->
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaHlodGNqcm1raXZtYnZnbnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzQyNTIsImV4cCI6MjA4NzkxMDI1Mn0.vMGlCujWsQp6d4tfFX3hLI6IxAf4OIj4hciuMFfw2q8"; // <!-- SUPABASE_ANON_KEY -->

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// STRIPE CONFIGURATION
const STRIPE_PUBLIC_KEY = "YOUR_STRIPE_PUBLIC_KEY"; // <!-- STRIPE_SECRET_KEY -->
const stripe = Stripe(STRIPE_PUBLIC_KEY);
