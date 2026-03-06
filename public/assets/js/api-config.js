// ================================
// SUPABASE CONFIGURATION
// ================================
const SUPABASE_URL = "https://lihyhtcjrmkivmbvgnqp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaHlodGNqcm1raXZtYnZnbnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzQyNTIsImV4cCI6MjA4NzkxMDI1Mn0.vMGlCujWsQp6d4tfFX3hLI6IxAf4OIj4hciuMFfw2q8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================
// STRIPE CONFIGURATION
// ================================
const STRIPE_PUBLIC_KEY = "pk_test_51T6671Gq9xS4z8Cj6q0NXf3PZZYHSF330e2XE8G8l0CEKhgkCujxUOD1slGiKH7BY5LtAZecT5CyPg0l1B2qqGI600zNfFw2PT";

// Initialize Stripe only if the library is loaded
let stripe = null;
if (typeof Stripe !== 'undefined') {
  stripe = Stripe(STRIPE_PUBLIC_KEY);
}
