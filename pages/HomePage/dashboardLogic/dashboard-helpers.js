(function (Dashboard) {
  const Helpers = {};

  Helpers.toISODate = function toISODate(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  Helpers.parseISODateToLocal = function parseISODateToLocal(iso) {
    if (!iso) return new Date();
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  Helpers.sameDay = function sameDay(d1, d2) {
    return Helpers.toISODate(d1) === Helpers.toISODate(d2);
  };

  Helpers.formatDayRangeLabel = function formatDayRangeLabel(weekStart) {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);

    const startDay = weekStart.getDate();
    const endDay = end.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const startMonth = monthNames[weekStart.getMonth()];
    const endMonth = monthNames[end.getMonth()];

    if (weekStart.getMonth() === end.getMonth()) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${end.getFullYear()}`;
    }
    return `${startDay} ${startMonth} ${weekStart.getFullYear()} - ${endDay} ${endMonth} ${end.getFullYear()}`;
  };

  Helpers.formatMonthLabel = function formatMonthLabel(weekStart) {
    const fullMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${
      fullMonthNames[weekStart.getMonth()]
    }, ${weekStart.getFullYear()}`;
  };

  Helpers.getPatientInitials = function getPatientInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  Dashboard.helpers = Helpers;
})(window.Dashboard);
