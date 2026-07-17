// src/views/medicoView.js
import { obtenerDatosSeccion, obtenerPacientes, asignarPacienteProfesional, obtenerPacienteDetalle, actualizarPaciente } from '../services/data.service.js';
import { cerrarSesion, obtenerSesionActiva } from '../services/auth.services.js';

export function profesionalView() {
    // Unificamos el punto de carga de estilos al CSS compilado centralizado
    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/Proyecto_Integrador/Front/Diseño_1/src/styles/styles.css';
        document.head.appendChild(styleLink);
    }

    // Obtener fecha dinámica
    const fechaActual = obtenerFechaFormateada();

    const estructuraDashboardBase = `
        <div class="dashboard-grid fade-in">
            <section class="main-content-column">
                
                <!-- Próxima Cita -->
                <div class="card next-appointment-card">
                    <h3>PRÓXIMA CONSULTA / ASISTENCIA</h3>
                    <div class="doctor-info">
                        <div class="doctor-avatar"></div>
                        <div class="doctor-meta">
                            <h4>Paciente: Miren Yagoo</h4>
                            <p>Control de Monitoreo General</p>
                        </div>
                    </div>
                    <div class="appointment-date">
                        <span><i class="ti ti-calendar"></i> Hoy, 10 Jul</span>
                        <span><i class="ti ti-clock"></i> 02:30 PM</span>
                        <span><i class="ti ti-map-pin"></i> Consultorio 3</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-reprogramar" id="btn-reprogramar">Reprogramar</button>
                        <button class="btn-detalles" id="btn-historial">Ver Historial</button>
                    </div>
                </div>

                <!-- Indicadores de Salud -->
                <div class="vitals-grid">
                    <div class="vital-card vital-glucose">
                        <span class="vital-value">102</span>
                        <span class="vital-label">Glucosa mg/dL</span>
                    </div>
                    <div class="vital-card vital-heart">
                        <span class="vital-value">78</span>
                        <span class="vital-label">Ritmo cardíaco</span>
                    </div>
                    <div class="vital-card vital-oxygen">
                        <span class="vital-value">98%</span>
                        <span class="vital-label">Saturación O2</span>
                    </div>
                    <div class="vital-card vital-pressure">
                        <span class="vital-value">139</span>
                        <span class="vital-label">Presión arterial</span>
                    </div>
                </div>

                <!-- Bloque del Gráfico -->
                <div class="card chart-card">
                    <div class="chart-header">
                        <h3>Evolución Clínica del Paciente</h3>
                    </div>
                    <div class="chart-placeholder">
                        <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                            <i class="ti ti-chart-line" style="font-size: 1.8rem; display: block; margin-bottom: 6px; opacity: 0.7;"></i>
                            [Gráfico de estabilidad del paciente]
                        </p>
                    </div>
                </div>

            </section>

            <aside class="right-content-column">
                <div class="card tracking-card">
                    <h3>Seguimiento del Plan de Cuidado</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Progreso General</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 60%;"></div>
                    </div>
                    <div class="progress-labels">
                        <span>60% completado</span>
                    </div>
                </div>

                <div class="card quick-actions-card">
                    <h3>Acciones rápidas</h3>
                    <ul class="actions-list">
                        <li class="action-item" data-target="medicacion">Emitir indicaciones <span class="arrow">›</span></li>
                        <li class="action-item" data-target="resultados">Subir reporte clínico <span class="arrow">›</span></li>
                    </ul>
                </div>

                <div class="card reminder-card">
                    <div class="rhead"><i class="ti ti-notes"></i> Notas del Turno</div>
                    <p>Revisar observaciones enviadas por el cuidador en la mañana.</p>
                </div>
            </aside>
        </div>
    `;

    setTimeout(() => {
        initProfesionalDashboardEvents(estructuraDashboardBase);
    }, 0);

    return `
        <div class="dashboard-layout layout-profesional">
            
            <aside class="sidebar sidebar-profesional">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Dashboard</a>
                    <a href="#" class="menu-item" data-view="pacientes"><i class="ti ti-users"></i> Mis Pacientes</a>
                    <a href="#" class="menu-item" data-view="citas"><i class="ti ti-calendar-event"></i> Citas / Visitas</a>
                    <a href="#" class="menu-item" data-view="mensajes"><i class="ti ti-message-circle"></i> Mensajes</a>
                    <a href="#" class="menu-item" data-view="resultados"><i class="ti ti-file-report"></i> Resultados</a>
                    <a href="#" class="menu-item" data-view="medicacion"><i class="ti ti-pill"></i> Indicaciones</a>
                    <a href="#" class="menu-item" data-view="perfil"><i class="ti ti-user"></i> Mi Perfil</a>
                    <a href="#/login" class="menu-item logout-item"><i class="ti ti-logout"></i> Cerrar Sesión</a>
                </nav>
            </aside>

            <div class="dashboard-main">
                <header class="dashboard-header">
                    <button class="menu-hamburger-btn" id="hamburguesa-toggle" aria-label="Abrir menú">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div class="welcome-text">
                        <h2>Bienvenido Profesional</h2>
                        <span class="current-date">${fechaActual}</span>
                    </div>
                    <div class="header-actions-group">
                        <div class="header-search">
                            <input type="text" placeholder="Buscar pacientes, bitácora...">
                        </div>
                        <div class="avatar">ZP</div>
                    </div>
                </header>

                <div id="dynamic-content-area">
                    ${estructuraDashboardBase}
                </div>

            </div>
        </div>
    `;
}

// Función para obtener la fecha formateada
function obtenerFechaFormateada() {
    const ahora = new Date();
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    let fecha = ahora.toLocaleDateString('es-ES', opciones);
    // Capitalizar primera letra
    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

function initProfesionalDashboardEvents(dashboardBaseHtml) {
    const menuItems = document.querySelectorAll('.sidebar-profesional .menu-item[data-view]');
    const contentArea = document.getElementById('dynamic-content-area');

    if (!contentArea) return;

    menuItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const vistaSolicitada = item.getAttribute('data-view');

            if (vistaSolicitada === 'dashboard') {
                contentArea.innerHTML = dashboardBaseHtml;
                initCardButtonsEvents();
            } else if (vistaSolicitada === 'pacientes') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando pacientes...</p></div>';
                await renderProfesionalPacientesSection(contentArea);
            } else {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando...</p></div>';
                contentArea.innerHTML = await obtenerDatosSeccion(vistaSolicitada, 'profesional');
            }
        });
    });

    initCardButtonsEvents();
    initLogoutEvents();
}

async function renderProfesionalPacientesSection(container) {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);
    const pacientesDisponibles = await obtenerPacientes('', '', 'disponibles');

    const pacientesHtml = pacientes.length
        ? pacientes.map((paciente) => `
            <div class="card paciente-card">
                <h4>${paciente.nombre}</h4>
                <p><strong>Fecha de nacimiento:</strong> ${paciente.fecha_nacimiento}</p>
                <p><strong>Dirección:</strong> ${paciente.direccion || 'No registrada'}</p>
                <p><strong>Cuidador:</strong> ${paciente.cuidador_nombre || 'No disponible'}</p>
                <button class="btn-detalles btn-ver-paciente" data-paciente-id="${paciente.id}" style="margin-top:10px;">Ver / Editar</button>
            </div>
        `).join('')
        : '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados aún.</p></div>';

    container.innerHTML = `
        <div class="card fade-in" style="margin-bottom: 18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
                <div>
                    <h3>Mis Pacientes</h3>
                    <p>Ver tus pacientes actuales y asignar nuevos pacientes a tu cuidado.</p>
                </div>
                <button id="btn-asignar-paciente" class="btn-detalles" style="padding: 0.8rem 1rem;">Relacionar paciente</button>
            </div>
        </div>
        <div id="profesional-pacientes-list">${pacientesHtml}</div>
        <div id="asignar-paciente-form-container"></div>
    `;

    document.getElementById('btn-asignar-paciente')?.addEventListener('click', () => {
        renderRelacionarPacienteForm(container, pacientesDisponibles, emailProfesional);
    });

    container.querySelectorAll('.btn-ver-paciente').forEach((button) => {
        button.addEventListener('click', async () => {
            const idPaciente = Number(button.dataset.pacienteId);
            if (!idPaciente) return;
            openPacienteDetalleModal(idPaciente);
        });
    });
}

function renderRelacionarPacienteForm(container, pacientesDisponibles, emailProfesional) {
    const pacientesOptions = pacientesDisponibles.length
        ? pacientesDisponibles.map((paciente) => `
            <option value="${paciente.id}">${paciente.nombre} — ${paciente.direccion || 'Sin dirección'}</option>
        `).join('')
        : '';

    const formHtml = `
        <div class="card fade-in" style="margin-top: 16px;">
            <h3>Relacionar paciente como mío</h3>
            ${pacientesDisponibles.length === 0 ? '<p style="color:var(--text-muted);">No hay pacientes disponibles sin profesional asignado.</p>' : `
                <form id="relacionar-paciente-form" class="patient-form">
                    <div class="form-group">
                        <label>Paciente disponible</label>
                        <select name="id_paciente" required>
                            <option value="">Selecciona un paciente</option>
                            ${pacientesOptions}
                        </select>
                    </div>
                    <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                        <button type="button" id="cancelar-relacionar-paciente" class="btn-outline-login">Cancelar</button>
                        <button type="submit" class="btn-submit">Relacionar</button>
                    </div>
                    <div id="relacionar-form-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                    <div id="relacionar-form-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
                </form>
            `}
        </div>
    `;

    const formContainer = document.getElementById('asignar-paciente-form-container');
    if (!formContainer) return;
    formContainer.innerHTML = formHtml;

    document.getElementById('cancelar-relacionar-paciente')?.addEventListener('click', () => {
        formContainer.innerHTML = '';
    });

    const form = document.getElementById('relacionar-paciente-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const idPaciente = Number(formData.get('id_paciente'));
        const errorDiv = document.getElementById('relacionar-form-error');
        const successDiv = document.getElementById('relacionar-form-success');

        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        if (!idPaciente) {
            if (errorDiv) {
                errorDiv.textContent = 'Selecciona un paciente válido.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        const respuesta = await asignarPacienteProfesional(idPaciente, emailProfesional);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo relacionar el paciente con el profesional.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Paciente relacionado con éxito.';
            successDiv.style.display = 'block';
        }

        await renderProfesionalPacientesSection(container);
    });
}

async function renderPacienteDetalle(container, idPaciente) {
    const paciente = await obtenerPacienteDetalle(idPaciente);
    if (!paciente) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No se encontró el paciente seleccionado.</p></div>';
        return;
    }

    const detalleHtml = `
        <div class="card fade-in">
            <h3>Detalle del paciente</h3>
            <form id="editar-paciente-form" class="patient-form">
                <div class="form-group"><label>Nombre</label><input type="text" name="nombre" value="${paciente.nombre || ''}" required></div>
                <div class="form-group"><label>Fecha de nacimiento</label><input type="date" name="fecha_nacimiento" value="${paciente.fecha_nacimiento || ''}" required></div>
                <div class="form-group"><label>Dirección</label><input type="text" name="direccion" value="${paciente.direccion || ''}"></div>
                <div class="form-group"><label>Historial médico</label><textarea name="historial_medico" rows="3">${paciente.historial_medico || ''}</textarea></div>
                <div class="form-group"><label>Profesional asignado</label><input type="text" value="${paciente.profesional_nombre || 'No asignado'}" disabled></div>
                <div class="form-group"><label>Cuidador</label><input type="text" value="${paciente.cuidador_nombre || 'No asignado'}" disabled></div>
                <div class="form-group"><label>Horario monitoreo</label><input type="text" name="horario_monitoreo" value="${paciente.horario_monitoreo || ''}"></div>
                <div class="form-group"><label>Observaciones</label><textarea name="observaciones" rows="3">${paciente.observaciones || ''}</textarea></div>
                <div class="form-group"><label>Nivel alerta</label><input type="text" name="nivel_alerta" value="${paciente.nivel_alerta || ''}"></div>
                <div class="form-group"><label>Estado general</label><input type="text" name="estado_general" value="${paciente.estado_general || ''}"></div>
                <div class="form-group"><label>Ubicación</label><input type="text" name="ubicacion" value="${paciente.ubicacion || ''}"></div>
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="button" id="volver-paciente-lista" class="btn-outline-login">Volver</button>
                    <button type="submit" class="btn-submit">Guardar cambios</button>
                </div>
                <div id="editar-paciente-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="editar-paciente-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    container.innerHTML = detalleHtml;

    document.getElementById('volver-paciente-lista')?.addEventListener('click', () => {
        renderProfesionalPacientesSection(container);
    });

    const form = document.getElementById('editar-paciente-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const datosActualizados = {
            nombre: String(formData.get('nombre') || '').trim(),
            fecha_nacimiento: String(formData.get('fecha_nacimiento') || '').trim(),
            direccion: String(formData.get('direccion') || '').trim(),
            historial_medico: String(formData.get('historial_medico') || '').trim(),
            horario_monitoreo: String(formData.get('horario_monitoreo') || '').trim(),
            observaciones: String(formData.get('observaciones') || '').trim(),
            nivel_alerta: String(formData.get('nivel_alerta') || '').trim(),
            estado_general: String(formData.get('estado_general') || '').trim(),
            ubicacion: String(formData.get('ubicacion') || '').trim()
        };

        const errorDiv = document.getElementById('editar-paciente-error');
        const successDiv = document.getElementById('editar-paciente-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        const respuesta = await actualizarPaciente(idPaciente, datosActualizados);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo actualizar el paciente.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Paciente actualizado con éxito.';
            successDiv.style.display = 'block';
        }
    });
}

function initLogoutEvents() {
    const logoutLink = document.querySelector('.sidebar-profesional .logout-item');
    if (!logoutLink) return;

    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        cerrarSesion();
        window.location.hash = '#/login';
    });
}

function closeFloatingModal() {
    document.getElementById('floating-modal-root')?.remove();
}

function openFloatingModal(contentHtml) {
    closeFloatingModal();

    const modalHtml = `
        <div id="floating-modal-root" class="modal-overlay">
            <div class="modal-dialog">
                <button type="button" class="modal-close-btn" aria-label="Cerrar">&times;</button>
                <div id="floating-modal-content" class="modal-content">${contentHtml}</div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const root = document.getElementById('floating-modal-root');
    root?.querySelector('.modal-close-btn')?.addEventListener('click', closeFloatingModal);
    root?.addEventListener('click', (event) => {
        if (event.target === root) closeFloatingModal();
    });
}

function openPacienteDetalleModal(idPaciente) {
    openFloatingModal('<div id="modal-paciente-detail" class="modal-scrollable"></div>');
    const modalContent = document.getElementById('modal-paciente-detail');
    if (modalContent) {
        renderPacienteDetalle(modalContent, idPaciente);
    }
}

function limpiarSesionYRedirigir() {
    cerrarSesion();
    window.location.hash = '#/login';
}

function initCardButtonsEvents() {
    const btnHistorial = document.getElementById('btn-historial');
    if (btnHistorial) {
        btnHistorial.addEventListener('click', () => alert('Abriendo historial clinico...'));
    }
}