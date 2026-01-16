document.addEventListener("DOMContentLoaded", () => {
  const token =
    localStorage.getItem("mtc_token") || localStorage.getItem("token");
  const user =
    JSON.parse(localStorage.getItem("mtc_user")) ||
    JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("Please log in to access your dashboard.");
    window.location.href = "../login.html";
    return;
  }

  const welcome = document.getElementById("welcomeMessage");
  if (welcome) {
    welcome.textContent = `Welcome To Your Dashboard, ${user.firstName}!`;
  }

  // Fixed: Changed from logoutLink to logoutBtn to match HTML
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "../login.html";
    });
  }
});
