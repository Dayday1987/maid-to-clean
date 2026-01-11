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

  const container = document.getElementById("paymentContainer");
  if (!container) return;

  container.innerHTML = '<p class="center">Loading payments...</p>';

  try {
    const res = await fetch(`${API_BASE}/payments/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="message-card">
          <p class="center">No payment records found.</p>
        </div>
      `;
      return;
    }

    const total = data.reduce((sum, p) => sum + (p.amount || 0), 0);

    container.innerHTML = `
      <div class="message-card">
        <h3>Payment Summary</h3>
        <p><strong>Total Payments:</strong> $${total.toFixed(2)}</p>
        <p><strong>Number of Transactions:</strong> ${data.length}</p>
      </div>
      ${data
        .map(
          (p) => `
        <div class="message-card">
          <h3>${p.serviceType || "Service"}</h3>
          <p><strong>Amount:</strong> $${(p.amount || 0).toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(p.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span class="status-${p.status?.toLowerCase() || 'pending'}">${p.status || "Pending"}</span></p>
          ${p.method ? `<p><strong>Payment Method:</strong> ${p.method}</p>` : ""}
        </div>
      `
        )
        .join("")}
    `;
  } catch (err) {
    console.error("Error loading payments:", err);
    container.innerHTML = `
      <div class="message-card">
        <p class="center">Could not load payments. Try again later.</p>
      </div>
    `;
  }
});
