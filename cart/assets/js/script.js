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


// ADDING PRODUCTS TO CART

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items in LocalStorage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.querySelector('.cart-list');
    const itemSummary = document.querySelector('.item-summary');
    const totalPrice = document.querySelector('.total-price .value p');
    
    // Fetch products data
    fetch('../products/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            if (cartItems.length === 0) {
                cartList.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                itemSummary.style.display = 'none';
                return;
            }

            renderCartItems(cartItems, products.products);
            updateSummary(cartItems, products.products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            cartList.innerHTML = '<p class="error-message">Error loading cart items. Please try again.</p>';
        });

    function renderCartItems(cartItems, products) {
        cartList.innerHTML = '';
        
        cartItems.forEach(cartItem => {
            const product = products.find(p => p.id == cartItem.id);
            if (!product) return;

            const listItem = document.createElement('li');
            listItem.className = 'list-item';
            listItem.dataset.id = cartItem.id;
            listItem.dataset.size = cartItem.size;

            listItem.innerHTML = `
                <div class="item-description">
                    <div class="item-img">
                        <img src="../../products/${product.image}" alt="${product.name}">
                    </div>
                    <div class="item-info">
                        <p class="shoe-name">${product.name}</p>
                        <p class="shoe-category">${getCategoryText(product.category)}</p>
                        <p class="shoe-size">Size ${cartItem.size}</p>
                        <p class="shoe-price">$${product.price}</p>
                    </div>
                </div>
                <div class="item-quantity">
                    <span class="less">-</span>
                    <span class="quantity">${cartItem.quantity}</span>
                    <span class="more">+</span>
                </div>
            `;

            cartList.appendChild(listItem);

            // quatity buttons
            const lessBtn = listItem.querySelector('.less');
            const moreBtn = listItem.querySelector('.more');
            const quantityDisplay = listItem.querySelector('.quantity');

            lessBtn.addEventListener('click', () => {
                updateQuantity(cartItem.id, cartItem.size, -1);
            });

            moreBtn.addEventListener('click', () => {
                updateQuantity(cartItem.id, cartItem.size, 1);
            });
        });
    }

    function updateQuantity(productId, size, change) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cartItems.findIndex(
            item => item.id == productId && item.size == size
        );

        if (itemIndex >= 0) {
            cartItems[itemIndex].quantity += change;

            // Remove item if quantity is 0
            if (cartItems[itemIndex].quantity <= 0) {
                cartItems.splice(itemIndex, 1);
            }

            localStorage.setItem('cart', JSON.stringify(cartItems));
            location.reload();
        }
    }

    function removeItem(productId, size) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems = cartItems.filter(
            item => !(item.id == productId && item.size == size)
        );
        localStorage.setItem('cart', JSON.stringify(cartItems));
        location.reload();
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

        // summary section
        document.querySelector('.item-subtotal .value p:nth-child(1)').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.item-subtotal .value p:nth-child(2)').textContent = SHIPPING_COST === 0 ? 'Free' : `$${SHIPPING_COST.toFixed(2)}`;
        document.querySelector('.item-subtotal .value p:nth-child(3)').textContent = `$${taxes.toFixed(2)}`;
        totalPrice.textContent = `$${total.toFixed(2)}`;
    }

    function getCategoryText(category) {
        return category === 'men' ? "Men's Shoes" :
               category === 'women' ? "Women's Shoes" : "Kid's Shoes";
    }
});