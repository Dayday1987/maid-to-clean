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
      nav.classList.toggle("open");
    });
  }

  // Simple fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  });
  document.querySelectorAll(".card, .service-card, .hero").forEach((el) => {
    observer.observe(el);
  });
});
