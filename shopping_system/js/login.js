document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const modal = document.getElementById('forgot-password-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelModalBtn = document.querySelector('.secondary-button');
    const submitButton = form.querySelector('.auth-button');
    const rememberCheckbox = document.getElementById('remember');

    let isPasswordVisible = false;

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? 'text' : 'password';
        
        const eyeIcon = this.querySelector('.eye-icon');
        const toggleText = this.querySelector('.toggle-text');
        
        eyeIcon.textContent = isPasswordVisible ? '🔒' : '👁️';
        toggleText.textContent = isPasswordVisible ? 'Hide' : 'Show';
    });

    // Forgot password modal
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('show');
    });

    // Close modal functions
    function closeModal() {
        modal.classList.remove('show');
    }

    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle forgot password form submission
    modal.querySelector('.auth-button').addEventListener('click', function() {
        const resetEmail = document.getElementById('reset-email').value;
        
        if (!resetEmail) {
            alert('Please enter your email address');
            return;
        }

        // Simulate sending reset email
        this.classList.add('loading');
        this.disabled = true;

        setTimeout(() => {
            showFlashMessage(`Password reset link sent to ${resetEmail}`, 'success');
            closeModal();
            this.classList.remove('loading');
            this.disabled = false;
            document.getElementById('reset-email').value = '';
        }, 1500);
    });

    // Enhanced form validation
    function validateForm() {
        let isValid = true;
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear previous errors
        clearErrors();

        // Email validation
        if (!email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!password) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        if (this.value.trim() && !isValidEmail(this.value.trim())) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearErrors();
        }
    });

    passwordInput.addEventListener('blur', function() {
        if (this.value && this.value.length < 6) {
            showError(this, 'Password must be at least 6 characters');
        } else {
            clearErrors();
        }
    });

    // Form submission with enhanced UX
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(function() {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const rememberMe = rememberCheckbox.checked;

            // Check credentials against stored user
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (user && user.email === email && user.password === password) {
                // Successful login
                localStorage.setItem('loggedIn', 'true');
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('loginEmail', email);
                }
                
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                submitButton.querySelector('.button-text').textContent = 'Welcome Back!';
                
                showFlashMessage('🎉 Login successful! Redirecting...', 'success');
                
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // Failed login
                submitButton.classList.remove('loading');
                showFlashMessage('❌ Invalid email or password. Please try again.', 'error');
                
                // Shake animation for error
                form.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    form.style.animation = '';
                }, 500);
                
                submitButton.disabled = false;
            }
        }, 2000);
    });

    // Flash message function
    function showFlashMessage(message, type) {
        let flash = document.querySelector('.flash-message');
        if (!flash) {
            flash = document.createElement('div');
            flash.className = 'flash-message';
            document.body.appendChild(flash);
        }
        
        flash.textContent = message;
        flash.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
        flash.classList.add('show');
        
        setTimeout(() => {
            flash.classList.remove('show');
        }, 4000);
    }

    // Auto-fill remembered email
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('loginEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberCheckbox.checked = true;
        }
    }

    // Add shake animation for errors
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
});