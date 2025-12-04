(function (Dashboard) {
  const { helpers, state, dom } = Dashboard;
  const {
    toISODate,
    sameDay,
    formatDayRangeLabel,
    formatMonthLabel,
    parseISODateToLocal,
    getMonday,
  } = helpers;
  const { weekDaysContainer, weekPrevBtn, weekNextBtn, weekRangeLabel, weekMonthLabel } =
    dom;

  function renderWeek() {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!weekDaysContainer) return;
    weekDaysContainer.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const date = new Date(state.currentWeekStart);
      date.setDate(state.currentWeekStart.getDate() + i);

      const iso = toISODate(date);
      const isToday = sameDay(date, today);
      const isSelected = sameDay(date, state.selectedDate);

      const dayEl = document.createElement("div");
      dayEl.className = "week-day";
      dayEl.dataset.date = iso;

      const labelEl = document.createElement("div");
      labelEl.className = "day-label";
      labelEl.textContent = dayLabels[i];

      const numberEl = document.createElement("div");
      numberEl.className = "day-number";
      numberEl.textContent = date.getDate();

      if (isToday) {
        labelEl.classList.add("day-label--today");
        numberEl.classList.add("day-number--today");
      }
      if (isSelected) {
        labelEl.classList.add("day-label--selected");
        numberEl.classList.add("day-number--selected");
      }

      dayEl.appendChild(labelEl);
      dayEl.appendChild(numberEl);
      weekDaysContainer.appendChild(dayEl);
    }

    if (weekRangeLabel) {
      weekRangeLabel.textContent = formatDayRangeLabel(state.currentWeekStart);
    }
    if (weekMonthLabel) {
      weekMonthLabel.textContent = formatMonthLabel(state.currentWeekStart);
    }
  }

  function attachCalendarListeners() {
    if (weekPrevBtn) {
      weekPrevBtn.addEventListener("click", () => {
        state.currentWeekStart.setDate(state.currentWeekStart.getDate() - 7);
        state.selectedDate.setDate(state.selectedDate.getDate() - 7);
        renderWeek();
        Dashboard.appointments.renderAppointments();
        Dashboard.doctors.renderDoctorsToday();
      });
    }

    if (weekNextBtn) {
      weekNextBtn.addEventListener("click", () => {
        state.currentWeekStart.setDate(state.currentWeekStart.getDate() + 7);
        state.selectedDate.setDate(state.selectedDate.getDate() + 7);
        renderWeek();
        Dashboard.appointments.renderAppointments();
        Dashboard.doctors.renderDoctorsToday();
      });
    }

    if (weekDaysContainer) {
      weekDaysContainer.addEventListener("click", (e) => {
        const dayEl = e.target.closest(".week-day");
        if (!dayEl) return;

        const iso = dayEl.dataset.date;
        if (!iso) return;

        state.selectedDate = parseISODateToLocal(iso);
        state.selectedDate.setHours(0, 0, 0, 0);
        state.currentWeekStart = getMonday(state.selectedDate);

        renderWeek();
        Dashboard.appointments.renderAppointments();
        Dashboard.doctors.renderDoctorsToday();
      });
    }
  }

  Dashboard.calendar = {
    renderWeek,
    attachCalendarListeners,
  };
})(window.Dashboard);
