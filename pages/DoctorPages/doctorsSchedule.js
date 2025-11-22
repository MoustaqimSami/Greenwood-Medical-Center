// Simple availability model: day index (0 = Sun) + time range.
// Time strings are in 24h "HH:MM" and represent the START of the slot.
const availabilityWindows = [
  { day: 0, start: "10:00", end: "18:00" },
  { day: 1, start: "13:00", end: "17:30" },
  { day: 3, start: "09:30", end: "19:00" },
  { day: 5, start: "14:00", end: "20:00" },
  { day: 6, start: "09:30", end: "19:00" },
];

(function () {
  const startHour = 8;
  const endHour = 21;
  const timesEl = document.getElementById("calendar-times");
  const daysEl = document.getElementById("calendar-days");

  if (!timesEl || !daysEl) return;

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

      col.appendChild(slot);
    }

    daysEl.appendChild(col);
  }
})();
