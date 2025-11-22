document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".sidebar-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-collapsed");
  });
});

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
