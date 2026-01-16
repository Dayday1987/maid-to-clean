document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav link
  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });

  // Responsive menu toggle
  const nav = document.querySelector(".nav-links");
  const btn = document.querySelector(".menu-toggle");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }

  // Close menu on link click (mobile)
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
    });
  });

  // Simple fade-in animations
