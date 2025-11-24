document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
    };
    
    // Save to localStorage (in real app, send to backend)
    localStorage.setItem('user', JSON.stringify(formData));
    
    alert('Registration successful! You can now login.');
    window.location.href = 'login.html';
});