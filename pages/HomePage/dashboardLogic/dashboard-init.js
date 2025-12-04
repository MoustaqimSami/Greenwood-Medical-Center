(function (Dashboard) {
  function init() {
    if (!Dashboard.state || !Dashboard.dom) {
      console.error("Dashboard state not initialized.");
      return;
    }

    Dashboard.calendar.attachCalendarListeners();
    Dashboard.appointments.attachTabsListeners();
    Dashboard.appointments.attachAppointmentListeners();
    Dashboard.appointments.attachQuickActions();

    Dashboard.calendar.renderWeek();
    Dashboard.appointments.renderAppointments();
    Dashboard.doctors.renderDoctorsToday();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window.Dashboard);
