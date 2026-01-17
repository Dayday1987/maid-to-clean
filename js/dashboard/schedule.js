document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user || !user.id) {
    alert("Please log in first.");
    window.location.href = "/html/login.html";
    return;
  }

  document.getElementById(
    "welcomeMessage"
  ).textContent = `Welcome, ${user.firstName}!`;

  const scheduleContainer = document.getElementById("scheduleContainer");
  scheduleContainer.innerHTML = "<p>Loading schedule...</p>";

  try {
    const res = await fetch(`${API_BASE}/schedule/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to load schedule");
    const data = await res.json();

    if (!data.length) {
      scheduleContainer.innerHTML =
        "<p>You don't have any upcoming cleanings.</p>";
      return;
    }

    scheduleContainer.innerHTML = data
      .map(
        (item) => `
      <div class="message-card">
        <h3>${item.serviceType}</h3>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleString()}</p>
        <p><strong>Status:</strong> ${item.status || "Pending"}</p>
      </div>
    `
      )
      .join("");
  } catch (err) {
    scheduleContainer.innerHTML =
      "<p>Could not load your schedule. Please try again later.</p>";
  }
});
