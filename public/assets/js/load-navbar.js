// ================================
// LOAD NAVBAR - Handles dynamic navbar loading and auth state
// ================================

fetch("/components/navbar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("navbar").innerHTML = html;

    // Handle logout button
    document.querySelectorAll(".logoutBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        logoutUser();
      });
    });

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
      const nav = document.getElementById("navbar");
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
      // ✅ LOGGED IN

      // Hide guest links
      document.querySelectorAll(".guest-only").forEach((el) => {
        el.style.display = "none";
      });

      // Show auth links (logout, etc)
      document.querySelectorAll(".auth-only").forEach((el) => {
        el.style.display = "block";
      });

      // 🔥 Hide public marketing links
      document.querySelectorAll(".public-only").forEach((el) => {
        el.style.display = "none";
      });

      // Role handling
      const role = await getUserRole();

      document.querySelectorAll(".customer-only").forEach((el) => {
        el.style.display = role === "customer" ? "block" : "none";
      });

      document.querySelectorAll(".admin-only").forEach((el) => {
        el.style.display = role === "admin" ? "block" : "none";
      });
    } else {
      // ❌ LOGGED OUT

      // Show guest links
      document.querySelectorAll(".guest-only").forEach((el) => {
        el.style.display = "block";
      });

      // Hide auth links
      document.querySelectorAll(".auth-only").forEach((el) => {
        el.style.display = "none";
      });

      // 🔥 Show public marketing links again
      document.querySelectorAll(".public-only").forEach((el) => {
        el.style.display = "block";
      });

      // Hide dashboard links
      document.querySelectorAll(".customer-only").forEach((el) => {
        el.style.display = "none";
      });

      document.querySelectorAll(".admin-only").forEach((el) => {
        el.style.display = "none";
      });
    }
  } catch (error) {
    console.error("Error updating nav state:", error);

    // Safe fallback = logged out view
    document.querySelectorAll(".guest-only").forEach((el) => {
      el.style.display = "block";
    });

    document.querySelectorAll(".public-only").forEach((el) => {
      el.style.display = "block";
    });
  }
}
