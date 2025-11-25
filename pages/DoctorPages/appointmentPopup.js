document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("appointment-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector("[data-appointment-close]");
  const timeLabel = modal.querySelector("[data-appointment-time]");
  const dayLabel = modal.querySelector("[data-appointment-day]");
  const dateLabel = modal.querySelector("[data-appointment-date]");
  let currentAppointment = null;
  let currentSlotInfo = null;
  let currentAppointmentType = "assessment";
  let editMode = false;

  /* -----------------------------------------------------------
     DOCTOR SEARCH / PANEL
     ----------------------------------------------------------- */

  const doctorSearchInput = modal.querySelector("#popup-doctor-search");
  const doctorResultsBox = modal.querySelector("#popup-doctor-results");
  const doctorPanel = modal.querySelector("#popup-doctor-panel");
  const doctorsDB = window.doctorsDatabase?.doctors || [];

  function renderDoctorPanel(doctor) {
    if (!doctorPanel) return;

    doctorPanel.classList.remove("appointment-profile--generic");
    doctorPanel.innerHTML = `
      <div class="appointment-avatar">
        <img src="../../assets/icons/person-black.svg" 
             alt="" class="appointment-avatar-icon">
      </div>
      <div class="appointment-profile-name">${doctor.name}</div>
      <div class="appointment-profile-detail">Specialty: ${doctor.specialty}</div>
      <div class="appointment-profile-detail">Age: ${doctor.age}</div>
      <div class="appointment-profile-detail">Gender: ${doctor.gender}</div>
      <div class="appointment-profile-detail">Phone: ${doctor.phone}</div>
      <div class="appointment-profile-action">
        <button class="appointment-profile-button" type="button">
          <img src="../../assets/icons/edit.svg"
               alt=""
               class="appointment-profile-edit-icon" />
          <span>Change Doctor</span>
        </button>
      </div>
    `;
  }

  function renderGenericDoctorPanel() {
    if (!doctorPanel) return;

    doctorPanel.classList.add("appointment-profile--generic");
    doctorPanel.innerHTML = `
      <div class="appointment-avatar">
        <img src="../../assets/icons/search.svg" 
             alt="" class="appointment-avatar-icon">
      </div>
      <div class="appointment-profile-generic-text">
        Search or select a doctor<br/>to view more information.
      </div>
    `;
  }

  function clearDoctorResults() {
    if (doctorResultsBox) doctorResultsBox.innerHTML = "";
  }

  function setActiveDoctor(id) {
    if (window.doctorsDatabase?.setActiveDoctorId) {
      window.doctorsDatabase.setActiveDoctorId(id);
    }
  }

  function renderDoctorResults(query) {
    if (!doctorResultsBox) return;

    clearDoctorResults();
    query = query.trim().toLowerCase();
    if (query.length < 2) return;

    const matches = doctorsDB
      .filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.specialty.toLowerCase().includes(query)
      )
      .slice(0, 5);

    if (matches.length === 0) {
      doctorResultsBox.innerHTML = `
        <div class="appointment-search-result">
          <div class="appointment-search-result-meta">No doctors found.</div>
        </div>`;
      return;
    }

    matches.forEach((doc) => {
      const row = document.createElement("div");
      row.className = "appointment-search-result";
      row.innerHTML = `
        <div class="appointment-search-result-name">${doc.name}</div>
        <div class="appointment-search-result-meta">
          ${doc.specialty}
        </div>
      `;

      row.addEventListener("click", () => {
        setActiveDoctor(doc.id);
        renderDoctorPanel(doc);
        clearDoctorResults();
        doctorSearchInput.value = "";

        if (window.refreshDoctorSchedule) {
          window.refreshDoctorSchedule();
        }
      });

      doctorResultsBox.appendChild(row);
    });
  }

  if (doctorSearchInput) {
    doctorSearchInput.addEventListener("input", (e) => {
      renderDoctorResults(e.target.value);
    });
  }

  /* -----------------------------------------------------------
     PATIENT SEARCH / PANEL
     ----------------------------------------------------------- */

  const patientSearchInput = modal.querySelector("#popup-patient-search");
  const patientResultsBox = modal.querySelector("#popup-patient-results");
  const patientPanel = modal.querySelector("#popup-patient-panel");
  const patientsDB = window.patientsDatabase?.patients || [];

  function renderPatientPanel(patient) {
    if (!patientPanel) return;

    patientPanel.classList.remove("appointment-profile--generic");
    patientPanel.innerHTML = `
      <div class="appointment-avatar">
        <img src="../../assets/icons/person-black.svg"
             alt=""
             class="appointment-avatar-icon">
      </div>
      <div class="appointment-profile-name">${patient.name}</div>
      <div class="appointment-profile-detail">Age: ${patient.age}</div>
      <div class="appointment-profile-detail">Gender: ${patient.gender}</div>
      <div class="appointment-profile-detail">
        Last Appointment: ${patient.lastAppointment || "—"}
      </div>
      <div class="appointment-profile-detail">Phone: ${patient.phone}</div>
      <div class="appointment-profile-action">
        <button class="appointment-profile-button" type="button">
          <img src="../../assets/icons/edit.svg"
               alt=""
               class="appointment-profile-edit-icon" />
          <span>Change Patient</span>
        </button>
      </div>
    `;
  }

  function renderGenericPatientPanel() {
    if (!patientPanel) return;

    patientPanel.classList.add("appointment-profile--generic");
    patientPanel.innerHTML = `
      <div class="appointment-avatar">
        <img src="../../assets/icons/search.svg"
             alt=""
             class="appointment-avatar-icon">
      </div>
      <div class="appointment-profile-generic-text">
        Search or select a patient<br/>to view more information.
      </div>
    `;
  }

  function clearPatientResults() {
    if (patientResultsBox) patientResultsBox.innerHTML = "";
  }

  function setActivePatient(id) {
    if (window.patientsDatabase?.setActivePatientId) {
      window.patientsDatabase.setActivePatientId(id);
    }
  }

  function renderPatientResults(query) {
    if (!patientResultsBox) return;

    clearPatientResults();
    query = query.trim().toLowerCase();
    if (query.length < 2) return;

    const matches = patientsDB
      .filter((pat) => {
        return (
          pat.name.toLowerCase().includes(query) ||
          pat.phone.replace(/\s+/g, "").includes(query.replace(/\s+/g, ""))
        );
      })
      .slice(0, 5);

    if (matches.length === 0) {
      patientResultsBox.innerHTML = `
        <div class="appointment-search-result">
          <div class="appointment-search-result-meta">No patients found.</div>
        </div>`;
      return;
    }

    matches.forEach((pat) => {
      const row = document.createElement("div");
      row.className = "appointment-search-result";
      row.innerHTML = `
        <div class="appointment-search-result-name">${pat.name}</div>
        <div class="appointment-search-result-meta">
         ${pat.phone}
        </div>
      `;

      row.addEventListener("click", () => {
        setActivePatient(pat.id);
        renderPatientPanel(pat);
        clearPatientResults();
        patientSearchInput.value = "";
      });

      patientResultsBox.appendChild(row);
    });
  }

  if (patientSearchInput) {
    patientSearchInput.addEventListener("input", (e) => {
      renderPatientResults(e.target.value);
    });
  }

  /* -----------------------------------------------------------
     FORMS / TABS
     ----------------------------------------------------------- */

  const tabButtons = modal.querySelectorAll("[data-appointment-tab]");
  const formContainer = document.getElementById("appointment-form-container");

  const templates = {
    assessment: document.getElementById("tpl-form-assessment"),
    reports: document.getElementById("tpl-form-reports"),
    followup: document.getElementById("tpl-form-followup"),
    walkin: document.getElementById("tpl-form-assessment"),
    other: document.getElementById("tpl-form-other"),
  };

  const editBtn = modal.querySelector(".appointment-btn-edit");
  const deleteBtn = modal.querySelector(".appointment-btn-delete");
  const saveBtn = modal.querySelector(".appointment-btn-save");

    const deleteDialog = modal.querySelector("#appointment-delete-dialog");
  const deleteCancelBtn = modal.querySelector(
    "[data-appointment-delete-cancel]"
  );
  const deleteConfirmBtn = modal.querySelector(
    "[data-appointment-delete-confirm]"
  );

    let statusHideTimer = null;

  function showStatus(message, type = "info", autoHide = true) {
    if (!modal) return;

    let statusEl = modal.querySelector(".appointment-status");

    // Create once if it doesn't exist
    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "appointment-status";
      modal.appendChild(statusEl);
    }

    // Clear previous timer
    if (statusHideTimer) {
      clearTimeout(statusHideTimer);
      statusHideTimer = null;
    }

    statusEl.textContent = message;
    statusEl.classList.remove(
      "appointment-status--info",
      "appointment-status--success",
      "appointment-status--danger",
      "is-visible"
    );

    const cls =
      type === "success"
        ? "appointment-status--success"
        : type === "danger"
        ? "appointment-status--danger"
        : "appointment-status--info";

    statusEl.classList.add(cls, "is-visible");

    if (autoHide && type !== "danger") {
      statusHideTimer = setTimeout(() => {
        statusEl.classList.remove("is-visible");
      }, 2400);
    }
  }

    function applyFormEditState() {
    const formEl = modal.querySelector(".appointment-form");
    if (!formEl) return;

    const controls = formEl.querySelectorAll("input, textarea, select");
    controls.forEach((ctrl) => {
      ctrl.disabled = !editMode;
    });

    // Button labels / visibility depend on whether we have an appointment
    if (currentAppointment) {
      // Existing appointment
      if (editBtn) {
        editBtn.style.display = "";
      }
      if (deleteBtn) {
        deleteBtn.textContent = "Delete";
      }
      if (saveBtn) {
        saveBtn.textContent = "Save";
      }
    } else {
      // New appointment
      if (editBtn) {
        editBtn.style.display = "none";
      }
      if (deleteBtn) {
        deleteBtn.textContent = "Cancel";
      }
      if (saveBtn) {
        saveBtn.textContent = "Add";
      }
    }

    if (saveBtn) {
      saveBtn.disabled = !editMode;
    }
  }



  function renderForm(type) {
    if (!formContainer) return;
    const tpl = templates[type];
    if (!tpl || !tpl.content) return;

    formContainer.innerHTML = "";
    const clone = tpl.content.cloneNode(true);
    formContainer.appendChild(clone);

    setupFormLayout();
    applyFormEditState();
  }

  function setupFormLayout() {
    const form = modal.querySelector(".appointment-form");
    if (!form) return;

    const fields = Array.from(form.querySelectorAll(".appointment-field"));
    if (!fields.length) return;

    fields.forEach((field) => {
      field.classList.remove("field-large", "field-medium", "field-small");
    });

    fields.forEach((field) => {
      const labelEl = field.querySelector(".appointment-field-label");
      const labelText = (labelEl?.textContent || "").toLowerCase();

      const isReason =
        labelText.includes("reason for visit") || labelText.includes("reason");
      const isAdditional =
        labelText.includes("additional") ||
        labelText.includes("notes") ||
        labelText.includes("comments");
      const isDateField =
        labelText.includes("symptom") ||
        labelText.includes("last appointment") ||
        labelText.includes("last visit") ||
        labelText.includes("since when");

      // Reason + additional notes are always large
      if (isReason || isAdditional) {
        field.classList.add("field-large");
        field.dataset.sizeLocked = "true";
      }
      // Date-ish fields are always the smallest ones
      else if (isDateField) {
        field.classList.add("field-small");
        field.dataset.dateField = "true";
      } else {
        field.classList.add("field-small");
      }
    });

    // If there are only a few fields, make non-date, non-large ones a bit bigger
    if (fields.length <= 3) {
      fields.forEach((field) => {
        const isLarge = field.classList.contains("field-large");
        const isDate = field.dataset.dateField === "true";

        if (!isLarge && !isDate && field.classList.contains("field-small")) {
          field.classList.remove("field-small");
          field.classList.add("field-medium");
        }
      });
    }
  }

  /* -----------------------------------------------------------
     MODAL OPEN/CLOSE
     ----------------------------------------------------------- */

  function openModal(slotInfo) {
    const appt = slotInfo && slotInfo.appointment ? slotInfo.appointment : null;
    currentAppointment = appt || null;
    currentSlotInfo = slotInfo || null;

    // Header labels: time + day + date
    if (slotInfo && timeLabel && dayLabel && dateLabel) {
      if (slotInfo.time) timeLabel.textContent = slotInfo.time;
      if (slotInfo.day) dayLabel.textContent = slotInfo.day;
      if (slotInfo.date) dateLabel.textContent = slotInfo.date;
    }

    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");

    // Determine type
    let baseType = appt && appt.type ? appt.type : "assessment";
    currentAppointmentType = baseType;
    let formType = baseType === "walkin" ? "assessment" : baseType;

    // Existing appointment opens in view mode, new slot opens in edit mode
    editMode = !appt; // existing => false (view), new => true (edit)

    renderForm(formType);

    // Highlight correct tab
    tabButtons.forEach((b) => b.classList.remove("is-active"));
    const activeTab =
      modal.querySelector(`[data-appointment-tab="${baseType}"]`) ||
      modal.querySelector('[data-appointment-tab="assessment"]');
    if (activeTab) activeTab.classList.add("is-active");

    // Prefill form fields for existing appointment
    if (appt) {
      const formEl = modal.querySelector(".appointment-form");
      if (formEl) {
        const fields = formEl.querySelectorAll(".appointment-field");
        fields.forEach((field) => {
          const label = field.querySelector(".appointment-field-label");
          const textarea = field.querySelector("textarea");
          const input = field.querySelector("input");
          const control = textarea || input;
          if (!label || !control) return;

          const labelText = (label.textContent || "").toLowerCase();

          if (
            labelText.includes("reason for visit") ||
            labelText.includes("reason for follow-up") ||
            labelText.includes("details")
          ) {
            control.value = appt.reason || "";
          } else if (
            labelText.includes("additional") ||
            labelText.includes("comments") ||
            labelText.includes("notes")
          ) {
            control.value = appt.notes || "";
          }
        });
      }
    }

    // Pre-fill doctor panel
    const activeDoctorId = window.doctorsDatabase.getActiveDoctorId();
    const activeDoctor = window.doctorsDatabase.getDoctorById(activeDoctorId);
    if (activeDoctor) {
      renderDoctorPanel(activeDoctor);
    } else {
      renderGenericDoctorPanel();
    }

    // Pre-fill patient panel from appointment (if any) or active patient
    let activePatient = null;
    if (appt && window.patientsDatabase) {
      activePatient = window.patientsDatabase.getPatientById(appt.patientId);
    } else if (window.patientsDatabase) {
      const activePatId = window.patientsDatabase.getActivePatientId();
      activePatient = window.patientsDatabase.getPatientById(activePatId);
    }

    if (activePatient) {
      renderPatientPanel(activePatient);
    } else {
      renderGenericPatientPanel();
    }

    applyFormEditState();
  }

  function closeModal() {
    // Need to add logic here for if a patient has already been selected
    if (window.patientsDatabase) {
      window.patientsDatabase.setActivePatientId(null);
    }
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    clearDoctorResults();
    clearPatientResults();
  }

  function formatTimeTo12h(timeStr) {
    if (!timeStr) return "";
    const [hStr, mStr] = timeStr.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
    const suffix = h >= 12 ? "PM" : "AM";
    h = ((h + 11) % 12) + 1;
    const mm = String(m).padStart(2, "0");
    return `${h}:${mm} ${suffix}`;
  }

  function getDateLabels(dateStr) {
    if (!dateStr) return { day: "", date: "" };
    const d = new Date(dateStr + "T00:00:00");
    const day = d.toLocaleDateString(undefined, { weekday: "long" });
    const date = d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return { day, date };
  }

  function setupAppointmentSlotHandlers() {
    const slots = document.querySelectorAll(".slot-row-available");

    slots.forEach((slot) => {
      slot.addEventListener("click", () => {
        const dateRaw = slot.dataset.date || "";
        const timeRaw = slot.dataset.time || "";
        const labels = dateRaw ? getDateLabels(dateRaw) : { day: "", date: "" };

        const slotInfo = {
          dateRaw,
          timeRaw,
          time: timeRaw ? formatTimeTo12h(timeRaw) : "",
          day: labels.day,
          date: labels.date,
        };

        const apptId = slot.dataset.appointmentId;
        if (apptId && window.appointmentsDatabase) {
          const appt = window.appointmentsDatabase.getAppointmentById(apptId);
          if (appt) {
            slotInfo.appointment = appt;
          }
        }

        openModal(slotInfo);
      });
    });
  }

  window.setupAppointmentSlotHandlers = setupAppointmentSlotHandlers;
  setupAppointmentSlotHandlers();

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.appointmentTab;
      if (!targetId) return;
      if (!editMode) return;

      tabButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      currentAppointmentType = targetId;
      const typeToRender = targetId === "walkin" ? "assessment" : targetId;
      renderForm(typeToRender);
    });
  });

  renderForm("assessment");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      if (!currentAppointment) return;
      editMode = true;
      applyFormEditState();
      showStatus("Editing appointment. Make changes then click Save.", "info");
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      if (!currentAppointment) {
        closeModal();
        showStatus("Appointment creation cancelled.", "info");
        return;
      }

      if (!deleteDialog) return;
      deleteDialog.classList.add("is-open");
    });
  }


  if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener("click", () => {
      if (!deleteDialog) return;
      deleteDialog.classList.remove("is-open");
      showStatus("Deletion cancelled.", "info");
    });
  }

  if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener("click", () => {
      if (!currentAppointment || !deleteDialog) return;

      if (window.appointmentsDatabase?.deleteAppointment) {
        window.appointmentsDatabase.deleteAppointment(currentAppointment.id);
      }

      deleteDialog.classList.remove("is-open");
      showStatus("Appointment deleted.", "success", false);

      currentAppointment = null;
      closeModal();

      if (window.refreshDoctorSchedule) {
        window.refreshDoctorSchedule();
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!editMode) return;

      const formEl = modal.querySelector(".appointment-form");
      if (!formEl) return;

      let reasonVal = "";
      let notesVal = "";

      const fields = formEl.querySelectorAll(".appointment-field");
      fields.forEach((field) => {
        const label = field.querySelector(".appointment-field-label");
        const textarea = field.querySelector("textarea");
        const input = field.querySelector("input");
        const control = textarea || input;
        if (!label || !control) return;

        const labelText = (label.textContent || "").toLowerCase();

        if (
          labelText.includes("reason for visit") ||
          labelText.includes("reason for follow-up") ||
          labelText.includes("details")
        ) {
          reasonVal = control.value;
        } else if (
          labelText.includes("additional") ||
          labelText.includes("comments") ||
          labelText.includes("notes")
        ) {
          notesVal = control.value;
        }
      });

      const doctorId = window.doctorsDatabase.getActiveDoctorId();
      const date = currentSlotInfo?.dateRaw;
      const start = currentSlotInfo?.timeRaw;

      // Simple 30-min slot
      function getEndTime(startStr) {
        if (!startStr) return null;
        const [h, m] = startStr.split(":").map(Number);
        const total = h * 60 + m + 30;
        const nh = Math.floor(total / 60);
        const nm = total % 60;
        return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
      }

      if (!currentAppointment) {
        // ---- NEW APPOINTMENT ----
        const activePatientId =
          window.patientsDatabase?.getActivePatientId?.() || "pat-1";

        const newAppt = window.appointmentsDatabase.createAppointment({
          doctorId,
          patientId: activePatientId,
          type: currentAppointmentType,
          date,
          start,
          end: getEndTime(start),
          reason: reasonVal,
          notes: notesVal,
        });

        currentAppointment = newAppt;
        editMode = false;
        applyFormEditState();
        showStatus("Appointment added.", "success");

        if (window.refreshDoctorSchedule) {
          window.refreshDoctorSchedule();
        }

        // Optional: close after add
        closeModal();
      } else {
        // ---- UPDATE EXISTING ----
        const changes = {
          type: currentAppointmentType,
          reason: reasonVal,
          notes: notesVal,
        };

        const updated =
          window.appointmentsDatabase.updateAppointmentById(
            currentAppointment.id,
            changes
          );
        if (updated) {
          currentAppointment = updated;
        }

        editMode = false;
        applyFormEditState();
        showStatus("Appointment updated.", "success");

        if (window.refreshDoctorSchedule) {
          window.refreshDoctorSchedule();
        }
      }
    });
  }


    // Optional reschedule banner (if present in HTML)
  const rescheduleBanner = document.getElementById("reschedule-banner");
  const rescheduleCancel = document.getElementById("reschedule-cancel");

  const calendarHeaderBlock = modal.querySelector(
    ".appointment-header-main .appointment-header-block:nth-child(2)"
  );

  if (calendarHeaderBlock) {
    calendarHeaderBlock.style.cursor = "pointer";
    calendarHeaderBlock.addEventListener("click", () => {
      if (!currentAppointment) {
        closeModal();
        return;
      }

      // Mark globally that we are rescheduling this appointment
      window.currentRescheduleAppointmentId = currentAppointment.id;

      if (rescheduleBanner) {
        rescheduleBanner.textContent =
          `Rescheduling appointment on ${dateLabel.textContent} at ${timeLabel.textContent}. ` +
          `Click a new time slot or Cancel.`;
        rescheduleBanner.classList.add("is-visible");
      } else {
        // Fallback UX if you don't have a banner element yet
        console.log(
          "Rescheduling mode ON for appointment",
          currentAppointment.id
        );
      }

      closeModal();
    });
  }

  if (rescheduleCancel) {
    rescheduleCancel.addEventListener("click", () => {
      window.currentRescheduleAppointmentId = null;
      if (rescheduleBanner) {
        rescheduleBanner.classList.remove("is-visible");
      }
    });
  }

  /* -----------------------------------------------------------
     CLICK OUTSIDE SEARCH: HIDE OVERLAY LISTS
     ----------------------------------------------------------- */

  document.addEventListener("click", (e) => {
    const inDoctorSearch =
      doctorSearchInput && doctorSearchInput.contains(e.target);
    const inDoctorResults =
      doctorResultsBox && doctorResultsBox.contains(e.target);

    const inPatientSearch =
      patientSearchInput && patientSearchInput.contains(e.target);
    const inPatientResults =
      patientResultsBox && patientResultsBox.contains(e.target);

    if (!inDoctorSearch && !inDoctorResults) {
      clearDoctorResults();
    }
    if (!inPatientSearch && !inPatientResults) {
      clearPatientResults();
    }
  });
});
