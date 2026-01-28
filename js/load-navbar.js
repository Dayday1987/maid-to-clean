document.addEventListener("DOMContentLoaded", async () => {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  try {
    const response = await fetch("/html/partials/navbar.html");
    const html = await response.text();
    navbarContainer.innerHTML = html;

    const toggle = navbarContainer.querySelector(".menu-toggle");
    const links = navbarContainer.querySelector(".nav-links");

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        links.classList.toggle("open");
      });
    }
  } catch (err) {
    console.error("Failed to load navbar:", err);
  }
});
