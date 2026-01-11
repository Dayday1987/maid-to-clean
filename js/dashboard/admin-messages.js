document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = window.API_BASE || 'https://maid-to-clean-backend.onrender.com/api';
  const token = localStorage.getItem("mtc_token") || localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("mtc_user") || localStorage.getItem("user") || "null"
  );

  if (!token || !user) {
    alert("Please log in first.");
    window.location.href = "../login.html";
    return;
  }

  if (user.role !== "admin") {
    alert("Access denied - admins only.");
    window.location.href = "dashboard.html";
    return;
  }

  async function loadMessages() {
    const container = document.getElementById("adminMessages");
    if (!container) return;

    container.innerHTML = '<p class="center">Loading messages...</p>';

    try {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (!data || data.length === 0) {
        container.innerHTML = '<p class="center">No messages yet.</p>';
        return;
      }

      container.innerHTML = data
        .map(
          (msg) => `
        <div class="message-card">
          <h3>${msg.title || "Untitled Message"}</h3>
          <p>${msg.body || "No content available."}</p>
          <small>Posted: ${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error("Failed to load admin messages:", err);
      container.innerHTML = '<p class="center">Failed to load messages. Try again later.</p>';
    }
  }

  await loadMessages();
  setInterval(loadMessages, 2 * 60 * 1000);
});
