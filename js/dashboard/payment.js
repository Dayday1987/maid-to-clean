document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user) {
    alert("Please log in first.");
    window.location.href = "/html/login.html";
    return;
  }

  document.getElementById(
    "welcomeMessage"
  ).textContent = `Welcome, ${user.firstName}!`;

  const container = document.getElementById("paymentContainer");
  container.innerHTML = "<p>Loading payments...</p>";

  try {
    const res = await fetch(`${API_BASE}/payments/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to load payments");
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = "<p>No payment records found.</p>";
      return;
    }

    container.innerHTML = data
      .map(
        (p) => `
      <div class="message-card">
        <h3>${p.serviceType}</h3>
        <p><strong>Amount:</strong> $${p.amount.toFixed(2)}</p>
        <p><strong>Date:</strong> ${new Date(p.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${p.status}</p>
      </div>
    `
      )
      .join("");
  } catch (err) {
    container.innerHTML =
      "<p>Could not load payments. Please try again later.</p>";
  }
});
