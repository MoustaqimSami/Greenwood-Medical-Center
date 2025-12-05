(function () {
  function getAllPatients() {
    if (
      !window.patientsDatabase ||
      !Array.isArray(window.patientsDatabase.patients)
    ) {
      console.error("patientsDatabase is not available on window.");
      return [];
    }
    return window.patientsDatabase.patients;
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
        <td>${p.dob || "—"}</td>
        <td>${p.phone || "—"}</td>
        <td>${p.gender || "—"}</td>
      `;

      // When a row is clicked, set active patient and go to profile
      row.addEventListener("click", () => {
        if (
          window.patientsDatabase &&
          typeof window.patientsDatabase.setActivePatientId === "function"
        ) {
          window.patientsDatabase.setActivePatientId(p.id);
        }
        // patients.html, patients-profile.html, etc. live in the same folder
        window.location.href = "patients-profile.html";
      });

      tableBody.appendChild(row);
    });
  }

  function filterPatients() {
    const allPatients = getAllPatients();
    const input = document.getElementById("myInput");
    const query = input ? input.value.trim().toLowerCase() : "";

    if (!query) {
      renderRows(allPatients);
      return;
    }

    const filtered = allPatients.filter((p) =>
      (p.name || "").toLowerCase().includes(query)
    );

    renderRows(filtered);
  }

  window.myFunction = filterPatients;

  document.addEventListener("DOMContentLoaded", () => {
    const allPatients = getAllPatients();
    renderRows(allPatients);

    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
      searchButton.addEventListener("click", filterPatients);
    }

    const searchInput = document.getElementById("myInput");
    if (searchInput) {
      searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
          filterPatients();
        }
      });
    }
  });
})();
