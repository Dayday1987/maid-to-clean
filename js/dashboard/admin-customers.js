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

  document.getElementById("welcomeMessage").textContent = `Welcome, ${user.firstName}!`;

  async function loadCustomers() {
    const container = document.getElementById("customersContainer");
    if (!container) return;

    container.innerHTML = "<p>Loading customers...</p>";

    try {
      // Note: You need to add this endpoint to your backend
      const res = await fetch(`${API_BASE}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        container.innerHTML = `<p>Error loading customers: ${res.statusText}</p>`;
        return;
      }

      const data = await res.json();

      if (!data || data.length === 0) {
        container.innerHTML = "<p>No customers found.</p>";
        return;
      }

      container.innerHTML = data
        .map(
          (customer) => `
        <div class="message-card">
          <h3>${customer.firstName} ${customer.lastName}</h3>
          <p>Email: ${customer.email}</p>
          <p>Phone: ${customer.phone}</p>
          <p>Role: ${customer.role}</p>
          <button class="btn btn-primary" onclick="editCustomer('${customer._id}')">Edit</button>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error("Failed to load customers:", err);
      container.innerHTML = "<p>Failed to load customers. Try again later.</p>";
    }
  }

  // Simple edit function (you'll need to create edit UI)
  window.editCustomer = function(userId) {
    alert(`Edit customer: ${userId}\n\nFeature coming soon!`);
  };

  loadCustomers();
});
