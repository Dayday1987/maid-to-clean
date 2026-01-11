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

  async function loadAnnouncements() {
    const container = document.getElementById("announcements");
    if (!container) return;

    container.innerHTML = '<p class="center">Loading announcements...</p>';

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
        container.innerHTML = `
          <div class="announcement">
            <p class="center">No announcements available right now.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = data
        .map(
          (msg) => `
        <div class="announcement">
          <h3>${msg.title || "Announcement"}</h3>
          <p>${msg.body || "No content available."}</p>
          <small>Posted: ${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error("Error loading announcements:", err);
      container.innerHTML = `
        <div class="announcement">
          <p class="center">Unable to load announcements at this time.</p>
        </div>
      `;
    }
  }

  await loadAnnouncements();
  setInterval(loadAnnouncements, 5 * 60 * 1000);
});
