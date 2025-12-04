(function () {
  const APPOINTMENT_TYPES = {
    ASSESSMENT: "assessment",
    REPORTS: "reports",
    FOLLOWUP: "followup",
    WALKIN: "walkin",
    OTHER: "other",
  };

  const appointments = [
    {
      id: "appt-1",
      doctorId: "doc-1",
      patientId: "pat-1",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-03",
      start: "10:00",
      end: "10:30",
      reason: "Initial assessment for knee pain.",
      notes: "Complains of pain when climbing stairs.",
      status: "completed",
    },
    {
      id: "appt-2",
      doctorId: "doc-1",
      patientId: "pat-2",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-03",
      start: "11:00",
      end: "11:30",
      reason: "Follow-up after physiotherapy.",
      notes: "Check range of motion and pain level.",
      status: "completed",
    },
    {
      id: "appt-3",
      doctorId: "doc-1",
      patientId: "pat-3",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-05",
      start: "16:00",
      end: "16:30",
      reason: "Shoulder discomfort after minor fall.",
      notes: "No prior imaging; consider X-ray if needed.",
      status: "upcoming",
    },
    {
      id: "appt-4",
      doctorId: "doc-1",
      patientId: "pat-4",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-05",
      start: "15:00",
      end: "15:30",
      reason: "Review MRI report.",
      notes: "Discuss results and next treatment steps.",
      status: "completed",
    },
    {
      id: "appt-5",
      doctorId: "doc-1",
      patientId: "pat-5",
      type: APPOINTMENT_TYPES.WALKIN,
      date: "2025-09-06",
      start: "09:30",
      end: "10:00",
      reason: "Walk-in for acute ankle sprain.",
      notes: "Swelling present; evaluate need for bandage/support.",
      status: "upcoming",
    },
    {
      id: "appt-6",
      doctorId: "doc-1",
      patientId: "pat-6",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-06",
      start: "14:00",
      end: "14:30",
      reason: "Chronic lower back pain.",
      notes: "Assess pain history and lifestyle factors.",
      status: "upcoming",
    },
    {
      id: "appt-7",
      doctorId: "doc-1",
      patientId: "pat-7",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-08",
      start: "16:00",
      end: "16:30",
      reason: "Post-surgery follow-up.",
      notes: "Check wound healing and mobility.",
      status: "upcoming",
    },
    {
      id: "appt-8",
      doctorId: "doc-1",
      patientId: "pat-8",
      type: APPOINTMENT_TYPES.OTHER,
      date: "2025-09-10",
      start: "10:30",
      end: "11:00",
      reason: "Insurance / documentation request.",
      notes: "Prepare letter outlining treatment to date.",
      status: "upcoming",
    },
    {
      id: "appt-9",
      doctorId: "doc-1",
      patientId: "pat-9",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-10",
      start: "12:00",
      end: "12:30",
      reason: "Review blood test results.",
      notes: "Discuss inflammation markers and next steps.",
      status: "upcoming",
    },
    {
      id: "appt-10",
      doctorId: "doc-1",
      patientId: "pat-10",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-13",
      start: "09:30",
      end: "10:00",
      reason: "Initial consult for hip pain.",
      notes: "Pain on standing from seated position.",
      status: "upcoming",
    },
  ];

  function getAppointmentById(id) {
    return appointments.find((appt) => appt.id === id) || null;
  }

  function getAppointmentsForDoctor(doctorId) {
    return appointments.filter((appt) => appt.doctorId === doctorId);
  }

  function getAppointmentsForDoctorOnDate(doctorId, date) {
    return appointments.filter(
      (appt) => appt.doctorId === doctorId && appt.date === date
    );
  }

  function getAppointmentsForPatient(patientId) {
    return appointments.filter((appt) => appt.patientId === patientId);
  }

  function createAppointment(data) {
    const newId = `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newAppt = {
      id: newId,
      status: "scheduled",
      ...data,
    };
    appointments.push(newAppt);
    return newAppt;
  }

  function updateAppointmentById(id, changes) {
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    appointments[idx] = { ...appointments[idx], ...changes };
    return appointments[idx];
  }

  function deleteAppointment(id) {
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    appointments.splice(idx, 1);
    return true;
  }

  window.appointmentsDatabase = {
    APPOINTMENT_TYPES,
    appointments,
    getAppointmentById,
    getAppointmentsForDoctor,
    getAppointmentsForDoctorOnDate,
    getAppointmentsForPatient,
    createAppointment,
    deleteAppointment,
    updateAppointmentById,
  };
})();
