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
  } = {}) {
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

      const actions = document.createElement("div");
      actions.className = "confirm-modal-actions";

      const cancelBtn = document.createElement("button");
      cancelBtn.className =
        "confirm-modal-btn confirm-modal-btn--secondary";
      cancelBtn.textContent = cancelLabel;

      const confirmBtn = document.createElement("button");
      confirmBtn.className =
        "confirm-modal-btn confirm-modal-btn--primary";
      confirmBtn.textContent = confirmLabel;

      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);

      modal.appendChild(titleEl);
      modal.appendChild(messageEl);
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
