(function (Dashboard) {
  const { state, dom, helpers } = Dashboard;
  const { doctors, appointments } = state;
  const { toISODate } = helpers;
  const { doctorsTodayList } = dom;

  // ---- helpers ------------------------------------------------------

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

    // All appointments for this doctor
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

    // 1) No appointments at all -> Available now
    if (bookedCount === 0) {
      return {
        tagClass: "availability-card-tag--available",
        tagText: "Available now",
        showTime: false,
        labelText: "",
        timeText: "",
      };
    }

    // 2) Some appointments but not completely full -> In appointment
    if (!capacitySlots || bookedCount < capacitySlots) {
      const lastAppt = todaysAppts[todaysAppts.length - 1];
      return {
        tagClass: "availability-card-tag--busy",
        tagText: "In appointment",
        showTime: true,
        labelText: "Available at:",
        timeText: lastAppt ? lastAppt.end : "",
      };
    }

    // 3) Appointments fill or exceed capacity -> Fully booked
    return {
      tagClass: "availability-card-tag--booked",
      tagText: "Fully booked",
      showTime: false,
      labelText: "",
      timeText: "",
    };
  }

  function renderDoctorsToday() {
    if (!doctorsTodayList) return;

    const dayIndex = state.selectedDate.getDay();
    const selectedDateISO = toISODate(state.selectedDate);

    doctorsTodayList.innerHTML = "";

    const availableDocs = doctors.filter((doc) =>
      (doc.availabilityWindows || []).some((w) => w.day === dayIndex)
    );

    if (availableDocs.length === 0) {
      const empty = document.createElement("p");
      empty.className = "body-sm-regular";
      empty.style.color = "var(--neutral-600)";
      empty.textContent = "No doctors available on this day.";
      doctorsTodayList.appendChild(empty);
      return;
    }

    availableDocs.forEach((doc) => {
      const card = document.createElement("div");
      card.className = "availability-card";

      const nameP = document.createElement("p");
      nameP.className = "availability-card-doctor";
      nameP.textContent = doc.name;

      const info = document.createElement("div");
      info.className = "availability-card-info";

      const tag = document.createElement("div");
      tag.className = "availability-card-tag";

      const status = getDoctorStatusForDay(doc, dayIndex, selectedDateISO);

      tag.classList.add(status.tagClass);
      tag.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="availability-card-tag-icon">
          <path d="M0.5 3C0.5 1.61929 1.61929 0.5 3 0.5C4.3807 0.5 5.5 1.61929 5.5 3C5.5 4.3807 4.3807 5.5 3 5.5C1.61929 5.5 0.5 4.3807 0.5 3Z" />
        </svg>
        <p>${status.tagText}</p>
      `;

      info.appendChild(tag);

      if (status.showTime && status.timeText) {
        const timeWrapper = document.createElement("div");
        timeWrapper.className = "flexrow-gap2";

        const label = document.createElement("p");
        label.className = "availability-card-label";
        label.textContent = status.labelText;

        const timeP = document.createElement("p");
        timeP.className = "availability-card-time";
        timeP.textContent = status.timeText;

        timeWrapper.appendChild(label);
        timeWrapper.appendChild(timeP);
        info.appendChild(timeWrapper);
      }

      card.appendChild(nameP);
      card.appendChild(info);
      doctorsTodayList.appendChild(card);
    });
  }

  Dashboard.doctors = {
    renderDoctorsToday,
  };
})(window.Dashboard);
