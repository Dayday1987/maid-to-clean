document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user) {
    alert("Please log in to access your dashboard.");
    window.location.href = "../html/login.html";
    return;
  }

  const welcome = document.getElementById("welcomeMessage");
  if (welcome) {
    welcome.textContent = `Welcome To Your Dashboard, ${user.firstName}!`;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "../html/login.html";
    });
  }
});
