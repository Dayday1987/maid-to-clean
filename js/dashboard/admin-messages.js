document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  // 🔒 Require login
  if (!token || !user) {
    alert("Please log in first.");
    window.location.href = "/html/login.html";
    return;
  }

  // 🔒 Require admin role
  if (user.role !== "admin") {
    alert("Access denied — admins only.");
    window.location.href = "/html/dashboard/dashboard.html";
    return;
  }

  // 🧭 Display welcome message
  const welcomeEl = document.getElementById("welcomeMessage");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome To Your Dashboard, ${user.firstName}!`;
  }

  // 📥 Fetch admin messages
  async function loadMessages() {
    const container = document.getElementById("adminMessages");
    if (!container) return;

    container.innerHTML = "<p>Loading messages...</p>";

    try {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        container.innerHTML = `<p>Error: ${res.statusText}</p>`;
        return;
      }

      const data = await res.json();

      if (!data || data.length === 0) {
        container.innerHTML = "<p>No messages yet.</p>";
        return;
      }

      container.innerHTML = data
        .map(
          (msg) => `
        <div class="message-card">
          <h3>${msg.title || "Untitled Message"}</h3>
          <p>${msg.body || "No content available."}</p>
          <small>Posted on: ${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error("Failed to load admin messages:", err);
      container.innerHTML = "<p>Failed to load messages. Try again later.</p>";
    }
  }

  // 🚪 Auto logout after 24h inactivity
  const MAX_INACTIVE_TIME = 24 * 60 * 60 * 1000; // 24 hours
  let lastActivity = Date.now();

  const resetTimer = () => {
    lastActivity = Date.now();
  };
  ["click", "mousemove", "keypress", "scroll"].forEach((evt) =>
    document.addEventListener(evt, resetTimer)
  );

  setInterval(() => {
    const now = Date.now();
    if (now - lastActivity > MAX_INACTIVE_TIME) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("mtc_token");
      localStorage.removeItem("mtc_user");
      window.location.href = "/html/login.html";
    }
  }, 60000);

  // 🚀 Load messages on page ready
  await loadMessages();
});
