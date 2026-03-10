// ================================
// AUTH FUNCTIONS
// ================================

async function registerUser(email, password, firstName, lastName, phone) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName, // MUST match trigger
        last_name: lastName,   // MUST match trigger
        phone: phone
      }
    }
  });

  if (error) throw error;
  return data;
}

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = "/index.html";
}

async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

async function getUserRole() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user role:", error);
    return null;
  }

  return data?.role;
}

async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  // Convenience helper — provides a display name regardless of how
  // first_name / last_name are filled in
  if (data) {
    const first = data.first_name || '';
    const last  = data.last_name  || '';
    data.full_name = [first, last].filter(Boolean).join(' ') || data.email;
  }

  return data;
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});
