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



// User profile page

document.addEventListener('DOMContentLoaded', function() {
    const userInfo = document.getElementById('user-info');
    const ordersList = document.getElementById('orders-list');
    const editProfileBtn = document.getElementById('edit-profile');
    const modal = document.getElementById('profile-modal');
    const closeModal = document.querySelector('.close-modal');
    const profileForm = document.getElementById('profile-form');
    const ordersDetails = document.getElementById('orders');
    
    
    // Check for order success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('orderSuccess') === 'true') {
        alert('Order placed successfully!');
        
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Load user profile and orders
    loadProfile();
    loadOrders();
    
    // Edit functionality
    editProfileBtn.addEventListener('click', () => {
        openModal();
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Profile form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProfile();
    });
    
    function loadProfile() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        
        if (userProfile) {
            userInfo.innerHTML = `
                <p><strong>Name:</strong> ${userProfile.firstname} ${userProfile.lastname}</p>
                <p><strong>Email:</strong> ${userProfile.email}</p>
                <p><strong>Address:</strong> ${userProfile.address}  ${userProfile.city}, ${userProfile.state} ${userProfile.zipcode}</p>
                <p><strong>Phone:</strong> (${userProfile.phone.substring(0, 3)}) ${userProfile.phone.substring(3, 6)} ${userProfile.phone.substring(6, 10)}</p>
                <p><small>Last updated: ${new Date(userProfile.lastUpdated).toLocaleDateString()}</small></p>
            `;
        }
    }
    
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
        
        if (orders.length > 0) {
            ordersList.innerHTML = '';
            
            orders.forEach(order => {
                const orderElement = document.createElement('div');
                orderElement.className = 'order';
                orderElement.innerHTML = `
                    <h3>Order #${order.orderId}</h3>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${order.total}</p>
                    <button class="view-order btn" data-orderid="${order.orderId}">View Details</button>
                `;
                ordersList.appendChild(orderElement);
            });
            
            // Add event listeners to view order buttons
            document.querySelectorAll('.view-order').forEach(button => {
                button.addEventListener('click', function() {
                    const orderId = this.getAttribute('data-orderid');
                    viewOrderDetails(orderId);
                });
            });
        }
    }
    
    function openModal() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
        
        document.getElementById('profile-email').value = userProfile.email || '';
        document.getElementById('profile-firstname').value = userProfile.firstname || '';
        document.getElementById('profile-lastname').value = userProfile.lastname || '';
        document.getElementById('profile-address').value = userProfile.address || '';
        document.getElementById('profile-phone').value = userProfile.phone || '';
        document.getElementById('profile-city').value = userProfile.city || '';
        document.getElementById('profile-state').value = userProfile.state || '';
        document.getElementById('profile-zipcode').value = userProfile.zipcode || '';
        
        modal.style.display = 'block';
    }
    
    function saveProfile() {
        const userProfile = {
            email: document.getElementById('profile-email').value,
            firstname: document.getElementById('profile-firstname').value,
            lastname: document.getElementById('profile-lastname').value,
            address: document.getElementById('profile-address').value,
            phone: document.getElementById('profile-phone').value,
            city: document.getElementById('profile-city').value,
            state: document.getElementById('profile-state').value,
            zipcode: document.getElementById('profile-zipcode').value,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        modal.style.display = 'none';
        loadProfile();
    }
    
    function viewOrderDetails(orderId) {
        const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
        const order = orders.find(o => o.orderId === orderId);
        const orderDetails = document.getElementById('orders-content')

        ordersDetails.style.display = 'block';
        
        if (order) {
            let itemsHtml = '';
            order.items.forEach(item => {
                itemsHtml += `<p>${item.quantity}  ${item.name}, Size: ${item.size}</p>`;
            });

            orderDetails.innerHTML = `
                <button class="close-order">
                <ion-icon name="close-outline"></ion-icon>
                </button>
                <p><strong>Order: </strong>#${order.orderId}</p>
                <p><strong>Date: </strong> ${new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Total: </strong> ${order.total}</p>
                <hr>
                
                <div><h4>Items: </h4>
                    ${itemsHtml}
                </div>

                <hr>

                <h4>Shipping to: </h4>
                <p>${order.user.firstname} ${order.user.lastname}</p>
                <p>${order.user.address}</p>
                <p>${order.user.city}, ${order.user.state} ${order.user.zipcode}</p>
            `

            const closeOrder = document.querySelector('.close-order');

            closeOrder.addEventListener('click', () => {
                ordersDetails.style.display = 'none';
            });
        }
    }
    


    //  LOG OUT

    
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Confirm logging out
            if (confirm('Are you sure you want to log out? This will clear your cart and sign you out.')) {
                clearSession();
                window.location.href = '../';
            }
        });
    }
    
    function clearSession() {
        // Clear all data from localStorage
        localStorage.removeItem('cart');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('orderHistory');
    }

});
