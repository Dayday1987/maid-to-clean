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
