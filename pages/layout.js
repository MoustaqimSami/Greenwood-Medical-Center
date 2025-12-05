// 1) Sidebar collapse toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".sidebar-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-collapsed");
  });
});

// 2) Highlight active nav item based on current page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const currentPage = path.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item");

  navItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (!href) return;

    const targetPage = href.split("/").pop();

    if (targetPage === currentPage) {
      item.classList.add("nav-item-active");
    } else {
      item.classList.remove("nav-item-active");
    }
  });
});

// 3) Navbar and user chip based on logged-in staff
document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("currentStaff");
  if (!raw) return;

  let staff;
  try {
    staff = JSON.parse(raw);
  } catch (e) {
    console.warn("[layout] Failed to parse currentStaff from localStorage", e);
    return;
  }

  if (!staff) return;
  if (staff.role) {
    document.body.dataset.role = staff.role;
  }

  // Update user chip text
  const nameEl = document.querySelector(".user-chip .user-name");
  const roleEl = document.querySelector(".user-chip .user-role");

  if (nameEl && staff.name) {
    nameEl.textContent = staff.name;
  }

  if (roleEl) {
    roleEl.textContent = staff.roleLabel || staff.role || "";
  }

  // Wire up "Log out" in sidebar bottom
  const logoutLink = Array.from(
    document.querySelectorAll(".sidebar-bottom .nav-item")
  ).find((link) => link.textContent.trim().includes("Log out"));

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentStaff");
      window.location.href = "../LoginPage/login.html";
    });
  }
});
