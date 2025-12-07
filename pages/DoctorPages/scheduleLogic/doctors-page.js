(function () {
  if (!window.doctorsDatabase || !window.appointmentsDatabase) return;

  const urlParams = new URLSearchParams(window.location.search);
  const patientIdFromUrl = urlParams.get("patientId");

  const { doctors, setActiveDoctorId } = window.doctorsDatabase;
  const { appointments } = window.appointmentsDatabase;

  const doctorsList = document.querySelector(".doctors-list");
  const searchBox = document.querySelector(".search-box");
  const searchInput = document.querySelector(".search-input");
  const searchBtn = searchBox?.querySelector(".btn.btn--sec");
  const filterBtn = searchBox?.querySelector(".filter-btn");

  if (!doctorsList || !searchBox) return;

  // ----------------- helpers -----------------

  function toISODate(date) {
    return date.toISOString().slice(0, 10);
  }

  function timeToMinutes(t) {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function getCapacitySlotsForDay(windowsForDay) {
    return windowsForDay.reduce((sum, w) => {
      const diff = timeToMinutes(w.end) - timeToMinutes(w.start);
      if (diff <= 0) return sum;
      return sum + Math.floor(diff / 30);
    }, 0);
  }

  function getDoctorStatusForDay(doc, dayIndex, selectedDateISO) {
    const windowsForDay = (doc.availabilityWindows || []).filter(
      (w) => w.day === dayIndex
    );

    const todaysAppts = (appointments || [])
      .filter(
        (a) =>
          a.doctorId === doc.id &&
          a.date === selectedDateISO &&
          a.status !== "cancelled"
      )
      .slice()
      .sort((a, b) => a.start.localeCompare(b.start));

    const capacitySlots = getCapacitySlotsForDay(windowsForDay);
    const bookedCount = todaysAppts.length;

    // 1) No appointments at all > Available now
    if (bookedCount === 0) {
      return {
        key: "available",
        tagClass: "availability-card-tag--available",
        tagText: "Available now",
        showTime: false,
        labelText: "",
        timeText: "",
      };
    }

    // 2) Some appointments but not completely full > In appointment
    if (!capacitySlots || bookedCount < capacitySlots) {
      const lastAppt = todaysAppts[todaysAppts.length - 1];
      return {
        key: "busy",
        tagClass: "availability-card-tag--busy",
        tagText: "In appointment",
        showTime: true,
        labelText: "Available at:",
        timeText: lastAppt ? lastAppt.end : "",
      };
    }

    // 3) Appointments fill or exceed capacity -> Fully booked
    return {
      key: "booked",
      tagClass: "availability-card-tag--booked",
      tagText: "Fully booked",
      showTime: false,
      labelText: "",
      timeText: "",
    };
  }

  // Wrap with "Out of office" case for today
  function getDoctorStatusForToday(doc, date) {
    const dayIndex = date.getDay();
    const selectedDateISO = toISODate(date);

    const hasWindowToday = (doc.availabilityWindows || []).some(
      (w) => w.day === dayIndex
    );

    if (!hasWindowToday) {
      return {
        key: "out",
        tagClass: "availability-card-tag--out",
        tagText: "Out of office",
        showTime: false,
        labelText: "",
        timeText: "",
      };
    }

    return getDoctorStatusForDay(doc, dayIndex, selectedDateISO);
  }

  function getInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }

  // ------------ navigation ------------

  function goToDoctorSchedule(doctorId) {
    if (
      window.doctorsDatabase &&
      typeof window.doctorsDatabase.setActiveDoctorId === "function"
    ) {
      window.doctorsDatabase.setActiveDoctorId(doctorId);
    }

    const url = new URL(
      "pages/DoctorPages/doctorsSchedule.html",
      window.location.origin
    );
    url.searchParams.set("doctorId", doctorId);

    // If we arrived on this page with a patientId, carry it forward
    if (patientIdFromUrl) {
      url.searchParams.set("patientId", patientIdFromUrl);
    }

    window.location.href = url.toString();
  }


  // -------------------------- card creation --------------------------

  function createDoctorCard(doc, status) {
    const card = document.createElement("div");
    card.className = "doctor-profile-card";

    // whole card clickable
    card.addEventListener("click", () => {
      goToDoctorSchedule(doc.id);
    });

    const content = document.createElement("div");
    content.className = "doctor-profile-card-content";

    // Left side: avatar + name + specialty
    const left = document.createElement("div");
    left.className = "flexrow-gap8";

    const avatar = document.createElement("div");
    avatar.className = "avatar avatar--medium";
    avatar.textContent = getInitials(doc.name);

    const details = document.createElement("div");
    details.className = "doctor-profile-card-details";

    const nameP = document.createElement("p");
    nameP.className = "doctor-profile-card-name";
    nameP.textContent = doc.name;

    const tagDiv = document.createElement("div");
    tagDiv.className = "doctor-profile-card-tag";
    tagDiv.textContent = doc.specialty || "Specialist";

    details.appendChild(nameP);
    details.appendChild(tagDiv);

    left.appendChild(avatar);
    left.appendChild(details);

    // Right side: availability
    const availability = document.createElement("div");
    availability.className = "doctor-profile-card-availability";

    const tag = document.createElement("div");
    tag.className = `availability-card-tag ${status.tagClass}`;
    tag.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="availability-card-tag-icon">
        <path d="M0.5 3C0.5 1.61929 1.61929 0.5 3 0.5C4.3807 0.5 5.5 1.61929 5.5 3C5.5 4.3807 4.3807 5.5 3 5.5C1.61929 5.5 0.5 4.3807 0.5 3Z" />
      </svg>
      <p>${status.tagText}</p>
    `;
    availability.appendChild(tag);

    if (status.showTime && status.timeText) {
      const timeRow = document.createElement("div");
      timeRow.className = "flexrow-gap2";

      const label = document.createElement("p");
      label.className = "availability-card-label";
      label.textContent = status.labelText || "Available at:";

      const time = document.createElement("p");
      time.className = "availability-card-time";
      time.textContent = status.timeText;

      timeRow.appendChild(label);
      timeRow.appendChild(time);
      availability.appendChild(timeRow);
    }

    content.appendChild(left);
    content.appendChild(availability);

    // Action area
    const action = document.createElement("div");
    action.className = "doctor-profile-card-action";

    const btn = document.createElement("button");
    btn.className = "btn btn--txt";
    btn.innerHTML = `
      View Schedule
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="btn-icon">
        <path
          d="M5.64645 2.81313C5.45118 3.00839 5.45118 3.32498 5.64645 3.52024L10.1262 8.00002L5.64645 12.4798C5.45118 12.6751 5.45118 12.9916 5.64645 13.1869C5.84171 13.3822 6.15829 13.3822 6.35355 13.1869L11.1869 8.35355C11.3821 8.15829 11.3821 7.84175 11.1869 7.64649L6.35355 2.81313C6.15829 2.61787 5.84171 2.61787 5.64645 2.81313Z" />
      </svg>
    `;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToDoctorSchedule(doc.id);
    });

    action.appendChild(btn);

    card.appendChild(content);
    card.appendChild(action);

    return card;
  }

  // ---------------------- filters + search ----------------------

  const filtersContainer = document.querySelector(".doctors-filters");
  const specialtySelect =
    filtersContainer?.querySelector(".filter-specialty") || null;
  const genderSelect =
    filtersContainer?.querySelector(".filter-gender") || null;
  const statusSelect =
    filtersContainer?.querySelector(".filter-status") || null;

  const specialties = Array.from(
    new Set(doctors.map((d) => d.specialty).filter(Boolean))
  ).sort();

  const genders = Array.from(
    new Set(doctors.map((d) => d.gender).filter(Boolean))
  ).sort();

  if (specialtySelect) {
    specialtySelect.innerHTML =
      `<option value="">All specialties</option>` +
      specialties.map((s) => `<option value="${s}">${s}</option>`).join("");
  }

  if (genderSelect) {
    genderSelect.innerHTML =
      `<option value="">All genders</option>` +
      genders.map((g) => `<option value="${g}">${g}</option>`).join("");
  }

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedSpecialty = specialtySelect.value;
    const selectedGender = genderSelect.value;
    const selectedStatus = statusSelect.value;

    const today = new Date();

    const filtered = doctors.filter((doc) => {
      // search
      if (query) {
        const haystack = `${doc.name} ${doc.specialty || ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      // specialty filter
      if (selectedSpecialty && doc.specialty !== selectedSpecialty) {
        return false;
      }

      // gender filter
      if (selectedGender && doc.gender !== selectedGender) {
        return false;
      }

      // status filter
      if (selectedStatus) {
        const status = getDoctorStatusForToday(doc, today);
        if (status.key !== selectedStatus) {
          return false;
        }
      }

      return true;
    });

    renderDoctorsList(filtered, today);
  }

  // ---------------------- rendering ----------------------

  function renderDoctorsList(list, today) {
    doctorsList.innerHTML = "";

    if (!list.length) {
      const emptyState = document.createElement("p");
      emptyState.className = "empty-state-text";
      emptyState.textContent = "No doctors match your filters.";
      doctorsList.appendChild(emptyState);
      return;
    }

    // group into rows of 3
    for (let i = 0; i < list.length; i += 3) {
      const row = document.createElement("div");
      row.className = "doctors-list-row";

      list.slice(i, i + 3).forEach((doc) => {
        const status = getDoctorStatusForToday(doc, today);
        const card = createDoctorCard(doc, status);
        row.appendChild(card);
      });

      doctorsList.appendChild(row);
    }
  }

  // ---------------------- wire events ----------------------

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilters();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFilters();
      }
    });

    searchInput.addEventListener("input", () => {
      applyFilters();
    });
  }

  specialtySelect.addEventListener("change", applyFilters);
  genderSelect.addEventListener("change", applyFilters);
  statusSelect.addEventListener("change", applyFilters);

  // initial render with all doctors
  renderDoctorsList(doctors, new Date());
})();
