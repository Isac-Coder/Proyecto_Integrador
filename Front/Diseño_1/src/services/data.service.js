// src/services/data.service.js

const API_URL = 'http://localhost:3001/api';

/**
 * Solicita los datos puros del Backend sin procesar estructuras HTML.
 * @param {string} seccion - Nombre de la vista elegida (ej: 'citas').
 * @param {string} rol - Rol del usuario dentro del sistema.
 * @returns {Promise<Object>} Datos crudos provenientes de la respuesta del servidor.
 */
export async function obtenerDatosSeccion(seccion, rol = 'profesional') {
    try {
        const response = await fetch(`${API_URL}/data/sections/${rol}/${seccion}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            return { error: true, msg: 'No se pudieron cargar los datos.' };
        }

        // Devolvemos el objeto de datos puro del backend
        return data.data; 
    } catch (error) {
        console.error('Error al conectar con el backend:', error);
        return { error: true, msg: 'Error de red al conectar con el servicio.' };
    }
}
