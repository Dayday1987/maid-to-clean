document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const API_BASE = window.API_BASE || 'https://maid-to-clean-backend.onrender.com/api';

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Logging in...";
      submitBtn.disabled = true;

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Invalid email or password");
          return;
        }

        localStorage.setItem("mtc_token", data.token);
        localStorage.setItem("mtc_user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          window.location.href = "dashboard/admin_messages.html";
        } else {
          window.location.href = "dashboard/dashboard.html";
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again later.");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const birthDate = document.getElementById("birthDate").value;

      if (!firstName || !lastName || !email || !password || !phone || !birthDate) {
        alert("Please fill out all fields.");
        return;
      }

      if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Registering...";
      submitBtn.disabled = true;

      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
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
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Registration failed.");
          return;
        }

        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
      } catch (err) {
        console.error("Registration error:", err);
        alert("Something went wrong. Please try again later.");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
