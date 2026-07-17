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

export async function obtenerPacientes(rol, email, scope = '') {
    try {
        const params = new URLSearchParams();
        if (rol) params.append('rol', rol);
        if (email) params.append('email', email);
        if (scope) params.append('scope', scope);

        const response = await fetch(`${API_URL}/data/pacientes?${params.toString()}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudieron cargar los pacientes.');
        }

        return data.items || [];
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        return [];
    }
}

export async function obtenerProfesionales() {
    try {
        const response = await fetch(`${API_URL}/data/profesionales`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudieron cargar los profesionales.');
        }

        return data.items || [];
    } catch (error) {
        console.error('Error al cargar profesionales:', error);
        return [];
    }
}

export async function crearPaciente(paciente) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paciente)
        });

        return await response.json();
    } catch (error) {
        console.error('Error al crear paciente:', error);
        return { success: false, message: 'No se pudo crear el paciente.' };
    }
}

export async function obtenerPacienteDetalle(idPaciente) {
    try {
        const response = await fetch(`${API_URL}/data/paciente/${idPaciente}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudo obtener el detalle del paciente.');
        }

        return data.item || null;
    } catch (error) {
        console.error('Error al cargar detalle de paciente:', error);
        return null;
    }
}

export async function obtenerBitacoraPlantillas(idPaciente) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/bitacora/plantillas`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudieron cargar las plantillas de bitácora.');
        }
        return data.items || [];
    } catch (error) {
        console.error('Error al cargar plantillas de bitácora:', error);
        return [];
    }
}

export async function crearBitacoraPlantilla(idPaciente, plantilla) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/bitacora/plantillas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plantilla)
        });

        return await response.json();
    } catch (error) {
        console.error('Error al crear plantilla de bitácora:', error);
        return { success: false, message: 'No se pudo crear la plantilla de bitácora.' };
    }
}

export async function obtenerBitacoraRegistros(idPaciente) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/bitacora/registros`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudieron cargar los registros de bitácora.');
        }
        return data.items || [];
    } catch (error) {
        console.error('Error al cargar registros de bitácora:', error);
        return [];
    }
}

export async function obtenerMedicamentosPaciente(idPaciente) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/medicamentos`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudieron cargar los medicamentos del paciente.');
        }
        return data.items || [];
    } catch (error) {
        console.error('Error al cargar medicamentos del paciente:', error);
        return [];
    }
}

export async function crearMedicamentoPaciente(idPaciente, medicamento) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/medicamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicamento)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al crear el medicamento del paciente:', error);
        return { success: false, message: 'No se pudo crear el medicamento del paciente.' };
    }
}

export async function actualizarMedicamentoPaciente(idPaciente, medicamentoId, medicamento) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/medicamentos/${medicamentoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicamento)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar el medicamento del paciente:', error);
        return { success: false, message: 'No se pudo actualizar el medicamento del paciente.' };
    }
}

export async function obtenerCitasPaciente(idPaciente) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/citas`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'No se pudieron cargar las citas del paciente.');
        }
        return data.items || [];
    } catch (error) {
        console.error('Error al cargar citas del paciente:', error);
        return [];
    }
}

export async function crearCitaPaciente(idPaciente, cita) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/citas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cita)
        });
        return await response.json();
    } catch (error) {
        console.error('Error al crear la cita del paciente:', error);
        return { success: false, message: 'No se pudo crear la cita del paciente.' };
    }
}

export async function crearBitacoraRegistro(idPaciente, registro) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/bitacora/registros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registro)
        });

        return await response.json();
    } catch (error) {
        console.error('Error al crear registro de bitácora:', error);
        return { success: false, message: 'No se pudo crear el registro de bitácora.' };
    }
}

export async function actualizarPaciente(idPaciente, paciente) {
    try {
        const response = await fetch(`${API_URL}/data/paciente/${idPaciente}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paciente)
        });

        return await response.json();
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        return { success: false, message: 'No se pudo actualizar el paciente.' };
    }
}

export async function asignarPacienteProfesional(idPaciente, emailProfesional) {
    try {
        const response = await fetch(`${API_URL}/data/pacientes/${idPaciente}/relacionar-profesional`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email_profesional: emailProfesional })
        });

        return await response.json();
    } catch (error) {
        console.error('Error al asignar paciente:', error);
        return { success: false, message: 'No se pudo asignar el paciente al profesional.' };
    }
}
