(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("appointment-modal");
    if (!modal) return;

    const doctorSearchInput = modal.querySelector("#popup-doctor-search");
    const doctorResultsBox = modal.querySelector("#popup-doctor-results");
    const doctorPanel = modal.querySelector("#popup-doctor-panel");
    const doctorsDB = window.doctorsDatabase?.doctors || [];

    function renderDoctorPanel(doctor) {
      if (!doctorPanel || !doctor) return;

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
          if (doctorSearchInput) doctorSearchInput.value = "";

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

    document.addEventListener("click", (e) => {
      const inDoctorSearch =
        doctorSearchInput && doctorSearchInput.contains(e.target);
      const inDoctorResults =
        doctorResultsBox && doctorResultsBox.contains(e.target);

      if (!inDoctorSearch && !inDoctorResults) {
        clearDoctorResults();
      }
    });

    window.appointmentDoctorSearch = {
      renderDoctorPanel,
      renderGenericDoctorPanel,
      clearDoctorResults,
      getActiveDoctor() {
        const activeId = window.doctorsDatabase?.getActiveDoctorId?.();
        return activeId
          ? window.doctorsDatabase.getDoctorById(activeId)
          : null;
      },
    };
  });
})();
