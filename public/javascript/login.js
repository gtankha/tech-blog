// Handles the login function

async function loginFormHandler(event) {
  event.preventDefault();

  const uname = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (uname && password) {
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        uname,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
}
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);