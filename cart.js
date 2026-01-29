// Cart functionality using localStorage

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('retroCart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('retroCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
    let cart = getCart();
    
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    saveCart(cart);
    updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    
    // Refresh cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            product.quantity = newQuantity;
            saveCart(cart);
            updateCartCount();
            
            // Refresh cart page if we're on it
            if (window.location.pathname.includes('cart.html')) {
                displayCart();
            }
        }
    }
}

// Update cart count in header
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCountElement.classList.remove('hidden');
        } else {
            cartCountElement.classList.add('hidden');
        }
    }
}

// Calculate cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Display cart items (for cart.html page)
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <p class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update totals
    const subtotal = getCartTotal();
    const tax = subtotal * 0.08; // 8% tax (adjust as needed)
    const total = subtotal + tax;
    
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('retroCart');
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    }
}
