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

  const scheduleContainer = document.getElementById("scheduleContainer");
  if (!scheduleContainer) return;

  scheduleContainer.innerHTML = '<p class="center">Loading schedule...</p>';

  try {
    const res = await fetch(`${API_BASE}/schedule/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      scheduleContainer.innerHTML = `
        <div class="message-card">
          <p class="center">You don't have any upcoming cleanings scheduled.</p>
        </div>
      `;
      return;
    }

    scheduleContainer.innerHTML = data
      .map(
        (item) => `
      <div class="message-card">
        <h3>${item.serviceType || "Cleaning Service"}</h3>
        <p><strong>Date & Time:</strong> ${new Date(item.date).toLocaleString()}</p>
        <p><strong>Status:</strong> <span class="status-${item.status?.toLowerCase() || 'pending'}">${item.status || "Pending"}</span></p>
        ${item.notes ? `<p><strong>Notes:</strong> ${item.notes}</p>` : ""}
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error("Error loading schedule:", err);
    scheduleContainer.innerHTML = `
      <div class="message-card">
        <p class="center">Could not load your schedule. Try again later.</p>
      </div>
    `;
  }
});
