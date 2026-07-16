// src/services/data.service.js

const API_URL = 'http://localhost:3001/api';

export async function obtenerDatosSeccion(seccion, rol = 'profesional') {
    try {
        const response = await fetch(`${API_URL}/data/sections/${rol}/${seccion}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            return `<div class="card fade-in"><p>No se pudieron cargar los datos.</p></div>`;
        }

        const itemList = (data.data?.items || []).map((item) => {
            const entries = Object.entries(item).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('');
            return `<ul style="margin-top:10px; padding-left:20px;">${entries}</ul>`;
        }).join('');

        return `
            <div class="card fade-in">
                <h3>${data.data?.title || 'Sección'}</h3>
                <p>${data.data?.description || ''}</p>
                ${itemList}
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar datos del backend:', error);
        return `<div class="card fade-in"><p>No se pudieron cargar los datos.</p></div>`;
    }
}
