fetch("/components/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar").innerHTML = html;

    // Handle logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logoutUser);
    }

    // Show/hide nav links based on auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isLoggedIn = !!session;

      document.querySelectorAll(".guest-only").forEach((el) => {
        el.style.display = isLoggedIn ? "none" : "block";
      });
      document.querySelectorAll(".auth-only").forEach((el) => {
        el.style.display = isLoggedIn ? "block" : "none";
      });

      if (isLoggedIn) {
        getUserRole().then((role) => {
          document.querySelectorAll(".admin-only").forEach((el) => {
            el.style.display = role === "admin" ? "block" : "none";
          });
          document.querySelectorAll(".customer-only").forEach((el) => {
            el.style.display = role === "customer" ? "block" : "none";
          });
        });
      }
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    if (hamburger) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
      });
    }
  });
