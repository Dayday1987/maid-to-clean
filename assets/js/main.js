// ==============================
// MAIN.JS - Residential Booking
// ==============================

import { supabase } from "./api-config.js";

document.addEventListener("DOMContentLoaded", () => {
  const serviceSelect = document.getElementById("serviceSelect");
  const roomsSelect = document.getElementById("roomsSelect");
  const squareFootageInput = document.getElementById("squareFootage");
  const addonSelect = document.getElementById("addonSelect");
  const customOptions = document.getElementById("customOptions");
  const appointmentDate = document.getElementById("appointmentDate");
  const timeSlots = document.getElementById("timeSlots");
  const notesInput = document.getElementById("notes");
  const scheduleForm = document.getElementById("scheduleForm");

  // ==============================
  // 1️⃣ Load Services Dynamically
  // ==============================
  async function loadServices() {
    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) return console.error("Error loading services:", error);

    services.forEach((s) => {
      const option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.name;
      serviceSelect.appendChild(option);
    });
  }

  // ==============================
  // 2️⃣ Load Add-Ons Dynamically
  // ==============================
  async function loadAddOns() {
    const { data: addOns, error } = await supabase.from("add_ons").select("*");

    if (error) return console.error("Error loading add-ons:", error);

    addOns.forEach((a) => {
      const option = document.createElement("option");
      option.value = a.id;
      option.textContent = a.name;
      addonSelect.appendChild(option);
    });
  }

  // ==============================
  // 3️⃣ Show Custom Cleaning Options Conditionally
  // ==============================
  serviceSelect.addEventListener("change", (e) => {
    const selectedText =
      serviceSelect.options[serviceSelect.selectedIndex].text;
    if (selectedText === "Custom Cleaning") {
      customOptions.style.display = "block";
    } else {
      customOptions.style.display = "none";
    }
  });

  // ==============================
  // 4️⃣ Load Available Time Slots (Real-Time Slot Locking)
  // ==============================
  async function loadTimeSlots(date) {
    timeSlots.innerHTML = "";

    if (!date) return;

    // Define possible slots
    const slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

    // Fetch existing appointments for the date
    const { data: booked, error } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("appointment_date", date);

    if (error) return console.error(error);

    const bookedTimes = booked.map((b) => b.appointment_time);

    slots.forEach((s) => {
      if (!bookedTimes.includes(s)) {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s;
        timeSlots.appendChild(option);
      }
    });
  }

  appointmentDate.addEventListener("change", (e) => {
    loadTimeSlots(e.target.value);
  });

  // ==============================
  // 5️⃣ Submit Booking Request
  // ==============================
  scheduleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = supabase.auth.user();
    if (!user) return alert("You must be logged in to book.");

    const serviceId = serviceSelect.value;
    const rooms = parseInt(roomsSelect.value);
    const squareFootage = parseInt(squareFootageInput.value) || null;
    const appointment_date = appointmentDate.value;
    const appointment_time = timeSlots.value;
    const notes = notesInput.value;

    // Collect selected add-ons
    const selectedAddOns = Array.from(addonSelect.selectedOptions).map(
      (opt) => opt.value,
    );

    // Collect custom cleaning options if visible
    let customDetails = null;
    if (customOptions.style.display === "block") {
      customDetails = {};

      // Rooms checkboxes
      const roomChecks = customOptions.querySelectorAll("input[name='rooms']");
      customDetails.rooms = Array.from(roomChecks)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      // Appliances
      const applianceChecks = customOptions.querySelectorAll(
        "input[name='appliances']",
      );
      const allAppliances =
        customOptions.querySelector("#allAppliances").checked;
      customDetails.appliances = allAppliances
        ? "all"
        : Array.from(applianceChecks)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value);

      // Windows, baseboards, laundry
      customDetails.windows = customOptions.querySelector(
        "input[name='windows']",
      ).checked
        ? "all"
        : null;
      customDetails.baseboards = customOptions.querySelector(
        "input[name='baseboards']",
      ).checked;
      customDetails.laundry = customOptions.querySelector(
        "input[name='laundry']",
      ).checked;
    }

    // Insert appointment into Supabase
    const { data, error } = await supabase.from("appointments").insert([
      {
        user_id: user.id,
        service_id: serviceId,
        rooms: rooms,
        square_footage: squareFootage,
        appointment_date,
        appointment_time,
        notes,
        custom_details: customDetails,
        status: "pending",
      },
    ]);

    if (error) return alert("Error submitting booking: " + error.message);

    alert("Booking request submitted! Admin will review and approve.");

    // Reset form
    scheduleForm.reset();
    customOptions.style.display = "none";
    timeSlots.innerHTML = "";
  });

  // ==============================
  // 6️⃣ Initial Load
  // ==============================
  loadServices();
  loadAddOns();
});
