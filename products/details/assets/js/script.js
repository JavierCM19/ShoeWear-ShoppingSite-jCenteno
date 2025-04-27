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


// SHOE DETAILED

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = '../products/';
        return;
    }
    
    // Fetch products data
    fetch('../assets/data/products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id == productId);
            
            if (!product) {
                window.location.href = '../products/';
                return;
            }
            
            renderProductDetails(product);
        })
        .catch(error => {
            console.error('Error loading product:', error);
            window.location.href = '../products/';
        });

    
    function renderProductDetails(product) {
        const productDetails = document.getElementById('product-details');
        const categoryText = 
            product.category === 'men' ? "Men's Shoes" :
            product.category === 'women' ? "Women's Shoes" : "Kid's Shoes";
        
        let sizesHtml = '';
        product.sizes.forEach(size => {
            sizesHtml += `<li><p data-size="${size}">${size}</p></li>`;
        });
        
        
        // Set the product details
        productDetails.innerHTML = `
            <section class="section-img">
                <img src="../../products/${product.image}" alt="${product.name}">
            </section>
            <section class="section-info">
                <div class="shoe-info">
                    <p class="shoe-name">${product.name}</p>
                    <p class="shoe-category">${categoryText}</p>
                    <p class="initial-price">$${product.initialPrice}</p>
                    <p class="shoe-price">$${product.price}</p>
                    
                </div>
                
                <div class="shoe-size">
                    <h3>Please select your size:</h3>
                    <ul class="shoe-sizes">
                        ${sizesHtml}
                    </ul>
                </div>
                
                <div class="buy-button">
                    <div class="cart-btn" id="add-to-cart">
                        <a>Add to cart</a>
                    </div>
                </div>
            </section>
        `;
        
        const sizeElements = document.querySelectorAll('.shoe-sizes li p');
        let selectedSize = null;

        sizeElements.forEach(sizeElement => {
            sizeElement.addEventListener('click', function() {
                sizeElements.forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                selectedSize = this.getAttribute('data-size');
            });
        });

        

        const addToCartBtn = document.getElementById('add-to-cart');
        addToCartBtn.addEventListener('click', function() {
            if (!selectedSize) {
                alert('Please select a size before adding to cart');
                return;
            }
            
            // Add product to cart with size selecgted
            addToCart(product.id, selectedSize);
        });

    }

    function addToCart(productId, size) {
        // Get existing cart items from LocalStorage
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Checks if this product with this size is already in cart
        const existingItemIndex = cartItems.findIndex(
            item => item.id === productId && item.size === size
        );
        
        if (existingItemIndex >= 0) {
            // If item exists, increase the quantity
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // if item does not exists, add new item to cart
            cartItems.push({
                id: productId,
                name: document.querySelector('.shoe-name').textContent,
                size: size,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        // Save updated list to LocalStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        window.location.href = '../../cart/';
    }


    
});