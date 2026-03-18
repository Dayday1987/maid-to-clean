async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  await supabase.from("users").insert([
    {
      id: data.user.id,
      role: "customer",
    },
  ]);
}

async function loginUser(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = "/index.html";
}

async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function getUserRole() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role;
}

// ===============================
// NAVBAR ROLE VISIBILITY CONTROL
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logoutBtn");

  const user = await getCurrentUser();
  const role = await getUserRole();

  const guestLinks = document.querySelectorAll(".guest-only");
  const customerLinks = document.querySelectorAll(".customer-only");
  const adminLinks = document.querySelectorAll(".admin-only");
  const authLinks = document.querySelectorAll(".auth-only");

  // Hide everything first
  guestLinks.forEach((el) => (el.style.display = "none"));
  customerLinks.forEach((el) => (el.style.display = "none"));
  adminLinks.forEach((el) => (el.style.display = "none"));
  authLinks.forEach((el) => (el.style.display = "none"));

  if (!user) {
    // Guest
    guestLinks.forEach((el) => (el.style.display = "block"));
  } else {
    // Logged in
    authLinks.forEach((el) => (el.style.display = "block"));

    if (role === "customer") {
      customerLinks.forEach((el) => (el.style.display = "block"));
    }

    if (role === "admin") {
      adminLinks.forEach((el) => (el.style.display = "block"));
    }
  }

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await logoutUser();
    });
  }
});
