const baseUrl = "http://localhost:3000/api";

// Înregistrare
document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        document.getElementById(
          "registerMessage"
        ).textContent = `Registered: ${data.user.email}`;
      } else {
        document.getElementById(
          "registerMessage"
        ).textContent = `Error: ${data.message}`;
      }
    } catch (error) {
      document.getElementById(
        "registerMessage"
      ).textContent = `Error: ${error.message}`;
    }
  });

// Login
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        document.getElementById(
          "loginMessage"
        ).textContent = `Login successful! Token: ${data.token}`;
      } else {
        document.getElementById(
          "loginMessage"
        ).textContent = `Error: ${data.message}`;
      }
    } catch (error) {
      document.getElementById(
        "loginMessage"
      ).textContent = `Error: ${error.message}`;
    }
  });
