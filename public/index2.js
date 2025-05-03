document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roomForm');
    const sections = document.querySelectorAll('.form-section');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.nav-button.next');
    const prevButtons = document.querySelectorAll('.nav-button.prev');
    let currentSection = 0;

    // Initialize form
    function initializeForm() {
        sections.forEach((section, index) => {
            if (index === 0) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        progressSteps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Validate current section
    function validateSection(section) {
        const inputs = section.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Show error message
    function showError(input) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'This field is required';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        input.parentNode.appendChild(errorDiv);
    }

    // Remove error message
    function removeError(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Navigate to next section
    function goToNextSection() {
        if (currentSection < sections.length - 1) {
            if (validateSection(sections[currentSection])) {
                sections[currentSection].classList.remove('active');
                progressSteps[currentSection].classList.remove('active');
                
                currentSection++;
                
                sections[currentSection].classList.add('active');
                progressSteps[currentSection].classList.add('active');
                
                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Show error messages for invalid fields
                const inputs = sections[currentSection].querySelectorAll('input[required], select[required], textarea[required]');
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        showError(input);
                    }
                });
            }
        }
    }

    // Navigate to previous section
    function goToPrevSection() {
        if (currentSection > 0) {
            sections[currentSection].classList.remove('active');
            progressSteps[currentSection].classList.remove('active');
            
            currentSection--;
            
            sections[currentSection].classList.add('active');
            progressSteps[currentSection].classList.add('active');
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Add event listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', goToNextSection);
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', goToPrevSection);
    });

    // Initialize the form
    initializeForm();

    // Add input validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
                removeError(this);
            }
        });
    });
});
