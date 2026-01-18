document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";
  const token = localStorage.getItem("mtc_token");
  const user = JSON.parse(localStorage.getItem("mtc_user") || "null");

  if (!token || !user || !user.id) {
    alert("Please log in first.");
    window.location.href = "../../login.html";
    return;
  }

  const container = document.getElementById("paymentContainer");
  container.innerHTML = "<p>Loading payment history...</p>";

  // ----------------------------
  // Payment buttons
  // ----------------------------
  async function pay(serviceType) {
    const amount = parseFloat(prompt(`Enter amount for ${serviceType}:`));
    if (!amount || amount <= 0) return;

    try {
      const res = await fetch(`${API_BASE}/payments/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, serviceType }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe checkout
      } else {
        alert("Failed to start payment.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error. Try again.");
    }
  }

  document.getElementById("payCardBtn").addEventListener("click", () => pay("Card Payment"));
  document.getElementById("payPaypalBtn").addEventListener("click", () => pay("PayPal Payment"));
  document.getElementById("payAppleBtn").addEventListener("click", () => pay("Apple Pay Payment"));

  // ----------------------------
  // Load payment history
  // ----------------------------
  try {
    const res = await fetch(`${API_BASE}/payments/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
    container.innerHTML = "<p>Could not load payments. Please try again later.</p>";
  }
});
