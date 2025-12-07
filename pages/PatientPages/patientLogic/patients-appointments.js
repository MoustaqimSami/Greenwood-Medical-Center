document.addEventListener("DOMContentLoaded", function () {
  const apptTableBody = document.getElementById("patient-appointments-body");
  if (!apptTableBody) return;

  const breadcrumbEl = document.getElementById("patient-name-breadcrumb");
  const headingEl = document.getElementById("patient-name-heading");

  const bookBtn = document.querySelector(
    ".page-header.page-header--twoitems .btn"
  );

  const appointmentsDb = window.appointmentsDatabase;
  const patientsDb = window.patientsDatabase;
  const doctorsDb = window.doctorsDatabase;

  if (!appointmentsDb || !patientsDb || !doctorsDb) {
    console.warn(
      "Missing one of the required databases on patients-appointments page."
    );
    return;
  }

  function computeStatusFromDate(appt) {
    // Standardize comparison date: 3 September 2025
    const cutoff = new Date("2025-09-03T00:00:00");
    const appointmentDate = new Date(appt.date + "T00:00:00");

    if (appointmentDate < cutoff) {
      return "Completed";
    }
    return "Upcoming";
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }); // e.g. "Sep 11, 2025"
  }

  function formatStatus(status) {
    if (!status) return "";
    const s = status.toLowerCase();
    if (s === "completed") return "Completed";
    if (s === "upcoming" || s === "scheduled") return "Upcoming";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function formatType(type) {
    if (!type) return "";
    const s = type.toLowerCase();
    if (s === "assessment") return "Assessment";
    if (s === "reports") return "Reports";
    if (s === "followup") return "Follow-up";
    if (s === "walkin") return "Walk-in";
    if (s === "other") return "Other";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function findActivePatient() {
    // Prefer an explicit active patient from the database
    if (typeof patientsDb.getActivePatientId === "function") {
      const activeId = patientsDb.getActivePatientId();
      if (activeId && typeof patientsDb.getPatientById === "function") {
        const p = patientsDb.getPatientById(activeId);
        if (p) return p;
      }
    }

    // Fallback: try to match the name from the heading if needed
    const nameText = headingEl ? headingEl.textContent.trim() : "";
    if (nameText && Array.isArray(patientsDb.patients)) {
      const lower = nameText.toLowerCase();
      const match = patientsDb.patients.find(
        (p) => p && (p.name || "").trim().toLowerCase() === lower
      );
      if (match) return match;
    }

    return null;
  }

  function renderAppointmentsForPatient(patient) {
    apptTableBody.innerHTML = "";

    const appts =
      typeof appointmentsDb.getAppointmentsForPatient === "function"
        ? appointmentsDb.getAppointmentsForPatient(patient.id)
        : [];

    if (!appts.length) {
      const emptyRow = document.createElement("tr");
      emptyRow.className = "table-row";
      emptyRow.innerHTML = `
        <td colspan="5">No appointments found for this patient.</td>
      `;
      apptTableBody.appendChild(emptyRow);
      return;
    }

    // Sort by date then time
    appts.sort((a, b) => {
      const da = new Date(a.date + "T00:00:00");
      const db = new Date(b.date + "T00:00:00");

      // Descending date
      if (da.getTime() !== db.getTime()) return db - da;

      // Descending time
      return (b.start || "").localeCompare(a.start || "");
    });

    appts.forEach((appt) => {
      const tr = document.createElement("tr");
      tr.className = "table-row";

      const doctor =
        doctorsDb &&
        Array.isArray(doctorsDb.doctors) &&
        doctorsDb.doctors.find((d) => d && d.id === appt.doctorId);

      const doctorName = doctor ? doctor.name : "Unknown doctor";

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(appt.date);

      const doctorCell = document.createElement("td");
      doctorCell.textContent = doctorName;

      const typeCell = document.createElement("td");
      typeCell.textContent = formatType(appt.type);

      const statusCell = document.createElement("td");
      const computedStatus = computeStatusFromDate(appt);
      statusCell.textContent = computedStatus;

      const actionsCell = document.createElement("td");
      actionsCell.className = "table-row--action";
      actionsCell.innerHTML = `
        <div class="actions-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="actions-icon" data-appt-view="${appt.id}" viewBox="0 0 24 24">
            <path
              d="M12.0004 9.00462C14.2095 9.00462 16.0004 10.7955 16.0004 13.0046C16.0004 15.2138 14.2095 17.0046 12.0004 17.0046C9.79122 17.0046 8.00036 15.2138 8.00036 13.0046C8.00036 10.7955 9.79122 9.00462 12.0004 9.00462ZM12.0004 10.5046C10.6197 10.5046 9.50036 11.6239 9.50036 13.0046C9.50036 14.3853 10.6197 15.5046 12.0004 15.5046C13.3811 15.5046 14.5004 14.3853 14.5004 13.0046C14.5004 11.6239 13.3811 10.5046 12.0004 10.5046ZM12.0004 5.5C16.6139 5.5 20.5965 8.65001 21.7015 13.0644C21.8021 13.4662 21.5579 13.8735 21.1561 13.9741C20.7542 14.0746 20.347 13.8305 20.2464 13.4286C19.3075 9.67796 15.9217 7 12.0004 7C8.0773 7 4.69046 9.68026 3.75322 13.4332C3.65286 13.835 3.24572 14.0794 2.84385 13.9791C2.44198 13.8787 2.19756 13.4716 2.29792 13.0697C3.40101 8.65272 7.38485 5.5 12.0004 5.5Z" />
          </svg>
        </div>
      `;

      tr.appendChild(dateCell);
      tr.appendChild(doctorCell);
      tr.appendChild(typeCell);
      tr.appendChild(statusCell);
      tr.appendChild(actionsCell);

      apptTableBody.appendChild(tr);

      const viewIcon = actionsCell.querySelector(
        `[data-appt-view="${appt.id}"]`
      );
      if (viewIcon) {
        viewIcon.addEventListener("click", (e) => {
          e.stopPropagation();

          // Build URL to doctorsSchedule for this doctor + patient + appointment
          const url = new URL(
            "../pages/DoctorPages/doctorsSchedule.html",
            window.location.origin
          );
          url.searchParams.set("doctorId", appt.doctorId);
          url.searchParams.set("patientId", patient.id);
          url.searchParams.set("appointmentId", appt.id);

          window.location.href = url.toString();
        });
      }
    });
  }

  const activePatient = findActivePatient();
  if (!activePatient) {
    console.warn("No active patient found for patients-appointments page.");
    return;
  }

  // Sync header names with the active patient
  if (breadcrumbEl) breadcrumbEl.textContent = activePatient.name;
  if (headingEl) headingEl.textContent = activePatient.name;

  // Wire the "Book a new appointment" button
  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      if (typeof patientsDb.setActivePatientId === "function") {
        patientsDb.setActivePatientId(activePatient.id);
      }
      // Reuse the same flow you already use from dashboard shortcut
      window.location.href = "../DoctorPages/doctorsSchedule.html?open=book";
    });
  }

  renderAppointmentsForPatient(activePatient);
});
