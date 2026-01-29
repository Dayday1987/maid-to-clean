document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("navbar");
  if (!container) return;

  try {
    const res = await fetch("/html/partials/navbar.html");
    const html = await res.text();
    container.innerHTML = html;

    const role = window.NAV_ROLE || "public";

    // Role-based visibility
    container.querySelectorAll("[data-role]").forEach(link => {
      const allowedRoles = link.dataset.role.split(",");
      if (!allowedRoles.includes(role) && !allowedRoles.includes("public")) {
        link.style.display = "none";
      }
    });

    // Mobile menu toggle
    const toggle = container.querySelector(".menu-toggle");
    const links = container.querySelector(".nav-links");

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        links.classList.toggle("open");
      });
    }

  } catch (err) {
    console.error("Navbar load failed:", err);
  }
});
