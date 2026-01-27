// js/dashboard/dashboard.js
// Customer dashboard – loads announcements visible to customers

document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";

  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  // Auth guard
  if (!token || !user) {
    alert("Please log in first.");
    window.location.href = "../../login.html";
    return;
  }

  // Welcome message
  const welcome = document.getElementById("welcomeMessage");
  if (welcome) {
    welcome.textContent = `Welcome back, ${user.firstName}!`;
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "../../login.html";
    });
  }

  async function loadAnnouncements() {
    const container = document.getElementById("announcements");

    if (!container) {
      console.error("Announcements container not found");
      return;
    }

    container.innerHTML = "<p>Loading announcements...</p>";

    try {
      // ✅ CUSTOMER-SAFE ENDPOINT
      const res = await fetch(`${API_BASE}/announcements`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Announcement fetch failed:", res.status);
        container.innerHTML = "<p>No announcements available.</p>";
        return;
      }

      const data = await res.json();
      console.log("Announcements:", data);

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<p>No announcements available.</p>";
        return;
      }

      container.innerHTML = data
        .map(
          (msg) => `
            <div class="message-card">
              <h3>${msg.title || "Announcement"}</h3>
              <p>${msg.body || ""}</p>
              <small>${new Date(msg.createdAt).toLocaleString()}</small>
            </div>
          `
        )
        .join("");
    } catch (err) {
      console.error("Announcement load error:", err);
      container.innerHTML =
        "<p>Unable to load announcements. Try again later.</p>";
    }
  }

  await loadAnnouncements();
});
