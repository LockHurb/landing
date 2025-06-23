// contact-functions.js
import { database } from './firebase_init.js';
import { ref, push, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

/**
 * Guarda los datos de contacto en Firebase
 */
export async function saveContactData(contactData) {
    try {
        // Validar datos requeridos
        const requiredFields = ['nombre', 'email', 'programa'];
        for (const field of requiredFields) {
            if (!contactData[field] || contactData[field].trim() === '') {
                throw new Error(`El campo ${field} es requerido`);
            }
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactData.email)) {
            throw new Error('El formato del email no es válido');
        }

        // Preparar datos con timestamps
        const dataToSave = {
            ...contactData,
            fechaEnvio: new Date().toISOString(),
            timestamp: Date.now(),
            estado: 'pendiente' // Para seguimiento
        };

        // Guardar en Firebase
        const contactsRef = ref(database, 'contactos');
        const newContactRef = push(contactsRef);
        await set(newContactRef, dataToSave);

        return newContactRef.key;
    } catch (error) {
        console.error('Error en saveContactData:', error);
        throw error;
    }
}


export function extractFormData(formData) {
    return {
        nombre: formData.get('nombre')?.trim() || '',
        email: formData.get('email')?.trim().toLowerCase() || '',
        telefono: formData.get('telefono')?.trim() || '',
        programa: formData.get('programa')?.trim() || '',
        mensaje: formData.get('mensaje')?.trim() || ''
    };
}

export async function getRegistros() {
    try {
        // Obtener referencia a la colección contactos
        const contactsRef = ref(database, 'contactos');
        
        // Obtener los datos de la colección
        const snapshot = await get(contactsRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Convertir el objeto a array con las claves como ID
            const registros = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            
            // Ordenar por timestamp (más reciente primero)
            return registros.sort((a, b) => b.timestamp - a.timestamp);
        } else {
            console.log('No hay registros de contactos disponibles');
            return [];
        }
    } catch (error) {
        console.error('Error en getRegistros:', error);
        throw error;
    }
}
/**
 * Muestra los registros de contactos en una tabla HTML
 */
export async function displayRegistros() {
    try {
        // Obtener los registros utilizando getRegistros
        const registros = await getRegistros();
        
        // Obtener el elemento HTML donde insertar la tabla
        const resultsElement = document.getElementById('results');
        
        if (!resultsElement) {
            console.error('Elemento con ID "results" no encontrado');
            return;
        }

        // Si no hay registros, mostrar mensaje
        if (registros.length === 0) {
            resultsElement.innerHTML = '<p class="no-records">No hay registros de contactos disponibles.</p>';
            return;
        }

        // Crear la tabla HTML
        let tableHTML = `
            <table class="contacts-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Programa</th>
                        <th>Fecha de Envío</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Iterar sobre los registros y crear filas
        registros.forEach(registro => {
            // Formatear la fecha
            const fecha = new Date(registro.fechaEnvio).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            tableHTML += `
                <tr>
                    <td>${registro.nombre || 'N/A'}</td>
                    <td>${registro.email || 'N/A'}</td>
                    <td>${registro.telefono || 'N/A'}</td>
                    <td>${registro.programa || 'N/A'}</td>
                    <td>${fecha}</td>
                    <td class="status-${registro.estado || 'pendiente'}">${registro.estado || 'pendiente'}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
            <div class="table-summary">
                <p>Total de registros: ${registros.length}</p>
            </div>
        `;

        // Insertar la tabla en el elemento results
        resultsElement.innerHTML = tableHTML;

    } catch (error) {
        console.error('Error en displayRegistros:', error);
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
            resultsElement.innerHTML = '<p class="error-message">Error al cargar los registros de contactos.</p>';
        }
    }
}

/**
 * Valida los datos del formulario

 */
export function validateContactData(data) {
    const errors = [];

    // Campos requeridos
    if (!data.nombre) errors.push('El nombre es requerido');
    if (!data.email) errors.push('El email es requerido');
    if (!data.programa) errors.push('Debe seleccionar un programa');

    // Validaciones específicas
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('El formato del email no es válido');
    }

    if (data.telefono && !/^\+?[\d\s\-\(\)]+$/.test(data.telefono)) {
        errors.push('El formato del teléfono no es válido');
    }

    if (data.nombre && data.nombre.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
