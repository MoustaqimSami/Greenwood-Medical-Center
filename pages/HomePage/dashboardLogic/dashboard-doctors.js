(function (Dashboard) {
  const { state, dom, helpers } = Dashboard;
  const { doctors, selectedDate } = state;
  const { toISODate } = helpers;
  const { doctorsTodayList } = dom;

  function renderDoctorsToday() {
    if (!doctorsTodayList) return;

    const dayIndex = state.selectedDate.getDay();
    const todayISO = toISODate(new Date());

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
      const windowsForDay = (doc.availabilityWindows || []).filter(
        (w) => w.day === dayIndex
      );
      const firstWindow = windowsForDay[0];

      const card = document.createElement("div");
      card.className = "availability-card";

      const nameP = document.createElement("p");
      nameP.className = "availability-card-doctor";
      nameP.textContent = doc.name;

      const info = document.createElement("div");
      info.className = "availability-card-info";

      const tag = document.createElement("div");
      tag.className = "availability-card-tag";

      const isToday = toISODate(state.selectedDate) === todayISO;
      const now = new Date();

      let tagClass = "availability-card-tag--available";
      let tagText = "Available";

      if (isToday && firstWindow) {
        const [startH, startM] = firstWindow.start.split(":").map(Number);
        const [endH, endM] = firstWindow.end.split(":").map(Number);

        const start = new Date(state.selectedDate);
        start.setHours(startH, startM, 0, 0);
        const end = new Date(state.selectedDate);
        end.setHours(endH, endM, 0, 0);

        if (now >= start && now <= end) {
          tagClass = "availability-card-tag--available";
          tagText = "Available now";
        } else if (now < start) {
          tagClass = "availability-card-tag--busy";
          tagText = "Available later";
        } else {
          tagClass = "availability-card-tag--out";
          tagText = "Finished for today";
        }
      } else {
        tagClass = "availability-card-tag--available";
        tagText = "Available this day";
      }

      tag.classList.add(tagClass);
      tag.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="availability-card-tag-icon">
          <path d="M0.5 3C0.5 1.61929 1.61929 0.5 3 0.5C4.3807 0.5 5.5 1.61929 5.5 3C5.5 4.3807 4.3807 5.5 3 5.5C1.61929 5.5 0.5 4.3807 0.5 3Z" />
        </svg>
        <p>${tagText}</p>
      `;

      const timeWrapper = document.createElement("div");
      timeWrapper.className = "flexrow-gap2";

      const label = document.createElement("p");
      label.className = "availability-card-label";
      label.textContent = "Available at:";

      const timeP = document.createElement("p");
      timeP.className = "availability-card-time";
      timeP.textContent = firstWindow
        ? `${firstWindow.start} - ${firstWindow.end}`
        : "-";

      timeWrapper.appendChild(label);
      timeWrapper.appendChild(timeP);

      info.appendChild(tag);
      info.appendChild(timeWrapper);

      card.appendChild(nameP);
      card.appendChild(info);
      doctorsTodayList.appendChild(card);
    });
  }

  Dashboard.doctors = {
    renderDoctorsToday,
  };
})(window.Dashboard);
