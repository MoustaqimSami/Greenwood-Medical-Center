// --- STARTING DATE ---
let currentDate = new Date(2025, 8, 3); // September = month 8

// Time slots used by the schedule grid
const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

// Format date
function formatDate(dateObj) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let formatted = dateObj.toLocaleDateString("en-CA", options);

  const day = dateObj.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  formatted = formatted.replace(/\d+/, day + suffix);

  return formatted;
}

// Date → "YYYY-MM-DD"
function toISODate(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "HH:MM" → grid column index
function timeToColumnIndex(timeStr) {
  const idx = TIME_SLOTS.indexOf(timeStr);
  if (idx === -1) return null;
  return idx + 1;
}

function getAppointmentColorClass(type) {
  switch ((type || "").toLowerCase()) {
    case "assessment":
      return "green";
    case "reports":
      return "yellow";
    case "followup":
      return "blue";
    case "walkin":
      return "grey";
    case "other":
      return "red";
    default:
      return "green";
  }
}

// Collect all appointments for a given date across all doctors
function getAppointmentsForDate(isoDate) {
  const apptsDb = window.appointmentsDatabase;
  const docsDb = window.doctorsDatabase;

  if (!apptsDb || !docsDb) {
    console.warn(
      "[Schedule] Missing appointmentsDatabase or doctorsDatabase; cannot render schedule."
    );
    return [];
  }

  const doctors = docsDb.doctors || [];
  const allForDay = [];

  doctors.forEach((doc) => {
    if (!doc || doc.id == null) return;
    const byDoctor =
      typeof apptsDb.getAppointmentsForDoctor === "function"
        ? apptsDb.getAppointmentsForDoctor(doc.id) || []
        : [];

    byDoctor.forEach((appt) => {
      if (appt && appt.date === isoDate) {
        allForDay.push({ appt, doctor: doc });
      }
    });
  });

  return allForDay;
}

// Render all appointments for currentDate into .schedule-grid
function renderScheduleForDate(dateObj) {
  const grid = document.querySelector(".schedule-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const isoDate = toISODate(dateObj);
  const apptsForDay = getAppointmentsForDate(isoDate);
  if (!apptsForDay.length) return;

  const patientsDb = window.patientsDatabase;

  // NEW: track how many appointments are in each column
  const columnStackCounts = {};

  apptsForDay.forEach(({ appt, doctor }) => {
    const col = timeToColumnIndex(appt.start);
    if (!col) return;

    // NEW: stack in that time slot (col)
    const row = (columnStackCounts[col] || 0) + 1;
    columnStackCounts[col] = row;

    const patient =
      patientsDb?.getPatientById?.(appt.patientId) || null;

    const patientName = patient?.name || "Patient";
    const patientPhone = patient?.phone || "—";
    const doctorName = doctor?.name || "—";

    const box = document.createElement("div");
    box.classList.add("appointment", getAppointmentColorClass(appt.type));
    box.style.gridColumn = col;
    box.style.gridRow = row;

    box.innerHTML = `
      <p class="p-name">${patientName}</p>
      <small>Phone: ${patientPhone}</small>
      <small>Doctor: ${doctorName}</small>
    `;

    grid.appendChild(box);
  });
}


// --- update date label + schedule ---
function updateDateDisplay() {
  const dateEl = document.querySelector(".schedule-date");
  if (dateEl) {
    dateEl.textContent = formatDate(currentDate);
  }

  renderScheduleForDate(currentDate);
}

// --- PREV / NEXT DAY NAV ---
function previousDay() {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDateDisplay();
}

function nextDay() {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDateDisplay();
}

// --- ON PAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  updateDateDisplay();

  const buttons = document.querySelectorAll(".schedule-header-row .nav-btn");
  if (buttons[0]) buttons[0].addEventListener("click", previousDay);
  if (buttons[1]) buttons[1].addEventListener("click", nextDay);
});
