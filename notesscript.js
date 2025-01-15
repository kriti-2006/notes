document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.form-box.register form');
    const loginForm = document.querySelector('.form-box form');

    // Handle signup
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = registerForm.querySelector('input[placeholder="Username"]').value;
        const email = registerForm.querySelector('input[placeholder="Email id"]').value;
        const password = registerForm.querySelector('input[placeholder="Password"]').value;

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.status === 200) {
                alert(data.message);
                // Automatically redirect to login form
                document.querySelector('.container').classList.remove('active');
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        }
    });

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginForm.querySelector('input[placeholder="Email id"]').value;
        const password = loginForm.querySelector('input[placeholder="Password"]').value;

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.status === 200) {
                alert(data.message);
                // Save token in localStorage and redirect
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        }
    });
});
