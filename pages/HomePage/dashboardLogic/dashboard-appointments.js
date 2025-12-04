(function (Dashboard) {
  const { state, dom, helpers, ui } = Dashboard;
  const {
    appointments,
    updateAppointmentById,
    deleteAppointment,
    patients,
    doctors,
  } = state;
  const { toISODate, getPatientInitials } = helpers;
  const { showPopup, openConfirmModal } = ui;

  const { upcomingPanel, completedPanel, tabsContainer, quickActions } = dom;

  function getAppointmentsForDate(date) {
    const iso = toISODate(date);
    return appointments.filter((a) => a.date === iso);
  }

  function buildAppointmentContextLines(appt) {
    const patient = patients.find((p) => p.id === appt.patientId);
    const doctor = doctors.find((d) => d.id === appt.doctorId);

    const patientName = patient ? patient.name : "Unknown patient";
    const doctorName = doctor ? doctor.name : "Unknown doctor";

    const typeLabel =
      appt.type && typeof appt.type === "string"
        ? appt.type.charAt(0).toUpperCase() + appt.type.slice(1)
        : "General";

    const timeLabel = `${appt.date} • ${appt.start} – ${appt.end}`;

    return [
      `Patient: ${patientName}`,
      `Doctor: ${doctorName}`,
      `When: ${timeLabel}`,
      `Visit type: ${typeLabel}`,
    ];
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
    const todaysAppts = getAppointmentsForDate(state.selectedDate);

    const upcoming = todaysAppts.filter(
      (a) => a.status !== "completed" && a.status !== "cancelled"
    );
    const completed = todaysAppts.filter((a) => a.status === "completed");

    if (!upcomingPanel || !completedPanel) return;

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

  function attachTabsListeners() {
    if (!tabsContainer) return;

    tabsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;

      const tab = btn.dataset.tab;
      if (!tab) return;

      tabsContainer.querySelectorAll(".tab").forEach((t) => {
        t.classList.toggle("tab--active", t === btn);
      });

      if (tab === "upcoming") {
        upcomingPanel.classList.add("tab-panel--active");
        completedPanel.classList.remove("tab-panel--active");
      } else {
        completedPanel.classList.add("tab-panel--active");
        upcomingPanel.classList.remove("tab-panel--active");
      }
    });
  }

  function attachAppointmentListeners() {
    if (upcomingPanel) {
      upcomingPanel.addEventListener("click", async (e) => {
        const completeBtn = e.target.closest(".appointment-complete-btn");
        const cancelBtn = e.target.closest(".appointment-cancel-btn");

        if (!completeBtn && !cancelBtn) return;

        const card = e.target.closest(".appointment-card");
        const apptId = card?.dataset.apptId;
        if (!apptId) return;

        const appt = appointments.find((a) => a.id === apptId);
        if (!appt) return;

        const patient = patients.find((p) => p.id === appt.patientId);
        const doctor = doctors.find((d) => d.id === appt.doctorId);

        const patientName = patient ? patient.name : "Unknown patient";
        const doctorName = doctor ? doctor.name : "Unknown doctor";
        const initials = getPatientInitials(patientName);
        const timeLabel = appt.start || "";

        const context = { initials, patientName, doctorName, timeLabel };

        if (completeBtn) {
          const confirmed = await openConfirmModal({
            title: "Mark as completed?",
            message: "This will move the appointment to the Completed tab.",
            confirmLabel: "Mark completed",
            cancelLabel: "Go back",
            context,
          });
          if (!confirmed) return;

          updateAppointmentById(apptId, { status: "completed" });
          renderAppointments();
          showPopup("Appointment marked as completed.", "success");
        }

        if (cancelBtn) {
          const confirmed = await openConfirmModal({
            title: "Cancel appointment",
            message: "Are you sure you want to cancel this appointment?",
            confirmLabel: "Cancel appointment",
            cancelLabel: "Go back",
            context,
          });
          if (!confirmed) return;

          updateAppointmentById(apptId, { status: "cancelled" });
          renderAppointments();
          showPopup("Appointment cancelled.", "danger");
        }
      });
    }

    if (completedPanel) {
      completedPanel.addEventListener("click", async (e) => {
        const followUpBtn = e.target.closest(".appointment-followup-btn");
        const removeBtn = e.target.closest(".appointment-remove-btn");

        if (!followUpBtn && !removeBtn) return;

        const card = e.target.closest(".appointment-card");
        const apptId = card?.dataset.apptId;
        if (!apptId) return;

        const appt = appointments.find((a) => a.id === apptId);
        if (!appt) return;

        const patient = patients.find((p) => p.id === appt.patientId);
        const doctor = doctors.find((d) => d.id === appt.doctorId);

        const patientName = patient ? patient.name : "Unknown patient";
        const doctorName = doctor ? doctor.name : "Unknown doctor";
        const initials = getPatientInitials(patientName);
        const timeLabel = appt.start || "";

        const context = { initials, patientName, doctorName, timeLabel };

        if (followUpBtn) {
          const confirmed = await openConfirmModal({
            title: "Start follow-up?",
            message: "This will start a follow-up flow for this appointment.",
            confirmLabel: "Start follow-up",
            cancelLabel: "Go back",
            context,
          });
          if (!confirmed) return;

          console.log("[Appointments] Follow-up started:", apptId);
        }

        if (removeBtn) {
          const confirmed = await openConfirmModal({
            title: "Remove from completed?",
            message: "This will permanently remove this appointment.",
            confirmLabel: "Remove",
            cancelLabel: "Go back",
            context,
          });
          if (!confirmed) return;

          deleteAppointment(apptId);
          renderAppointments();
          showPopup("Appointment removed from completed.", "success");
        }
      });
    }
  }

  function attachQuickActions() {
    if (!quickActions) return;
    quickActions.forEach((qa) => {
      qa.addEventListener("click", () => {
        const labelElement = qa.querySelector(".quick-action-text p");
        const label = labelElement
          ? labelElement.textContent.trim()
          : "Quick action";
        console.log(`[Quick Action] ${label} clicked`);
      });
    });
  }

  Dashboard.appointments = {
    renderAppointments,
    attachAppointmentListeners,
    attachTabsListeners,
    attachQuickActions,
  };
})(window.Dashboard);
