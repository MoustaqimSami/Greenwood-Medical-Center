document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("appointment-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector("[data-appointment-close]");
  const timeLabel = modal.querySelector("[data-appointment-time]");
  const dayLabel = modal.querySelector("[data-appointment-day]");
  const dateLabel = modal.querySelector("[data-appointment-date]");

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

  function renderForm(type) {
    if (!formContainer) return;
    const tpl = templates[type];
    if (!tpl || !tpl.content) return;

    formContainer.innerHTML = "";
    const clone = tpl.content.cloneNode(true);
    formContainer.appendChild(clone);

    setupFormLayout();
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

    if (slotInfo && timeLabel && dayLabel && dateLabel) {
      if (slotInfo.time) timeLabel.textContent = slotInfo.time;
      if (slotInfo.day) dayLabel.textContent = slotInfo.day;
      if (slotInfo.date) dateLabel.textContent = slotInfo.date;
    }

    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");

    let baseType = appt && appt.type ? appt.type : "assessment";
    let formType = baseType === "walkin" ? "assessment" : baseType;

    renderForm(formType);

    tabButtons.forEach((b) => b.classList.remove("is-active"));
    const activeTab =
      modal.querySelector(`[data-appointment-tab="${baseType}"]`) ||
      modal.querySelector('[data-appointment-tab="assessment"]');
    if (activeTab) activeTab.classList.add("is-active");

    // If there's an existing appointment, prefill key fields
    if (appt) {
      setActiveDoctor(appt.doctorId);
      setActivePatient(appt.patientId);

      console.log();
      const formEl = modal.querySelector(".appointment-form");
      if (!formEl) return;

      const fields = formEl.querySelectorAll(".appointment-field");
      fields.forEach((field) => {
        const label = field.querySelector(".appointment-field-label");
        const textarea = field.querySelector("textarea");
        const input = field.querySelector("input");
        const control = textarea || input;
        if (!label || !control) return;

        const labelText = (label.textContent || "").toLowerCase();

        // Reason fields
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

    // Pre-fill doctor panel from active doctor
    const activeDoctorId = window.doctorsDatabase.getActiveDoctorId();
    const activeDoctor = window.doctorsDatabase.getDoctorById(activeDoctorId);

    if (activeDoctor) {
      renderDoctorPanel(activeDoctor);
    } else {
      renderGenericDoctorPanel();
    }

    // Pre-fill patient panel from active patient
    let activePatient = null;
    if (window.patientsDatabase) {
      const activePatId = window.patientsDatabase.getActivePatientId();
      activePatient = window.patientsDatabase.getPatientById(activePatId);
    }
    if (activePatient) {
      console.log(activePatient);
      renderPatientPanel(activePatient);
    } else {
      renderGenericPatientPanel();
    }
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
    const slots = document.querySelectorAll(".slot-row");

    slots.forEach((slot) => {
      slot.addEventListener("click", () => {
        const dateRaw = slot.dataset.date || "";
        const timeRaw = slot.dataset.time || "";
        const labels = dateRaw ? getDateLabels(dateRaw) : { day: "", date: "" };

        const slotInfo = {
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

      tabButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const typeToRender = targetId === "walkin" ? "assessment" : targetId;
      renderForm(typeToRender);
    });
  });

  renderForm("assessment");

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
