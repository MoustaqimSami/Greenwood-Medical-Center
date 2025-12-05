document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const loginButton = document.getElementById("login-btn");
  const messageBox = document.getElementById("login-message");
  const eyeIcon = document.getElementById("eye-icon");

  if (!emailInput || !passwordInput || !loginButton || !messageBox) {
    console.warn("[login] Missing form elements");
    return;
  }

  // --- Password visibility toggle ---
  if (eyeIcon) {
    const eyeOpenSrc = "../../assets/icons/eye.svg";
    const eyeClosedSrc = "../../assets/icons/eye-off.svg";

    eyeIcon.style.display = "block";

    eyeIcon.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.src = eyeOpenSrc;
      } else {
        passwordInput.type = "password";
        eyeIcon.src = eyeClosedSrc;
      }
    });
  }

  // --- Login message stub ---
  function showMessage(text, type) {
    messageBox.textContent = text || "";
    messageBox.className = "login-message";
    if (type === "error") {
      messageBox.classList.add("error");
    } else if (type === "success") {
      messageBox.classList.add("success");
    }
  }

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage("Please enter both email and password.", "error");
      return;
    }

    if (!window.staffDatabase) {
      console.error("[login] staffDatabase is not loaded");
      showMessage("Configuration error. Please contact support.", "error");
      return;
    }

    const staffMember = window.staffDatabase.validateCredentials(
      email,
      password
    );

    if (!staffMember) {
      showMessage("Invalid email or password. Please try again.", "error");
      return;
    }

    const { id, name, role, roleLabel, avatarInitials, avatarUrl } =
      staffMember;

    localStorage.setItem(
      "currentStaff",
      JSON.stringify({ id, name, role, roleLabel, avatarInitials, avatarUrl })
    );

    showMessage("Login successful!", "success");

    setTimeout(() => {
      window.location.href = "../HomePage/dashboard.html";
    }, 300);
  });
});
