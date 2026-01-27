document.addEventListener("DOMContentLoaded", async () => {
  console.log("📨 admin messages script loaded");

  const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user) {
    window.location.replace("/html/login.html");
    return;
  }

  if (user.role !== "admin") {
    window.location.replace("/html/dashboard/dashboard.html");
    return;
  }

  const welcomeEl = document.getElementById("welcomeMessage");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome, ${user.firstName}!`;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.replace("/html/login.html");
    });
  }

  async function loadMessages() {
    const container = document.getElementById("adminMessages");
    if (!container) {
      console.log("ℹ️ No adminMessages container found");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        container.innerHTML = "<p>Failed to load messages.</p>";
        return;
      }

      if (!data.length) {
        container.innerHTML = "<p>No messages yet.</p>";
        return;
      }

      container.innerHTML = data.map(msg => `
        <div class="message-card">
          <h3>${msg.title}</h3>
          <p>${msg.body}</p>
          <small>${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      `).join("");
    } catch (err) {
      console.error("❌ loadMessages error:", err);
    }
  }

  await loadMessages();

  const form = document.getElementById("messageForm");
  if (!form) {
    console.log("ℹ️ No messageForm found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    console.log("📨 message submit fired");
    e.preventDefault();

    const title = document.getElementById("title")?.value.trim();
    const body = document.getElementById("body")?.value.trim();

    if (!title || !body) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        alert("Failed to send message.");
        return;
      }

      form.reset();
      await loadMessages();
    } catch (err) {
      console.error("❌ submit error:", err);
    }
  });
});
