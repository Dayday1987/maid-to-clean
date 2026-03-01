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
