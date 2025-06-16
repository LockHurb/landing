// Landing page JavaScript functionality with Firebase integration

// Navigation functionality
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = 64; // Height of fixed navigation
        const elementPosition = element.offsetTop - navHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Wait for Firebase to initialize before setting up form
    setTimeout(() => {
        updateSubmissionsDisplay();
        setupFormSubmission();
        setupClearData();
    }, 1000);
});

// Form submission functionality with Firebase
function setupFormSubmission() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check if Firebase is available
            if (!window.firebase) {
                alert('Firebase no está configurado. Por favor configura Firebase primero.');
                return;
            }
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                programa: formData.get('programa'),
                mensaje: formData.get('mensaje'),
                timestamp: new Date().toISOString()
            };
            
            // Validate required fields
            if (!data.nombre || !data.email || !data.programa) {
                alert('Por favor completa todos los campos requeridos.');
                return;
            }
            
            // Add loading state to button
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = 'Enviando...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            try {
                // Save to Firebase
                await saveSubmissionToFirebase(data);
                
                // Reset form
                form.reset();
                
                // Update display
                await updateSubmissionsDisplay();
                
                // Show success message
                alert('¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.');
                
                // Scroll to data section
                scrollToSection('datos');
            } catch (error) {
                console.error('Error saving to Firebase:', error);
                alert('Error al enviar la solicitud. Por favor intenta de nuevo.');
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        });
    }
}

// Save submission to Firebase
async function saveSubmissionToFirebase(data) {
    try {
        const { db, collection, addDoc } = window.firebase;
        await addDoc(collection(db, 'submissions'), data);
        console.log('Data saved to Firebase successfully');
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        throw error;
    }
}

// Get submissions from Firebase
async function getSubmissionsFromFirebase() {
    try {
        if (!window.firebase) {
            console.warn('Firebase not available, returning empty array');
            return [];
        }
        
        const { db, collection, getDocs } = window.firebase;
        const querySnapshot = await getDocs(collection(db, 'submissions'));
        const submissions = [];
        
        querySnapshot.forEach((doc) => {
            submissions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
        console.error('Error getting submissions from Firebase:', error);
        return [];
    }
}

// Clear all submissions from Firebase
async function clearSubmissionsFromFirebase() {
    try {
        const { db, collection, getDocs, deleteDoc, doc } = window.firebase;
        const querySnapshot = await getDocs(collection(db, 'submissions'));
        
        const deletePromises = [];
        querySnapshot.forEach((document) => {
            deletePromises.push(deleteDoc(doc(db, 'submissions', document.id)));
        });
        
        await Promise.all(deletePromises);
        console.log('All submissions cleared from Firebase');
    } catch (error) {
        console.error('Error clearing submissions from Firebase:', error);
        throw error;
    }
}

// Setup clear data functionality
function setupClearData() {
    const clearButton = document.getElementById('clear-data');
    if (clearButton) {
        clearButton.addEventListener('click', async function() {
            if (confirm('¿Estás seguro de que quieres eliminar todas las solicitudes?')) {
                try {
                    await clearSubmissionsFromFirebase();
                    await updateSubmissionsDisplay();
                    alert('Datos eliminados exitosamente.');
                } catch (error) {
                    console.error('Error clearing data:', error);
                    alert('Error al eliminar los datos. Por favor intenta de nuevo.');
                }
            }
        });
    }
}

// Update submissions display
async function updateSubmissionsDisplay() {
    try {
        const submissions = await getSubmissionsFromFirebase();
        const container = document.getElementById('submissions-container');
        const emptyState = document.getElementById('empty-state');
        const countElement = document.getElementById('submissions-count');
        const pluralElement = document.getElementById('submissions-plural');
        const pluralElement2 = document.getElementById('submissions-plural-2');
        
        if (!container || !emptyState || !countElement) return;
        
        // Update count
        countElement.textContent = submissions.length;
        
        // Update plural forms
        if (submissions.length === 1) {
            pluralElement.textContent = '';
            pluralElement2.textContent = '';
        } else {
            pluralElement.textContent = 'es';
            pluralElement2.textContent = 's';
        }
        
        if (submissions.length === 0) {
            // Show empty state
            container.innerHTML = '';
            emptyState.style.display = 'block';
        } else {
            // Hide empty state and show submissions
            emptyState.style.display = 'none';
            container.innerHTML = submissions.map(submission => createSubmissionCard(submission)).join('');
        }
    } catch (error) {
        console.error('Error updating submissions display:', error);
    }
}

// Create submission card HTML
function createSubmissionCard(submission) {
    const programNames = {
        fullstack: "Full Stack Development",
        datascience: "Data Science & AI",
        mobile: "Mobile Development",
        devops: "DevOps & Cloud"
    };
    
    const programName = programNames[submission.programa] || submission.programa;
    
    return `
        <article class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
            <header class="mb-4">
                <div class="flex items-center space-x-2 mb-2">
                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <h3 class="font-semibold text-lg truncate">${submission.nombre}</h3>
                </div>
            </header>
            
            <div class="space-y-3">
                <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-sm truncate">${submission.email}</span>
                </div>
                
                ${submission.telefono ? `
                <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span class="text-sm">${submission.telefono}</span>
                </div>
                ` : ''}
                
                <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        ${programName}
                    </span>
                </div>

                ${submission.mensaje ? `
                <div class="space-y-2">
                    <div class="flex items-start space-x-2">
                        <svg class="h-4 w-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <div>
                            <div class="text-xs text-gray-500 mb-1">Mensaje:</div>
                            <p class="text-sm text-gray-600 italic line-clamp-3">
                                "${submission.mensaje}"
                            </p>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </article>
    `;
}

// Intersection Observer for animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('section > div > div:first-child, article, .grid > div');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Add active navigation indicator
window.addEventListener('scroll', function() {
    const sections = ['hero', 'programas', 'informacion', 'contacto', 'datos'];
    const navLinks = document.querySelectorAll('nav button[onclick^="scrollToSection"]');
    
    let current = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                current = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'font-semibold');
        link.classList.add('text-gray-700');
        
        const sectionName = link.textContent.toLowerCase();
        if ((current === 'hero' && sectionName.includes('inicio')) ||
            (current === 'programas' && sectionName.includes('programas')) ||
            (current === 'informacion' && sectionName.includes('información')) ||
            (current === 'contacto' && sectionName.includes('contacto')) ||
            (current === 'datos' && sectionName.includes('solicitudes'))) {
            link.classList.remove('text-gray-700');
            link.classList.add('text-blue-600', 'font-semibold');
        }
    });
});

// Form validation feedback
function addFormValidation() {
    const inputs = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor ingresa un email válido');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('border-red-500');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    errorDiv.setAttribute('data-error-for', field.id);
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    
    const existingError = field.parentNode.querySelector(`[data-error-for="${field.id}"]`);
    if (existingError) {
        existingError.remove();
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', addFormValidation);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Enable keyboard navigation for custom buttons
    if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target.tagName === 'BUTTON' || target.hasAttribute('role') === 'button') {
            e.preventDefault();
            target.click();
        }
    }
    
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});