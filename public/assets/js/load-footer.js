// ================================
// LOAD FOOTER - Handles dynamic footer loading
// ================================

fetch("/components/footer.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("footer").innerHTML = html;
  })
  .catch((err) => console.error("Failed to load footer:", err));
