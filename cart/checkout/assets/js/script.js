// HEADER
const overlay = document.getElementById("overlay");
const navOpen = document.getElementById("btn-open");
const navClose = document.getElementById("btn-close");
const navbar = document.getElementById("navbar");

overlay.addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
});

navOpen.addEventListener("click", function () {
    navbar.classList.add("active");
    overlay.classList.add("active");
});

navClose.addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
});

// CHECKOUT

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.querySelector('.cart-list');
    const checkoutForm = document.querySelector('form');
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        window.location.href = '../products/';
        return;
    }

    // Load user data if available
    const userData = JSON.parse(localStorage.getItem('userProfile')) || {};
    if (userData.email) {
        populateForm(userData);
    }

    // Fetch product data and render cart
    fetch('../../products/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            renderCartItems(cartItems, products.products);
            updateSummary(cartItems, products.products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });

    // Form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        if (!validateForm()) {
            return;
        }
        
        saveUserProfile();
        
        processOrder();
    });

    function renderCartItems(cartItems, products) {
        cartList.innerHTML = '';
        
        cartItems.forEach(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (!product) return;

            const listItem = document.createElement('li');
            listItem.className = 'cart-item';
            
            listItem.innerHTML = `
                <div class="item-img">
                    <img src="../../products/${product.image}" alt="${product.name}">
                </div>
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <p>Size: ${cartItem.size}</p>
                    <p>Quantity: ${cartItem.quantity}</p>
                    <p class="item-price">$${(product.price * cartItem.quantity).toFixed(2)}</p>
                </div>
            `;

            cartList.appendChild(listItem);
        });
    }

    function updateSummary(cartItems, products) {
        let subtotal = 0;
        const TAX_RATE = 0.0825;
        const SHIPPING_COST = 0;

        cartItems.forEach(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (product) {
                subtotal += product.price * cartItem.quantity;
            }
        });

        const taxes = subtotal * TAX_RATE;
        const total = subtotal + taxes + SHIPPING_COST;

        // Update summary section
        document.querySelector('.item-subtotal .value p:nth-child(1)').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.item-subtotal .value p:nth-child(2)').textContent = 'Free';
        document.querySelector('.item-subtotal .value p:nth-child(3)').textContent = `$${taxes.toFixed(2)}`;
        document.querySelector('.total-price .value p').textContent = `$${total.toFixed(2)}`;
    }

    function populateForm(userData) {
        document.getElementById('email').value = userData.email || '';
        document.getElementById('firstname').value = userData.firstname || '';
        document.getElementById('lastname').value = userData.lastname || '';
        document.getElementById('address').value = userData.address || '';
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('city').value = userData.city || '';
        document.getElementById('state').value = userData.state || '';
        document.getElementById('zipcode').value = userData.zipcode || '';
    }

    function saveUserProfile() {
        const userProfile = {
            email: document.getElementById('email').value,
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipcode: document.getElementById('zipcode').value,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }

    function validateForm() {
        const email = document.getElementById('email').value;
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        
        if (!email || !firstname || !lastname || !address || !phone) {
            alert('Please fill in all required fields');
            return false;
        }
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function processOrder() {
        
        const order = {
            items: JSON.parse(localStorage.getItem('cart')),
            user: JSON.parse(localStorage.getItem('userProfile')),
            total: document.querySelector('.total-price .value p').textContent,
            date: new Date().toISOString(),
            orderId: 'SW-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
        
        // Save order to order history
        const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orders.push(order);
        localStorage.setItem('orderHistory', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to confirmation page
        window.location.href = '../../profile/?orderSuccess=true';
    }
});