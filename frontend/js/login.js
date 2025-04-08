const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageContainer = document.getElementById('login-message');

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showMessage(text, type) {
  const classes = {
    success: 'bg-green-300/20 text-green-300',
    error: 'bg-red-300/20 text-red-300',
  };

  messageContainer.innerHTML = `
    <div class="p-3 rounded-lg ${classes[type]}" 
         style="animation: fadeInOut 0.7s linear">
      ${text}
    </div>
  `;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageContainer.innerHTML = '';
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!validateEmail(email)) {
    showMessage('Invalid email format', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    localStorage.setItem('token', data.access_token);
    window.location.href = 'home.html';
  } catch (error) {
    showMessage(error.message, 'error');
  }
});