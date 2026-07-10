// src/services/data.service.js

export function obtenerDatosSeccion(seccion, rol = 'medico') {
    // SECCIONES DEL CUIDADOR
    if (rol === 'cuidador') {
        switch (seccion) {
            case 'pacientes':
                return `
                    <div class="card fade-in">
                        <h3>👥 Mis Pacientes Asignados</h3>
                        <p>Lista de adultos mayores o pacientes bajo tu cuidado activo.</p>
                        <div style="margin-top:15px; display:flex; flex-direction:column; gap:12px;">
                            <div style="padding:15px; background:#fff; border:1px solid #e2e8f0; border-radius:8px;">
                                <strong>Don Alberto Gómez</strong> - Edad: 78 años <br>
                                <span style="color:#64748b; font-size:0.9rem;">Dirección: Calle 45 #12-34 | Turno: Mañana</span>
                            </div>
                        </div>
                    </div>
                `;
            case 'bitacora':
                return `
                    <div class="card fade-in">
                        <h3>📝 Bitácora de Novedades Diaria</h3>
                        <p>Registra el comportamiento, alimentación y novedades del día.</p>
                        <textarea placeholder="Escribe aquí las observaciones del turno actual..." style="width:100%; height:100px; padding:10px; border-radius:6px; border:1px solid #cbd5e1; margin-top:12px; font-family:inherit; outline:none;"></textarea>
                        <button style="background:#2b4c3f; color:white; border:none; padding:10px 16px; border-radius:6px; margin-top:10px; cursor:pointer; font-weight:600;">Guardar Reporte</button>
                    </div>
                `;
            default: return '';
        }
    }

    // SECCIONES DEL MÉDICO
    switch (seccion) {
        case 'citas':
            return `
                <div class="card fade-in">
                    <h3>📅 Gestión de Citas Médicas</h3>
                    <table style="width:100%; border-collapse: collapse; margin-top: 15px; text-align: left;">
                        <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 0.9rem;">
                            <th style="padding: 10px;">Paciente</th>
                            <th>Hora</th>
                            <th>Motivo</th>
                        </tr>
                        <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.95rem;">
                            <td style="padding: 12px 10px;">Miren Yagoo</td>
                            <td>10:30 AM</td>
                            <td>Control Prenatal</td>
                        </tr>
                    </table>
                </div>
            `;
        case 'mensajes':
            return `
                <div class="card fade-in">
                    <h3>💬 Bandeja de Mensajes Médicos</h3>
                    <div style="margin-top:15px; display:flex; flex-direction:column; gap:10px;">
                        <div style="background:#f8fafc; padding:12px; border-radius:8px; border-left:4px solid #046467;">
                            <strong>Cuidador - Juana:</strong> <span style="color:#64748b;">"El paciente Alberto presentó presión alta..."</span>
                        </div>
                    </div>
                </div>
            `;
        case 'resultados':
            return `
                <div class="card fade-in">
                    <h3>🔬 Resultados Clínicos</h3>
                    <p style="color:#64748b; margin-top:10px;">📁 Examen de Sangre Completo - Miren Yagoo (PDF)</p>
                </div>
            `;
        case 'medicacion':
            return `
                <div class="card fade-in">
                    <h3>💊 Control de Medicación</h3>
                    <button style="background:#046467; color:white; border:none; padding:10px 16px; border-radius:6px; font-weight:600; cursor:pointer; margin-top:10px;">+ Crear Nueva Receta</button>
                </div>
            `;
        case 'perfil':
            return `
                <div class="card fade-in">
                    <h3>👤 Perfil Profesional</h3>
                    <p style="margin-top:10px;"><strong>Nombre:</strong> Dr. Jack<br><strong>Especialidad:</strong> Medicina General</p>
                </div>
            `;
        default:
            return '';
    }
}
