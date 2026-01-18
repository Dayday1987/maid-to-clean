document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user || !user.id) {
    alert("Please log in first.");
    window.location.href = "../../login.html";
    return;
  }

  document.getElementById(
    "welcomeMessage"
  ).textContent = `Welcome, ${user.firstName}!`;

  const container = document.getElementById("paymentContainer");
  container.innerHTML = "<p>Loading payment history...</p>";

  // ----------------------------
  // Payment buttons
  // ----------------------------
  document.getElementById("payCardBtn").addEventListener("click", () => {
    alert("Card payment functionality coming soon!");
  });
  document.getElementById("payPaypalBtn").addEventListener("click", () => {
    alert("PayPal payment functionality coming soon!");
  });
  document.getElementById("payAppleBtn").addEventListener("click", () => {
    alert("Apple Pay functionality coming soon!");
  });

  // ----------------------------
  // Load payment history
  // ----------------------------
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
    console.error(err);
    container.innerHTML =
      "<p>Could not load payments. Please try again later.</p>";
  }
});
