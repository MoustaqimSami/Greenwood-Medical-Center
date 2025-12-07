(function () {
  if (!window.patientsDatabase) {
    console.warn("patients.js: window.patientsDatabase is not defined");
    return;
  }

  const { patients, getActivePatientId } = window.patientsDatabase;

  function getActivePatient() {
    if (!Array.isArray(patients) || patients.length === 0) return null;

    const id =
      typeof getActivePatientId === "function" ? getActivePatientId() : null;

    if (id) {
      const found = patients.find((p) => p && p.id === id);
      if (found) return found;
    }

    const firstValid = patients.find((p) => p && p.id);
    return firstValid || null;
  }

  function splitName(fullName) {
    if (!fullName) return { first: "", last: "" };
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0] || "";
    const last = parts.slice(1).join(" ");
    return { first, last };
  }

  function renderPatientProfile(patient) {
    if (!patient) return;

    const { first, last } = splitName(patient.name || "");
    const fullName = patient.name || `${first} ${last}`.trim();

    const mainTitle = document.querySelector("h1.page-title");
    const breadcrumbInner = document.querySelector(".page-title--inner");
    const patientNameSpan = document.querySelector(".patient-name");

    if (mainTitle) mainTitle.textContent = fullName;
    if (breadcrumbInner) breadcrumbInner.textContent = fullName;
    if (patientNameSpan) patientNameSpan.textContent = fullName;

    const sections = document.querySelectorAll(".item--personal");
    if (sections.length < 3) return;

    const personalSection = sections[0];
    const contactSection = sections[1];
    const healthSection = sections[2];

    const personalFirstNameEl = personalSection.querySelector(".content-1");
    const personalLastNameEl = personalSection.querySelector(".content-2");
    const personalDobEl = personalSection.querySelector(".content-3");
    const personalPhoneEl = personalSection.querySelector(".content-4");

    if (personalFirstNameEl) {
      personalFirstNameEl.innerHTML = `First name<br>${first || ""}`;
    }
    if (personalLastNameEl) {
      personalLastNameEl.innerHTML = `Last name<br>${last || ""}`;
    }
    if (personalDobEl) {
      personalDobEl.innerHTML = `Date of birth<br>${patient.dob || "—"}`;
    }
    if (personalPhoneEl) {
      personalPhoneEl.innerHTML = `Phone<br>${patient.phone || "—"}`;
    }

    const ei = patient.extendedInfo || {};

    const contactAddressEl = contactSection.querySelector(".content-1");
    const contactPhoneEl = contactSection.querySelector(".content-2");
    const emergencyNameEl = contactSection.querySelector(".content-3");
    const emergencyPhoneEl = contactSection.querySelector(".content-4");

    if (contactAddressEl) {
      contactAddressEl.innerHTML = `Address<br>${ei.address || "Not on file"}`;
    }
    if (contactPhoneEl) {
      contactPhoneEl.innerHTML = `Phone Number<br>${
        ei.phoneNumber || patient.phone || "Not on file"
      }`;
    }
    if (emergencyNameEl) {
      emergencyNameEl.innerHTML = `Emergency Contact<br>${
        ei.emergencyContactName || "Not on file"
      }`;
    }
    if (emergencyPhoneEl) {
      emergencyPhoneEl.innerHTML = `Emergency Phone<br>${
        ei.emergencyContactPhone || "Not on file"
      }`;
    }

    const healthNumberEl = healthSection.querySelector(".content-1");
    const familyDoctorEl = healthSection.querySelector(".content-2");
    const referredByEl = healthSection.querySelector(".content-3");
    const otherInsuranceEl = healthSection.querySelector(".content-4");

    if (healthNumberEl) {
      healthNumberEl.innerHTML = `Alberta Healthcare Number<br>${
        ei.healthcareNumber || "Not on file"
      }`;
    }
    if (familyDoctorEl) {
      familyDoctorEl.innerHTML = `Family Doctor<br>${
        ei.familyDoctor || "Not on file"
      }`;
    }
    if (referredByEl) {
      referredByEl.innerHTML = `Referred by<br>${
        ei.referredBy || "Not on file"
      }`;
    }
    if (otherInsuranceEl) {
      otherInsuranceEl.innerHTML = `Other Healthcare Insurance<br>${
        ei.otherInsurance || "N/A"
      }`;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const patient = getActivePatient();
    renderPatientProfile(patient);
  });
})();
