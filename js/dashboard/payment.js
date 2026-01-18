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

  // Welcome message
  if (document.getElementById("welcomeMessage")) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Welcome, ${user.firstName}!`;
  }

  // Logout
  if (document.getElementById("logoutBtn")) {
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "../../login.html";
    });
  }

  // ----------------------------
  // Payment buttons
  // ----------------------------
  async function pay(serviceType) {
    const amount = parseFloat(prompt(`Enter amount for ${serviceType}:`));
    if (!amount || amount <= 0) return;

    // Disable buttons while processing
    ["payCardBtn", "payPaypalBtn", "payAppleBtn"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = true;
    });

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
        // Redirect to Stripe/PayPal/Apple Pay checkout
        window.location.href = data.url;
      } else {
        alert("Failed to start payment.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error. Try again.");
    } finally {
      // Re-enable buttons
      ["payCardBtn", "payPaypalBtn", "payAppleBtn"].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = false;
      });
    }
  }

  ["payCardBtn", "payPaypalBtn", "payAppleBtn"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      let type;
      if (id === "payCardBtn") type = "Card Payment";
      if (id === "payPaypalBtn") type = "PayPal Payment";
      if (id === "payAppleBtn") type = "Apple Pay Payment";
      btn.addEventListener("click", () => pay(type));
    }
  });

  // ----------------------------
  // Load payment history
  // ----------------------------
  container.innerHTML = "<p>Loading payment history...</p>";

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
