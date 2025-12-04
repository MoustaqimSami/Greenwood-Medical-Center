(function () {
  if (
    !window.appointmentsDatabase ||
    !window.doctorsDatabase ||
    !window.patientsDatabase
  ) {
    console.error("Databases not loaded. Check script paths.");
    return;
  }

  const { appointments, updateAppointmentById, deleteAppointment } =
    window.appointmentsDatabase;
  const { doctors } = window.doctorsDatabase;
  const { patients } = window.patientsDatabase;

  // ------- Confirmation Modal helper -------

  function openConfirmModal({
    title = "Are you sure?",
    message = "",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
  } = {}) {
    return new Promise((resolve) => {
      const backdrop = document.createElement("div");
      backdrop.className = "confirm-modal-backdrop";

      const modal = document.createElement("div");
      modal.className = "confirm-modal";

      const titleEl = document.createElement("h2");
      titleEl.className = "confirm-modal-title";
      titleEl.textContent = title;

      const messageEl = document.createElement("p");
      messageEl.className = "confirm-modal-message";
      messageEl.textContent = message;

      const actions = document.createElement("div");
      actions.className = "confirm-modal-actions";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "confirm-modal-btn confirm-modal-btn--secondary";
      cancelBtn.textContent = cancelLabel;

      const confirmBtn = document.createElement("button");
      confirmBtn.className = "confirm-modal-btn confirm-modal-btn--primary";
      confirmBtn.textContent = confirmLabel;

      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);

      modal.appendChild(titleEl);
      modal.appendChild(messageEl);
      modal.appendChild(actions);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      const close = (result) => {
        backdrop.remove();
        resolve(result);
      };

      cancelBtn.addEventListener("click", () => close(false));
      confirmBtn.addEventListener("click", () => close(true));
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) close(false);
      });
    });
  }

  // ------- Popup helper -------

  let popupTimeoutId = null;

  function showPopup(message, variant = "success") {
    let popup = document.getElementById("feedback-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "feedback-popup";
      popup.className = "feedback-popup";
      document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.className = `feedback-popup feedback-popup--${variant} feedback-popup--visible`;

    if (popupTimeoutId) {
      clearTimeout(popupTimeoutId);
    }

    popupTimeoutId = setTimeout(() => {
      popup.classList.remove("feedback-popup--visible");
    }, 2500);
  }

  // ------- Helpers -------

  function toISODate(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function parseISODateToLocal(iso) {
    if (!iso) return new Date();
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function sameDay(d1, d2) {
    return toISODate(d1) === toISODate(d2);
  }

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function formatDayRangeLabel(weekStart) {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);

    const startDay = weekStart.getDate();
    const endDay = end.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const startMonth = monthNames[weekStart.getMonth()];
    const endMonth = monthNames[end.getMonth()];

    // If same month, show: "21 Oct - 27 Oct 2025"
    if (weekStart.getMonth() === end.getMonth()) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${end.getFullYear()}`;
    }
    // Different months in the same week
    return `${startDay} ${startMonth} ${weekStart.getFullYear()} - ${endDay} ${endMonth} ${end.getFullYear()}`;
  }

  function formatMonthLabel(weekStart) {
    const fullMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      fullMonthNames[weekStart.getMonth()]
    }, ${weekStart.getFullYear()}`;
  }

  function getPatientInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }

  // ------- State -------

  const firstApptDate = appointments[0]
    ? parseISODateToLocal(appointments[0].date)
    : new Date();
  let selectedDate = new Date(firstApptDate);
  selectedDate.setHours(0, 0, 0, 0);
  let currentWeekStart = getMonday(selectedDate);

  // ------- DOM refs -------

  const weekDaysContainer = document.getElementById("week-days-container");
  const weekPrevBtn = document.getElementById("week-prev-btn");
  const weekNextBtn = document.getElementById("week-next-btn");
  const weekRangeLabel = document.getElementById("week-range-label");
  const weekMonthLabel = document.getElementById("week-month-label");

  const upcomingPanel = document.getElementById("upcoming-appointments-panel");
  const completedPanel = document.getElementById(
    "completed-appointments-panel"
  );
  const doctorsTodayList = document.getElementById("doctors-today-list");

  const tabsContainer = document.getElementById("appointments-tabs");

  const quickActions = document.querySelectorAll(".quick-action");

  // ------- Quick actions (Book appointment / Add patient) -------

  quickActions.forEach((qa) => {
    qa.addEventListener("click", () => {
      const labelElement = qa.querySelector(".quick-action-text p");
      const label = labelElement
        ? labelElement.textContent.trim()
        : "Quick action";
      console.log(`[Quick Action] ${label} clicked`);
    });
  });

  // ------- Calendar rendering -------

  function renderWeek() {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    weekDaysContainer.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);

      const iso = toISODate(date);
      const isToday = sameDay(date, today);
      const isSelected = sameDay(date, selectedDate);

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
      weekRangeLabel.textContent = formatDayRangeLabel(currentWeekStart);
    }
    if (weekMonthLabel) {
      weekMonthLabel.textContent = formatMonthLabel(currentWeekStart);
    }
  }

  // ------- Appointments rendering -------

  function getAppointmentsForDate(date) {
    const iso = toISODate(date);
    return appointments.filter((a) => a.date === iso);
  }

  function renderAppointmentCard(appt, statusView) {
    const patient = patients.find((p) => p.id === appt.patientId);
    const doctor = doctors.find((d) => d.id === appt.doctorId);

    const patientName = patient ? patient.name : "Unknown patient";
    const doctorName = doctor ? doctor.name : "Unknown doctor";
    const initials = getPatientInitials(patientName);

    const card = document.createElement("div");
    card.className = "appointment-card";
    card.dataset.apptId = appt.id;

    const left = document.createElement("div");
    left.className = "flexrow-gap12";
    left.style.alignItems = "center";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = initials;

    const info = document.createElement("div");
    info.className = "appointment-card-info";

    const patientP = document.createElement("p");
    patientP.className = "appointment-card-patient";
    patientP.textContent = patientName;

    const doctorP = document.createElement("p");
    doctorP.className = "appointment-card-doctor";
    doctorP.textContent = doctorName;

    const timeP = document.createElement("p");
    timeP.className = "appointment-card-time";
    timeP.textContent = `${appt.start} - ${appt.end}`;

    info.appendChild(patientP);
    info.appendChild(doctorP);
    info.appendChild(timeP);

    left.appendChild(avatar);
    left.appendChild(info);

    const right = document.createElement("div");
    right.className = "flexrow-gap4";

    if (statusView === "upcoming") {
      const completeBtn = document.createElement("button");
      completeBtn.className =
        "btn btn--small btn--txt appointment-complete-btn";
      completeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon btn-icon--small">
          <path d="M3.02024 8.64649C2.82498 8.45122 2.50839 8.45122 2.31313 8.64649C2.11787 8.84175 2.11787 9.15829 2.31313 9.35355L5.31313 12.3536C5.50839 12.5488 5.82498 12.5488 6.02024 12.3536L13.3536 5.02024C13.5488 4.82498 13.5488 4.50839 13.3536 4.31313C13.1583 4.11787 12.8418 4.11787 12.6465 4.31313L5.66669 11.2929L3.02024 8.64649Z" />
        </svg>
        Complete
      `;

      const cancelBtn = document.createElement("button");
      cancelBtn.className =
        "btn btn--small btn--danger-txt appointment-cancel-btn";
      cancelBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon btn-icon--small">
          <path d="M2.58902 2.71602L2.64602 2.64602C2.72888 2.56335 2.83811 2.51236 2.9547 2.50194C3.07128 2.49153 3.18782 2.52234 3.28402 2.58902L3.35402 2.64602L8.00002 7.29302L12.646 2.64602C12.7399 2.55213 12.8672 2.49939 13 2.49939C13.1328 2.49939 13.2601 2.55213 13.354 2.64602C13.4479 2.73991 13.5007 2.86725 13.5007 3.00002C13.5007 3.1328 13.4479 3.26013 13.354 3.35402L8.70702 8.00002L13.354 12.646C13.4367 12.7289 13.4877 12.8381 13.4981 12.9547C13.5085 13.0713 13.4777 13.1878 13.411 13.284L13.354 13.354C13.2712 13.4367 13.1619 13.4877 13.0453 13.4981C12.9288 13.5085 12.8122 13.4777 12.716 13.411L12.646 13.354L8.00002 8.70702L3.35402 13.354C3.26013 13.4479 3.1328 13.5007 3.00002 13.5007C2.86725 13.5007 2.73991 13.4479 2.64602 13.354C2.55213 13.2601 2.49939 13.1328 2.49939 13C2.49939 12.8672 2.55213 12.7399 2.64602 12.646L7.29302 8.00002L2.64602 3.35402C2.56335 3.27117 2.51236 3.16193 2.50194 3.04535C2.49153 2.92876 2.52234 2.81222 2.58902 2.71602Z" />
        </svg>
        Cancel
      `;

      right.appendChild(completeBtn);
      right.appendChild(cancelBtn);
    } else if (statusView === "completed") {
      const followUpBtn = document.createElement("button");
      followUpBtn.className =
        "btn btn--small btn--sec-txt appointment-followup-btn";
      followUpBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon btn-icon--small">
          <path d="M14 4.16667C14 2.97005 13.0299 2 11.8333 2H4.16667C2.97005 2 2 2.97005 2 4.16667V11.8333C2 13.0299 2.97005 14 4.16667 14H8V13.9881C7.69347 13.9437 7.40513 13.7783 7.2128 13.5051C7.10327 13.3495 7.01153 13.1785 6.9364 13H4.16667C3.52233 13 3 12.4777 3 11.8333V5.66667H13V9.01687C13.1561 9.17607 13.2573 9.36893 13.3038 9.5718C13.5236 9.4596 13.7671 9.42333 14 9.45707V4.16667Z" />
        </svg>
    Follow-up
  `;

      const removeBtn = document.createElement("button");
      removeBtn.className =
        "btn btn--small btn--danger-txt appointment-remove-btn";
      removeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon btn-icon--small">
          <path d="M2.58902 2.71602L2.64602 2.64602C2.72888 2.56335 2.83811 2.51236 2.9547 2.50194C3.07128 2.49153 3.18782 2.52234 3.28402 2.58902L3.35402 2.64602L8.00002 7.29302L12.646 2.64602C12.7399 2.55213 12.8672 2.49939 13 2.49939C13.1328 2.49939 13.2601 2.55213 13.354 2.64602C13.4479 2.73991 13.5007 2.86725 13.5007 3.00002C13.5007 3.1328 13.4479 3.26013 13.354 3.35402L8.70702 8.00002L13.354 12.646C13.4367 12.7289 13.4877 12.8381 13.4981 12.9547C13.5085 13.0713 13.4777 13.1878 13.411 13.284L13.354 13.354C13.2712 13.4367 13.1619 13.4877 13.0453 13.4981C12.9288 13.5085 12.8122 13.4777 12.716 13.411L12.646 13.354L8.00002 8.70702L3.35402 13.354C3.26013 13.4479 3.1328 13.5007 3.00002 13.5007C2.86725 13.5007 2.73991 13.4479 2.64602 13.354C2.55213 13.2601 2.49939 13.1328 2.49939 13C2.49939 12.8672 2.55213 12.7399 2.64602 12.646L7.29302 8.00002L2.64602 3.35402C2.56335 3.27117 2.51236 3.16193 2.50194 3.04535C2.49153 2.92876 2.52234 2.81222 2.58902 2.71602Z" />
        </svg>
        Remove
        `;

      right.appendChild(followUpBtn);
      right.appendChild(removeBtn);
    }

    card.appendChild(left);
    card.appendChild(right);
    return card;
  }

  function renderAppointments() {
    const todaysAppts = getAppointmentsForDate(selectedDate);

    // Upcoming = anything not completed or cancelled
    const upcoming = todaysAppts.filter(
      (a) => a.status !== "completed" && a.status !== "cancelled"
    );
    const completed = todaysAppts.filter((a) => a.status === "completed");

    upcomingPanel.innerHTML = "";
    if (upcoming.length === 0) {
      const empty = document.createElement("p");
      empty.className = "body-sm-regular";
      empty.style.color = "var(--neutral-600)";
      empty.textContent = "No upcoming appointments for this day.";
      upcomingPanel.appendChild(empty);
    } else {
      upcoming
        .sort((a, b) => (a.start > b.start ? 1 : -1))
        .forEach((appt) => {
          upcomingPanel.appendChild(renderAppointmentCard(appt, "upcoming"));
        });
    }

    completedPanel.innerHTML = "";
    if (completed.length === 0) {
      const empty = document.createElement("p");
      empty.className = "body-sm-regular";
      empty.style.color = "var(--neutral-600)";
      empty.textContent = "No completed appointments for this day.";
      completedPanel.appendChild(empty);
    } else {
      completed
        .sort((a, b) => (a.start > b.start ? 1 : -1))
        .forEach((appt) => {
          completedPanel.appendChild(renderAppointmentCard(appt, "completed"));
        });
    }
  }

  // ------- Doctors Today rendering -------

  function renderDoctorsToday() {
    const dayIndex = selectedDate.getDay(); // 0 = Sun, ...
    const todayISO = toISODate(new Date());

    doctorsTodayList.innerHTML = "";

    const availableDocs = doctors.filter((doc) =>
      (doc.availabilityWindows || []).some((w) => w.day === dayIndex)
    );

    if (availableDocs.length === 0) {
      const empty = document.createElement("p");
      empty.className = "body-sm-regular";
      empty.style.color = "var(--neutral-600)";
      empty.textContent = "No doctors available on this day.";
      doctorsTodayList.appendChild(empty);
      return;
    }

    availableDocs.forEach((doc) => {
      const windowsForDay = (doc.availabilityWindows || []).filter(
        (w) => w.day === dayIndex
      );
      const firstWindow = windowsForDay[0];

      const card = document.createElement("div");
      card.className = "availability-card";

      const nameP = document.createElement("p");
      nameP.className = "availability-card-doctor";
      nameP.textContent = doc.name;

      const info = document.createElement("div");
      info.className = "availability-card-info";

      const tag = document.createElement("div");
      tag.className = "availability-card-tag";

      const isToday = toISODate(selectedDate) === todayISO;
      const now = new Date();

      let tagClass = "availability-card-tag--available";
      let tagText = "Available";

      if (isToday && firstWindow) {
        const [startH, startM] = firstWindow.start.split(":").map(Number);
        const [endH, endM] = firstWindow.end.split(":").map(Number);

        const start = new Date(selectedDate);
        start.setHours(startH, startM, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(endH, endM, 0, 0);

        if (now >= start && now <= end) {
          tagClass = "availability-card-tag--available";
          tagText = "Available now";
        } else if (now < start) {
          tagClass = "availability-card-tag--busy";
          tagText = "Available later";
        } else {
          tagClass = "availability-card-tag--out";
          tagText = "Finished for today";
        }
      } else {
        tagClass = "availability-card-tag--available";
        tagText = "Available this day";
      }

      tag.classList.add(tagClass);
      tag.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="availability-card-tag-icon">
          <path d="M0.5 3C0.5 1.61929 1.61929 0.5 3 0.5C4.3807 0.5 5.5 1.61929 5.5 3C5.5 4.3807 4.3807 5.5 3 5.5C1.61929 5.5 0.5 4.3807 0.5 3Z" />
        </svg>
        <p>${tagText}</p>
      `;

      const timeWrapper = document.createElement("div");
      timeWrapper.className = "flexrow-gap2";

      const label = document.createElement("p");
      label.className = "availability-card-label";
      label.textContent = "Available at:";

      const timeP = document.createElement("p");
      timeP.className = "availability-card-time";
      timeP.textContent = firstWindow
        ? `${firstWindow.start} - ${firstWindow.end}`
        : "-";

      timeWrapper.appendChild(label);
      timeWrapper.appendChild(timeP);

      info.appendChild(tag);
      info.appendChild(timeWrapper);

      card.appendChild(nameP);
      card.appendChild(info);
      doctorsTodayList.appendChild(card);
    });
  }

  // ------- Tabs interactions -------

  if (tabsContainer) {
    tabsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;

      const tab = btn.dataset.tab;
      if (!tab) return;

      // update tab styles
      tabsContainer.querySelectorAll(".tab").forEach((t) => {
        t.classList.toggle("tab--active", t === btn);
      });

      // show/hide panels
      if (tab === "upcoming") {
        upcomingPanel.classList.add("tab-panel--active");
        completedPanel.classList.remove("tab-panel--active");
      } else {
        completedPanel.classList.add("tab-panel--active");
        upcomingPanel.classList.remove("tab-panel--active");
      }
    });
  }

  // Handle Complete/Cancel/Follow-up actions via event delegation
  upcomingPanel.addEventListener("click", async (e) => {
    const completeBtn = e.target.closest(".appointment-complete-btn");
    const cancelBtn = e.target.closest(".appointment-cancel-btn");

    if (!completeBtn && !cancelBtn) return;

    const card = e.target.closest(".appointment-card");
    const apptId = card?.dataset.apptId;
    if (!apptId) return;

    if (completeBtn) {
      const confirmed = await openConfirmModal({
        title: "Mark as completed?",
        message: "This will move the appointment to the Completed tab.",
        confirmLabel: "Mark completed",
      });
      if (!confirmed) return;

      updateAppointmentById(apptId, { status: "completed" });
      showPopup("Appointment marked as completed.", "success");
    } else if (cancelBtn) {
      const confirmed = await openConfirmModal({
        title: "Cancel appointment?",
        message:
          "This will cancel the appointment and remove it from Upcoming.",
        confirmLabel: "Cancel appointment",
      });
      if (!confirmed) return;

      updateAppointmentById(apptId, { status: "cancelled" });
      showPopup("Appointment cancelled.", "danger");
    }

    renderAppointments();
  });

  completedPanel.addEventListener("click", async (e) => {
    const followUpBtn = e.target.closest(".appointment-followup-btn");
    const removeBtn = e.target.closest(".appointment-remove-btn");

    if (!followUpBtn && !removeBtn) return;

    const card = e.target.closest(".appointment-card");
    const apptId = card?.dataset.apptId;
    if (!apptId) return;

    if (followUpBtn) {
      const confirmed = await openConfirmModal({
        title: "Start follow-up?",
        message: "This will start a follow-up flow for this appointment.",
        confirmLabel: "Start follow-up",
      });
      if (!confirmed) return;

      console.log(`[Appointments] Follow-up clicked for ${apptId}`);
      showPopup("Follow-up action triggered.", "info");
    }

    if (removeBtn) {
      const confirmed = await openConfirmModal({
        title: "Remove from completed?",
        message:
          "This will permanently remove the appointment from the Completed list.",
        confirmLabel: "Remove",
      });
      if (!confirmed) return;

      deleteAppointment(apptId);
      showPopup("Appointment removed from completed.", "success");
      renderAppointments();
    }
  });

  // ------- Calendar interactions -------

  if (weekPrevBtn) {
    weekPrevBtn.addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      selectedDate.setDate(selectedDate.getDate() - 7);
      renderWeek();
      renderAppointments();
      renderDoctorsToday();
    });
  }

  if (weekNextBtn) {
    weekNextBtn.addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      selectedDate.setDate(selectedDate.getDate() + 7);
      renderWeek();
      renderAppointments();
      renderDoctorsToday();
    });
  }

  if (weekDaysContainer) {
    weekDaysContainer.addEventListener("click", (e) => {
      const dayEl = e.target.closest(".week-day");
      if (!dayEl) return;

      const iso = dayEl.dataset.date;
      if (!iso) return;

      selectedDate = new parseISODateToLocal(iso);
      selectedDate.setHours(0, 0, 0, 0);
      currentWeekStart = getMonday(selectedDate);
      renderWeek();
      renderAppointments();
      renderDoctorsToday();
    });
  }

  // ------- Initial render -------

  renderWeek();
  renderAppointments();
  renderDoctorsToday();
})();
