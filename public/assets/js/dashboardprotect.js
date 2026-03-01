document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const role = await getUserRole();

  if (window.location.pathname.includes("/admin") && role !== "admin") {
    window.location.href = "/dashboard/dashboard.html";
  }
});
