document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://maid-to-clean-backend.onrender.com/api";
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

  // Fill form
  document.getElementById("firstName").value = user.firstName || "";
  document.getElementById("lastName").value = user.lastName || "";
  document.getElementById("email").value = user.email || "";

  const form = document.getElementById("settingsForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Update failed");
      
      // Update local storage
      const newUserData = { ...user, ...updated };
      localStorage.setItem("mtc_user", JSON.stringify(newUserData));
      
      alert("Profile updated successfully!");
      document.getElementById("welcomeMessage").textContent = `Welcome, ${updated.firstName}!`;
    } catch (err) {
      alert("Something went wrong while saving changes.");
    }
  });
});
