(function () {
  const STORAGE_KEY = "gmc_active_doctor_id";

  let ACTIVE_DOCTOR_ID = null;

  try {
    const storedId = window.localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      ACTIVE_DOCTOR_ID = storedId;
    }
  } catch (e) {
    console.warn("Could not read active doctor from storage", e);
  }

  const doctors = [
    {
      id: "doc-1",
      name: "Dr. Pamela Anderson",
      specialty: "Orthopedics",
      age: 55,
      gender: "Female",
      phone: "825 288 8888",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "10:00", end: "18:00" },
        { day: 1, start: "13:00", end: "21:00" },
        { day: 3, start: "09:30", end: "19:00" },
        { day: 5, start: "14:00", end: "20:00" },
        { day: 6, start: "09:30", end: "19:00" },
      ],
    },
    {
      id: "doc-2",
      name: "Dr. Din Kim",
      specialty: "Physical Medicine",
      age: 34,
      gender: "Male",
      phone: "825 288 7888",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "10:00", end: "18:00" },
        { day: 1, start: "13:00", end: "21:00" },
        { day: 2, start: "09:30", end: "19:00" },
        { day: 3, start: "14:00", end: "20:00" },
        { day: 4, start: "09:30", end: "19:00" },
      ],
    },
    {
      id: "doc-3",
      name: "Dr. Eleanor Vance",
      specialty: "Cardiology",
      age: 48,
      gender: "Female",
      phone: "825 311 4001",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 1, start: "08:00", end: "16:00" },
        { day: 2, start: "08:00", end: "16:00" },
        { day: 3, start: "08:00", end: "16:00" },
        { day: 4, start: "08:00", end: "16:00" },
      ],
    },
    {
      id: "doc-4",
      name: "Dr. Ben Carter",
      specialty: "Pediatrics",
      age: 62,
      gender: "Male",
      phone: "825 311 4002",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "12:00", end: "20:00" },
        { day: 2, start: "10:00", end: "18:00" },
        { day: 4, start: "12:00", end: "20:00" },
        { day: 6, start: "10:00", end: "18:00" },
      ],
    },
    {
      id: "doc-5",
      name: "Dr. Sarah Chen",
      specialty: "Dermatology",
      age: 30,
      gender: "Female",
      phone: "825 311 4003",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "09:00", end: "17:00" },
        { day: 1, start: "09:00", end: "17:00" },
        { day: 2, start: "09:00", end: "17:00" },
        { day: 3, start: "09:00", end: "17:00" },
        { day: 4, start: "09:00", end: "17:00" },
      ],
    },
    {
      id: "doc-6",
      name: "Dr. Marcus Reed",
      specialty: "Neurology",
      age: 51,
      gender: "Male",
      phone: "825 311 4004",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 1, start: "10:30", end: "18:30" },
        { day: 3, start: "10:30", end: "18:30" },
        { day: 5, start: "09:00", end: "17:00" },
      ],
    },
    {
      id: "doc-7",
      name: "Dr. Olivia Hayes",
      specialty: "Oncology",
      age: 44,
      gender: "Female",
      phone: "825 311 4005",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "07:00", end: "15:00" },
        { day: 1, start: "07:00", end: "15:00" },
        { day: 2, start: "07:00", end: "15:00" },
      ],
    },
    {
      id: "doc-8",
      name: "Dr. Alex Rodriguez",
      specialty: "Gastroenterology",
      age: 39,
      gender: "Male",
      phone: "825 311 4006",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 2, start: "11:00", end: "19:00" },
        { day: 4, start: "11:00", end: "19:00" },
        { day: 6, start: "11:00", end: "19:00" },
      ],
    },
    {
      id: "doc-9",
      name: "Dr. Jennifer Lee",
      specialty: "Ophthalmology",
      age: 58,
      gender: "Female",
      phone: "825 311 4007",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 1, start: "09:30", end: "17:30" },
        { day: 3, start: "09:30", end: "17:30" },
        { day: 5, start: "09:30", end: "17:30" },
      ],
    },
    {
      id: "doc-10",
      name: "Dr. Michael Davies",
      specialty: "Pulmonology",
      age: 68,
      gender: "Male",
      phone: "825 311 4008",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "13:00", end: "17:00" },
        { day: 1, start: "13:00", end: "17:00" },
        { day: 2, start: "13:00", end: "17:00" },
        { day: 3, start: "13:00", end: "17:00" },
      ],
    },
    {
      id: "doc-11",
      name: "Dr. Nicole White",
      specialty: "Endocrinology",
      age: 36,
      gender: "Female",
      phone: "825 311 4009",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "08:30", end: "16:30" },
        { day: 2, start: "14:00", end: "20:00" },
        { day: 4, start: "08:30", end: "16:30" },
      ],
    },
    {
      id: "doc-12",
      name: "Dr. James Wilson",
      specialty: "Urology",
      age: 41,
      gender: "Male",
      phone: "825 311 4010",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 1, start: "07:30", end: "17:30" },
        { day: 3, start: "07:30", end: "17:30" },
        { day: 5, start: "07:30", end: "17:30" },
      ],
    },
    {
      id: "doc-13",
      name: "Dr. Anna Petrova",
      specialty: "Psychiatry",
      age: 29,
      gender: "Female",
      phone: "825 311 4011",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "10:00", end: "19:00" },
        { day: 1, start: "10:00", end: "19:00" },
        { day: 2, start: "10:00", end: "19:00" },
        { day: 3, start: "10:00", end: "19:00" },
        { day: 4, start: "10:00", end: "19:00" },
      ],
    },
    {
      id: "doc-14",
      name: "Dr. Kenneth Wong",
      specialty: "Anesthesiology",
      age: 53,
      gender: "Male",
      phone: "825 311 4012",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 2, start: "06:00", end: "14:00" },
        { day: 4, start: "06:00", end: "14:00" },
        { day: 6, start: "06:00", end: "14:00" },
      ],
    },
    {
      id: "doc-15",
      name: "Dr. Chloe Adams",
      specialty: "Rheumatology",
      age: 47,
      gender: "Female",
      phone: "825 311 4013",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "09:30", end: "15:30" },
        { day: 3, start: "13:30", end: "19:30" },
        { day: 5, start: "09:30", end: "15:30" },
      ],
    },
    {
      id: "doc-16",
      name: "Dr. Robert Singh",
      specialty: "Nephrology",
      age: 71,
      gender: "Male",
      phone: "825 311 4014",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 1, start: "11:00", end: "16:00" },
        { day: 2, start: "11:00", end: "16:00" },
        { day: 3, start: "11:00", end: "16:00" },
      ],
    },
    {
      id: "doc-17",
      name: "Dr. Emilia Santos",
      specialty: "Infectious Disease",
      age: 40,
      gender: "Female",
      phone: "825 311 4015",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "14:00", end: "22:00" },
        { day: 1, start: "14:00", end: "22:00" },
        { day: 2, start: "14:00", end: "22:00" },
        { day: 3, start: "14:00", end: "22:00" },
      ],
    },
    {
      id: "doc-18",
      name: "Dr. David Klein",
      specialty: "General Surgery",
      age: 60,
      gender: "Male",
      phone: "825 311 4016",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 1, start: "08:00", end: "18:00" },
        { day: 3, start: "08:00", end: "18:00" },
        { day: 5, start: "08:00", end: "18:00" },
      ],
    },
    {
      id: "doc-19",
      name: "Dr. Maya Gupta",
      specialty: "Allergy and Immunology",
      age: 32,
      gender: "Female",
      phone: "825 311 4017",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "09:00", end: "13:00" },
        { day: 2, start: "14:00", end: "18:00" },
        { day: 4, start: "09:00", end: "13:00" },
        { day: 6, start: "14:00", end: "18:00" },
      ],
    },
    {
      id: "doc-20",
      name: "Dr. Ethan Miller",
      specialty: "Emergency Medicine",
      age: 45,
      gender: "Male",
      phone: "825 311 4018",
      avatarIcon: "../assets/icons/person-black.svg",
      availabilityWindows: [
        { day: 0, start: "18:00", end: "06:00" },
        { day: 2, start: "18:00", end: "06:00" },
        { day: 4, start: "18:00", end: "06:00" },
      ],
    },
  ];

  function getActiveDoctorId() {
    return ACTIVE_DOCTOR_ID;
  }

  function setActiveDoctorId(id) {
    ACTIVE_DOCTOR_ID = id;
    try {
      window.localStorage.setItem(ACTIVE_DOCTOR_STORAGE_KEY, id);
    } catch (e) {
      console.warn("Could not save active doctor to storage", e);
    }
  }

  function getDoctorById(id) {
    return doctors.find((d) => d.id === id) || null;
  }

  function getDoctorAvailability(id) {
    const doc = getDoctorById(id);
    return doc ? doc.availabilityWindows || [] : [];
  }

  window.doctorsDatabase = {
    doctors,
    getActiveDoctorId,
    setActiveDoctorId,
    getDoctorById,
    getDoctorAvailability,
  };
})();
