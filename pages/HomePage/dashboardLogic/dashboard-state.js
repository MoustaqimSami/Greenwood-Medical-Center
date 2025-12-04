(function (Dashboard) {
  const appointmentsDB = window.appointmentsDatabase || {
    appointments: [],
    updateAppointmentById: () => {},
    deleteAppointment: () => {},
  };
  const doctorsDB = window.doctorsDatabase || { doctors: [] };
  const patientsDB = window.patientsDatabase || { patients: [] };

  const { appointments, updateAppointmentById, deleteAppointment } = appointmentsDB;
  const { doctors } = doctorsDB;
  const { patients } = patientsDB;

  if (!Dashboard.helpers) {
    console.error("Dashboard.helpers is missing – check script order.");
    Dashboard.helpers = {};
  }

  const { parseISODateToLocal, getMonday } = Dashboard.helpers;

  const firstApptDate = appointments[0]
    ? parseISODateToLocal(appointments[0].date)
    : new Date();
  const selectedDate = new Date(firstApptDate);
  selectedDate.setHours(0, 0, 0, 0);
  const currentWeekStart = getMonday ? getMonday(selectedDate) : selectedDate;

  const dom = {
    weekDaysContainer: document.getElementById("week-days-container"),
    weekPrevBtn: document.getElementById("week-prev-btn"),
    weekNextBtn: document.getElementById("week-next-btn"),
    weekRangeLabel: document.getElementById("week-range-label"),
    weekMonthLabel: document.getElementById("week-month-label"),
    upcomingPanel: document.getElementById("upcoming-appointments-panel"),
    completedPanel: document.getElementById("completed-appointments-panel"),
    doctorsTodayList: document.getElementById("doctors-today-list"),
    tabsContainer: document.getElementById("appointments-tabs"),
    quickActions: document.querySelectorAll(".quick-action"),
  };

  Dashboard.state = {
    appointments,
    updateAppointmentById,
    deleteAppointment,
    doctors,
    patients,
    selectedDate,
    currentWeekStart,
  };

  Dashboard.dom = dom;
})(window.Dashboard);
