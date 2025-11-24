const products = [
    { 
        id: 1, 
        name: "analog watch", 
        price: 85000, 
        image: "images/products/laptop.jpg",
        onlineImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Fitness tracking smartwatch with heart monitor"
    },
    { 
         id: 2, 
        name: "Hp laptop", 
        price: 45000, 
        image: "images/products/smartphone.jpg",
        description: "High-performance gaming laptop with RTX graphics"
    },
        {
        id: 3, 
        name: "Wireless Headphones", 
        price: 12000, 
        image: "images/products/headphones.jpg",
        onlineImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Noise-cancelling wireless headphones"
    },
    { 
        id: 4, 
        name: "Smart Phone", 
        price: 25000, 
        image: "images/products/watch.jpg",
        onlineImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        description: "Digital smartphone"
    }
];

function displayProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     onerror="this.src='${product.onlineImage}'"
                     onload="console.log('Image loaded: ${product.name}')">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">KSh ${product.price.toLocaleString()}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// ... keep the rest of your functions the same
function handleImageError(img, productName) {
    console.error(`Image failed to load for ${productName}:`, img.src);
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">📷</div>
            <div>${productName}</div>
            <div style="font-size: 0.8rem; color: #999;">Image not found</div>
            <div style="font-size: 0.7rem; color: #ccc;">Path: ${img.src}</div>
        </div>
    `;
    img.parentNode.appendChild(placeholder);
}

// ... keep the rest of your functions (addToCart, showNotification) the same
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1 
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', displayProducts);