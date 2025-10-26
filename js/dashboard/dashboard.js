document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user) {
    alert("Please log in first.");
    window.location.href = "/html/login.html";
    return;
  }

  // Welcome message
  const welcomeEl = document.getElementById("welcomeMessage");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome back, ${user.firstName}!`;
  }

  // Load announcements (from admin)
  async function loadAnnouncements() {
    const container = document.getElementById("announcements");
    if (!container) return;

    container.innerHTML = "<p>Loading...</p>";

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
        container.innerHTML = "<p>No announcements available right now.</p>";
        return;
      }

      container.innerHTML = data
        .map(
          (msg) => `
        <div class="message-card">
          <h3>${msg.title || "Announcement"}</h3>
          <p>${msg.body || "No content available."}</p>
          <small>Posted on: ${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error("Error loading announcements:", err);
      container.innerHTML = "<p>Failed to load announcements.</p>";
    }
  }

  await loadAnnouncements();
});
