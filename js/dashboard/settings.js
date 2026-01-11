document.addEventListener("DOMContentLoaded", () => {
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

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");

  if (firstNameInput) firstNameInput.value = user.firstName || "";
  if (lastNameInput) lastNameInput.value = user.lastName || "";
  if (emailInput) emailInput.value = user.email || "";

  const form = document.getElementById("settingsForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Updating...";
    submitBtn.disabled = true;

    const updated = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
    };

    if (!updated.firstName || !updated.lastName || !updated.email) {
      alert("Please fill out all fields.");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const updatedUser = { ...user, ...updated };
      localStorage.setItem("mtc_user", JSON.stringify(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");

      const welcomeMsg = document.getElementById("welcomeMessage");
      if (welcomeMsg) {
        welcomeMsg.textContent = `Welcome back, ${updated.firstName}!`;
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});
