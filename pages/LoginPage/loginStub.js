const LoginStub = {
  authenticate(email, password) {
    //Hardcoded fake user
    const fakeUser = {
      email: "selenadoe@example.com",
      password: "password123"
    };

    if (email === fakeUser.email && password === fakeUser.password) {
      return { success: true, message: "Login successful!" };
    }

    return { success: false, message: "Invalid email or password." };
  }
};
