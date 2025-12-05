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
  });
})();
