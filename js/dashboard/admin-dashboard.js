document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user) {
    alert("Please log in first.");
    window.location.href = "../../login.html";
    return;
  }

  if (user.role !== "admin") {
    alert("Access denied - admins only.");
    window.location.href = "dashboard.html";
    return;
  }

  document.getElementById(
    "welcomeMessage"
  ).textContent = `Welcome, Admin ${user.firstName}!`;

  // Load recent messages
  async function loadRecentMessages() {
    const container = document.getElementById("recentMessages");
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
        container.innerHTML = "<p>No recent messages.</p>";
        return;
      }

      // Show only last 3 messages
      container.innerHTML = data
        .slice(0, 3)
        .map(
          (msg) => `
        <div class="message-card">
          <h3>${msg.title || "Announcement"}</h3>
          <p>${msg.body || "No content available."}</p>
          <small>Posted: ${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error("Error loading recent messages:", err);
      container.innerHTML = "<p>Failed to load messages.</p>";
    }
  }
  console.log("Token:", token);
console.log("User:", user);

  loadRecentMessages();
});
