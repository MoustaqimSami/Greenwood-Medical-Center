(function () {
function findPatientIdFromDom() {
  const nameEl = document.querySelector(".patient-name");
  if (
    !nameEl ||
    !window.patientsDatabase ||
    !Array.isArray(window.patientsDatabase.patients)
  ) {
    return null;
  }

  const fullName = nameEl.textContent.trim().toLowerCase();

  const match = window.patientsDatabase.patients.find((p) => {
    if (!p) return false; // guard against undefined slots

    // If your patients store `name` as a single field:
    const simpleName = (p.name || "").trim().toLowerCase();

    // If you ever move to firstName / lastName, you can also build a fallback:
    // const compositeName = `${p.firstName || ""} ${p.lastName || ""}`.trim().toLowerCase();
    // return simpleName === fullName || compositeName === fullName;

    return simpleName === fullName;
  });

  return match ? match.id : null;
}


  // Helper: go to doctors page (relative from PatientPages/)
  function goToDoctorsPageWithPatient(patientId) {
    // patients-profile.html → ../DoctorPages/doctors.html
    const url = new URL("../DoctorPages/doctors.html", window.location.href);

    if (patientId) {
      url.searchParams.set("patientId", patientId);
    }

    window.location.href = url.toString();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const bookBtn = document.querySelector(".book-appointment-btn");
    if (!bookBtn) {
      console.warn(
        "patient-book-appointment.js: .book-appointment-btn not found"
      );
      return;
    }

    bookBtn.addEventListener("click", function (e) {
      e.preventDefault();

      let patientId = null;

      // 1) Try to detect patient from the profile name on this page
      
      patientId = findPatientIdFromDom();

      // 2) If that fails, fall back to whatever is active in patientsDatabase
      if (!patientId && window.patientsDatabase) {
        const { patients, getActivePatientId } = window.patientsDatabase;

        if (typeof getActivePatientId === "function") {
          patientId = getActivePatientId();
        }

        // 3) Last resort: first valid patient
        if (!patientId && Array.isArray(patients)) {
          const firstValid = patients.find((p) => p && p.id);
          if (firstValid) {
            patientId = firstValid.id;
          }
        }
      }

      // Persist active patient if we have one
      if (
        patientId &&
        window.patientsDatabase &&
        typeof window.patientsDatabase.setActivePatientId === "function"
      ) {
        window.patientsDatabase.setActivePatientId(patientId);
      }

      // Redirect (with patientId in the query if available)
      goToDoctorsPageWithPatient(patientId);
    });
  });
})();
