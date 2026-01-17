document.addEventListener("DOMContentLoaded", () => {
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

  const form = document.getElementById("messageForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    if (!title || !body) {
      alert("Please fill in both title and body.");
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

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create announcement");
        return;
      }

      alert("Announcement sent successfully!");
      form.reset();
    } catch (err) {
      console.error("Error creating message:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});
