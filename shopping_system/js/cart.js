// Cart page functionality: Render cart items, handle quantity changes and total calculation

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountSpan = document.getElementById('total-amount');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalAmountSpan.textContent = '0';
        return;
    }

    let totalAmount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>KSh ${item.price.toLocaleString()}</p>
                <p>Quantity: 
                    <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button> 
                    <span>${item.quantity}</span> 
                    <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                </p>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    totalAmountSpan.textContent = totalAmount.toLocaleString();

    // Attach event listeners for quantity buttons and remove buttons
    const quantityButtons = cartItemsContainer.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            const idx = parseInt(e.target.getAttribute('data-index'));
            updateQuantity(idx, action);
        });
    });

    const removeButtons = cartItemsContainer.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            removeItem(idx);
        });
    });
}

function updateQuantity(index, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        if (action === 'increase') {
            cart[index].quantity += 1;
        } else if (action === 'decrease') {
            cart[index].quantity = Math.max(cart[index].quantity - 1, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality not implemented yet.');
    });
});

// Use updateCartCount function from main.js
// Add these features to your existing cart.js

// Promo code functionality
const promoCodes = {
    'WELCOME10': { type: 'percentage', value: 10 },
    'FREESHIP': { type: 'shipping', value: 100 },
    'SAVE15': { type: 'percentage', value: 15 }
};

let appliedPromo = null;

function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const code = promoInput.value.trim().toUpperCase();
    
    if (promoCodes[code]) {
        appliedPromo = { code, ...promoCodes[code] };
        showFlashMessage(`Promo code applied successfully!`, 'success');
        updateCartSummary();
        promoInput.value = '';
    } else {
        showFlashMessage('Invalid promo code', 'error');
    }
}

// Enhanced cart summary with discounts
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate discount
    let discount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discount = subtotal * (appliedPromo.value / 100);
        } else if (appliedPromo.type === 'shipping') {
            discount = appliedPromo.value;
        }
    }
    
    const shipping = subtotal > 5000 ? 0 : 300;
    const tax = (subtotal - discount) * 0.14;
    const total = subtotal - discount + shipping +