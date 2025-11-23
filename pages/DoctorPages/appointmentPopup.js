document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("appointment-modal");
  if (!modal) return;

  const closeBtn = modal.querySelector("[data-appointment-close]");
  const tabButtons = modal.querySelectorAll("[data-appointment-tab]");
  const timeLabel = modal.querySelector("[data-appointment-time]");
  const dayLabel = modal.querySelector("[data-appointment-day]");
  const dateLabel = modal.querySelector("[data-appointment-date]");

  function openModal(slotInfo) {
    // later can pass real data; for now it's static
    if (slotInfo && timeLabel && dayLabel && dateLabel) {
      if (slotInfo.time) timeLabel.textContent = slotInfo.time;
      if (slotInfo.day) dayLabel.textContent = slotInfo.day;
      if (slotInfo.date) dateLabel.textContent = slotInfo.date;
    }
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  // open modal when clicking any available slot
  const availableSlots = document.querySelectorAll(".slot-row-available");
  availableSlots.forEach(function (slot) {
    slot.addEventListener("click", function () {
      // later can extract time/day from data attributes here
      openModal();
    });
  });

  // close button
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeModal();
    });
  }

  // close when clicking on the dim overlay (outside the dialog)
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // simple tab active state (visual only for now)
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabButtons.forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      // content switching can be added later
    });
  });
});
