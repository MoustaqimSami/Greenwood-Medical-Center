(function () {
  // ---- Helpers ----
  function getAllPatients() {
    if (
      !window.patientsDatabase ||
      !Array.isArray(window.patientsDatabase.patients)
    ) {
      console.error("patientsDatabase is not available on window.");
      return [];
    }

    return [...window.patientsDatabase.patients].sort((a, b) => {
      const an = (a.name || "").toLowerCase();
      const bn = (b.name || "").toLowerCase();
      return an.localeCompare(bn);
    });
  }

  function applySort(patients, sortValue) {
    const result = [...patients];

    if (sortValue === "name-desc") {
      result.sort((a, b) => {
        const an = (a.name || "").toLowerCase();
        const bn = (b.name || "").toLowerCase();
        return bn.localeCompare(an);
      });
    } else {
      result.sort((a, b) => {
        const an = (a.name || "").toLowerCase();
        const bn = (b.name || "").toLowerCase();
        return an.localeCompare(bn);
      });
    }

    return result;
  }

  function renderRows(patients) {
    const tableBody = document.querySelector("#myTable tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!patients || patients.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No patients found.";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    patients.forEach((p) => {
      const row = document.createElement("tr");
      row.dataset.patientId = p.id;

      const [firstName, ...rest] = (p.name || "").split(" ");
      const lastName = rest.join(" ");

      row.innerHTML = `
        <td>${firstName || ""}</td>
        <td>${lastName || ""}</td>
        <td>${p.dob || "-"}</td>
        <td>${p.phone || "-"}</td>
        <td>${p.gender || "-"}</td>
      `;

      // Click: set active patient and go to profile page
      row.addEventListener("click", () => {
        if (
          window.patientsDatabase &&
          typeof window.patientsDatabase.setActivePatientId === "function"
        ) {
          window.patientsDatabase.setActivePatientId(p.id);
        }
        window.location.href = "patients-profile.html";
      });

      tableBody.appendChild(row);
    });
  }

  // ---- Core filter + search ----
  function filterAndRender() {
    const allPatients = getAllPatients();
    const searchInput = document.getElementById("myInput");
    const genderFilter = document.getElementById("genderFilter");
    const sortSelect = document.getElementById("sortBy");

    const query = (searchInput?.value || "").trim().toLowerCase();
    const genderValue = genderFilter?.value || "all";
    const sortValue = sortSelect?.value || "name-asc";

    let filtered = allPatients;

    // Filter by gender
    if (genderValue !== "all") {
      filtered = filtered.filter(
        (p) => (p.gender || "").toLowerCase() === genderValue.toLowerCase()
      );
    }

    // Search by "everything"
    if (query) {
      filtered = filtered.filter((p) => {
        const haystack = [
          p.name || "",
          p.phone || "",
          p.gender || "",
          p.age != null ? String(p.age) : "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    // Apply sort
    filtered = applySort(filtered, sortValue);

    renderRows(filtered);
  }

  // ---- Init ----
  // ---- Init ----
  document.addEventListener("DOMContentLoaded", () => {
    // Initial render
    renderRows(getAllPatients());

    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("myInput");
    const genderFilter = document.getElementById("genderFilter");
    const sortSelect = document.getElementById("sortBy");

    if (searchButton) {
      searchButton.addEventListener("click", filterAndRender);
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        filterAndRender();
      });

      searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          filterAndRender();
        }
      });
    }

    if (genderFilter) {
      genderFilter.addEventListener("change", filterAndRender);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", filterAndRender);
    }

    // Modal functionality
    const addPatientBtn = document.querySelector(".new-pat-btn");
    const addPatientModal = document.getElementById("addPatientModal");
    const modalClose = document.querySelector(".modal-close");
    const modalCancel = document.querySelector(".modal-cancel");
    const addPatientForm = document.getElementById("addPatientForm");

    if (!addPatientBtn || !addPatientModal || !addPatientForm) {
      return;
    }

    // Open modal
    addPatientBtn.addEventListener("click", () => {
      addPatientModal.classList.add("active");
    });

    // Close modal
    function closeModal() {
      addPatientModal.classList.remove("active");
      addPatientForm.reset();
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalCancel) modalCancel.addEventListener("click", closeModal);

    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === addPatientModal) {
        closeModal();
      }
    });

    addPatientForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!window.patientsDatabase) {
        console.error("patientsDatabase is not available.");
        return;
      }

      const formData = new FormData(addPatientForm);

      const firstName = (formData.get("firstName") || "").trim();
      const lastName = (formData.get("lastName") || "").trim();
      const dateOfBirth = formData.get("dateOfBirth") || "";
      const gender = formData.get("gender") || "";
      const phoneNumber = (formData.get("phoneNumber") || "").trim();
      const address = (formData.get("address") || "").trim();
      const emergencyContact = (formData.get("emergencyContact") || "").trim();
      const emergencyPhone = (formData.get("emergencyPhone") || "").trim();
      const healthcareNumber = (formData.get("healthcareNumber") || "").trim();
      const familyDoctor = (formData.get("familyDoctor") || "").trim();
      const referredBy = (formData.get("referredBy") || "").trim();
      const otherInsurance = (formData.get("otherInsurance") || "").trim();

      // Required fields; browser "required" also helps
      if (!firstName || !lastName || !dateOfBirth || !gender || !phoneNumber) {
        return;
      }

      const list = window.patientsDatabase.patients;

      // Generate new id like "pat-31"
      let maxNumeric = 0;
      if (Array.isArray(list)) {
        list.forEach((p) => {
          if (!p || !p.id) return;
          const match = String(p.id).match(/(\d+)$/);
          if (match) {
            const n = parseInt(match[1], 10);
            if (!Number.isNaN(n) && n > maxNumeric) maxNumeric = n;
          }
        });
      }
      const newId = `pat-${maxNumeric + 1}`;

      // Match structure used in patients-database.js
      const newPatient = {
        id: newId,
        name: `${firstName} ${lastName}`,
        gender,
        phone: phoneNumber,
        dob: dateOfBirth,
        extendedInfo: {
          address,
          phoneNumber,
          emergencyContactName: emergencyContact,
          emergencyContactPhone: emergencyPhone,
          healthcareNumber,
          familyDoctor,
          referredBy,
          otherInsurance,
        },
      };

      // 🔗 Add to DB with persistence
      if (typeof window.patientsDatabase.addPatient === "function") {
        window.patientsDatabase.addPatient(newPatient);
      } else if (Array.isArray(window.patientsDatabase.patients)) {
        // fallback, but ideally addPatient exists
        window.patientsDatabase.patients.push(newPatient);
      }

      // ✅ Set active patient BEFORE redirect
      if (typeof window.patientsDatabase.setActivePatientId === "function") {
        window.patientsDatabase.setActivePatientId(newId);
      }

      // Refresh table for when you come back
      if (typeof filterAndRender === "function") {
        filterAndRender();
      }

      // Close modal and reset
      addPatientForm.reset();
      addPatientModal.classList.remove("active");

      // Go straight to profile page
      window.location.href = "patients-profile.html";
    });
  });

  // Close the IIFE
})();
