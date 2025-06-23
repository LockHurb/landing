// form-handler.js
import { saveContactData, extractFormData, validateContactData, displayRegistros } from './firebase_funcs.js';

class ContactFormHandler {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.statusMessage = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.bindEvents();
        });
    }

    setupElements() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submitBtn');
        this.statusMessage = document.getElementById('statusMessage');

        if (!this.form) {
            console.error('Formulario con ID "contact-form" no encontrado');
            return;
        }

        // Crear elemento de status si no existe
        if (!this.statusMessage) {
            this.statusMessage = this.createStatusElement();
        }
    }

    createStatusElement() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'statusMessage';
        statusDiv.className = 'hidden mb-6 p-4 rounded-lg';
        
        // Insertar antes del formulario
        this.form.parentNode.insertBefore(statusDiv, this.form);
        return statusDiv;
    }

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Validación en tiempo real
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const fields = ['nombre', 'email', 'programa'];
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        switch (field.id) {
            case 'nombre':
                isValid = value.length >= 2;
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                break;
            case 'programa':
                isValid = value !== '';
                break;
        }

        this.setFieldValidation(field, isValid);
        return isValid;
    }

    setFieldValidation(field, isValid) {
        if (isValid) {
            field.classList.remove('border-red-500');
            field.classList.add('border-green-500');
        } else {
            field.classList.remove('border-green-500');
            field.classList.add('border-red-500');
        }
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500', 'border-green-500');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        this.setLoading(true);
        
        try {
            // Extraer datos del formulario
            const formData = new FormData(this.form);
            const contactData = extractFormData(formData);
            
            // Validar datos
            const validation = validateContactData(contactData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Guardar en Firebase
            const contactId = await saveContactData(contactData);
            
            // Mostrar éxito
            this.showMessage(
                '¡Solicitud enviada exitosamente! Te contactaremos pronto.',
                'success'
            );
            
            // Limpiar formulario
            this.form.reset();
            this.clearAllFieldValidations();
            
            // Log para analytics (opcional)
            console.log('Contacto guardado con ID:', contactId);
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showMessage(
                error.message || 'Error al enviar la solicitud. Por favor, inténtalo nuevamente.',
                'error'
            );
        } finally {
            this.setLoading(false);
        }
    }
    /**
     * Carga y muestra los registros de contactos
     */
    async loadRegistros() {
        try {
            console.log('Cargando registros de contactos...');
            await displayRegistros();
        } catch (error) {
            console.error('Error al cargar registros:', error);
            // Opcional: mostrar mensaje de error para los registros
            const resultsElement = document.getElementById('results');
            if (resultsElement) {
                resultsElement.innerHTML = '<p class="error-message">Error al cargar los registros de contactos.</p>';
            }
        }
    }
    
    setLoading(loading) {
        if (!this.submitBtn) return;

        this.submitBtn.disabled = loading;
        
        // Actualizar texto del botón
        const btnText = this.submitBtn.querySelector('#btnText') || this.submitBtn;
        const loadingIcon = this.submitBtn.querySelector('#loadingIcon');
        const sendIcon = this.submitBtn.querySelector('#sendIcon');

        if (loading) {
            btnText.textContent = 'Enviando...';
            if (loadingIcon) loadingIcon.classList.remove('hidden');
            if (sendIcon) sendIcon.classList.add('hidden');
            this.submitBtn.classList.add('opacity-75');
        } else {
            btnText.textContent = 'Enviar Solicitud';
            if (loadingIcon) loadingIcon.classList.add('hidden');
            if (sendIcon) sendIcon.classList.remove('hidden');
            this.submitBtn.classList.remove('opacity-75');
        }
    }

    showMessage(message, type) {
        if (!this.statusMessage) return;

        const classes = type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200';

        this.statusMessage.className = `mb-6 p-4 rounded-lg ${classes}`;
        this.statusMessage.textContent = message;
        this.statusMessage.classList.remove('hidden');

        // Auto-hide después de 5 segundos
        setTimeout(() => {
            this.statusMessage.classList.add('hidden');
        }, 5000);

        // Scroll hacia el mensaje
        this.statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearAllFieldValidations() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => this.clearFieldError(field));
    }
}

// Inicializar el manejador del formulario
new ContactFormHandler();