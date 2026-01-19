<invoke name="artifacts">
<parameter name="command">create</parameter>
<parameter name="type">application/vnd.ant.code</parameter>
<parameter name="language">javascript</parameter>
<parameter name="title">COMPLETE dashboard.js File</parameter>
<parameter name="id">complete_dashboard_js</parameter>
<parameter name="content">// js/dashboard/dashboard.js
// This file handles the customer dashboard functionality including loading admin announcements
document.addEventListener("DOMContentLoaded", async () => {
// API base URL for backend requests
const API_BASE = "https://maid-to-clean-backend-vrfr.onrender.com/api";
// Retrieve authentication token from localStorage
const token = localStorage.getItem("mtc_token");
// Retrieve and parse user data from localStorage
const user = JSON.parse(localStorage.getItem("mtc_user") || "null");
// AUTHENTICATION CHECK: Redirect to login if no token or user data exists
if (!token || !user) {
alert("Please log in first.");
window.location.href = "../../login.html";
return;
}
// WELCOME MESSAGE: Display personalized greeting to the user
if (document.getElementById("welcomeMessage")) {
document.getElementById("welcomeMessage").textContent = Welcome back, ${user.firstName}!;
}
// LOGOUT FUNCTIONALITY: Clear localStorage and redirect to login page
if (document.getElementById("logoutBtn")) {
document.getElementById("logoutBtn").addEventListener("click", (e) => {
e.preventDefault(); // Prevent default anchor behavior
localStorage.clear(); // Remove all stored data
window.location.href = "../../login.html"; // Redirect to login
});
}
// LOAD ANNOUNCEMENTS FUNCTION: Fetches admin messages from the backend
async function loadAnnouncements() {
// Get the container element where messages will be displayed
const container = document.getElementById("announcements");
if (!container) return; // Exit if container doesn't exist
// Show loading message while fetching data
container.innerHTML = "<p>Loading...</p>";

try {
  // FIXED: Changed endpoint from /messages to /admin/messages
  // This ensures we're reading from the same collection admins write to
  const res = await fetch(`${API_BASE}/admin/messages`, {
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
      Authorization: `Bearer ${token}`, // Include authentication token
    },
  });

  // ERROR HANDLING: Check if request was successful
  if (!res.ok) {
    container.innerHTML = `<p>Error: ${res.statusText}</p>`;
    console.error("Failed to fetch messages:", res.status, res.statusText);
    return;
  }

  // Parse the JSON response
  const data = await res.json();
  
  // Log the response for debugging purposes
  console.log("Messages received:", data);

  // EMPTY STATE: Display message if no announcements exist
  if (!data || data.length === 0) {
    container.innerHTML = "<p>No announcements available right now.</p>";
    return;
  }

  // RENDER MESSAGES: Build HTML for each message card
  container.innerHTML = data
    .map(
      (msg) => `
    <div class="message-card">
      <h3>${msg.title || "Announcement"}</h3>
      <p>${msg.body || "No content available."}</p>
      <small>Posted on: ${new Date(msg.createdAt).toLocaleString()}</small>
    </div>
  `
    )
    .join(""); // Join array elements into single HTML string
} catch (err) {
  // CATCH BLOCK: Handle any network or parsing errors
  console.error("Error loading announcements:", err);
  container.innerHTML = "<p>Failed to load announcements. Please try again later.</p>";
}
}
// INITIALIZE: Call the function to load announcements when page loads
await loadAnnouncements();
});</parameter>
