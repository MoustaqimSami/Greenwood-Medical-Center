document.addEventListener("DOMContentLoaded", function () {
  const core = window.appointmentModalCore;
  if (!core || !core.modal) return;

  const {
    modal,
    editBtn,
    deleteBtn,
    saveBtn,
    deleteDialog,
    deleteCancelBtn,
    deleteConfirmBtn,
  } = core;

  // --- EDIT BUTTON ---
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const currentAppointment = core.getCurrentAppointment();
      if (!currentAppointment) {
        core.showStatus(
          "No existing appointment to edit. Use Add to create one.",
          "info"
        );
        return;
      }

      core.setEditMode(true);
      core.showStatus(
        "Editing appointment. Make changes then click Save.",
        "info"
      );
    });
  }

  // --- DELETE / CANCEL BUTTON ---
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const currentAppointment = core.getCurrentAppointment();

      // New appointment
      if (!currentAppointment) {
        core.closeModal();
        core.showStatus("Appointment creation cancelled.", "info");
        return;
      }

      // Existing appointment
      if (!deleteDialog) {
        core.showStatus(
          "Delete dialog not available. Please try again.",
          "danger",
          false
        );
        return;
      }

      deleteDialog.classList.add("is-open");
    });
  }

  // --- DELETE DIALOG: CANCEL ---
  if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener("click", () => {
      if (!deleteDialog) {
        core.showStatus(
          "Could not close delete dialog. Please try again.",
          "danger",
          false
        );
        return;
      }
      deleteDialog.classList.remove("is-open");
      core.showStatus("Deletion cancelled.", "info");
    });
  }

  // --- DELETE DIALOG: CONFIRM ---
  if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener("click", () => {
      const currentAppointment = core.getCurrentAppointment();
      if (!currentAppointment) {
        core.showStatus(
          "No appointment selected to delete.",
          "danger",
          false
        );
        return;
      }

      if (!window.appointmentsDatabase?.deleteAppointment) {
        core.showStatus(
          "Unable to delete appointment. Please try again.",
          "danger",
          false
        );
        return;
      }

      const deleted = window.appointmentsDatabase.deleteAppointment(
        currentAppointment.id
      );

      if (!deleted) {
        core.showStatus(
          "Delete failed. Please check the schedule and try again.",
          "danger",
          false
        );
        return;
      }

      if (deleteDialog) {
        deleteDialog.classList.remove("is-open");
      }

      core.showStatus("Appointment deleted.", "success", false);
      core.setCurrentAppointment(null);
      core.closeModal();

      if (window.refreshDoctorSchedule) {
        window.refreshDoctorSchedule();
      }
    });
  }

  // --- SAVE / ADD BUTTON ---
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const editMode = core.getEditMode();
      if (!editMode) {
        core.showStatus(
          "Click Edit before saving changes to an existing appointment.",
          "info"
        );
        return;
      }

      const { reason, notes } = core.getFormValues();
      const currentSlotInfo = core.getCurrentSlotInfo();
      const currentAppointment = core.getCurrentAppointment();
      const appointmentType = core.getCurrentAppointmentType();

      const doctorId = window.doctorsDatabase?.getActiveDoctorId?.();
      const date = currentSlotInfo?.dateRaw;
      const start = currentSlotInfo?.timeRaw;

      if (!doctorId || !date || !start) {
        core.showStatus(
          "Missing doctor or time information. Please select a valid slot.",
          "danger",
          false
        );
        return;
      }

      // New appointment
      if (!currentAppointment) {
        const activePatientId =
          window.patientsDatabase?.getActivePatientId?.() || null;

        if (!activePatientId) {
          core.showStatus(
            "Select a patient before adding an appointment.",
            "danger",
            false
          );
          return;
        }

        if (!window.appointmentsDatabase?.createAppointment) {
          core.showStatus(
            "Unable to add appointment. Please try again.",
            "danger",
            false
          );
          return;
        }

        const newAppt = window.appointmentsDatabase.createAppointment({
          doctorId,
          patientId: activePatientId,
          type: appointmentType,
          date,
          start,
          end: core.getEndTime(start),
          reason,
          notes,
        });

        if (!newAppt) {
          core.showStatus(
            "Unable to add appointment. Please try again.",
            "danger",
            false
          );
          return;
        }

        core.setCurrentAppointment(newAppt);
        core.setEditMode(false);
        core.showStatus("Appointment added.", "success");

        if (window.refreshDoctorSchedule) {
          window.refreshDoctorSchedule();
        }

        core.closeModal();
        return;
      }

      // Existing appointment: update
      if (!window.appointmentsDatabase?.updateAppointmentById) {
        core.showStatus(
          "Unable to update appointment. Please try again.",
          "danger",
          false
        );
        return;
      }

      const changes = {
        type: appointmentType,
        reason,
        notes,
      };

      const updated =
        window.appointmentsDatabase.updateAppointmentById(
          currentAppointment.id,
          changes
        );

      if (!updated) {
        core.showStatus(
          "Update failed. Please try again.",
          "danger",
          false
        );
        return;
      }

      core.setCurrentAppointment(updated);
      core.setEditMode(false);
      core.showStatus("Appointment updated.", "success");

      if (window.refreshDoctorSchedule) {
        window.refreshDoctorSchedule();
      }
    });
  }
});