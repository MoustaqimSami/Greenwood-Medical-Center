// --- STARTING DATE (your default) ---
let currentDate = new Date(2025, 8, 3); // September = month 8

// Format date → “Monday - September 3rd, 2025”
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

// --- DRIVER: update only the date field ---
function updateDateDisplay() {
  document.querySelector(".schedule-date").textContent = formatDate(currentDate);
}

// --- STUB: go to previous day ---
function previousDay() {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDateDisplay();

  // ⬇ Your teammate will replace this
  console.log("Stub: loading schedule for previous day");
}

// --- STUB: go to next day ---
function nextDay() {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDateDisplay();

  // ⬇ Your teammate will replace this
  console.log("Stub: loading schedule for next day");
}

// --- ON PAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  updateDateDisplay();

  document.querySelector(".nav-btn:first-child").addEventListener("click", previousDay);
  document.querySelector(".nav-btn:last-child").addEventListener("click", nextDay);
});
