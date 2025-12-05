(function () {
  const ACTIVE_PATIENT_STORAGE_KEY = "gmc_active_patient_id";

  let ACTIVE_PATIENT_ID = null;

  try {
    const storedId = window.localStorage.getItem(ACTIVE_PATIENT_STORAGE_KEY);
    if (storedId) {
      ACTIVE_PATIENT_ID = storedId;
    }
  } catch (e) {
    console.warn("Could not read active patient from storage", e);
  }

  const patients = [
    {
      id: "pat-1",
      name: "Janet Dean",
      age: 78,
      gender: "Female",
      phone: "825 288 8888",
      dob: "1947-12-04",
    },
    {
      id: "pat-2",
      name: "Michael Brown",
      age: 46,
      gender: "Male",
      phone: "825 555 1010",
      dob: "1979-12-04",
    },
    {
      id: "pat-3",
      name: "Aisha Khan",
      age: 32,
      gender: "Female",
      phone: "825 555 2020",
      dob: "1993-12-04",
    },
    {
      id: "pat-4",
      name: "David Lee",
      age: 58,
      gender: "Male",
      phone: "825 555 3030",
      dob: "1967-12-04",
    },
    {
      id: "pat-5",
      name: "Sofia Martinez",
      age: 27,
      gender: "Female",
      phone: "825 555 4040",
      dob: "1998-12-04",
    },
    {
      id: "pat-6",
      name: "Robert Taylor",
      age: 65,
      gender: "Male",
      phone: "825 555 5050",
      dob: "1960-12-04",
    },
    {
      id: "pat-7",
      name: "Emily Wilson",
      age: 19,
      gender: "Female",
      phone: "825 555 6060",
      dob: "2006-12-04",
    },
    {
      id: "pat-8",
      name: "James O'Connell",
      age: 82,
      gender: "Male",
      phone: "825 555 7070",
      dob: "1943-12-04",
    },
    {
      id: "pat-9",
      name: "Chloe Davies",
      age: 41,
      gender: "Female",
      phone: "825 555 8080",
      dob: "1984-12-04",
    },
    {
      id: "pat-10",
      name: "Daniel Chen",
      age: 50,
      gender: "Male",
      phone: "825 555 9090",
      dob: "1975-12-04",
    },
    {
      id: "pat-11",
      name: "Hannah Miller",
      age: 24,
      gender: "Female",
      phone: "825 555 1111",
      dob: "2001-12-04",
    },
    {
      id: "pat-12",
      name: "Ethan Williams",
      age: 63,
      gender: "Male",
      phone: "825 555 2222",
      dob: "1962-12-04",
    },
    {
      id: "pat-13",
      name: "Isabella Garcia",
      age: 37,
      gender: "Female",
      phone: "825 555 3333",
      dob: "1988-12-04",
    },
    {
      id: "pat-14",
      name: "Noah Evans",
      age: 72,
      gender: "Male",
      phone: "825 555 4444",
      dob: "1953-12-04",
    },
    {
      id: "pat-15",
      name: "Olivia Rodriguez",
      age: 29,
      gender: "Female",
      phone: "825 555 5555",
      dob: "1996-12-04",
    },
    {
      id: "pat-16",
      name: "William Jackson",
      age: 55,
      gender: "Male",
      phone: "825 555 6666",
      dob: "1970-12-04",
    },
    {
      id: "pat-17",
      name: "Mia Clark",
      age: 49,
      gender: "Female",
      phone: "825 555 7777",
      dob: "1976-12-04",
    },
    {
      id: "pat-18",
      name: "Alexander King",
      age: 12,
      gender: "Male",
      phone: "825 555 8888",
      dob: "2013-12-04",
    },
    {
      id: "pat-19",
      name: "Grace Lopez",
      age: 90,
      gender: "Female",
      phone: "825 555 9999",
      dob: "1935-12-04",
    },
    {
      id: "pat-20",
      name: "Jacob Scott",
      age: 31,
      gender: "Male",
      phone: "825 555 0000",
      dob: "1994-12-04",
    },
    {
      id: "pat-21",
      name: "Charlotte Green",
      age: 68,
      gender: "Female",
      phone: "825 555 1020",
      dob: "1957-12-04",
    },
    {
      id: "pat-22",
      name: "Samuel Baker",
      age: 22,
      gender: "Male",
      phone: "825 555 2030",
      dob: "2003-12-04",
    },
    {
      id: "pat-23",
      name: "Amelia Perez",
      age: 43,
      gender: "Female",
      phone: "825 555 3040",
      dob: "1982-12-04",
    },
    {
      id: "pat-24",
      name: "Logan Hill",
      age: 76,
      gender: "Male",
      phone: "825 555 4050",
      dob: "1949-12-04",
    },
    {
      id: "pat-25",
      name: "Evelyn Carter",
      age: 21,
      gender: "Female",
      phone: "825 555 5060",
      dob: "2004-12-04",
    },
    {
      id: "pat-26",
      name: "Henry Walker",
      age: 59,
      gender: "Male",
      phone: "825 555 6070",
      dob: "1966-12-04",
    },
    {
      id: "pat-27",
      name: "Lily Morris",
      age: 35,
      gender: "Female",
      phone: "825 555 7080",
      dob: "1990-12-04",
    },
    {
      id: "pat-28",
      name: "Jack Cooper",
      age: 88,
      gender: "Male",
      phone: "825 555 8090",
      dob: "1937-12-04",
    },
    {
      id: "pat-29",
      name: "Victoria Bell",
      age: 52,
      gender: "Female",
      phone: "825 555 9001",
      dob: "1973-12-04",
    },
    {
      id: "pat-30",
      name: "George Perez",
      age: 44,
      gender: "Male",
      phone: "825 555 0112",
      dob: "1981-12-04",
    },
  ];

  function getActivePatientId() {
    return ACTIVE_PATIENT_ID;
  }

  function setActivePatientId(id) {
    ACTIVE_PATIENT_ID = id;
    try {
      window.localStorage.setItem(ACTIVE_PATIENT_STORAGE_KEY, id);
    } catch (e) {
      console.warn("Could not save active patient to storage", e);
    }
  }

  function getPatientById(id) {
    return patients.find((p) => p.id === id) || null;
  }

  window.patientsDatabase = {
    patients,
    getActivePatientId,
    setActivePatientId,
    getPatientById,
  };
})();
