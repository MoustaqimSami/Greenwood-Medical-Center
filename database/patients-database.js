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
      extendedInfo: {
        address: "172 Glacier Ridge NW, T3P 139",
        phoneNumber: "503-825-7620",
        emergencyContactName: "Hannah Dean",
        emergencyContactPhone: "825-712-4290",
        healthcareNumber: "99251673",
        familyDoctor: "Dr. Nelson James",
        referredBy: "Dr. John Whale",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-2",
      name: "Michael Brown",
      age: 46,
      gender: "Male",
      phone: "825 555 1010",
      dob: "1979-12-04",
      extendedInfo: {
        address: "45 Maple Avenue SW, T2P 2J1",
        phoneNumber: "825-555-1010",
        emergencyContactName: "Sarah Brown",
        emergencyContactPhone: "403-555-9876",
        healthcareNumber: "10293847",
        familyDoctor: "Dr. Emily Stone",
        referredBy: "Dr. Alan Grant",
        otherInsurance: "Blue Cross",
      },
    },
    {
      id: "pat-3",
      name: "Aisha Khan",
      age: 32,
      gender: "Female",
      phone: "825 555 2020",
      dob: "1993-12-04",
      extendedInfo: {
        address: "889 Coral Springs Blvd NE, T3J 3K4",
        phoneNumber: "825-555-2020",
        emergencyContactName: "Omar Khan",
        emergencyContactPhone: "587-555-4321",
        healthcareNumber: "56473829",
        familyDoctor: "Dr. Rajiv Patel",
        referredBy: "N/A",
        otherInsurance: "Sun Life",
      },
    },
    {
      id: "pat-4",
      name: "David Lee",
      age: 58,
      gender: "Male",
      phone: "825 555 3030",
      dob: "1967-12-04",
      extendedInfo: {
        address: "123 Aspen Woods Dr SW, T3H 0V5",
        phoneNumber: "825-555-3030",
        emergencyContactName: "Jennifer Lee",
        emergencyContactPhone: "403-222-3333",
        healthcareNumber: "84736251",
        familyDoctor: "Dr. Susan Wu",
        referredBy: "Dr. Mark Spencer",
        otherInsurance: "Manulife",
      },
    },
    {
      id: "pat-5",
      name: "Sofia Martinez",
      age: 27,
      gender: "Female",
      phone: "825 555 4040",
      dob: "1998-12-04",
      extendedInfo: {
        address: "776 Beltline Road SE, T2G 0A1",
        phoneNumber: "825-555-4040",
        emergencyContactName: "Carlos Martinez",
        emergencyContactPhone: "587-999-8888",
        healthcareNumber: "11223344",
        familyDoctor: "Dr. Maria Gonzalez",
        referredBy: "N/A",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-6",
      name: "Robert Taylor",
      age: 65,
      gender: "Male",
      phone: "825 555 5050",
      dob: "1960-12-04",
      extendedInfo: {
        address: "2234 Varsity Dr NW, T3A 1Z1",
        phoneNumber: "825-555-5050",
        emergencyContactName: "Linda Taylor",
        emergencyContactPhone: "403-444-5555",
        healthcareNumber: "99887766",
        familyDoctor: "Dr. Robert Smith",
        referredBy: "Dr. Alice Cooper",
        otherInsurance: "Green Shield",
      },
    },
    {
      id: "pat-7",
      name: "Emily Wilson",
      age: 19,
      gender: "Female",
      phone: "825 555 6060",
      dob: "2006-12-04",
      extendedInfo: {
        address: "101 University Way NW, T2N 1N4",
        phoneNumber: "825-555-6060",
        emergencyContactName: "James Wilson",
        emergencyContactPhone: "403-777-8888",
        healthcareNumber: "55443322",
        familyDoctor: "Dr. Karen White",
        referredBy: "N/A",
        otherInsurance: "Student Care",
      },
    },
    {
      id: "pat-8",
      name: "James O'Connell",
      age: 82,
      gender: "Male",
      phone: "825 555 7070",
      dob: "1943-12-04",
      extendedInfo: {
        address: "55 Seniors Lane SW, T2V 4J2",
        phoneNumber: "825-555-7070",
        emergencyContactName: "Maureen O'Connell",
        emergencyContactPhone: "403-333-2222",
        healthcareNumber: "66778899",
        familyDoctor: "Dr. Patrick O'Malley",
        referredBy: "Dr. Sean Connery",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-9",
      name: "Chloe Davies",
      age: 41,
      gender: "Female",
      phone: "825 555 8080",
      dob: "1984-12-04",
      extendedInfo: {
        address: "321 Bridgeland Ave NE, T2E 7P1",
        phoneNumber: "825-555-8080",
        emergencyContactName: "Tom Davies",
        emergencyContactPhone: "587-111-2222",
        healthcareNumber: "22334455",
        familyDoctor: "Dr. Fiona Apple",
        referredBy: "Dr. Dre",
        otherInsurance: "Desjardins",
      },
    },
    {
      id: "pat-10",
      name: "Daniel Chen",
      age: 50,
      gender: "Male",
      phone: "825 555 9090",
      dob: "1975-12-04",
      extendedInfo: {
        address: "990 Panorama Hills Blvd NW, T3K 5R5",
        phoneNumber: "825-555-9090",
        emergencyContactName: "Lisa Chen",
        emergencyContactPhone: "403-666-7777",
        healthcareNumber: "77665544",
        familyDoctor: "Dr. Bruce Lee",
        referredBy: "N/A",
        otherInsurance: "Great-West Life",
      },
    },
    {
      id: "pat-11",
      name: "Hannah Miller",
      age: 24,
      gender: "Female",
      phone: "825 555 1111",
      dob: "2001-12-04",
      extendedInfo: {
        address: "404 Kensington Rd NW, T2N 3P5",
        phoneNumber: "825-555-1111",
        emergencyContactName: "Greg Miller",
        emergencyContactPhone: "587-222-3333",
        healthcareNumber: "33445566",
        familyDoctor: "Dr. Sarah Palin",
        referredBy: "N/A",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-12",
      name: "Ethan Williams",
      age: 63,
      gender: "Male",
      phone: "825 555 2222",
      dob: "1962-12-04",
      extendedInfo: {
        address: "56 Signal Hill Dr SW, T3H 3V3",
        phoneNumber: "825-555-2222",
        emergencyContactName: "Betty Williams",
        emergencyContactPhone: "403-999-0000",
        healthcareNumber: "88990011",
        familyDoctor: "Dr. Frank Sinatra",
        referredBy: "Dr. Dean Martin",
        otherInsurance: "Sun Life",
      },
    },
    {
      id: "pat-13",
      name: "Isabella Garcia",
      age: 37,
      gender: "Female",
      phone: "825 555 3333",
      dob: "1988-12-04",
      extendedInfo: {
        address: "789 Mahogany Row SE, T3M 1T1",
        phoneNumber: "825-555-3333",
        emergencyContactName: "Pedro Garcia",
        emergencyContactPhone: "587-888-9999",
        healthcareNumber: "44556677",
        familyDoctor: "Dr. Selena Gomez",
        referredBy: "N/A",
        otherInsurance: "Manulife",
      },
    },
    {
      id: "pat-14",
      name: "Noah Evans",
      age: 72,
      gender: "Male",
      phone: "825 555 4444",
      dob: "1953-12-04",
      extendedInfo: {
        address: "12 Lake Bonavista Dr SE, T2J 0N3",
        phoneNumber: "825-555-4444",
        emergencyContactName: "Mary Evans",
        emergencyContactPhone: "403-123-4567",
        healthcareNumber: "55667788",
        familyDoctor: "Dr. Chris Evans",
        referredBy: "Dr. Robert Downey",
        otherInsurance: "Blue Cross",
      },
    },
    {
      id: "pat-15",
      name: "Olivia Rodriguez",
      age: 29,
      gender: "Female",
      phone: "825 555 5555",
      dob: "1996-12-04",
      extendedInfo: {
        address: "33 Mission Rd SW, T2S 3E4",
        phoneNumber: "825-555-5555",
        emergencyContactName: "Juan Rodriguez",
        emergencyContactPhone: "587-654-3210",
        healthcareNumber: "99001122",
        familyDoctor: "Dr. Jennifer Lopez",
        referredBy: "N/A",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-16",
      name: "William Jackson",
      age: 55,
      gender: "Male",
      phone: "825 555 6666",
      dob: "1970-12-04",
      extendedInfo: {
        address: "456 Royal Oak Way NW, T3G 5R5",
        phoneNumber: "825-555-6666",
        emergencyContactName: "Kate Jackson",
        emergencyContactPhone: "403-321-6540",
        healthcareNumber: "22110099",
        familyDoctor: "Dr. Michael Jackson",
        referredBy: "Dr. Janet Jackson",
        otherInsurance: "Canada Life",
      },
    },
    {
      id: "pat-17",
      name: "Mia Clark",
      age: 49,
      gender: "Female",
      phone: "825 555 7777",
      dob: "1976-12-04",
      extendedInfo: {
        address: "78 Evergreen Circle SW, T2Y 4M4",
        phoneNumber: "825-555-7777",
        emergencyContactName: "John Clark",
        emergencyContactPhone: "587-456-7890",
        healthcareNumber: "33221100",
        familyDoctor: "Dr. Clark Kent",
        referredBy: "Dr. Lois Lane",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-18",
      name: "Alexander King",
      age: 12,
      gender: "Male",
      phone: "825 555 8888",
      dob: "2013-12-04",
      extendedInfo: {
        address: "99 Skyview Ranch Rd NE, T3N 0L0",
        phoneNumber: "825-555-8888",
        emergencyContactName: "Stephen King",
        emergencyContactPhone: "403-567-8901",
        healthcareNumber: "77889900",
        familyDoctor: "Dr. Seuss",
        referredBy: "N/A",
        otherInsurance: "Sun Life (Parent)",
      },
    },
    {
      id: "pat-19",
      name: "Grace Lopez",
      age: 90,
      gender: "Female",
      phone: "825 555 9999",
      dob: "1935-12-04",
      extendedInfo: {
        address: "100 Silver Springs Blvd NW, T3B 4N2",
        phoneNumber: "825-555-9999",
        emergencyContactName: "Maria Lopez",
        emergencyContactPhone: "403-890-1234",
        healthcareNumber: "11002299",
        familyDoctor: "Dr. Phil",
        referredBy: "Dr. Oz",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-20",
      name: "Jacob Scott",
      age: 31,
      gender: "Male",
      phone: "825 555 0000",
      dob: "1994-12-04",
      extendedInfo: {
        address: "202 Beltline Ave SW, T2R 0C5",
        phoneNumber: "825-555-0000",
        emergencyContactName: "Michael Scott",
        emergencyContactPhone: "587-901-2345",
        healthcareNumber: "44332211",
        familyDoctor: "Dr. Dre",
        referredBy: "N/A",
        otherInsurance: "Manulife",
      },
    },
    {
      id: "pat-21",
      name: "Charlotte Green",
      age: 68,
      gender: "Female",
      phone: "825 555 1020",
      dob: "1957-12-04",
      extendedInfo: {
        address: "55 Arbour Lake Way NW, T3G 4A3",
        phoneNumber: "825-555-1020",
        emergencyContactName: "Rachel Green",
        emergencyContactPhone: "403-234-5678",
        healthcareNumber: "99880011",
        familyDoctor: "Dr. Ross Geller",
        referredBy: "N/A",
        otherInsurance: "Blue Cross",
      },
    },
    {
      id: "pat-22",
      name: "Samuel Baker",
      age: 22,
      gender: "Male",
      phone: "825 555 2030",
      dob: "2003-12-04",
      extendedInfo: {
        address: "88 University Dr NW, T2N 1N4",
        phoneNumber: "825-555-2030",
        emergencyContactName: "Simon Baker",
        emergencyContactPhone: "587-345-6789",
        healthcareNumber: "11229988",
        familyDoctor: "Dr. Who",
        referredBy: "N/A",
        otherInsurance: "Student Care",
      },
    },
    {
      id: "pat-23",
      name: "Amelia Perez",
      age: 43,
      gender: "Female",
      phone: "825 555 3040",
      dob: "1982-12-04",
      extendedInfo: {
        address: "66 Taradale Dr NE, T3J 5C2",
        phoneNumber: "825-555-3040",
        emergencyContactName: "Jose Perez",
        emergencyContactPhone: "403-678-9012",
        healthcareNumber: "55664433",
        familyDoctor: "Dr. House",
        referredBy: "Dr. Cuddy",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-24",
      name: "Logan Hill",
      age: 76,
      gender: "Male",
      phone: "825 555 4050",
      dob: "1949-12-04",
      extendedInfo: {
        address: "123 Edgemont Blvd NW, T3A 2X7",
        phoneNumber: "825-555-4050",
        emergencyContactName: "Jonah Hill",
        emergencyContactPhone: "403-901-2345",
        healthcareNumber: "88776655",
        familyDoctor: "Dr. Strange",
        referredBy: "Dr. Wong",
        otherInsurance: "Alberta Blue Cross",
      },
    },
    {
      id: "pat-25",
      name: "Evelyn Carter",
      age: 21,
      gender: "Female",
      phone: "825 555 5060",
      dob: "2004-12-04",
      extendedInfo: {
        address: "444 Sunnyside Rd NW, T2N 3R4",
        phoneNumber: "825-555-5060",
        emergencyContactName: "Shawn Carter",
        emergencyContactPhone: "587-567-8901",
        healthcareNumber: "22338899",
        familyDoctor: "Dr. Beyonce Knowles",
        referredBy: "N/A",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-26",
      name: "Henry Walker",
      age: 59,
      gender: "Male",
      phone: "825 555 6070",
      dob: "1966-12-04",
      extendedInfo: {
        address: "777 West Springs Rd SW, T3H 4R5",
        phoneNumber: "825-555-6070",
        emergencyContactName: "Paul Walker",
        emergencyContactPhone: "403-222-1111",
        healthcareNumber: "66554433",
        familyDoctor: "Dr. Vin Diesel",
        referredBy: "N/A",
        otherInsurance: "Great-West Life",
      },
    },
    {
      id: "pat-27",
      name: "Lily Morris",
      age: 35,
      gender: "Female",
      phone: "825 555 7080",
      dob: "1990-12-04",
      extendedInfo: {
        address: "888 Bowness Rd NW, T3B 0A1",
        phoneNumber: "825-555-7080",
        emergencyContactName: "Zack Morris",
        emergencyContactPhone: "587-333-2222",
        healthcareNumber: "99008877",
        familyDoctor: "Dr. Saved By The Bell",
        referredBy: "N/A",
        otherInsurance: "N/A",
      },
    },
    {
      id: "pat-28",
      name: "Jack Cooper",
      age: 88,
      gender: "Male",
      phone: "825 555 8090",
      dob: "1937-12-04",
      extendedInfo: {
        address: "999 Scenic Acres Dr NW, T3L 1R2",
        phoneNumber: "825-555-8090",
        emergencyContactName: "Alice Cooper",
        emergencyContactPhone: "403-444-3333",
        healthcareNumber: "11223399",
        familyDoctor: "Dr. Ozzy Osbourne",
        referredBy: "N/A",
        otherInsurance: "Veterans Affairs",
      },
    },
    {
      id: "pat-29",
      name: "Victoria Bell",
      age: 52,
      gender: "Female",
      phone: "825 555 9001",
      dob: "1973-12-04",
      extendedInfo: {
        address: "1010 17th Ave SW, T2T 0A1",
        phoneNumber: "825-555-9001",
        emergencyContactName: "Alexander Graham Bell",
        emergencyContactPhone: "587-555-6666",
        healthcareNumber: "44558899",
        familyDoctor: "Dr. Watson",
        referredBy: "N/A",
        otherInsurance: "Sun Life",
      },
    },
    {
      id: "pat-30",
      name: "George Perez",
      age: 44,
      gender: "Male",
      phone: "825 555 0112",
      dob: "1981-12-04",
      extendedInfo: {
        address: "2020 4th St SW, T2S 1W3",
        phoneNumber: "825-555-0112",
        emergencyContactName: "Rosie Perez",
        emergencyContactPhone: "403-777-9999",
        healthcareNumber: "77885544",
        familyDoctor: "Dr. Spike Lee",
        referredBy: "N/A",
        otherInsurance: "Manulife",
      },
    },
  ];

    const EXTRA_PATIENTS_STORAGE_KEY = "gmc_extra_patients";

  // Load any extra patients saved to localStorage and append them
  try {
    const storedExtras = window.localStorage.getItem(EXTRA_PATIENTS_STORAGE_KEY);
    if (storedExtras) {
      const parsed = JSON.parse(storedExtras);
      if (Array.isArray(parsed)) {
        parsed.forEach((p) => {
          if (p && p.id) {
            patients.push(p);
          }
        });
      }
    }
  } catch (e) {
    console.warn("Could not read extra patients from storage", e);
  }


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

  function getPatientById(rawId) {
    if (!rawId) return null;

    const id = String(rawId);

    if (!Array.isArray(patients)) return null;

    const match = patients.find((p) => {
      if (!p) return false;
      if (!("id" in p)) return false;
      return String(p.id) === id;
    });

    return match || null;
  }

    function addPatient(newPatient) {
    if (!newPatient || !newPatient.id) return;

    // Add to in-memory list
    patients.push(newPatient);

    // Update extras in localStorage
    try {
      const storedExtras = window.localStorage.getItem(EXTRA_PATIENTS_STORAGE_KEY);
      let extras = [];
      if (storedExtras) {
        const parsed = JSON.parse(storedExtras);
        if (Array.isArray(parsed)) extras = parsed;
      }

      const idx = extras.findIndex((p) => p && p.id === newPatient.id);
      if (idx >= 0) {
        extras[idx] = newPatient;
      } else {
        extras.push(newPatient);
      }

      window.localStorage.setItem(EXTRA_PATIENTS_STORAGE_KEY, JSON.stringify(extras));
    } catch (e) {
      console.warn("Could not save extra patients to storage", e);
    }
  }

  window.patientsDatabase = {
    patients,
    getActivePatientId,
    setActivePatientId,
    getPatientById,
    addPatient,
  };
})();
