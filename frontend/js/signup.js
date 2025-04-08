function validateFormData(formData) {
  if (!/^[a-zA-Z\s]*$/.test(formData.first_name)) {
      throw new Error("First name can only contain alphabets and spaces.");
  }

  if (!/^[a-zA-Z\s]*$/.test(formData.last_name)) {
      throw new Error("Last name can only contain alphabets and spaces.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error("Please enter a valid email address.");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(formData.password)) {
      throw new Error("Password must contain at least 8 characters, including uppercase, lowercase, numbers, and at least one special character.");
  }
}

function showMessage(container, message, type) {
  container.innerHTML = `
      <div class="p-3 rounded-lg ${type === 'success' ? 'bg-green-300/20 text-green-300' : 'bg-red-300/20 text-red-300'}">
          ${message}
      </div>
  `;
}

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const messageDiv = document.getElementById("signup-message");
  messageDiv.innerHTML = ''; 
  const formData = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      date_of_birth: form.date_of_birth.value,
      gender: form.gender.value
  };

  try {
      validateFormData(formData);
      form.querySelector('button[type="submit"]').disabled = true;
      const response = await fetch("http://localhost:8000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.detail || "Signup failed");
      }

      showMessage(
          messageDiv, 
          "Signup successful! Redirecting to login...", 
          'success'
      );
      setTimeout(() => window.location.href = "login.html", 1500);
  } catch (error) {
      showMessage(messageDiv, error.message, 'error');
  } finally {
      form.querySelector('button[type="submit"]').disabled = false;
  }
});