// ================================
// LOAD NAVBAR - Handles dynamic navbar loading and auth state
// ================================

fetch("/components/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar").innerHTML = html;

    // Handle logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
      });
    }

    // Handle hamburger menu
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("open");
        hamburger.setAttribute(
          "aria-expanded",
          navLinks.classList.contains("open"),
        );
      });

      // Close menu when clicking a link (mobile)
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          navLinks.classList.remove("open");
        });
      });
    }

    // Show/hide nav links based on auth state
    updateNavState();

    // Add scroll effect to navbar
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const nav = document.getElementById("mainNav");
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

      lastScroll = currentScroll;
    });
  })
  .catch((err) => console.error("Failed to load navbar:", err));

// Update navigation based on auth state
async function updateNavState() {
  try {
    const session = await getSession();

    if (session && session.user) {
      // User is logged in
      document.querySelectorAll(".guest-only").forEach((el) => {
        el.style.display = "none";
      });
      document.querySelectorAll(".auth-only").forEach((el) => {
        el.style.display = "block";
      });

      // Check role for customer/admin links
      const role = await getUserRole();

      document.querySelectorAll(".customer-only").forEach((el) => {
        el.style.display =
          role === "customer" || role === "admin" ? "block" : "none";
      });
      document.querySelectorAll(".admin-only").forEach((el) => {
        el.style.display = role === "admin" ? "block" : "none";
      });
    } else {
      // User is not logged in
      document.querySelectorAll(".guest-only").forEach((el) => {
        el.style.display = "block";
      });
      document.querySelectorAll(".auth-only").forEach((el) => {
        el.style.display = "none";
      });
      document.querySelectorAll(".customer-only").forEach((el) => {
        el.style.display = "none";
      });
      document.querySelectorAll(".admin-only").forEach((el) => {
        el.style.display = "none";
      });
    }
  } catch (error) {
    console.error("Error updating nav state:", error);
    // Default to guest state on error
    document.querySelectorAll(".guest-only").forEach((el) => {
      el.style.display = "block";
    });
  }
}
