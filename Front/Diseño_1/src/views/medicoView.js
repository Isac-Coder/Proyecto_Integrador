// src/views/medicoView.js
import { obtenerDatosSeccion, obtenerPacientes, asignarPacienteProfesional, obtenerPacienteDetalle, actualizarPaciente, obtenerCitasPaciente, obtenerBitacoraRegistros, obtenerSolicitudesPendientes, aceptarSolicitudVinculacion, rechazarSolicitudVinculacion, crearSolicitudVinculacion, obtenerPacientesDisponibles, obtenerProfesionales } from '../services/data.service.js';
import { cerrarSesion, obtenerSesionActiva } from '../services/auth.services.js';

export function profesionalView() {
    const session = obtenerSesionActiva();
    const nombreProfesional = session?.nombre || 'Profesional';

    // Unificamos el punto de carga de estilos al CSS compilado centralizado
    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/styles/styles.css';
        document.head.appendChild(styleLink);
    }

    // Obtener fecha dinámica
    const fechaActual = obtenerFechaFormateada();

    const estructuraDashboardBase = `
        <div class="dashboard-grid fade-in">v
                <div class="card professional-hero-card">
                    <div>
                        <span class="professional-pill">Panel clínico premium</span>
                        <h3 id="professional-hero-title">Tu espacio de observación y decisión está más claro y elegante</h3>
                        <p id="professional-hero-description">Coordina pacientes, revisa indicadores y prioriza atenciones con una vista más cercana a un entorno hospitalario moderno.</p>
                    </div>
                    <div class="professional-hero-metrics" id="professional-hero-metrics">
                        <div class="professional-metric-chip">Cargando pacientes...</div>
                    </div>
                </div>

                <div id="professional-patient-summary" class="card professional-summary-card"></div>

                <div class="professional-stats-grid">
                    <div class="professional-stat-card">
                        <span class="professional-stat-label">Pacientes en seguimiento</span>
                        <strong>12</strong>
                    </div>
                    <div class="professional-stat-card">
                        <span class="professional-stat-label">Reportes pendientes</span>
                        <strong>5</strong>
                    </div>
                    <div class="professional-stat-card">
                        <span class="professional-stat-label">Indicaciones emitidas</span>
                        <strong>18</strong>
                    </div>
                    <div class="professional-stat-card">
                        <span class="professional-stat-label">Estado clínico general</span>
                        <strong>Estable</strong>
                    </div>
                </div>

                <div class="card next-appointment-card">
                    <h3>PRÓXIMA CONSULTA / ASISTENCIA</h3>
                    <div class="doctor-info">
                        <div class="doctor-avatar"></div>
                        <div class="doctor-meta">
                            <h4 id="professional-next-patient">Paciente: Cargando...</h4>
                            <p id="professional-next-description">Esperando información del paciente asignado.</p>
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
                <div class="card tracking-card professional-side-panel">
                    <h3>Seguimiento del Plan de Cuidado</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Progreso General</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 60%;"></div>
                    </div>
                    <div class="progress-labels">
                        <span>60% completado</span>
                    </div>
                    <div class="professional-signal-list">
                        <span class="professional-signal">✓ Ruta de medicación ajustada</span>
                        <span class="professional-signal">✓ Observaciones del cuidador revisadas</span>
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
        actualizarIndicadoresDeNotificacion();
        cargarContenidoDashboardProfesional();
    }, 0);

    return `
        <div class="dashboard-layout layout-profesional">
            
            <aside class="sidebar sidebar-profesional">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Dashboard</a>
                    <a href="#" class="menu-item" data-view="pacientes"><i class="ti ti-users"></i> Mis Pacientes <span class="notification-badge"></span></a>
                    <a href="#" class="menu-item" data-view="citas"><i class="ti ti-calendar-event"></i> Citas / Visitas <span class="notification-badge"></span></a>
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
                        <h2>Bienvenido ${nombreProfesional}</h2>
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

async function cargarContenidoDashboardProfesional() {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);

    const heroTitle = document.getElementById('professional-hero-title');
    const heroDescription = document.getElementById('professional-hero-description');
    const heroMetrics = document.getElementById('professional-hero-metrics');
    const summaryContainer = document.getElementById('professional-patient-summary');
    const nextPatient = document.getElementById('professional-next-patient');
    const nextDescription = document.getElementById('professional-next-description');

    if (pacientes.length) {
        const pacientePrincipal = pacientes[0];
        if (heroTitle) heroTitle.textContent = `Seguimiento activo para ${pacientePrincipal.nombre || 'tu paciente'}`;
        if (heroDescription) heroDescription.textContent = 'Los pacientes relacionados con tu cuenta se muestran automáticamente desde la base de datos del backend.';
        if (heroMetrics) {
            heroMetrics.innerHTML = `
                <div class="professional-metric-chip">${pacientes.length} paciente${pacientes.length > 1 ? 's' : ''} asignado${pacientes.length > 1 ? 's' : ''}</div>
                <div class="professional-metric-chip">${pacientePrincipal.direccion ? 'Dirección registrada' : 'Sin dirección registrada'}</div>
                <div class="professional-metric-chip">${pacientePrincipal.cuidador_nombre ? `Cuidador: ${pacientePrincipal.cuidador_nombre}` : 'Sin cuidador asignado'}</div>
            `;
        }
        if (nextPatient) nextPatient.textContent = `Paciente: ${pacientePrincipal.nombre || 'Sin nombre'}`;
        if (nextDescription) nextDescription.textContent = pacientePrincipal.direccion ? `Seguimiento y coordinación para ${pacientePrincipal.direccion}` : 'Sin información adicional registrada.';
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <h3>Pacientes asignados</h3>
                <ul class="professional-patient-list">
                    ${pacientes.map((paciente) => `<li><strong>${paciente.nombre || 'Paciente sin nombre'}</strong>${paciente.cuidador_nombre ? ` · Cuidador: ${paciente.cuidador_nombre}` : ''}</li>`).join('')}
                </ul>
            `;
        }
    } else {
        if (heroTitle) heroTitle.textContent = 'Aún no tienes pacientes asignados';
        if (heroDescription) heroDescription.textContent = 'Cuando un paciente sea creado y vinculado a tu cuenta, aparecerá aquí automáticamente.';
        if (heroMetrics) {
            heroMetrics.innerHTML = `
                <div class="professional-metric-chip">Sin pacientes aún</div>
                <div class="professional-metric-chip">Esperando vinculación</div>
                <div class="professional-metric-chip">Listo para recibir datos</div>
            `;
        }
        if (nextPatient) nextPatient.textContent = 'Paciente: Sin pacientes asignados';
        if (nextDescription) nextDescription.textContent = 'No hay información de pacientes para mostrar todavía.';
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <h3>Pacientes asignados</h3>
                <p style="color:var(--text-muted); margin-top:8px;">Aún no tienes pacientes relacionados. El contenido aparecerá aquí cuando el backend los registre.</p>
            `;
        }
    }
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
            } else if (vistaSolicitada === 'citas') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando citas...</p></div>';
                await renderCitasSection(contentArea);
            } else if (vistaSolicitada === 'mensajes') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando mensajes...</p></div>';
                await renderMensajesSection(contentArea);
            } else if (vistaSolicitada === 'resultados') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando resultados...</p></div>';
                await renderResultadosSection(contentArea);
            } else if (vistaSolicitada === 'medicacion') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando indicaciones...</p></div>';
                await renderIndicacionesSection(contentArea);
            } else if (vistaSolicitada === 'perfil') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando perfil...</p></div>';
                await renderPerfilSection(contentArea);
            } else {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando...</p></div>';
                contentArea.innerHTML = await obtenerDatosSeccion(vistaSolicitada, 'profesional');
            }
        });
    });

    initCardButtonsEvents();
    initLogoutEvents();
}

async function actualizarIndicadoresDeNotificacion() {
    const session = obtenerSesionActiva();
    if (!session) return;

    const pacientes = await obtenerPacientes(session.rol, session.email);

    // Indicador para pacientes con alertas
    const pacientesConAlerta = pacientes.some(p => p.nivel_alerta && p.nivel_alerta.toLowerCase() !== 'bajo' && p.nivel_alerta.toLowerCase() !== 'normal');
    const badgePacientes = document.querySelector('.sidebar .menu-item[data-view="pacientes"] .notification-badge');
    if (badgePacientes) {
        badgePacientes.style.display = pacientesConAlerta ? 'block' : 'none';
    }

    // Indicador para citas de hoy
    if (pacientes.length > 0) {
        const citasPromises = pacientes.map(p => obtenerCitasPaciente(p.id));
        const citasDeTodos = (await Promise.all(citasPromises)).flat();

        const hoy = new Date();
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

        const hayCitasHoy = citasDeTodos.some(cita => {
            const fechaCita = new Date(cita.fecha_hora);
            return fechaCita >= inicioHoy && fechaCita < finHoy;
        });

        const badgeCitas = document.querySelector('.sidebar .menu-item[data-view="citas"] .notification-badge');
        if (badgeCitas) {
            badgeCitas.style.display = hayCitasHoy ? 'block' : 'none';
        }
    }
}





async function renderProfesionalPacientesSection(container) {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);
    const pacientesDisponibles = await obtenerPacientes('', '', 'disponibles');

    const pacientesHtml = pacientes.length
        ? pacientes.map((paciente) => `
            <div class="card patient-dashboard-card">
                <div class="patient-card-header">
                    <div>
                        <h4>${paciente.nombre || 'Paciente sin nombre'}</h4>
                        <p>${paciente.direccion ? `Dirección: ${paciente.direccion}` : 'Sin dirección registrada'}</p>
                    </div>
                    <span class="patient-card-badge">${paciente.cuidador_nombre ? 'Con seguimiento' : 'Por asignar'}</span>
                </div>
                <div class="patient-card-body">
                    <div><strong>Fecha de nacimiento</strong><span>${paciente.fecha_nacimiento || 'No registrada'}</span></div>
                    <div><strong>Cuidador</strong><span>${paciente.cuidador_nombre || 'No disponible'}</span></div>
                    <div><strong>Estado</strong><span>${paciente.nivel_alerta || 'Sin alerta'}</span></div>
                </div>
                <button class="btn-detalles btn-ver-paciente" data-paciente-id="${paciente.id}" style="margin-top:10px;">Ver / Editar</button>
            </div>
        `).join('')
        : '<div class="card empty-state-card"><div class="empty-state-icon">🩺</div><h4>Aún no tienes pacientes asignados</h4><p>Cuando el backend vincule pacientes a tu profesional, aparecerán aquí con toda su información.</p></div>';

    container.innerHTML = `
        <div class="card fade-in section-hero-card" style="margin-bottom: 18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
                <div>
                    <h3>Mis Pacientes</h3>
                    <p>Gestiona tus pacientes vinculados desde la base de datos y mantén el seguimiento clínico actualizado.</p>
                </div>
                <button id="btn-asignar-paciente" class="btn-detalles" style="padding: 0.8rem 1rem;">Relacionar paciente</button>
            </div>
        </div>
        <div id="profesional-pacientes-list" class="section-grid">${pacientesHtml}</div>
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

function formatFechaCorta(fechaValor) {
    if (!fechaValor) return 'Sin registro';
    const fecha = new Date(fechaValor);
    if (Number.isNaN(fecha.getTime())) return 'Sin registro';
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function obtenerClaveMensajes() {
    const session = obtenerSesionActiva();
    const email = session?.email || 'anonimo';
    const rol = session?.rol || 'profesional';
    return `zoe-mensajes-${rol}-${email}`;
}

function leerMensajes() {
    try {
        const guardados = localStorage.getItem(obtenerClaveMensajes());
        if (!guardados) {
            const mensajeInicial = [
                {
                    id: 1,
                    remitente: 'Cuidador',
                    texto: 'Hola, el paciente presentó más energía en la tarde y ya tomó la medicación programada.',
                    hora: new Date().toISOString(),
                    tipo: 'entrada'
                },
                {
                    id: 2,
                    remitente: 'Tú',
                    texto: 'Gracias. Voy a revisar la evolución y ajustar la indicación si es necesario.',
                    hora: new Date().toISOString(),
                    tipo: 'salida'
                }
            ];
            localStorage.setItem(obtenerClaveMensajes(), JSON.stringify(mensajeInicial));
            return mensajeInicial;
        }
        return JSON.parse(guardados);
    } catch (error) {
        return [];
    }
}

function guardarMensajes(mensajes) {
    localStorage.setItem(obtenerClaveMensajes(), JSON.stringify(mensajes));
}

async function renderCitasSection(container) {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);

    if (!pacientes.length) {
        container.innerHTML = `
            <div class="card fade-in empty-state-card">
                <div class="empty-state-icon">🗓️</div>
                <h4>No hay citas registradas todavía</h4>
                <p>Cuando el backend asocie un paciente a tu perfil, las próximas visitas aparecerán aquí con su fecha y lugar.</p>
            </div>
        `;
        return;
    }

    const citasPorPaciente = await Promise.all(pacientes.map(async (paciente) => ({
        paciente,
        citas: await obtenerCitasPaciente(paciente.id)
    })));

    const citas = citasPorPaciente
        .flatMap(({ paciente, citas }) => citas.map((cita) => ({ ...cita, paciente: paciente.nombre, id_paciente: paciente.id })))
        .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

    container.innerHTML = `
        <div class="card fade-in section-hero-card" style="margin-bottom: 16px;">
            <div>
                <h3>Citas y visitas</h3>
                <p>Revisa las próximas consultas del paciente o las visitas coordinadas desde la base de datos.</p>
            </div>
        </div>
        <div class="section-grid">
            ${citas.length ? citas.map((cita) => `
                <div class="card info-compact-card">
                    <div class="card-title-row">
                        <h4>${cita.paciente || 'Paciente'}</h4>
                        <span class="status-pill">${cita.estado || 'Agendada'}</span>
                    </div>
                    <div class="info-grid">
                        <div><strong>Motivo</strong><span>${cita.motivo || 'Sin motivo indicado'}</span></div>
                        <div><strong>Fecha</strong><span>${formatFechaCorta(cita.fecha_hora)}</span></div>
                        <div><strong>Lugar</strong><span>${cita.lugar || 'Por definir'}</span></div>
                    </div>
                </div>
            `).join('') : '<div class="card empty-state-card"><div class="empty-state-icon">🗓️</div><h4>No hay citas para mostrar</h4><p>El siguiente registro aparecerá cuando exista una visita programada.</p></div>'}
        </div>
    `;
}

async function renderMensajesSection(container) {
    const session = obtenerSesionActiva();
    const pacientes = await obtenerPacientes(session?.rol || 'profesional', session?.email || '');
    const mensajes = leerMensajes();
    const pacientePrincipal = pacientes[0];

    container.innerHTML = `
        <div class="card fade-in section-hero-card" style="margin-bottom: 16px;">
            <div>
                <h3>Mensajes del equipo</h3>
                <p>Recibe observaciones del cuidador y responde desde aquí con una conversación más clara y organizada.</p>
            </div>
        </div>
        <div class="card fade-in message-shell">
            <div class="message-header">
                <h4>${pacientePrincipal ? `Seguimiento de ${pacientePrincipal.nombre}` : 'Conversación clínica'}</h4>
                <span class="status-pill">En línea</span>
            </div>
            <div class="message-list">
                ${mensajes.length ? mensajes.map((mensaje) => `
                    <div class="message-bubble ${mensaje.tipo === 'entrada' ? 'incoming' : 'outgoing'}">
                        <strong>${mensaje.remitente}</strong>
                        <p>${mensaje.texto}</p>
                        <span>${formatFechaCorta(mensaje.hora)}</span>
                    </div>
                `).join('') : '<div class="empty-state-card"><div class="empty-state-icon">💬</div><p>No hay mensajes todavía.</p></div>'}
            </div>
            <form id="mensaje-form" class="message-form">
                <textarea id="mensaje-input" rows="3" placeholder="Escribe una respuesta o una indicación para el cuidador..."></textarea>
                <button type="submit" class="btn-submit">Enviar mensaje</button>
            </form>
        </div>
    `;

    const form = document.getElementById('mensaje-form');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('mensaje-input');
        const texto = input?.value?.trim();
        if (!texto) return;

        const mensajesActualizados = [
            ...leerMensajes(),
            {
                id: Date.now(),
                remitente: 'Tú',
                texto,
                hora: new Date().toISOString(),
                tipo: 'salida'
            }
        ];

        guardarMensajes(mensajesActualizados);
        renderMensajesSection(container);
    });
}

async function renderResultadosSection(container) {
    const session = obtenerSesionActiva();
    const pacientes = await obtenerPacientes(session?.rol || 'profesional', session?.email || '');

    if (!pacientes.length) {
        container.innerHTML = `
            <div class="card fade-in empty-state-card">
                <div class="empty-state-icon">🧪</div>
                <h4>No hay resultados clínicos para mostrar</h4>
                <p>Los registros del paciente aparecerán aquí cuando exista información disponible en el backend.</p>
            </div>
        `;
        return;
    }

    const resultados = await Promise.all(pacientes.map(async (paciente) => {
        const registros = await obtenerBitacoraRegistros(paciente.id);
        const ultimoRegistro = registros[0] || null;
        return {
            paciente,
            ultimoRegistro
        };
    }));

    container.innerHTML = `
        <div class="card fade-in section-hero-card" style="margin-bottom: 16px;">
            <div>
                <h3>Resultados y seguimiento</h3>
                <p>Revisa la evolución clínica más reciente de cada paciente y su estado general.</p>
            </div>
        </div>
        <div class="section-grid">
            ${resultados.map(({ paciente, ultimoRegistro }) => `
                <div class="card info-compact-card">
                    <div class="card-title-row">
                        <h4>${paciente.nombre || 'Paciente'}</h4>
                        <span class="status-pill">${paciente.estado_general || 'Estable'}</span>
                    </div>
                    <div class="info-grid">
                        <div><strong>Último registro</strong><span>${ultimoRegistro ? (ultimoRegistro.notas || 'Registro sin notas') : 'Sin registros'}</span></div>
                        <div><strong>Fecha</strong><span>${ultimoRegistro ? formatFechaCorta(ultimoRegistro.fecha_registro) : 'Sin información'}</span></div>
                        <div><strong>Observaciones</strong><span>${paciente.observaciones || 'Sin observaciones'}</span></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function renderIndicacionesSection(container) {
    const session = obtenerSesionActiva();
    const pacientes = await obtenerPacientes(session?.rol || 'profesional', session?.email || '');

    if (!pacientes.length) {
        container.innerHTML = `
            <div class="card fade-in empty-state-card">
                <div class="empty-state-icon">💊</div>
                <h4>Aún no hay indicaciones activas</h4>
                <p>Las indicaciones sugeridas para el paciente aparecerán aquí cuando se encuentre información en el sistema.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="card fade-in section-hero-card" style="margin-bottom: 16px;">
            <div>
                <h3>Indicaciones clínicas</h3>
                <p>Organiza revisiones, horarios de monitoreo y observaciones relevantes para cada paciente.</p>
            </div>
        </div>
        <div class="section-grid">
            ${pacientes.map((paciente) => `
                <div class="card info-compact-card">
                    <div class="card-title-row">
                        <h4>${paciente.nombre || 'Paciente'}</h4>
                        <span class="status-pill">${paciente.nivel_alerta || 'Normal'}</span>
                    </div>
                    <div class="info-grid">
                        <div><strong>Monitoreo</strong><span>${paciente.horario_monitoreo || 'Sin horario de monitoreo'}</span></div>
                        <div><strong>Observaciones</strong><span>${paciente.observaciones || 'Sin observaciones en el registro'}</span></div>
                        <div><strong>Ubicación</strong><span>${paciente.ubicacion || 'Sin ubicación registrada'}</span></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function renderPerfilSection(container) {
    const session = obtenerSesionActiva();
    const pacientes = await obtenerPacientes(session?.rol || 'profesional', session?.email || '');
    const rolLabel = session?.rol === 'profesional' ? 'Especialista clínico' : 'Cuidador';

    container.innerHTML = `
        <div class="card fade-in profile-shell">
            <div class="profile-hero">
                <div class="profile-avatar">${(session?.nombre || 'Z').charAt(0).toUpperCase()}</div>
                <div>
                    <span class="professional-pill">${rolLabel}</span>
                    <h3>${session?.nombre || 'Usuario Zoe Care'}</h3>
                    <p>${session?.email || 'Sin correo registrado'}</p>
                </div>
            </div>
            <div class="profile-stats">
                <div class="profile-stat-card">
                    <strong>${pacientes.length}</strong>
                    <span>Pacientes vinculados</span>
                </div>
                <div class="profile-stat-card">
                    <strong>${pacientes.filter((paciente) => paciente.nivel_alerta && paciente.nivel_alerta.toLowerCase() !== 'bajo' && paciente.nivel_alerta.toLowerCase() !== 'normal').length}</strong>
                    <span>Alertas activas</span>
                </div>
                <div class="profile-stat-card">
                    <strong>${pacientes[0]?.profesional_nombre ? 'Activo' : 'En espera'}</strong>
                    <span>Estado de coordinación</span>
                </div>
            </div>
            <div class="profile-details">
                <h4>Resumen del perfil</h4>
                <p>Tu información queda centralizada para revisar pacientes, coordinar con el cuidador y mantener un seguimiento más claro.</p>
                ${pacientes.length ? `
                    <ul class="caregiver-checklist">
                        ${pacientes.slice(0, 3).map((paciente) => `<li><span>✓</span>${paciente.nombre || 'Paciente sin nombre'}</li>`).join('')}
                    </ul>
                ` : '<p style="color:var(--text-muted);">Aún no hay pacientes vinculados a tu perfil.</p>'}
            </div>
        </div>
    `;
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