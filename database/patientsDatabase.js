(function () {
  let ACTIVE_PATIENT_ID = null;

  const patients = [
  {
    "id": "pat-1",
    "name": "Janet Dean",
    "age": 78,
    "gender": "Female",
    "phone": "825 288 8888"
  },
  {
    "id": "pat-2",
    "name": "Michael Brown",
    "age": 46,
    "gender": "Male",
    "phone": "825 555 1010"
  },
  {
    "id": "pat-3",
    "name": "Aisha Khan",
    "age": 32,
    "gender": "Female",
    "phone": "825 555 2020"
  },
  {
    "id": "pat-4",
    "name": "David Lee",
    "age": 58,
    "gender": "Male",
    "phone": "825 555 3030"
  },
  {
    "id": "pat-5",
    "name": "Sofia Martinez",
    "age": 27,
    "gender": "Female",
    "phone": "825 555 4040"
  },
  {
    "id": "pat-6",
    "name": "Robert Taylor",
    "age": 65,
    "gender": "Male",
    "phone": "825 555 5050"
  },
  {
    "id": "pat-7",
    "name": "Emily Wilson",
    "age": 19,
    "gender": "Female",
    "phone": "825 555 6060"
  },
  {
    "id": "pat-8",
    "name": "James O'Connell",
    "age": 82,
    "gender": "Male",
    "phone": "825 555 7070"
  },
  {
    "id": "pat-9",
    "name": "Chloe Davies",
    "age": 41,
    "gender": "Female",
    "phone": "825 555 8080"
  },
  {
    "id": "pat-10",
    "name": "Daniel Chen",
    "age": 50,
    "gender": "Male",
    "phone": "825 555 9090"
  },
  {
    "id": "pat-11",
    "name": "Hannah Miller",
    "age": 24,
    "gender": "Female",
    "phone": "825 555 1111"
  },
  {
    "id": "pat-12",
    "name": "Ethan Williams",
    "age": 63,
    "gender": "Male",
    "phone": "825 555 2222"
  },
  {
    "id": "pat-13",
    "name": "Isabella Garcia",
    "age": 37,
    "gender": "Female",
    "phone": "825 555 3333"
  },
  {
    "id": "pat-14",
    "name": "Noah Evans",
    "age": 72,
    "gender": "Male",
    "phone": "825 555 4444"
  },
  {
    "id": "pat-15",
    "name": "Olivia Rodriguez",
    "age": 29,
    "gender": "Female",
    "phone": "825 555 5555"
  },
  {
    "id": "pat-16",
    "name": "William Jackson",
    "age": 55,
    "gender": "Male",
    "phone": "825 555 6666"
  },
  {
    "id": "pat-17",
    "name": "Mia Clark",
    "age": 49,
    "gender": "Female",
    "phone": "825 555 7777"
  },
  {
    "id": "pat-18",
    "name": "Alexander King",
    "age": 12,
    "gender": "Male",
    "phone": "825 555 8888"
  },
  {
    "id": "pat-19",
    "name": "Grace Lopez",
    "age": 90,
    "gender": "Female",
    "phone": "825 555 9999"
  },
  {
    "id": "pat-20",
    "name": "Jacob Scott",
    "age": 31,
    "gender": "Male",
    "phone": "825 555 0000"
  },
  {
    "id": "pat-21",
    "name": "Charlotte Green",
    "age": 68,
    "gender": "Female",
    "phone": "825 555 1020"
  },
  {
    "id": "pat-22",
    "name": "Samuel Baker",
    "age": 22,
    "gender": "Male",
    "phone": "825 555 2030"
  },
  {
    "id": "pat-23",
    "name": "Amelia Perez",
    "age": 43,
    "gender": "Female",
    "phone": "825 555 3040"
  },
  {
    "id": "pat-24",
    "name": "Logan Hill",
    "age": 76,
    "gender": "Male",
    "phone": "825 555 4050"
  },
  {
    "id": "pat-25",
    "name": "Evelyn Carter",
    "age": 21,
    "gender": "Female",
    "phone": "825 555 5060"
  },
  {
    "id": "pat-26",
    "name": "Henry Walker",
    "age": 59,
    "gender": "Male",
    "phone": "825 555 6070"
  },
  {
    "id": "pat-27",
    "name": "Lily Morris",
    "age": 35,
    "gender": "Female",
    "phone": "825 555 7080"
  },
  {
    "id": "pat-28",
    "name": "Jack Cooper",
    "age": 88,
    "gender": "Male",
    "phone": "825 555 8090"
  },
  {
    "id": "pat-29",
    "name": "Victoria Bell",
    "age": 52,
    "gender": "Female",
    "phone": "825 555 9001"
  },
  {
    "id": "pat-30",
    "name": "George Perez",
    "age": 44,
    "gender": "Male",
    "phone": "825 555 0112"
  }
];

  function getActivePatientId() {
    return ACTIVE_PATIENT_ID;
  }

  function setActivePatientId(id) {
    ACTIVE_PATIENT_ID = id;
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