// ================================
// DASHBOARD PROTECTION
// Route guard for protected pages
// ================================

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  const currentPath = window.location.pathname;

  // If no user is logged in, redirect to login
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  // Get user role
  const role = await getUserRole();

  // Admin page protection
  if (currentPath.includes("/admin") && role !== "admin") {
    alert("Access denied. Admin privileges required.");
    window.location.href = "/dashboard/dashboard.html";
    return;
  }

  // Customer trying to access admin
  if (currentPath.includes("/admin") && role === "customer") {
    window.location.href = "/dashboard/dashboard.html";
    return;
  }
});

// Helper to check if user is authenticated
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

// Helper to check if user is admin
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login.html";
    return false;
  }

  const role = await getUserRole();
  if (role !== "admin") {
    window.location.href = "/dashboard/dashboard.html";
    return false;
  }
  return true;
}
