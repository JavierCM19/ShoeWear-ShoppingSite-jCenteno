// HEADER RESPONSIVE
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

// PRODUCTS FETCHING
document.addEventListener('DOMContentLoaded', function() {
    const shoesList = document.querySelector('.shoes-list');
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter = document.getElementById('brand-filter');
    const sortBy = document.getElementById('sort-by');
    
    // Store the products
    let products = [];
    let filteredProducts = [];
    
    // Get URL parameters from home page links
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('filter') || urlParams.get('category');
    const brandParam = urlParams.get('brand');
    
    // Fetch products from JSON
    fetch('./assets/data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data.products;
            filteredProducts = [...products];
            
            // Set filters from URL parameters if exist
            if (categoryParam) {
                categoryFilter.value = categoryParam;
            }
            if (brandParam) {
                brandFilter.value = brandParam;
            }
            
            // Apply filters from home page links
            if (categoryParam || brandParam) {
                filterProducts();
            } else {
                renderProducts(filteredProducts);
            }
        })
        .catch(error => console.error('Error loading products:', error));
    
    // display the products
    function renderProducts(productsToRender) {
        shoesList.innerHTML = '';
        
        if (productsToRender.length === 0) {
            shoesList.innerHTML = '<p class="no-products">No products match your filters.</p>';
            return;
        }
        
        productsToRender.forEach(product => {
            const categoryText = 
                product.category === 'men' ? "Men's Shoes" :
                product.category === 'women' ? "Women's Shoes" : "Kid's Shoes";
            
            const shoeItem = document.createElement('li');
            shoeItem.className = 'shoe-item';
            
            shoeItem.innerHTML = `
                <a href="details/?id=${product.id}">
                    <div class="shoe-img">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="shoe-info">
                        <p class="shoe-name">${product.name}</p>
                        <p class="shoe-category">${categoryText}</p>
                        <p class="shoe-price"><span class=initial-price> $${product.initialPrice}</span> <span class=price>$${product.price}</span></p>
                    </div>
                </a>
            `;
            
            shoesList.appendChild(shoeItem);
        });
    }
    
    // Filter products
    function filterProducts() {
        const categoryValue = categoryFilter.value;
        const brandValue = brandFilter.value;
        
        filteredProducts = products.filter(product => {
            // Filter for category
            if (categoryValue !== 'all' && product.category !== categoryValue) {
                return false;
            }
            
            // Filter for brand
            if (brandValue !== 'all' && product.brand !== brandValue) {
                return false;
            }
            
            return true;
        });
        
        sortProducts();
    }
    
    // Sorting products
    function sortProducts() {
        const sortValue = sortBy.value;
        
        switch(sortValue) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default sorting
                filteredProducts = [...filteredProducts];
        }
        
        renderProducts(filteredProducts);
    }
    
    // Event listeners for filters and sort
    categoryFilter.addEventListener('change', filterProducts);
    brandFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', sortProducts);
});