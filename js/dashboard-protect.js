document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("mtc_token") || localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("mtc_user") || localStorage.getItem("user") || "null"
  );

  if (!token || !user) {
    alert("Please log in to access your dashboard.");
    window.location.href = "../login.html";
    return;
  }

  const welcome = document.getElementById("welcomeMessage");
  if (welcome) {
    welcome.textContent = `Welcome back, ${user.firstName}!`;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("mtc_token");
        localStorage.removeItem("mtc_user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "../login.html";
      }
    });
  }

  const MAX_INACTIVE_TIME = 24 * 60 * 60 * 1000;
  let lastActivity = Date.now();

  const resetTimer = () => {
    lastActivity = Date.now();
  };

  ["click", "mousemove", "keypress", "scroll", "touchstart"].forEach((evt) =>
    document.addEventListener(evt, resetTimer, { passive: true })
  );

  setInterval(() => {
    const now = Date.now();
    if (now - lastActivity > MAX_INACTIVE_TIME) {
      alert("Your session has expired. Please log in again.");
      localStorage.clear();
      window.location.href = "../login.html";
    }
  }, 60000);
});
