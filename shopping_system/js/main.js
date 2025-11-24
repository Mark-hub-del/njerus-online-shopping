function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Make updateCartCount globally accessible
window.updateCartCount = updateCartCount;

function updateNavigation() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const nav = document.querySelector('nav ul');
    
    if (nav) {
        if (isLoggedIn) {
            // Update navigation for logged-in users
            const loginLink = nav.querySelector('a[href="login.html"]');
            if (loginLink) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
                loginLink.onclick = function() {
                    localStorage.removeItem('loggedIn');
                    window.location.reload();
                };
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateNavigation();
});
