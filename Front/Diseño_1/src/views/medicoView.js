// src/views/medicoView.js
import { obtenerDatosSeccion, obtenerPacientes, asignarPacienteProfesional, obtenerPacienteDetalle, actualizarPaciente, obtenerCitasPaciente, obtenerBitacoraRegistros, obtenerBitacoraPlantillas, crearBitacoraPlantilla, crearBitacoraRegistro, obtenerMedicamentosPaciente, crearMedicamentoPaciente, actualizarMedicamentoPaciente, crearCitaPaciente, actualizarCitaPaciente, eliminarCitaPaciente, obtenerSolicitudesPendientes, aceptarSolicitudVinculacion, rechazarSolicitudVinculacion, crearSolicitudVinculacion, obtenerPacientesDisponibles, obtenerProfesionales, obtenerSolicitudesEnviadas } from '../services/data.service.js';
import { cerrarSesion, obtenerSesionActiva } from '../services/auth.services.js';

export function profesionalView() {
    const session = obtenerSesionActiva();
    const nombreProfesional = session?.nombre || 'Profesional';
    const iniciales = (session?.nombre || 'P').charAt(0).toUpperCase();

    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/styles/styles.css';
        document.head.appendChild(styleLink);
    }

    const fechaActual = obtenerFechaFormateada();

    const estructuraDashboardBase = `
        <div class="dashboard-grid fade-in">
            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card" data-target="pacientes">
                    <div class="kpi-icon"><i class="ti ti-users"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-value" id="kpi-pacientes">0</span>
                        <span class="kpi-label">Pacientes</span>
                    </div>
                </div>
                <div class="kpi-card" data-target="medicacion">
                    <div class="kpi-icon"><i class="ti ti-pill"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-value" id="kpi-medicamentos">0</span>
                        <span class="kpi-label">Medicamentos</span>
                    </div>
                </div>
                <div class="kpi-card" data-target="citas">
                    <div class="kpi-icon"><i class="ti ti-calendar-event"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-value" id="kpi-citas">0</span>
                        <span class="kpi-label">Citas</span>
                    </div>
                </div>
                <div class="kpi-card" data-target="bitacora">
                    <div class="kpi-icon"><i class="ti ti-notes"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-value" id="kpi-registros">0</span>
                        <span class="kpi-label">Registros</span>
                    </div>
                </div>
            </div>

            <!-- Hero -->
            <div class="card professional-hero-card">
                <div>
                    <span class="professional-pill">Panel clínico</span>
                    <h3 id="professional-hero-title">Tu espacio de observación y decisión</h3>
                    <p id="professional-hero-description">Coordina pacientes, revisa indicadores y prioriza atenciones.</p>
                </div>
                <div class="professional-hero-metrics" id="professional-hero-metrics">
                    <div class="professional-metric-chip">Cargando pacientes...</div>
                </div>
            </div>

            <!-- Checklist + Gráfico -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="card checklist-card">
                    <h3><i class="ti ti-checklist"></i> Checklist del día</h3>
                    <ul class="caregiver-checklist" id="checklist-diario">
                        <li><span class="checkbox-placeholder"></span> Revisar bitácora del paciente</li>
                        <li><span class="checkbox-placeholder"></span> Verificar medicación</li>
                        <li><span class="checkbox-placeholder"></span> Confirmar próxima cita</li>
                        <li><span class="checkbox-placeholder"></span> Actualizar observaciones</li>
                    </ul>
                </div>
                <div class="card chart-card">
                    <div class="chart-header">
                        <h3>Registros de Bitácora (7 días)</h3>
                    </div>
                    <div id="chart-bitacora-simple" class="chart-simple-bars">
                        <p style="text-align:center;color:var(--text-muted);font-size:0.85rem;">Cargando datos...</p>
                    </div>
                </div>
            </div>

            <!-- Progreso medicamentos -->
            <div class="card">
                <h3>Progreso de Medicamentos</h3>
                <div id="medication-progress-container">
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="medication-progress-bar" style="width:0%;"></div>
                    </div>
                    <div class="progress-labels">
                        <span id="medication-progress-text">0% completado</span>
                    </div>
                </div>
                <div id="medication-list-preview" style="margin-top:8px;"></div>
            </div>

            <!-- Próximas Citas -->
            <div class="card next-appointment-card">
                <h3>PRÓXIMAS CITAS</h3>
                <div id="proximas-citas-container">
                    <p style="color:var(--text-muted);">Cargando citas...</p>
                </div>
            </div>

            <!-- Último registro bitácora -->
            <div class="card">
                <h3>Último Registro de Bitácora</h3>
                <div id="ultimo-registro-bitacora">
                    <p style="color:var(--text-muted);">Cargando último registro...</p>
                </div>
            </div>

            <!-- Panel derecho -->
            <div class="right-content-column">
                <div class="card tracking-card professional-side-panel">
                    <h3>Seguimiento del Plan de Cuidado</h3>
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Progreso General</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width:60%;"></div>
                    </div>
                    <div class="progress-labels"><span>60% completado</span></div>
                    <div class="professional-signal-list">
                        <span class="professional-signal">✓ Ruta de medicación ajustada</span>
                        <span class="professional-signal">✓ Observaciones revisadas</span>
                    </div>
                </div>

                <div class="card quick-actions-card">
                    <h3>Acciones rápidas</h3>
                    <ul class="actions-list">
                        <li class="action-item" data-target="medicacion">Emitir indicaciones <span class="arrow">›</span></li>
                        <li class="action-item" data-target="bitacora">Nuevo registro <span class="arrow">›</span></li>
                    </ul>
                </div>

                <div class="card reminder-card">
                    <div class="rhead"><i class="ti ti-bell"></i> Recordatorio</div>
                    <p>Revisar observaciones enviadas por el cuidador.</p>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initProfesionalDashboardEvents(estructuraDashboardBase);
        actualizarIndicadoresDeNotificacion();
        cargarDashboardConDatosReales();
    }, 0);

    return `
        <div class="dashboard-layout layout-profesional">
            <aside class="sidebar sidebar-profesional">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Dashboard</a>
                    <a href="#" class="menu-item" data-view="pacientes"><i class="ti ti-users"></i> Mis Pacientes <span class="notification-badge"></span></a>
                    <a href="#" class="menu-item" data-view="citas"><i class="ti ti-calendar-event"></i> Citas / Visitas <span class="notification-badge"></span></a>
                    <a href="#" class="menu-item" data-view="bitacora"><i class="ti ti-notes"></i> Bitácora</a>
                    <a href="#" class="menu-item" data-view="medicacion"><i class="ti ti-pill"></i> Medicamentos</a>
                    <a href="#" class="menu-item" data-view="calendario"><i class="ti ti-calendar"></i> Calendario</a>
                    <a href="#" class="menu-item" data-view="solicitudes"><i class="ti ti-link"></i> Solicitudes</a>
                    <a href="#" class="menu-item" data-view="perfil"><i class="ti ti-user"></i> Mi Perfil</a>
                    <a href="#/login" class="menu-item logout-item"><i class="ti ti-logout"></i> Cerrar Sesión</a>
                </nav>
            </aside>

            <div class="dashboard-main">
                <header class="dashboard-header">
                    <button class="menu-hamburger-btn" id="hamburguesa-toggle" aria-label="Abrir menú">
                        <span></span><span></span><span></span>
                    </button>
                    <div class="welcome-text">
                        <h2>Bienvenido ${nombreProfesional}</h2>
                        <span class="current-date">${fechaActual}</span>
                    </div>
                    <div class="header-actions-group">
                        <div class="header-search">
                            <input type="text" placeholder="Buscar pacientes, bitácora...">
                        </div>
                        <div class="avatar">${iniciales}</div>
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

async function cargarDashboardConDatosReales() {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);

    // Actualizar KPIs
    const kpiPacientes = document.getElementById('kpi-pacientes');
    const kpiMedicamentos = document.getElementById('kpi-medicamentos');
    const kpiCitas = document.getElementById('kpi-citas');
    const kpiRegistros = document.getElementById('kpi-registros');

    if (kpiPacientes) kpiPacientes.textContent = pacientes.length;

    let totalMedicamentos = 0;
    let totalCitas = 0;
    let totalRegistros = 0;
    let proximasCitasHtml = '';
    let ultimoRegistroHtml = '';
    let checklistData = [];

    if (pacientes.length) {
        const pacientePrincipal = pacientes[0];

        // Hero metrics
        const heroMetrics = document.getElementById('professional-hero-metrics');
        if (heroMetrics) {
            heroMetrics.innerHTML = `
                <div class="professional-metric-chip">${pacientes.length} paciente${pacientes.length > 1 ? 's' : ''} asignado${pacientes.length > 1 ? 's' : ''}</div>
                <div class="professional-metric-chip">${pacientePrincipal.direccion ? 'Dirección registrada' : 'Sin dirección registrada'}</div>
                <div class="professional-metric-chip">${pacientePrincipal.cuidador_nombre ? `Cuidador: ${pacientePrincipal.cuidador_nombre}` : 'Sin cuidador asignado'}</div>
            `;
        }

        const heroTitle = document.getElementById('professional-hero-title');
        const heroDesc = document.getElementById('professional-hero-description');
        if (heroTitle) heroTitle.textContent = `Seguimiento activo para ${pacientePrincipal.nombre || 'tu paciente'}`;
        if (heroDesc) heroDesc.textContent = 'Los pacientes relacionados con tu cuenta se muestran automáticamente desde la base de datos del backend.';

                // Obtener datos agregados (PARALELO)
        const todosLosRegistros = [];
        const todasLasCitas = [];

        const resultadosPacientes = await Promise.all(pacientes.map(async (p) => {
            const [meds, citas, registros] = await Promise.all([
                obtenerMedicamentosPaciente(p.id),
                obtenerCitasPaciente(p.id),
                obtenerBitacoraRegistros(p.id)
            ]);
            return { p, meds, citas, registros };
        }));

        for (const { p, meds, citas, registros } of resultadosPacientes) {
            totalMedicamentos += meds.length;
            todasLasCitas.push(...citas.map(c => ({ ...c, paciente: p.nombre, id_paciente: p.id })));
            totalCitas += citas.length;
            todosLosRegistros.push(...registros.map(r => ({ ...r, paciente: p.nombre })));
            totalRegistros += registros.length;
        }

        if (kpiMedicamentos) kpiMedicamentos.textContent = totalMedicamentos;
        if (kpiCitas) kpiCitas.textContent = totalCitas;
        if (kpiRegistros) kpiRegistros.textContent = totalRegistros;

        // Próximas citas
        const ahora = new Date();
        const proximas = todasLasCitas
            .filter(c => new Date(c.fecha_hora) >= ahora)
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
            .slice(0, 5);

        if (proximas.length) {
            proximasCitasHtml = proximas.map(c => `
                <div class="cita-item" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light);">
                    <span><strong>${c.paciente || 'Paciente'}</strong> — ${c.motivo || 'Sin motivo'}</span>
                    <span style="color:var(--text-muted);font-size:0.85rem;">${formatFechaCorta(c.fecha_hora)}</span>
                </div>
            `).join('');
        } else {
            proximasCitasHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">No hay próximas citas programadas.</p>';
        }

        // Último registro
        todosLosRegistros.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
        if (todosLosRegistros.length) {
            const ultimo = todosLosRegistros[0];
            ultimoRegistroHtml = `
                <div style="padding:8px 0;">
                    <p><strong>${ultimo.paciente || 'Paciente'}</strong> — ${formatFechaCorta(ultimo.fecha_registro)}</p>
                    <p style="color:var(--text-muted);font-size:0.9rem;margin-top:4px;">${ultimo.notas || 'Sin notas'}</p>
                </div>
            `;
        } else {
            ultimoRegistroHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">Aún no hay registros de bitácora.</p>';
        }

        // Checklist dinámico
        if (proximas.length) checklistData.push('Revisar bitácora del paciente');
        if (totalMedicamentos) checklistData.push('Verificar medicación');
        if (proximas.length) checklistData.push('Confirmar próxima cita');
        checklistData.push('Actualizar observaciones');
    } else {
        const heroMetrics = document.getElementById('professional-hero-metrics');
        if (heroMetrics) {
            heroMetrics.innerHTML = `
                <div class="professional-metric-chip">Sin pacientes aún</div>
                <div class="professional-metric-chip">Esperando vinculación</div>
                <div class="professional-metric-chip">Listo para recibir datos</div>
            `;
        }
        proximasCitasHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">No hay pacientes asignados aún.</p>';
        ultimoRegistroHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">Aún no hay registros de bitácora.</p>';
        checklistData = ['Revisar bitácora del paciente', 'Verificar medicación', 'Confirmar próxima cita', 'Actualizar observaciones'];
    }

    // Render checklist
    const checklistEl = document.getElementById('checklist-diario');
    if (checklistEl) {
        checklistEl.innerHTML = checklistData.map(item => `
            <li><span class="checkbox-placeholder"></span> ${item}</li>
        `).join('');
    }

    // Render próximas citas
    const citasContainer = document.getElementById('proximas-citas-container');
    if (citasContainer) citasContainer.innerHTML = proximasCitasHtml;

    // Render último registro
    const ultimoRegistroContainer = document.getElementById('ultimo-registro-bitacora');
    if (ultimoRegistroContainer) ultimoRegistroContainer.innerHTML = ultimoRegistroHtml;

    // Progreso de medicamentos
    const progressBar = document.getElementById('medication-progress-bar');
    const progressText = document.getElementById('medication-progress-text');
    const medListPreview = document.getElementById('medication-list-preview');
    if (progressBar && progressText) {
        const pct = totalMedicamentos > 0 ? Math.min(Math.round((totalRegistros / (totalMedicamentos * 7)) * 100), 100) : 0;
        progressBar.style.width = `${pct}%`;
        progressText.textContent = `${pct}% completado`;
    }
    if (medListPreview) {
        medListPreview.innerHTML = totalMedicamentos > 0
            ? `<p style="color:var(--text-muted);font-size:0.85rem;">${totalMedicamentos} medicamento${totalMedicamentos > 1 ? 's' : ''} registrado${totalMedicamentos > 1 ? 's' : ''}</p>`
            : '<p style="color:var(--text-muted);font-size:0.85rem;">Sin medicamentos registrados</p>';
    }

    // Gráfico simple de bitácora (7 días)
    renderChartBitacoraSimple(pacientes);
}

async function renderChartBitacoraSimple(pacientes) {
    const chartContainer = document.getElementById('chart-bitacora-simple');
    if (!chartContainer) return;

    // Generar últimos 7 días
    const dias = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dias.push(d.toISOString().split('T')[0]);
    }

    // Contar registros por día
    const conteo = {};
    for (const dia of dias) conteo[dia] = 0;

        const todosRegistros = await Promise.all(pacientes.map(p => obtenerBitacoraRegistros(p.id)));
    for (const registros of todosRegistros) {
        for (const r of registros) {
            const fechaReg = r.fecha_registro ? r.fecha_registro.split('T')[0] : '';
            if (conteo[fechaReg] !== undefined) conteo[fechaReg]++;
        }
    }

    const maxVal = Math.max(...Object.values(conteo), 1);
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    chartContainer.innerHTML = '<div style="display:flex;align-items:flex-end;gap:8px;height:120px;padding:8px 0;">' +
        dias.map((dia, i) => {
            const d = new Date(dia + 'T12:00:00');
            const altura = Math.max((conteo[dia] / maxVal) * 100, 2);
            return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                <div style="width:100%;background:var(--primary-light);border-radius:4px 4px 0 0;height:${altura}px;min-height:4px;transition:height 0.3s;" title="${conteo[dia]} registros"></div>
                <span style="font-size:0.65rem;color:var(--text-muted);margin-top:4px;">${diasSemana[d.getDay()]}</span>
            </div>`;
        }).join('') + '</div>';
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
            } else if (vistaSolicitada === 'bitacora') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando bitácora...</p></div>';
                await renderBitacoraSection(contentArea);
            } else if (vistaSolicitada === 'medicacion') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando medicamentos...</p></div>';
                await renderMedicamentosSection(contentArea);
            } else if (vistaSolicitada === 'calendario') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando calendario...</p></div>';
                await renderCalendarioSection(contentArea);
            } else if (vistaSolicitada === 'solicitudes') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando solicitudes...</p></div>';
                await renderSolicitudesSection(contentArea);
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

async function renderBitacoraSection(container) {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);

    let html = `
        <div class="card fade-in section-hero-card" style="margin-bottom: 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
                <div>
                    <h3>Bitácora de Pacientes</h3>
                    <p>Registros diarios de evolución, observaciones y novedades clínicas.</p>
                </div>
                <button id="btn-nuevo-registro-bitacora" class="btn-detalles" style="padding:0.8rem 1rem;">+ Nuevo registro</button>
            </div>
        </div>
    `;

    if (!pacientes.length) {
        html += `
            <div class="card fade-in empty-state-card">
                <div class="empty-state-icon">📝</div>
                <h4>No hay pacientes asignados</h4>
                <p>Para crear registros de bitácora, primero debes tener pacientes vinculados a tu perfil.</p>
            </div>
        `;
        container.innerHTML = html;
        return;
    }

        const [todosLosRegistros, plantillas] = await Promise.all([
        (async () => {
            const resultados = await Promise.all(pacientes.map(async (p) => {
                const registros = await obtenerBitacoraRegistros(p.id);
                return registros.map(r => ({ ...r, paciente_nombre: p.nombre, id_paciente: p.id }));
            }));
            const flat = resultados.flat();
            flat.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
            return flat;
        })(),
        obtenerBitacoraPlantillas()
    ]);

    html += `
        <div class="section-grid">
            ${todosLosRegistros.length ? todosLosRegistros.slice(0, 20).map(r => `
                <div class="card info-compact-card">
                    <div class="card-title-row">
                        <h4>${r.paciente_nombre || 'Paciente'}</h4>
                        <span class="status-pill">${formatFechaCorta(r.fecha_registro)}</span>
                    </div>
                    <div class="info-grid">
                        <div><strong>Notas</strong><span>${r.notas || 'Sin notas'}</span></div>
                        <div><strong>Estado</strong><span>${r.estado_animo || r.estado || 'Sin especificar'}</span></div>
                    </div>
                </div>
            `).join('') : '<div class="card empty-state-card"><div class="empty-state-icon">📝</div><h4>Sin registros aún</h4><p>Usa el botón "+ Nuevo registro" para crear la primera entrada de bitácora.</p></div>'}
        </div>
        <div id="nuevo-registro-bitacora-form"></div>
    `;

    container.innerHTML = html;

    document.getElementById('btn-nuevo-registro-bitacora')?.addEventListener('click', () => {
        renderFormNuevoRegistroBitacora(container, pacientes, plantillas);
    });
}

function renderFormNuevoRegistroBitacora(container, pacientes, plantillas) {
    const formContainer = document.getElementById('nuevo-registro-bitacora-form');
    if (!formContainer) return;

    const pacienteOptions = pacientes.map(p => `<option value="${p.id}">${p.nombre || 'Sin nombre'}</option>`).join('');
    const plantillaOptions = plantillas.length
        ? plantillas.map(pt => `<option value="${pt.id}">${pt.nombre || 'Plantilla'}</option>`).join('')
        : '<option value="">Sin plantillas disponibles</option>';

    formContainer.innerHTML = `
        <div class="card fade-in" style="margin-top: 16px;">
            <h4>Nuevo registro de bitácora</h4>
            <form id="form-nuevo-registro" class="patient-form">
                <div class="form-group">
                    <label>Paciente</label>
                    <select name="id_paciente" required>${pacienteOptions}</select>
                </div>
                <div class="form-group">
                    <label>Plantilla (opcional)</label>
                    <select name="id_plantilla">${plantillaOptions}</select>
                </div>
                <div class="form-group">
                    <label>Notas / Observaciones</label>
                    <textarea name="notas" rows="4" required placeholder="Describe el estado del paciente..."></textarea>
                </div>
                <div class="form-group">
                    <label>Estado / Ánimo</label>
                    <input type="text" name="estado_animo" placeholder="Ej: Estable, Mejorando, Alerta">
                </div>
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end;">
                    <button type="button" id="cancelar-nuevo-registro" class="btn-outline-login">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar registro</button>
                </div>
                <div id="registro-bitacora-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="registro-bitacora-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    document.getElementById('cancelar-nuevo-registro')?.addEventListener('click', () => { formContainer.innerHTML = ''; });

    document.getElementById('form-nuevo-registro')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const idPaciente = Number(fd.get('id_paciente'));
        const idPlantilla = fd.get('id_plantilla') ? Number(fd.get('id_plantilla')) : null;
        const notas = String(fd.get('notas') || '').trim();
        const estadoAnimo = String(fd.get('estado_animo') || '').trim();
        const errorDiv = document.getElementById('registro-bitacora-error');
        const successDiv = document.getElementById('registro-bitacora-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
        if (!idPaciente || !notas) {
            if (errorDiv) { errorDiv.textContent = 'Selecciona un paciente y escribe las notas.'; errorDiv.style.display = 'block'; }
            return;
        }
        const resp = await crearBitacoraRegistro(idPaciente, { notas, estado_animo: estadoAnimo, id_plantilla: idPlantilla });
        if (!resp.success) {
            if (errorDiv) { errorDiv.textContent = resp.message || 'Error al guardar el registro.'; errorDiv.style.display = 'block'; }
            return;
        }
        if (successDiv) { successDiv.textContent = 'Registro creado con éxito.'; successDiv.style.display = 'block'; }
        setTimeout(() => renderBitacoraSection(container), 500);
    });
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