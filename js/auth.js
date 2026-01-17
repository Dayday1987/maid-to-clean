document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // ---------------------------
  // LOGIN
  // ---------------------------
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const res = await fetch(
          "https://maid-to-clean-backend.onrender.com/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Invalid email or password");
          return;
        }

        // Save token + user info - STANDARDIZED KEYS
        
// Find these lines:
localStorage.setItem("mtc_token", data.token);
localStorage.setItem("mtc_user", JSON.stringify(data.user));
        // Redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "/html/dashboard/admin_messages.html";
        } else {
          window.location.href = "/html/dashboard/dashboard.html";
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again later.");
      }
    });
  }

  // ---------------------------
  // REGISTER
  // ---------------------------
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const birthDate = document.getElementById("birthDate").value;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !phone ||
        !birthDate
      ) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const res = await fetch(
          "https://maid-to-clean-backend.onrender.com/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              password,
              phone,
              birthDate,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Registration failed.");
          return;
        }

        alert("Registration successful! You can now log in.");
        window.location.href = "/html/login.html";
      } catch (err) {
        console.error("Registration error:", err);
        alert("Something went wrong. Please try again later.");
      }
    });
  }
});
