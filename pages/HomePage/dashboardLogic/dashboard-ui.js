(function (Dashboard) {
  const UI = {};
  let popupTimeoutId = null;

  UI.showPopup = function showPopup(message, variant = "success") {
    let popup = document.getElementById("feedback-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "feedback-popup";
      popup.className = "feedback-popup";
      document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.className = `feedback-popup feedback-popup--${variant} feedback-popup--visible`;

    if (popupTimeoutId) {
      clearTimeout(popupTimeoutId);
    }

    popupTimeoutId = setTimeout(() => {
      popup.classList.remove("feedback-popup--visible");
    }, 2500);
  };

  UI.openConfirmModal = function openConfirmModal({
    title = "Are you sure?",
    message = "",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    context = null,
    confirmVariant = "primary",
  } = {}) {
    
    let confirmVariantClass = "confirm-modal-btn--primary";

    if (confirmVariant === "teal") {
      confirmVariantClass = "confirm-modal-btn--teal";
    }
    return new Promise((resolve) => {
      const backdrop = document.createElement("div");
      backdrop.className = "confirm-modal-backdrop";

      const modal = document.createElement("div");
      modal.className = "confirm-modal";

      const titleEl = document.createElement("h2");
      titleEl.className = "confirm-modal-title";
      titleEl.textContent = title;

      const messageEl = document.createElement("p");
      messageEl.className = "confirm-modal-message";
      messageEl.textContent = message;

      modal.appendChild(titleEl);
      if (message) modal.appendChild(messageEl);

      // ---- Appointment card  ----
      if (context) {
        const {
          initials = "",
          patientName = "",
          doctorName = "",
          timeLabel = "",
        } = context;

        const card = document.createElement("div");
        card.className = "confirm-appt-card";

        const avatar = document.createElement("div");
        avatar.className = "confirm-appt-avatar";
        avatar.textContent =
          (initials && initials.trim()) ||
          (patientName ? patientName.trim()[0] : "?");

        const textBox = document.createElement("div");
        textBox.className = "confirm-appt-text";

        if (patientName) {
          const p = document.createElement("div");
          p.className = "confirm-appt-patient";
          p.textContent = patientName;
          textBox.appendChild(p);
        }

        if (doctorName) {
          const d = document.createElement("div");
          d.className = "confirm-appt-doctor";
          d.textContent = doctorName;
          textBox.appendChild(d);
        }

        if (timeLabel) {
          const t = document.createElement("div");
          t.className = "confirm-appt-time";
          t.textContent = timeLabel;
          textBox.appendChild(t);
        }

        card.appendChild(avatar);
        card.appendChild(textBox);
        modal.appendChild(card);
      }

      const actions = document.createElement("div");
      actions.className = "confirm-modal-actions";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "confirm-modal-btn confirm-modal-btn--secondary";
      cancelBtn.textContent = cancelLabel;

      const confirmBtn = document.createElement("button");
      confirmBtn.type = "button";
      confirmBtn.className = `confirm-modal-btn ${confirmVariantClass}`;
      confirmBtn.textContent = confirmLabel;

      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);

      modal.appendChild(actions);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      const close = (result) => {
        backdrop.remove();
        resolve(result);
      };

      cancelBtn.addEventListener("click", () => close(false));
      confirmBtn.addEventListener("click", () => close(true));
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) close(false);
      });
    });
  };

  Dashboard.ui = UI;
})(window.Dashboard);
