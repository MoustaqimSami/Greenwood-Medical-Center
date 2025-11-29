// Simple availability model: day index (0 = Sun) + time range.
// Time strings are in 24h "HH:MM" and represent the START of the slot.
const ACTIVE_DOCTOR_ID = window.doctorsDatabase.getActiveDoctorId();
let WEEK_DATES = [
  "2025-09-03",
  "2025-09-04",
  "2025-09-05",
  "2025-09-06",
  "2025-09-07",
  "2025-09-08",
  "2025-09-09",
];

let activeDoctor = null;
let availabilityWindows = [];

if (window.doctorsDatabase) {
  activeDoctor = window.doctorsDatabase.getDoctorById(ACTIVE_DOCTOR_ID);
  availabilityWindows =
    window.doctorsDatabase.getDoctorAvailability(ACTIVE_DOCTOR_ID) || [];
}

function populateDoctorCard(doc) {
  const doctor = doc;
  const current = doctor || activeDoctor;

  const nameEl = document.getElementById("doctor-name");
  const specEl = document.getElementById("doctor-specialty");
  const ageEl = document.getElementById("doctor-age");
  const genderEl = document.getElementById("doctor-gender");
  const phoneEl = document.getElementById("doctor-phone");
  const changeLabelEl = document.querySelector(".change-doctor-label");

  if (!current) {
    if (nameEl) nameEl.textContent = "No doctor selected";
    if (specEl) specEl.textContent = "-";
    if (ageEl) ageEl.textContent = "-";
    if (genderEl) genderEl.textContent = "-";
    if (phoneEl) phoneEl.textContent = "-";

    if (changeLabelEl) changeLabelEl.textContent = "Select Doctor";
    return;
  }

  if (nameEl) nameEl.textContent = current.name;
  if (specEl) specEl.textContent = current.specialty;
  if (ageEl) ageEl.textContent = current.age;
  if (genderEl) genderEl.textContent = current.gender;
  if (phoneEl) phoneEl.textContent = current.phone;

  if (changeLabelEl) changeLabelEl.textContent = "Change Doctor";
}

populateDoctorCard(activeDoctor);

function buildCalendarGrid() {
  const startHour = 8;
  const endHour = 21;
  const timesEl = document.getElementById("calendar-times");
  const daysEl = document.getElementById("calendar-days");

  if (!timesEl || !daysEl) return;

  // --- NEW: update calendar header labels from WEEK_DATES ---
  const headerDayEls = document.querySelectorAll(".calendar-header-day");
  headerDayEls.forEach((headerEl, index) => {
    if (!WEEK_DATES[index]) return;
    const dateObj = new Date(WEEK_DATES[index] + "T00:00:00");

    const dateSpan = headerEl.querySelector(".calendar-header-date");
    const labelSpan = headerEl.querySelector(".calendar-header-label");

    if (dateSpan) {
      const monthShort = dateObj.toLocaleDateString(undefined, {
        month: "short",
      });
      const dayNum = dateObj.getDate();
      dateSpan.textContent = `${monthShort} ${dayNum}`;
    }

    if (labelSpan) {
      labelSpan.textContent = dateObj.toLocaleDateString(undefined, {
        weekday: "short",
      });
    }
  });
  // --- END header update ---

  timesEl.innerHTML = "";
  daysEl.innerHTML = "";

  const totalSlots = (endHour - startHour) * 2;

  function formatHour(hour) {
    const h = Math.floor(hour);
    return h + ":00";
  }

  function timeToSlotIndex(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    const minutesFromStart = h * 60 + m - startHour * 60;
    return Math.floor(minutesFromStart / 30);
  }

  function slotIndexToTime(index) {
    const totalMinutes = startHour * 60 + index * 30;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const availableSet = new Set();
  availabilityWindows.forEach((win) => {
    const startIdx = timeToSlotIndex(win.start);
    const endIdx = timeToSlotIndex(win.end);
    for (let i = startIdx; i < endIdx; i++) {
      if (i >= 0 && i < totalSlots) {
        availableSet.add(`${win.day}-${i}`);
      }
    }
  });

  for (let i = 0; i < totalSlots; i++) {
    const row = document.createElement("div");
    const isFullHour = i % 2 === 0;

    row.classList.add("time-row");
    row.classList.add(isFullHour ? "time-row-hour" : "time-row-half");

    if (isFullHour) {
      const hourValue = startHour + i / 2;
      row.textContent = formatHour(hourValue);
    }

    timesEl.appendChild(row);
  }

  const days = 7;
  for (let d = 0; d < days; d++) {
    const col = document.createElement("div");
    col.classList.add("calendar-day-column");

    for (let i = 0; i < totalSlots; i++) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.classList.add("slot-row");

      const key = `${d}-${i}`;
      if (availableSet.has(key)) {
        slot.classList.add("slot-row-available");
      } else {
        slot.classList.add("slot-row-unavailable");
      }
      const date = WEEK_DATES[d];
      const time = slotIndexToTime(i);

      slot.dataset.dayIndex = String(d);
      slot.dataset.slotIndex = String(i);
      slot.dataset.date = date;
      slot.dataset.time = time;

      col.appendChild(slot);
    }
    daysEl.appendChild(col);
  }
  renderAppointmentsForActiveDoctor();
}

function renderAppointmentsForActiveDoctor() {
  const daysEl = document.getElementById("calendar-days");
  if (
    !daysEl ||
    !window.appointmentsDatabase ||
    !window.doctorsDatabase ||
    !window.patientsDatabase
  )
    return;

  const doctorId = window.doctorsDatabase.getActiveDoctorId();
  const allAppointments =
    window.appointmentsDatabase.getAppointmentsForDoctor(doctorId) || [];

  const allSlots = daysEl.querySelectorAll(".slot-row");
  allSlots.forEach((slot) => {
    slot.classList.remove(
      "slot--occupied",
      "slot--assessment",
      "slot--reports",
      "slot--followup",
      "slot--walkin",
      "slot--other"
    );
    slot.innerHTML = "";
    slot.removeAttribute("data-appointment-id");
  });

  allAppointments.forEach((appt) => {
    const selector = `.slot-row[data-date="${appt.date}"][data-time="${appt.start}"]`;
    const slot = daysEl.querySelector(selector);
    if (!slot) return;

    const patient = window.patientsDatabase.getPatientById(appt.patientId);

    slot.classList.add("slot--occupied", `slot--${appt.type}`);

    slot.dataset.appointmentId = appt.id;

    slot.innerHTML = `
      <div class="slot-appointment">
        <div class="slot-appointment-patient">${
          patient ? patient.name : appt.patientId
        }</div>
      </div>
    `;
  });
}

buildCalendarGrid();
if (window.setupAppointmentSlotHandlers) {
  window.setupAppointmentSlotHandlers();
}

window.refreshDoctorSchedule = function () {
  const newId = window.doctorsDatabase.getActiveDoctorId();
  const newDoc = window.doctorsDatabase.getDoctorById(newId);

  if (!newDoc) {
    populateDoctorCard(null);
    availabilityWindows = [];
    buildCalendarGrid();
    return;
  }

  populateDoctorCard(newDoc);
  availabilityWindows =
    window.doctorsDatabase.getDoctorAvailability(newId) || [];
  buildCalendarGrid();
  if (window.setupAppointmentSlotHandlers) {
    window.setupAppointmentSlotHandlers();
  }
};

window.WEEK_DATES = WEEK_DATES;