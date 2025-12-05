(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("appointment-modal");
    if (!modal) return;

    const patientSearchInput = modal.querySelector("#popup-patient-search");
    const patientResultsBox = modal.querySelector("#popup-patient-results");
    const patientPanel = modal.querySelector("#popup-patient-panel");
    const patientsDB = window.patientsDatabase?.patients || [];

    function renderPatientPanel(patient) {
      if (!patientPanel || !patient) return;

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
          if (patientSearchInput) patientSearchInput.value = "";
        });

        patientResultsBox.appendChild(row);
      });
    }

    if (patientSearchInput) {
      patientSearchInput.addEventListener("input", (e) => {
        renderPatientResults(e.target.value);
      });
    }

    document.addEventListener("click", (e) => {
      const inPatientSearch =
        patientSearchInput && patientSearchInput.contains(e.target);
      const inPatientResults =
        patientResultsBox && patientResultsBox.contains(e.target);

      if (!inPatientSearch && !inPatientResults) {
        clearPatientResults();
      }
    });

    window.appointmentPatientSearch = {
      renderPatientPanel,
      renderGenericPatientPanel,
      clearPatientResults,
      getActivePatientById(id) {
        return id
          ? window.patientsDatabase?.getPatientById?.(id) || null
          : null;
      },
    };

    renderGenericPatientPanel();
  });
})();
