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

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const issueInput = document.getElementById('issue');
    
    // Success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
    contactForm.appendChild(successMessage);

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous errors
        resetErrors();
        
        // Validate fieldss
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            showError('name-error', 'Please enter your name');
            nameInput.classList.add('error');
            isValid = false;
        } else {
            nameInput.classList.add('valid');
        }
        
        if (!emailInput.value.trim()) {
            showError('email-error', 'Please enter your email');
            emailInput.classList.add('error');
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            showError('email-error', 'Please enter a valid email');
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailInput.classList.add('valid');
        }
        
        if (!phoneInput.value.trim()) {
            showError('phone-error', 'Please enter your phone number');
            phoneInput.classList.add('error');
            isValid = false;
        } else if (!validatePhone(phoneInput.value)) {
            showError('phone-error', 'Please enter a valid phone number');
            phoneInput.classList.add('error');
            isValid = false;
        } else {
            phoneInput.classList.add('valid');
        }
        
        if (!issueInput.value.trim()) {
            showError('issue-error', 'Please describe your issue');
            issueInput.classList.add('error');
            isValid = false;
        } else if (issueInput.value.trim().length < 10) {
            showError('issue-error', 'Description should be at least 10 characters');
            issueInput.classList.add('error');
            isValid = false;
        } else {
            issueInput.classList.add('valid');
        }
        
        if (isValid) {
            
            console.log('Form submitted:', {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                issue: issueInput.value
            });
            
            // Show success message
            successMessage.style.display = 'block';
            contactForm.reset();
            
            // Temporal message
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    });
    
    // Real-time validation
    nameInput.addEventListener('input', () => validateField(nameInput, 'name-error', 'Please enter your name'));
    emailInput.addEventListener('input', () => validateEmailField(emailInput, 'email-error'));
    phoneInput.addEventListener('input', () => validatePhoneField(phoneInput, 'phone-error'));
    issueInput.addEventListener('input', () => validateIssueField(issueInput, 'issue-error'));
    
    
    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function resetErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.style.display = 'none';
        });
        
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('error', 'valid');
        });
        
        successMessage.style.display = 'none';
    }
    
    function validateField(field, errorId, errorMessage) {
        if (!field.value.trim()) {
            showError(errorId, errorMessage);
            field.classList.add('error');
            field.classList.remove('valid');
        } else {
            document.getElementById(errorId).style.display = 'none';
            field.classList.remove('error');
            field.classList.add('valid');
        }
    }
    
    function validateEmailField(field, errorId) {
        if (!field.value.trim()) {
            showError(errorId, 'Please enter your email');
            field.classList.add('error');
            field.classList.remove('valid');
        } else if (!validateEmail(field.value)) {
            showError(errorId, 'Please enter a valid email');
            field.classList.add('error');
            field.classList.remove('valid');
        } else {
            document.getElementById(errorId).style.display = 'none';
            field.classList.remove('error');
            field.classList.add('valid');
        }
    }
    
    function validatePhoneField(field, errorId) {
        if (!field.value.trim()) {
            showError(errorId, 'Please enter your phone number');
            field.classList.add('error');
            field.classList.remove('valid');
        } else if (!validatePhone(field.value)) {
            showError(errorId, 'Please enter a valid phone number');
            field.classList.add('error');
            field.classList.remove('valid');
        } else {
            document.getElementById(errorId).style.display = 'none';
            field.classList.remove('error');
            field.classList.add('valid');
        }
    }
    
    function validateIssueField(field, errorId) {
        if (!field.value.trim()) {
            showError(errorId, 'Please describe your issue');
            field.classList.add('error');
            field.classList.remove('valid');
        } else if (field.value.trim().length < 10) {
            showError(errorId, 'Description should be at least 10 characters');
            field.classList.add('error');
            field.classList.remove('valid');
        } else {
            document.getElementById(errorId).style.display = 'none';
            field.classList.remove('error');
            field.classList.add('valid');
        }
    }
    
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function validatePhone(phone) {
        const regex = /^[\d\s\-\(\)]{7,}$/;
        return regex.test(phone);
    }
});