(function () {
  const APPOINTMENT_TYPES = {
    ASSESSMENT: "assessment",
    REPORTS: "reports",
    FOLLOWUP: "followup",
    WALKIN: "walkin",
    OTHER: "other",
  };

  const appointments = [
    // --- Original Appointments (1-10) ---
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

    // --- Batch 2 Appointments (11-20) ---
    {
      id: "appt-11",
      doctorId: "doc-2",
      patientId: "pat-11",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-02",
      start: "10:00",
      end: "10:30",
      reason: "Assessment for sports injury rehab.",
      notes: "Patient recovering from ACL tear.",
      status: "upcoming",
    },
    {
      id: "appt-12",
      doctorId: "doc-2",
      patientId: "pat-12",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-08",
      start: "14:00",
      end: "14:30",
      reason: "Sciatica pain management review.",
      notes: "Evaluate effectiveness of current exercises.",
      status: "upcoming",
    },
    {
      id: "appt-13",
      doctorId: "doc-3",
      patientId: "pat-13",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-04",
      start: "09:00",
      end: "09:30",
      reason: "Consult regarding heart palpitations.",
      notes: "Patient reports irregular heartbeat at night.",
      status: "upcoming",
    },
    {
      id: "appt-14",
      doctorId: "doc-3",
      patientId: "pat-14",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-09",
      start: "11:00",
      end: "11:30",
      reason: "Review Holter monitor results.",
      notes: "Discuss findings and potential medication.",
      status: "upcoming",
    },
    {
      id: "appt-15",
      doctorId: "doc-4",
      patientId: "pat-18",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-06",
      start: "11:00",
      end: "11:30",
      reason: "Annual physical check-up.",
      notes: "Check vaccination status and growth charts.",
      status: "upcoming",
    },
    {
      id: "appt-16",
      doctorId: "doc-4",
      patientId: "pat-30",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-09",
      start: "14:00",
      end: "14:30",
      reason: "Follow-up for child's asthma.",
      notes: "Review inhaler usage and frequency of attacks.",
      status: "upcoming",
    },
    {
      id: "appt-17",
      doctorId: "doc-5",
      patientId: "pat-15",
      type: APPOINTMENT_TYPES.WALKIN,
      date: "2025-09-03",
      start: "14:30",
      end: "15:00",
      reason: "Evaluation of allergic rash.",
      notes: "Patient has hives on arms and neck.",
      status: "completed",
    },
    {
      id: "appt-18",
      doctorId: "doc-6",
      patientId: "pat-21",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-05",
      start: "10:00",
      end: "10:30",
      reason: "Consultation for chronic migraines.",
      notes: "Discuss triggers and previous treatments.",
      status: "upcoming",
    },
    {
      id: "appt-19",
      doctorId: "doc-7",
      patientId: "pat-24",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-08",
      start: "08:00",
      end: "08:30",
      reason: "Review biopsy results.",
      notes: "Discuss pathology report and next steps.",
      status: "upcoming",
    },
    {
      id: "appt-20",
      doctorId: "doc-9",
      patientId: "pat-28",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-10",
      start: "13:00",
      end: "13:30",
      reason: "Vision assessment for cataracts.",
      notes: "Patient reports blurry vision in right eye.",
      status: "upcoming",
    },

    // --- NEW: Batch 3 Appointments (21-40) ---
    {
      id: "appt-21",
      doctorId: "doc-11", // Endocrinology
      patientId: "pat-14",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-30",
      start: "19:00",
      end: "19:30",
      reason: "Thyroid check",
      notes: "Fatigue and weight changes.",
      status: "upcoming"
    },
    {
      id: "appt-22",
      doctorId: "doc-19", // Allergy and Immunology
      patientId: "pat-15",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-28",
      start: "11:00",
      end: "11:30",
      reason: "Food allergy test",
      notes: "Reaction to peanuts.",
      status: "upcoming"
    },
    {
      id: "appt-23", // Manually fixed index for continuity
      doctorId: "doc-15", // Rheumatology
      patientId: "pat-23",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-07",
      start: "15:00",
      end: "15:30",
      reason: "Joint swelling",
      notes: "Inflammation in knees.",
      status: "upcoming"
    },
    {
      id: "appt-24",
      doctorId: "doc-10", // Pulmonology
      patientId: "pat-16",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-16",
      start: "13:00",
      end: "13:30",
      reason: "Breathing difficulty",
      notes: "Shortness of breath on exertion.",
      status: "upcoming"
    },
    {
      id: "appt-25",
      doctorId: "doc-16", // Nephrology
      patientId: "pat-12",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-30",
      start: "14:00",
      end: "14:30",
      reason: "Hypertension consult",
      notes: "Renal related BP issues.",
      status: "upcoming"
    },
    {
      id: "appt-26",
      doctorId: "doc-16", // Nephrology
      patientId: "pat-16",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-22",
      start: "15:30",
      end: "16:00",
      reason: "Kidney function review",
      notes: "Lab results discussion.",
      status: "upcoming"
    },
    {
      id: "appt-27",
      doctorId: "doc-11", // Endocrinology
      patientId: "pat-20",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-18",
      start: "14:30",
      end: "15:00",
      reason: "Diabetes management",
      notes: "Review glucose logs.",
      status: "upcoming"
    },
    {
      id: "appt-28",
      doctorId: "doc-15", // Rheumatology
      patientId: "pat-8",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-17",
      start: "19:00",
      end: "19:30",
      reason: "Arthritis check",
      notes: "Joint stiffness in mornings.",
      status: "upcoming"
    },
    {
      id: "appt-29",
      doctorId: "doc-1", // Orthopedics
      patientId: "pat-6",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-12",
      start: "18:00",
      end: "18:30",
      reason: "Knee pain assessment",
      notes: "Patient reports clicking sound.",
      status: "upcoming"
    },
    {
      id: "appt-30",
      doctorId: "doc-16", // Nephrology
      patientId: "pat-7",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-30",
      start: "11:00",
      end: "11:30",
      reason: "Kidney function review",
      notes: "Lab results discussion.",
      status: "upcoming"
    },
    {
      id: "appt-31",
      doctorId: "doc-5", // Dermatology
      patientId: "pat-9",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-02",
      start: "14:00",
      end: "14:30",
      reason: "Mole check",
      notes: "Change in size/color noticed.",
      status: "upcoming"
    },
    {
      id: "appt-32",
      doctorId: "doc-10", // Pulmonology
      patientId: "pat-22",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-07",
      start: "14:30",
      end: "15:00",
      reason: "Asthma review",
      notes: "Inhaler refill needed.",
      status: "upcoming"
    },
    {
      id: "appt-33",
      doctorId: "doc-7", // Oncology
      patientId: "pat-27",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-15",
      start: "14:00",
      end: "14:30",
      reason: "Biopsy results",
      notes: "Discuss findings.",
      status: "upcoming"
    },
    {
      id: "appt-34",
      doctorId: "doc-6", // Neurology
      patientId: "pat-7",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-08",
      start: "14:00",
      end: "14:30",
      reason: "Migraine follow-up",
      notes: "Review medication efficacy.",
      status: "upcoming"
    },
    {
      id: "appt-35",
      doctorId: "doc-14", // Anesthesiology
      patientId: "pat-11",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-06",
      start: "11:30",
      end: "12:00",
      reason: "Pain management",
      notes: "Chronic pain review.",
      status: "upcoming"
    },
    {
      id: "appt-36",
      doctorId: "doc-18", // General Surgery
      patientId: "pat-10",
      type: APPOINTMENT_TYPES.REPORTS,
      date: "2025-09-05",
      start: "10:30",
      end: "11:00",
      reason: "Hernia consult",
      notes: "Pain in groin area.",
      status: "upcoming"
    },
    {
      id: "appt-37",
      doctorId: "doc-14", // Anesthesiology
      patientId: "pat-23",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-16",
      start: "09:30",
      end: "10:00",
      reason: "Pre-operative assessment",
      notes: "Prepare for upcoming surgery.",
      status: "upcoming"
    },
    {
      id: "appt-38",
      doctorId: "doc-14", // Anesthesiology
      patientId: "pat-20",
      type: APPOINTMENT_TYPES.FOLLOWUP,
      date: "2025-09-09",
      start: "11:30",
      end: "12:00",
      reason: "Pre-operative assessment",
      notes: "Prepare for upcoming surgery.",
      status: "upcoming"
    },
    {
      id: "appt-39",
      doctorId: "doc-1", // Orthopedics
      patientId: "pat-19",
      type: APPOINTMENT_TYPES.ASSESSMENT,
      date: "2025-09-20",
      start: "14:00",
      end: "14:30",
      reason: "Osteoporosis consult",
      notes: "Bone density review.",
      status: "upcoming"
    },
    {
      id: "appt-40",
      doctorId: "doc-20", // Emergency Medicine (Night/Late Shift)
      patientId: "pat-5",
      type: APPOINTMENT_TYPES.WALKIN,
      date: "2025-09-07", // Sunday night
      start: "22:00",
      end: "22:30",
      reason: "Acute migraine",
      notes: "Severe pain and nausea.",
      status: "completed"
    }
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