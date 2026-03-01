// Generate 30-min time slots
function generateTimeSlots() {
  const slots = [];
  for (let hour = 8; hour <= 17; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
}

// Load available slots with locking
async function loadAvailableSlots(date) {
  const allSlots = generateTimeSlots();

  const { data } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("appointment_date", date);

  const booked = data.map((a) => a.appointment_time);

  const available = allSlots.filter((slot) => !booked.includes(slot));

  const select = document.getElementById("timeSlots");
  select.innerHTML = "";

  available.forEach((slot) => {
    const opt = document.createElement("option");
    opt.value = slot;
    opt.textContent = slot;
    select.appendChild(opt);
  });
}

// Prevent double booking with database check
async function lockSlot(date, time) {
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("appointment_date", date)
    .eq("appointment_time", time);

  if (data.length > 0) {
    alert("Slot just booked. Choose another.");
    return false;
  }

  return true;
}

document.getElementById("appointmentDate")?.addEventListener("change", (e) => {
  loadAvailableSlots(e.target.value);
});
