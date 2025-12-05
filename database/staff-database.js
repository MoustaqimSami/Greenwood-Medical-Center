(function (window) {
  const staff = [
    {
      id: 1,
      name: "Selena Doe",
      email: "selena@gmcclinic.com",
      password: "password123",
      role: "front-desk",
      roleLabel: "Front Desk Staff",
      avatarInitials: "SD",
      avatarUrl: null,
    },
    {
      id: 2,
      name: "Dr. Alex Smith",
      email: "alex.smith@gmcclinic.com",
      password: "doctor123",
      role: "doctor",
      roleLabel: "Front Desk Staff",
      avatarInitials: "AS",
      avatarUrl: null,
    },
    {
      id: 3,
      name: "Admin User",
      email: "admin@gmcclinic.com",
      password: "admin123",
      role: "admin",
      roleLabel: "Front Desk Staff",
      avatarInitials: "AD",
      avatarUrl: null,
    },
  ];

  function getStaffByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return staff.find((s) => s.email.toLowerCase() === normalized) || null;
  }

  function getStaffById(id) {
    return staff.find((s) => s.id === id) || null;
  }

  function validateCredentials(email, password) {
    const user = getStaffByEmail(email);
    if (!user) return null;
    if (user.password !== password) return null;
    return user;
  }

  window.staffDatabase = {
    staff,
    getStaffByEmail,
    getStaffById,
    validateCredentials,
  };
})(window);
