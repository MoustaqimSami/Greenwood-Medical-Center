(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const prevBtn = document.querySelector(".week-nav--prev");
    const nextBtn = document.querySelector(".week-nav--next");
    const weekRangeEl = document.querySelector(".week-range");

    if (!prevBtn || !nextBtn || !weekRangeEl) return;
    if (typeof window.refreshDoctorSchedule !== "function") return;
    if (typeof window.WEEK_DATES === "undefined") return;

    // --- HELPERS ---
    function getSundayOfWeek(date) {
      const d = new Date(date);
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function formatISO(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const da = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${da}`;
    }

    function buildWeekDates(startSunday) {
      const dates = [];
      const d = new Date(startSunday);
      for (let i = 0; i < 7; i++) {
        dates.push(formatISO(d));
        d.setDate(d.getDate() + 1);
      }
      return dates;
    }

    function updateWeekRangeText(startSunday) {
      const start = new Date(startSunday);
      const end = new Date(startSunday);
      end.setDate(end.getDate() + 6);

      const startMonthName = start.toLocaleDateString(undefined, {
        month: "long",
      });
      const endMonthName = end.toLocaleDateString(undefined, {
        month: "long",
      });
      const startDay = start.getDate();
      const endDay = end.getDate();
      const year = start.getFullYear();

      let labelText;
      if (
        startMonthName === endMonthName &&
        start.getFullYear() === end.getFullYear()
      ) {
        labelText = `${startMonthName} ${startDay} – ${endDay}, ${year}`;
      } else if (start.getFullYear() === end.getFullYear()) {
        labelText = `${startMonthName} ${startDay} – ${endMonthName} ${endDay}, ${year}`;
      } else {
        const endYear = end.getFullYear();
        labelText = `${startMonthName} ${startDay}, ${year} – ${endMonthName} ${endDay}, ${endYear}`;
      }

      weekRangeEl.textContent = labelText;
    }

    function refreshCalendarFrom(startSunday) {
      const newWeekDates = buildWeekDates(startSunday);

      if (Array.isArray(window.WEEK_DATES)) {
        window.WEEK_DATES.length = 0;
        newWeekDates.forEach((d) => window.WEEK_DATES.push(d));
      } else {
        window.WEEK_DATES = newWeekDates;
      }

      updateWeekRangeText(startSunday);
      window.refreshDoctorSchedule();
    }

    let initialDate;
    if (window.WEEK_DATES && window.WEEK_DATES[0]) {
      initialDate = new Date(window.WEEK_DATES[0] + "T00:00:00");
    } else {
      initialDate = new Date();
    }

    let currentWeekSunday = getSundayOfWeek(initialDate);

    // Initial sync
    refreshCalendarFrom(currentWeekSunday);

    prevBtn.addEventListener("click", () => {
      currentWeekSunday.setDate(currentWeekSunday.getDate() - 7);
      refreshCalendarFrom(currentWeekSunday);
    });

    nextBtn.addEventListener("click", () => {
      currentWeekSunday.setDate(currentWeekSunday.getDate() + 7);
      refreshCalendarFrom(currentWeekSunday);
    });
  });
})();
