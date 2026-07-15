// ==========================================
// PROYECTO INTEGRADOR - ZOE CARE
// RAMA: Desarrollo-Backend-IV
// ARCHIVO: src/services/data.service.js
// LÓGICA: Petición de datos puros (JSON)
// ==========================================

const URL_BASE_DE_LA_API_DEL_BACKEND = 'http://localhost:3001/api';

/**
 * Obtiene los datos en formato JSON crudo para una sección específica desde el backend.
 * Si el servidor está apagado o da error, retorna un objeto vacío para activar tu depuración de 'undefined'.
 * 
 * @param {string} parametro_nombre_de_la_seccion - Nombre de la pestaña seleccionada ('citas', 'mensajes', etc.)
 * @param {string} parametro_rol_del_usuario - Rol que realiza la consulta ('profesional', 'cuidador')
 * @returns {Promise<Object>} Datos limpios del registro médico en formato JSON.
 */
export async function obtenerDatosSeccion(parametro_nombre_de_la_seccion, parametro_rol_del_usuario = 'profesional') {
    try {
        const objeto_respuesta_http_servidor = await fetch(`${URL_BASE_DE_LA_API_DEL_BACKEND}/data/sections/${parametro_rol_del_usuario}/${parametro_nombre_de_la_seccion}`);
        
        if (!objeto_respuesta_http_servidor.ok) {
            throw new Error('Servidor local offline o código de estado erróneo.');
        }
        
        const objeto_datos_json = await objeto_respuesta_http_servidor.json();
        return objeto_datos_json.data || objeto_datos_json;
    } catch (objeto_error_detectado) {
        console.warn(`[DEBUG AUDIT] Backend desconectado en la pestaña "${parametro_nombre_de_la_seccion}". Entregando objeto vacío.`);
        // Retornamos un objeto completamente vacío adrede para disparar los 'undefined' en la vista
        return {}; 
    }
}
