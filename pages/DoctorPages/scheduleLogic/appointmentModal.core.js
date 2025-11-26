document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("appointment-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector("[data-appointment-close]");
  const timeLabel = modal.querySelector("[data-appointment-time]");
  const dayLabel = modal.querySelector("[data-appointment-day]");
  const dateLabel = modal.querySelector("[data-appointment-date]");

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

  const rescheduleBanner = document.getElementById("reschedule-banner");
  const rescheduleCancel = document.getElementById("reschedule-cancel");
  const calendarHeaderBlock = modal.querySelector(
    ".appointment-header-main .appointment-header-block:nth-child(2)"
  );

  let currentAppointment = null;
  let currentSlotInfo = null;
  let currentAppointmentType = "assessment";
  let editMode = false;
  let statusHideTimer = null;

  /* -----------------------------------------------------------
     STATUS / FEEDBACK
     ----------------------------------------------------------- */

  function clearStatus() {
    if (!modal) return;
    const statusEl = modal.querySelector(".appointment-status");
    if (!statusEl) return;

    statusEl.classList.remove(
      "appointment-status--info",
      "appointment-status--success",
      "appointment-status--danger",
      "is-visible"
    );
    statusEl.textContent = "";

    if (statusHideTimer) {
      clearTimeout(statusHideTimer);
      statusHideTimer = null;
    }
  }

  function showStatus(message, type = "info", autoHide = true) {
    if (!modal) return;

    let statusEl = modal.querySelector(".appointment-status");

    if (!statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "appointment-status";
      modal.appendChild(statusEl);
    }

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

    if (autoHide) {
      statusHideTimer = setTimeout(() => {
        statusEl.classList.remove("is-visible");
      }, 2500);
    }
  }

  /* -----------------------------------------------------------
     FORM LAYOUT + EDIT STATE
     ----------------------------------------------------------- */

  function applyFormEditState() {
    const formEl = modal.querySelector(".appointment-form");
    if (!formEl) return;

    const controls = formEl.querySelectorAll("input, textarea, select");
    controls.forEach((ctrl) => {
      ctrl.disabled = !editMode;
    });

    if (currentAppointment) {
      if (editBtn) editBtn.style.display = "";
      if (deleteBtn) deleteBtn.textContent = "Delete";
      if (saveBtn) saveBtn.textContent = "Save";
    } else {
      if (editBtn) editBtn.style.display = "none";
      if (deleteBtn) deleteBtn.textContent = "Cancel";
      if (saveBtn) saveBtn.textContent = "Add";
    }

    if (saveBtn) {
      saveBtn.disabled = !editMode;
    }
  }

  function setupFormLayout() {
    const form = modal.querySelector(".appointment-form");
    if (!form) return;

    const fields = Array.from(form.querySelectorAll(".appointment-field"));
    if (!fields.length) return;

    fields.forEach((field) => {
      field.classList.remove("field-large", "field-medium", "field-small");
      delete field.dataset.sizeLocked;
      delete field.dataset.dateField;
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

      if (isReason || isAdditional) {
        field.classList.add("field-large");
        field.dataset.sizeLocked = "true";
      } else if (isDateField) {
        field.classList.add("field-small");
        field.dataset.dateField = "true";
      } else {
        field.classList.add("field-small");
      }
    });

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

  /* -----------------------------------------------------------
     TIME / DATE HELPERS
     ----------------------------------------------------------- */

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

  function getEndTime(startStr) {
    if (!startStr) return null;
    const [h, m] = startStr.split(":").map(Number);
    const total = h * 60 + m + 30;
    const nh = Math.floor(total / 60);
    const nm = total % 60;
    return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
  }

  /* -----------------------------------------------------------
     MODAL OPEN / CLOSE
     ----------------------------------------------------------- */

  function openModal(slotInfo) {
    const doctorModule = window.appointmentDoctorSearch;
    const patientModule = window.appointmentPatientSearch;

    const appt =
      slotInfo && slotInfo.appointment ? slotInfo.appointment : null;

    currentAppointment = appt || null;
    currentSlotInfo = slotInfo || null;
    clearStatus();

    if (slotInfo && timeLabel && dayLabel && dateLabel) {
      if (slotInfo.time) timeLabel.textContent = slotInfo.time;
      if (slotInfo.day) dayLabel.textContent = slotInfo.day;
      if (slotInfo.date) dateLabel.textContent = slotInfo.date;
    }

    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");

    let baseType = appt && appt.type ? appt.type : "assessment";
    currentAppointmentType = baseType;
    let formType = baseType === "walkin" ? "assessment" : baseType;

    // new slot => edit mode, existing => view mode
    editMode = !appt;

    renderForm(formType);

    tabButtons.forEach((b) => b.classList.remove("is-active"));
    const activeTab =
      modal.querySelector(`[data-appointment-tab="${baseType}"]`) ||
      modal.querySelector('[data-appointment-tab="assessment"]');
    if (activeTab) activeTab.classList.add("is-active");

    // Populate form from existing appointment
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

    // Doctor panel
    if (doctorModule && doctorModule.renderDoctorPanel) {
      const activeDoctor = doctorModule.getActiveDoctor();
      if (activeDoctor) {
        doctorModule.renderDoctorPanel(activeDoctor);
      } else {
        doctorModule.renderGenericDoctorPanel();
      }
    }

    // Patient panel
    let activePatient = null;
    if (appt && window.patientsDatabase) {
      activePatient = window.patientsDatabase.getPatientById(appt.patientId);
    } else if (window.patientsDatabase) {
      const activePatId = window.patientsDatabase.getActivePatientId();
      activePatient = window.patientsDatabase.getPatientById(activePatId);
    }

    if (patientModule && patientModule.renderPatientPanel) {
      if (activePatient) {
        patientModule.renderPatientPanel(activePatient);
      } else {
        patientModule.renderGenericPatientPanel();
      }
    }

    applyFormEditState();
  }

  function closeModal() {
    if (window.patientsDatabase) {
      window.patientsDatabase.setActivePatientId(null);
    }
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");

    if (window.appointmentDoctorSearch?.clearDoctorResults) {
      window.appointmentDoctorSearch.clearDoctorResults();
    }
    if (window.appointmentPatientSearch?.clearPatientResults) {
      window.appointmentPatientSearch.clearPatientResults();
    }
  }

  /* -----------------------------------------------------------
     SLOT CLICK HANDLERS
     ----------------------------------------------------------- */

  function setupAppointmentSlotHandlers() {
    const slots = document.querySelectorAll(".slot-row-available");

    slots.forEach((slot) => {
      slot.addEventListener("click", () => {
        const dateRaw = slot.dataset.date || "";
        const timeRaw = slot.dataset.time || "";
        const labels = dateRaw ? getDateLabels(dateRaw) : { day: "", date: "" };

        const isRescheduleMode = !!window.currentRescheduleAppointmentId;

        if (isRescheduleMode) {
          const targetApptId = window.currentRescheduleAppointmentId;

          if (!targetApptId) {
            window.currentRescheduleAppointmentId = null;
            if (rescheduleBanner) rescheduleBanner.classList.remove("is-visible");
            showStatus(
              "Unable to reschedule right now. Please try again.",
              "danger",
              false
            );
            return;
          }

          if (slot.dataset.appointmentId) {
            showStatus(
              "Please select an empty time slot to reschedule.",
              "danger",
              false
            );
            return;
          }

          if (!window.appointmentsDatabase?.updateAppointmentById) {
            showStatus(
              "Unable to update appointment time. Please try again.",
              "danger",
              false
            );
            return;
          }

          const newEnd = getEndTime(timeRaw);
          const updated =
            window.appointmentsDatabase.updateAppointmentById(targetApptId, {
              date: dateRaw,
              start: timeRaw,
              end: newEnd,
            });

          if (!updated) {
            showStatus(
              "Could not move appointment. Please try again.",
              "danger",
              false
            );
            return;
          }

          window.currentRescheduleAppointmentId = null;
          if (rescheduleBanner) {
            rescheduleBanner.classList.remove("is-visible");
          }

          if (window.refreshDoctorSchedule) {
            window.refreshDoctorSchedule();
          }

          const slotInfo = {
            dateRaw,
            timeRaw,
            time: timeRaw ? formatTimeTo12h(timeRaw) : "",
            day: labels.day,
            date: labels.date,
            appointment: updated,
          };

          openModal(slotInfo);
          showStatus("Appointment rescheduled.", "success");
          return;
        }

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

  // Initial form
  renderForm("assessment");

  // Close button, click outside, ESC key
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

  // Tabs
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

  window.appointmentModalCore = {
    get modal() {
      return modal;
    },
    get editBtn() {
      return editBtn;
    },
    get deleteBtn() {
      return deleteBtn;
    },
    get saveBtn() {
      return saveBtn;
    },
    get deleteDialog() {
      return deleteDialog;
    },
    get deleteCancelBtn() {
      return deleteCancelBtn;
    },
    get deleteConfirmBtn() {
      return deleteConfirmBtn;
    },
    getCurrentAppointment: () => currentAppointment,
    setCurrentAppointment: (appt) => {
      currentAppointment = appt;
    },
    getCurrentSlotInfo: () => currentSlotInfo,
    setCurrentSlotInfo: (info) => {
      currentSlotInfo = info;
    },
    getEditMode: () => editMode,
    setEditMode: (val) => {
      editMode = !!val;
      applyFormEditState();
    },
    getCurrentAppointmentType: () => currentAppointmentType,
    setCurrentAppointmentType: (type) => {
      currentAppointmentType = type;
    },
    showStatus,
    applyFormEditState,
    closeModal,
    getEndTime,
    getFormValues: () => {
      const formEl = modal.querySelector(".appointment-form");
      let reasonVal = "";
      let notesVal = "";

      if (!formEl) {
        return { reason: reasonVal, notes: notesVal };
      }

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

      return { reason: reasonVal, notes: notesVal };
    },
  };

  // Reschedule banner behaviour
  if (calendarHeaderBlock) {
    calendarHeaderBlock.style.cursor = "pointer";
    calendarHeaderBlock.addEventListener("click", () => {
      if (!currentAppointment) {
        closeModal();
        return;
      }

      window.currentRescheduleAppointmentId = currentAppointment.id;

      if (rescheduleBanner) {
        rescheduleBanner.textContent =
          `Rescheduling appointment on ${dateLabel.textContent} at ${timeLabel.textContent}. ` +
          `Click a new time slot or Cancel.`;
        rescheduleBanner.classList.add("is-visible");
      } else {
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

  setupAppointmentSlotHandlers();
});
