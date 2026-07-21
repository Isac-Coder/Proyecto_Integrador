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
            <section class="main-content-column">

                <!-- KPI Cards -->
                <div class="caregiver-kpi-row">
                    <div class="kpi-card kpi-clickable" data-tipo="pacientes" title="Click para ver detalle"><i class="ti ti-users kpi-icon"></i><span class="kpi-value" id="kpi-pacientes">0</span><span class="kpi-label">Pacientes</span></div>
                    <div class="kpi-card kpi-clickable" data-tipo="medicamentos" title="Click para ver detalle"><i class="ti ti-pill kpi-icon"></i><span class="kpi-value" id="kpi-medicamentos">0</span><span class="kpi-label">Medicamentos</span></div>
                    <div class="kpi-card kpi-clickable" data-tipo="citas" title="Click para ver detalle"><i class="ti ti-calendar-event kpi-icon"></i><span class="kpi-value" id="kpi-citas">0</span><span class="kpi-label">Citas</span></div>
                    <div class="kpi-card kpi-clickable" data-tipo="registros" title="Click para ver detalle"><i class="ti ti-notes kpi-icon"></i><span class="kpi-value" id="kpi-registros">0</span><span class="kpi-label">Registros</span></div>
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
            </section>

            <aside class="right-content-column">
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
            </aside>
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

    const kpiPacientes = document.getElementById('kpi-pacientes');
    const kpiMedicamentos = document.getElementById('kpi-medicamentos');
    const kpiCitas = document.getElementById('kpi-citas');
    const kpiRegistros = document.getElementById('kpi-registros');

    let totalMedicamentos = 0;
    let totalCitas = 0;
    let totalRegistros = 0;
    let todasLasCitas = [];
    let todosLosMeds = [];
    let todosLosRegistros = [];
    let proximasCitasHtml = '';
    let ultimoRegistroHtml = '';
    let checklistData = [];
    let panelLateralHtml = '';

    if (kpiPacientes) kpiPacientes.textContent = pacientes.length;

    if (pacientes.length) {
        const pacientePrincipal = pacientes[0];

        // Hero metrics con datos reales
        const heroMetrics = document.getElementById('professional-hero-metrics');
        if (heroMetrics) {
            heroMetrics.innerHTML = `
                <div class="professional-metric-chip" title="Total pacientes">${pacientes.length} paciente${pacientes.length > 1 ? 's' : ''}</div>
                <div class="professional-metric-chip" title="Dirección">${pacientePrincipal.direccion || 'Sin dirección'}</div>
                <div class="professional-metric-chip" title="Cuidador">${pacientePrincipal.cuidador_nombre ? `Cuidador: ${pacientePrincipal.cuidador_nombre}` : 'Sin cuidador'}</div>
                <div class="professional-metric-chip" title="Estado general" style="background:${pacientePrincipal.nivel_alerta && pacientePrincipal.nivel_alerta.toLowerCase() !== 'bajo' && pacientePrincipal.nivel_alerta.toLowerCase() !== 'normal' ? '#fef2f2;color:#991b1b' : '#f0fdf4;color:#15803d'}">
                    ${pacientePrincipal.nivel_alerta || 'Estable'}
                </div>
            `;
        }

        const heroTitle = document.getElementById('professional-hero-title');
        const heroDesc = document.getElementById('professional-hero-description');
        if (heroTitle) heroTitle.textContent = `Seguimiento activo para ${pacientePrincipal.nombre || 'tu paciente'}`;
        if (heroDesc) heroDesc.textContent = `${pacientes.length} paciente${pacientes.length > 1 ? 's' : ''} vinculado${pacientes.length > 1 ? 's' : ''} a tu cuenta. Los datos se cargan desde el backend automáticamente.`;

        // Obtener datos agregados en paralelo
        const resultadosPacientes = await Promise.all(pacientes.map(async (p) => {
            const [meds, citas, registros] = await Promise.all([
                obtenerMedicamentosPaciente(p.id),
                obtenerCitasPaciente(p.id),
                obtenerBitacoraRegistros(p.id)
            ]);
            return { p, meds, citas, registros };
        }));

        for (const { p, meds, citas, registros } of resultadosPacientes) {
            meds.forEach(m => m._pacienteNombre = p.nombre);
            todosLosMeds.push(...meds);
            totalMedicamentos += meds.length;
            citas.forEach(c => { c._pacienteNombre = p.nombre; c.id_paciente = p.id; });
            todasLasCitas.push(...citas);
            totalCitas += citas.length;
            registros.forEach(r => { r._pacienteNombre = p.nombre; });
            todosLosRegistros.push(...registros);
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
                <div class="cita-item" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-light);">
                    <div>
                        <strong>${c._pacienteNombre || 'Paciente'}</strong>
                        <span style="display:block;font-size:0.82rem;color:var(--text-muted);">${c.motivo || 'Sin motivo'}</span>
                    </div>
                    <span style="color:var(--text-muted);font-size:0.82rem;white-space:nowrap;">${formatFechaCorta(c.fecha_hora)}</span>
                </div>
            `).join('');
        } else {
            proximasCitasHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">No hay próximas citas programadas.</p>';
        }

        // Último registro de bitácora
        todosLosRegistros.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
        if (todosLosRegistros.length) {
            const ultimo = todosLosRegistros[0];
            ultimoRegistroHtml = `
                <div style="padding:8px 0;">
                    <p style="margin-bottom:4px;">
                        <strong>${ultimo._pacienteNombre || 'Paciente'}</strong>
                        <span style="font-size:0.82rem;color:var(--text-muted);margin-left:8px;">${formatFechaCorta(ultimo.fecha_registro)}</span>
                    </p>
                    <p style="color:var(--text-primary);font-size:0.9rem;line-height:1.5;font-style:italic;background:#f9fafb;padding:8px 12px;border-radius:8px;">"${ultimo.notas || 'Sin notas'}"</p>
                    ${ultimo.estado_animo ? `<span style="font-size:0.75rem;padding:2px 10px;border-radius:20px;background:#f3f4f6;color:#374151;display:inline-block;margin-top:6px;">Estado: ${ultimo.estado_animo}</span>` : ''}
                </div>
            `;
        } else {
            ultimoRegistroHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">Aún no hay registros de bitácora.</p>';
        }

        // Checklist dinámico con datos reales
        if (pacientes.length > 0) checklistData.push(`${pacientes.length} paciente(s) asignado(s)`);
        if (totalMedicamentos > 0) checklistData.push(`${totalMedicamentos} medicamento(s) en tratamiento`);
        if (proximas.length > 0) checklistData.push(`${proximas.length} próxima(s) cita(s) programada(s)`);
        if (totalRegistros > 0) checklistData.push(`${totalRegistros} registro(s) de bitácora`);
        checklistData.push('Actualizar observaciones clínicas');

        // Panel lateral - Seguimiento del Plan de Cuidado con datos reales
        const pctMedicamentos = totalMedicamentos > 0 ? Math.min(Math.round((todosLosMeds.filter(m => m.estado === 'En tratamiento' || !m.estado).length / totalMedicamentos) * 100), 100) : 0;
        const pacientesConAlerta = pacientes.filter(p => p.nivel_alerta && p.nivel_alerta.toLowerCase() !== 'bajo' && p.nivel_alerta.toLowerCase() !== 'normal').length;
        const totalSenales = [];
        if (totalMedicamentos > 0) totalSenales.push('✓ Medicación en seguimiento');
        if (totalRegistros > 0) totalSenales.push('✓ Bitácora actualizada');
        if (pacientesConAlerta > 0) totalSenales.push(`⚠ ${pacientesConAlerta} alerta(s) activa(s)`);
        if (proximas.length > 0) totalSenales.push(`✓ ${proximas.length} cita(s) próxima(s)`);
        if (totalSenales.length === 0) totalSenales.push('📋 Sin datos aún');

        panelLateralHtml = `
            <div class="card tracking-card professional-side-panel">
                <h3>Seguimiento del Plan de Cuidado</h3>
                <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Progreso General</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width:${totalSenales.length > 0 ? Math.min(totalSenales.length * 20, 100) : 0}%;"></div>
                </div>
                <div class="progress-labels"><span>${totalSenales.length * 20 > 100 ? 100 : totalSenales.length * 20}% completado</span></div>
                <div class="professional-signal-list">
                    ${totalSenales.map(s => `<span class="professional-signal">${s}</span>`).join('')}
                </div>
            </div>

            <div class="card quick-actions-card">
                <h3>Acciones rápidas</h3>
                <ul class="actions-list">
                    <li class="action-item" data-target="medicacion">Emitir indicaciones <span class="arrow">›</span></li>
                    <li class="action-item" data-target="bitacora">Nuevo registro <span class="arrow">›</span></li>
                    <li class="action-item" data-target="citas">Gestionar citas <span class="arrow">›</span></li>
                </ul>
            </div>

            <div class="card reminder-card">
                <div class="rhead"><i class="ti ti-bell"></i> Recordatorio</div>
                <p>
                    ${totalRegistros > 0
                        ? `Tienes ${totalRegistros} registro(s) de bitácora. Revisa las observaciones enviadas por el cuidador.`
                        : 'Revisar observaciones enviadas por el cuidador.'}
                    ${pacientesConAlerta > 0
                        ? `<br><span style="color:#991b1b;font-weight:600;">⚠ ${pacientesConAlerta} paciente(s) con alerta activa.</span>`
                        : ''}
                </p>
            </div>
        `;

    } else {
        const heroMetrics = document.getElementById('professional-hero-metrics');
        if (heroMetrics) {
            heroMetrics.innerHTML = `
                <div class="professional-metric-chip">Sin pacientes aún</div>
                <div class="professional-metric-chip">Esperando vinculación</div>
            `;
        }
        const heroTitle = document.getElementById('professional-hero-title');
        const heroDesc = document.getElementById('professional-hero-description');
        if (heroTitle) heroTitle.textContent = 'Aún no tienes pacientes asignados';
        if (heroDesc) heroDesc.textContent = 'Cuando un paciente sea vinculado a tu cuenta, aparecerá aquí con su información y seguimiento.';

        proximasCitasHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">No hay pacientes asignados aún.</p>';
        ultimoRegistroHtml = '<p style="color:var(--text-muted);font-size:0.9rem;">Aún no hay registros de bitácora.</p>';
        checklistData = ['Revisar bitácora del paciente', 'Verificar medicación', 'Confirmar próxima cita', 'Actualizar observaciones'];

        panelLateralHtml = `
            <div class="card tracking-card professional-side-panel">
                <h3>Seguimiento del Plan de Cuidado</h3>
                <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">Progreso General</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width:0%;"></div>
                </div>
                <div class="progress-labels"><span>0% completado</span></div>
                <div class="professional-signal-list">
                    <span class="professional-signal">📋 Sin pacientes asignados</span>
                </div>
            </div>

            <div class="card quick-actions-card">
                <h3>Acciones rápidas</h3>
                <ul class="actions-list">
                    <li class="action-item" data-target="bitacora">Nuevo registro <span class="arrow">›</span></li>
                </ul>
            </div>

            <div class="card reminder-card">
                <div class="rhead"><i class="ti ti-bell"></i> Recordatorio</div>
                <p>Revisar observaciones enviadas por el cuidador cuando tengas pacientes asignados.</p>
            </div>
        `;
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
        const enTratamiento = todosLosMeds.filter(m => m.estado === 'En tratamiento' || !m.estado).length;
        const pct = totalMedicamentos > 0 ? Math.min(Math.round((enTratamiento / totalMedicamentos) * 100), 100) : 0;
        progressBar.style.width = `${pct}%`;
        progressText.textContent = `${pct}% en tratamiento activo`;
    }
    if (medListPreview) {
        medListPreview.innerHTML = totalMedicamentos > 0
            ? `<p style="color:var(--text-muted);font-size:0.85rem;">${totalMedicamentos} medicamento${totalMedicamentos > 1 ? 's' : ''} registrado${totalMedicamentos > 1 ? 's' : ''} · ${todosLosMeds.filter(m => m.estado === 'En tratamiento' || !m.estado).length} activo${todosLosMeds.filter(m => m.estado === 'En tratamiento' || !m.estado).length !== 1 ? 's' : ''}</p>`
            : '<p style="color:var(--text-muted);font-size:0.85rem;">Sin medicamentos registrados</p>';
    }

    // Render panel lateral dinámico
    const sidePanelContainer = document.querySelector('.right-content-column');
    if (sidePanelContainer) {
        sidePanelContainer.innerHTML = panelLateralHtml;
        // Reactivar eventos de acciones rápidas
        sidePanelContainer.querySelectorAll('.action-item').forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.target;
                const navItem = document.querySelector(`.sidebar-profesional .menu-item[data-view="${target}"]`);
                if (navItem) navItem.click();
            });
        });
    }

    // Inicializar KPIs interactivos
    initKpiClickEventsProfesional(pacientes, todosLosMeds, todasLasCitas, todosLosRegistros);

    // Gráfico simple de bitácora (7 días)
    renderChartBitacoraSimple(pacientes);
}

// === KPIs interactivos para profesional ===
function initKpiClickEventsProfesional(pacientes, todosLosMeds, todasLasCitas, todosLosRegistros) {
    // Omitir si no hay elementos kpi-clickable aún
    const kpiRow = document.querySelector('.caregiver-kpi-row');
    if (!kpiRow) return;

    kpiRow.querySelectorAll('.kpi-clickable').forEach(card => {
        card.addEventListener('click', function() {
            const tipo = this.dataset.tipo;
            let modalContent = '';

            switch (tipo) {
                case 'pacientes': {
                    if (!pacientes || pacientes.length === 0) {
                        modalContent = '<div class="card fade-in"><h3>Pacientes</h3><p style="color:var(--text-muted);">No hay pacientes registrados.</p></div>';
                        break;
                    }
                    const listItems = pacientes.map(p =>
                        `<li style="padding:8px 0; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
                            <span><strong>${p.nombre || 'Sin nombre'}</strong>${p.cuidador_nombre ? '<br><small style="color:#6b7280;">Cuidador: ' + p.cuidador_nombre + '</small>' : ''}</span>
                            <span style="font-size:0.75rem; padding:2px 8px; border-radius:20px; background:${p.nivel_alerta && p.nivel_alerta.toLowerCase() !== 'bajo' && p.nivel_alerta.toLowerCase() !== 'normal' ? '#fef2f2; color:#991b1b;' : '#f0fdf4; color:#15803d;'}">${p.nivel_alerta || 'Normal'}</span>
                        </li>`
                    ).join('');
                    modalContent = `<div class="card fade-in"><h3>Pacientes (${pacientes.length})</h3><ul style="list-style:none; padding:0; margin:0;">${listItems}</ul></div>`;
                    break;
                }
                case 'medicamentos': {
                    if (!todosLosMeds || todosLosMeds.length === 0) {
                        modalContent = '<div class="card fade-in"><h3>Medicamentos</h3><p style="color:var(--text-muted);">No hay medicamentos registrados.</p></div>';
                        break;
                    }
                    const medItems = todosLosMeds.map(m =>
                        `<div style="padding:8px 0; border-bottom:1px solid #f3f4f6;">
                            <strong>${m.nombre || m.nombre_medicamento || 'Medicamento'}</strong>
                            <span style="display:block; font-size:0.85rem; color:#6b7280;">${m._pacienteNombre || 'Paciente'} · Dosis: ${m.dosis} · ${m.frecuencia}</span>
                            <span style="font-size:0.75rem; color:${m.estado === 'En tratamiento' ? '#15803d' : m.estado === 'Suspendido' ? '#991b1b' : '#6b7280'};">${m.estado || 'En tratamiento'}</span>
                        </div>`
                    ).join('');
                    modalContent = `<div class="card fade-in"><h3>Medicamentos (${todosLosMeds.length})</h3>${medItems}</div>`;
                    break;
                }
                case 'citas': {
                    if (!todasLasCitas || todasLasCitas.length === 0) {
                        modalContent = '<div class="card fade-in"><h3>Citas</h3><p style="color:var(--text-muted);">No hay citas programadas.</p></div>';
                        break;
                    }
                    const citaItems = todasLasCitas.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)).slice(0, 10).map(c =>
                        `<div style="padding:8px 0; border-bottom:1px solid #f3f4f6;">
                            <strong>${c._pacienteNombre || 'Paciente'}</strong>
                            <span style="display:block; font-size:0.85rem; color:#6b7280;">
                                ${formatFechaCorta(c.fecha_hora)} · ${new Date(c.fecha_hora).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })}
                                ${c.lugar ? '· ' + c.lugar : ''}
                            </span>
                            <span style="font-size:0.8rem; color:#9ca3af;">${c.motivo || 'Sin motivo'} · ${c.estado || 'Agendada'}</span>
                        </div>`
                    ).join('');
                    modalContent = `<div class="card fade-in"><h3>Citas (${todasLasCitas.length})</h3>${citaItems}</div>`;
                    break;
                }
                case 'registros': {
                    if (!todosLosRegistros || todosLosRegistros.length === 0) {
                        modalContent = '<div class="card fade-in"><h3>Registros de Bitácora</h3><p style="color:var(--text-muted);">No hay registros de bitácora.</p></div>';
                        break;
                    }
                    const ultimosRegistros = [...todosLosRegistros]
                        .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
                        .slice(0, 10);
                    const regItems = ultimosRegistros.map(r =>
                        `<div style="padding:8px 0; border-bottom:1px solid #f3f4f6;">
                            <strong>${r._pacienteNombre || 'Paciente'}</strong>
                            <span style="display:block; font-size:0.82rem; color:#6b7280;">
                                ${formatFechaCorta(r.fecha_registro)} ${r.plantilla_nombre ? '· ' + r.plantilla_nombre : ''}
                            </span>
                            ${r.notas ? '<span style="font-size:0.8rem; color:#9ca3af; font-style:italic;">"' + r.notas.substring(0, 80) + (r.notas.length > 80 ? '..."' : '"') + '</span>' : ''}
                            ${r.estado_animo ? `<span style="font-size:0.7rem; padding:1px 8px; border-radius:12px; background:#f3f4f6; margin-left:6px;">${r.estado_animo}</span>` : ''}
                        </div>`
                    ).join('');
                    modalContent = `<div class="card fade-in"><h3>Registros de Bitácora (${todosLosRegistros.length})</h3><p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">Últimos ${ultimosRegistros.length} registros</p>${regItems}</div>`;
                    break;
                }
                default:
                    modalContent = '<div class="card fade-in"><p>Información no disponible.</p></div>';
            }

            openFloatingModal(modalContent);
        });
    });
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
                            cargarDashboardConDatosReales();
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

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

function parseFrecuenciaHoras(frecuencia) {
    const texto = String(frecuencia || '').toLowerCase();
    const horasMatch = texto.match(/(\d+)\s*(?:horas|hrs?|h)/);
    if (horasMatch) return Number(horasMatch[1]);
    if (/cada\s*(?:día|dia|diaria|diario|mañana|noche)/.test(texto)) return 24;
    return null;
}

function obtenerFechaInicioMedicacion(medicamento) {
    if (medicamento.fecha_registro) {
        const fecha = new Date(medicamento.fecha_registro);
        if (!isNaN(fecha)) return fecha;
    }
    if (medicamento.fecha_inicio) {
        const fecha = new Date(medicamento.fecha_inicio);
        if (!isNaN(fecha)) return fecha;
    }
    return null;
}

function generarEventosMedicacion(medicamento, pacienteNombre) {
    const inicio = obtenerFechaInicioMedicacion(medicamento);
    if (!inicio) return [];
    const intervaloHoras = parseFrecuenciaHoras(medicamento.frecuencia);
    const totalDosis = Number(medicamento.cantidad_dosis) || 0;
    const eventos = [];
    if (totalDosis <= 0) return eventos;
    let actual = new Date(inicio);
    for (let i = 0; i < totalDosis; i++) {
        eventos.push({
            fecha: new Date(actual),
            paciente: pacienteNombre,
            medicamento: medicamento.nombre || medicamento.nombre_medicamento || 'Medicamento',
            tipo: 'Medicación',
            estado: medicamento.estado || 'En tratamiento',
            detalle: 'Dosis ' + (i + 1) + '/' + totalDosis + ' · ' + (medicamento.dosis || '') + ' · Estado: ' + (medicamento.estado || 'En tratamiento')
        });
        if (intervaloHoras && intervaloHoras > 0) {
            actual = new Date(actual);
            actual.setHours(actual.getHours() + intervaloHoras);
        } else {
            actual = new Date(actual);
            actual.setDate(actual.getDate() + 1);
        }
    }
    return eventos;
}

function getIdUnico(e) {
    const d = new Date(e.fecha);
    const fechaKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    return e.tipo + '-' + (e.idOriginal || e.medicamento || '') + '-' + e.paciente + '-' + fechaKey;
}

// ============================================================
// SECCIÓN MEDICAMENTOS
// ============================================================

async function renderMedicamentosSection(container) {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);
    if (!pacientes.length) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados para gestionar medicamentos.</p></div>';
        return;
    }
    const pacienteOptions = pacientes.map(function(paciente) {
        return '<option value="' + paciente.id + '">' + paciente.nombre + '</option>';
    }).join('');
    container.innerHTML = `
        <div class="card fade-in section-hero-card" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                    <h3>Gestión de Medicamentos</h3>
                    <p>Revisa los tratamientos activos de tus pacientes.</p>
                </div>
                <div class="section-actions" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                    <div class="form-group-inline" style="display:flex; align-items:center; gap:6px;">
                        <label style="font-size:0.85rem;">Paciente:</label>
                        <select id="medicamento-paciente-select" style="padding:8px 12px; border-radius:8px; border:1px solid var(--border-subtle); background:var(--surface-card); color:var(--text-primary);">
                            ` + pacienteOptions + `
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div id="medicamento-list-area" class="card fade-in"></div>
    `;
    const selectPaciente = document.getElementById('medicamento-paciente-select');
    if (!selectPaciente) return;
    selectPaciente.addEventListener('change', async function() {
        await renderMedicamentoDetailProfesional(container, Number(selectPaciente.value));
    });
    await renderMedicamentoDetailProfesional(container, Number(selectPaciente.value) || pacientes[0].id);
}

async function renderMedicamentoDetailProfesional(container, idPaciente) {
    const medicamentoListArea = document.getElementById('medicamento-list-area');
    if (!medicamentoListArea) return;
    medicamentoListArea.innerHTML = '<div style="text-align:center;padding:16px;"><p style="color:var(--text-muted);">Cargando medicamentos...</p></div>';
    const medicamentos = await obtenerMedicamentosPaciente(idPaciente);
    const listHtml = medicamentos.length ? medicamentos.map(function(med) {
        const estadoColor = med.estado === 'En tratamiento' ? '#15803d' : (med.estado === 'Suspendido' ? '#991b1b' : '#6b7280');
        return '<div class="paciente-card medicamento-card" style="border:1px solid var(--border-subtle); border-radius:12px; padding:14px; margin-bottom:10px; background:var(--surface-card);">' +
            '<h4 style="margin:0 0 6px 0; color:var(--text-primary);">' + med.nombre + '</h4>' +
            '<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.85rem; color:var(--text-muted);">' +
                '<span><strong>Dosis:</strong> ' + med.dosis + '</span>' +
                '<span><strong>Frecuencia:</strong> ' + med.frecuencia + '</span>' +
                '<span><strong>Dosis total:</strong> ' + (med.cantidad_dosis || 'N/E') + '</span>' +
                '<span><strong>Estado:</strong> <span style="color:' + estadoColor + ';">' + (med.estado || 'En tratamiento') + '</span></span>' +
                '<span><strong>Inicio:</strong> ' + (med.fecha_inicio || 'N/E') + '</span>' +
                '<span><strong>Registrado:</strong> ' + (med.fecha_registro ? new Date(med.fecha_registro).toLocaleDateString('es-ES', { day:'2-digit', month:'short' }) : 'N/E') + '</span>' +
            '</div></div>';
    }).join('') : '<p style="color:var(--text-muted); text-align:center; padding:16px 0;">Aún no hay tratamientos registrados para este paciente.</p>';
    medicamentoListArea.innerHTML = '<h4>Medicamentos asociados</h4><div style="margin-top:12px;">' + listHtml + '</div>';
}

// ============================================================
// SECCIÓN CALENDARIO
// ============================================================

async function renderCalendarioSection(container) {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    const pacientes = await obtenerPacientes('profesional', emailProfesional);
    if (!pacientes.length) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados para mostrar el calendario.</p></div>';
        return;
    }
    const pacienteDatos = await Promise.all(pacientes.map(async function(paciente) {
        return {
            paciente: paciente.nombre,
            idPaciente: paciente.id,
            medicamentos: await obtenerMedicamentosPaciente(paciente.id),
            citas: await obtenerCitasPaciente(paciente.id)
        };
    }));
    var STORAGE_KEY = 'zoe_calendario_completados_' + (session?.email || 'anon');
    var eventosCompletados = new Set();
    try {
        var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        saved.forEach(function(id) { eventosCompletados.add(id); });
    } catch (e) {}
    function guardarCompletados() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...eventosCompletados])); } catch (e) {}
    }
        var eventos = pacienteDatos.reduce(function(lista, item) {
        // Solo se muestran eventos de tipo Cita (NO medicamentos)
        item.citas.forEach(function(cita) {
            var fecha = new Date(cita.fecha_hora);
            if (isNaN(fecha)) return;
            lista.push({
                fecha: fecha,
                paciente: item.paciente,
                tipo: 'Cita',
                idOriginal: cita.id,
                idPaciente: item.idPaciente,
                detalle: 'Cita: ' + (cita.motivo || 'Sin motivo') + ' · ' + (cita.lugar || 'Lugar no definido') + ' · Estado: ' + (cita.estado || 'Agendada')
            });
        });
        return lista;
    }, []);
    var mesActual = new Date().getMonth();
    var anioActual = new Date().getFullYear();
    function renderizarCalendario() {
        var mesNombre = new Date(anioActual, mesActual).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        var eventosDelMes = eventos.filter(function(e) {
            var f = new Date(e.fecha);
            return f.getMonth() === mesActual && f.getFullYear() === anioActual;
        });
        var primerDia = new Date(anioActual, mesActual, 1);
        var ultimoDia = new Date(anioActual, mesActual + 1, 0);
        var diaSemanaInicio = primerDia.getDay();
        var diasEnMes = ultimoDia.getDate();
        var hoy = new Date();
        var hoyStr = hoy.toDateString();
        var nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        var htmlDias = '<div class="cal-grid-dias" style="display:grid; grid-template-columns:repeat(7,1fr); gap:4px;">';
        nombresDias.forEach(function(n) {
            htmlDias += '<div style="text-align:center; font-size:0.78rem; font-weight:600; color:var(--text-muted); padding:6px 0;">' + n + '</div>';
        });
        for (var i = 0; i < diaSemanaInicio; i++) {
            htmlDias += '<div style="min-height:60px;"></div>';
        }
        for (var d = 1; d <= diasEnMes; d++) {
            var fechaDia = new Date(anioActual, mesActual, d);
            var eventosDelDia = eventosDelMes.filter(function(e) {
                var f = new Date(e.fecha);
                return f.getDate() === d && f.getMonth() === mesActual && f.getFullYear() === anioActual;
            });
            var esHoy = fechaDia.toDateString() === hoyStr;
            var estilo = 'min-height:60px; padding:4px; border-radius:8px; background:var(--surface-card); border:1px solid var(--border-subtle); position:relative; cursor:pointer;';
            if (esHoy) estilo += ' border-color:#d2967f; box-shadow:0 0 0 2px rgba(210,150,127,0.3);';
            htmlDias += '<div style="' + estilo + '" data-dia="' + d + '" data-mes="' + mesActual + '" data-anio="' + anioActual + '">';
            htmlDias += '<span style="font-size:0.8rem; font-weight:' + (esHoy ? '700' : '500') + '; color:' + (esHoy ? '#d2967f' : 'var(--text-primary)') + ';">' + d + '</span>';
            if (eventosDelDia.length > 0) {
                htmlDias += '<div style="margin-top:4px; display:flex; gap:3px; flex-wrap:wrap;">';
                var maxBurbujas = 3;
                eventosDelDia.slice(0, maxBurbujas).forEach(function(e) {
                    var completado = eventosCompletados.has(getIdUnico(e));
                    htmlDias += '<span style="width:8px; height:8px; border-radius:50%; background:' + (completado ? '#16a34a' : '#d2967f') + '; display:inline-block;"></span>';
                });
                if (eventosDelDia.length > maxBurbujas) {
                    htmlDias += '<span style="font-size:0.6rem; color:var(--text-muted);">+' + (eventosDelDia.length - maxBurbujas) + '</span>';
                }
                htmlDias += '</div>';
            }
            htmlDias += '</div>';
        }
        htmlDias += '</div>';
        var totalPendientes = eventosDelMes.filter(function(e) { return !eventosCompletados.has(getIdUnico(e)); }).length;
        var htmlContenido = '<div class="calendario-view fade-in">' +
            '<div class="card" style="margin-bottom:18px;"><div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;"><div><h3>Calendario de Monitoreo</h3><p>Horarios de medicación y citas programadas de tus pacientes.</p></div></div></div>' +
            '<div class="card" style="margin-bottom:18px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">' +
            '<button class="cal-btn-nav" id="cal-mes-ant" style="background:var(--surface-hover); border:none; border-radius:8px; padding:8px 14px; cursor:pointer; font-size:1.1rem;">&larr;</button>' +
            '<h4 style="text-transform:capitalize; margin:0;">' + mesNombre + '</h4>' +
            '<button class="cal-btn-nav" id="cal-mes-sig" style="background:var(--surface-hover); border:none; border-radius:8px; padding:8px 14px; cursor:pointer; font-size:1.1rem;">&rarr;</button>' +
            '</div>' + htmlDias + '</div>' +
            '<div class="card"><div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;"><h4 style="margin:0;">Eventos del mes</h4><span style="font-size:0.82rem; color:var(--text-muted); background:#f3f4f6; padding:4px 12px; border-radius:20px;">' + totalPendientes + ' pendientes</span></div>' +
            '<div id="cal-lista-eventos">' +
            (eventosDelMes.length > 0 ? eventosDelMes.sort(function(a, b) { return a.fecha - b.fecha; }).map(function(e) {
                var idUnico = getIdUnico(e);
                var completado = eventosCompletados.has(idUnico);
                var icono = e.tipo === 'Cita' ? '\ud83d\udcc5' : '\ud83d\udc8a';
                return '<div class="cal-evento-item" data-evento-id="' + idUnico + '" data-tipo="' + e.tipo + '" data-detalle="' + e.detalle + '" data-paciente="' + e.paciente + '" data-fecha="' + e.fecha.toISOString() + '" data-medicamento="' + (e.medicamento || '') + '" style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-subtle); cursor:pointer;' + (completado ? 'opacity:0.6;' : '') + '">' +
                    '<div style="flex:1;">' +
                        '<strong>' + e.paciente + '</strong>' +
                        '<span style="display:block; font-size:0.82rem; color:var(--text-muted);">' + (e.tipo === 'Cita' ? 'Cita' : e.medicamento) + ' · ' + e.fecha.toLocaleDateString('es-ES', { day:'2-digit', month:'short' }) + ' · ' + e.fecha.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' }) + '</span>' +
                        '<small style="color:#9ca3af;">' + e.detalle + '</small>' +
                    '</div>' +
                    '<span style="font-size:0.78rem; padding:3px 10px; border-radius:20px; background:' + (completado ? '#f0fdf4' : '#fefce8') + '; color:' + (completado ? '#15803d' : '#92400e') + ';">' + (completado ? '\u2713' : '\u25CB') + '</span>' +
                '</div>';
            }).join('') : '<p style="color:var(--text-muted); text-align:center; padding:16px 0;">No hay eventos este mes.</p>') +
            '</div></div></div>';
        container.innerHTML = htmlContenido;
        document.getElementById('cal-mes-ant')?.addEventListener('click', function() {
            mesActual--;
            if (mesActual < 0) { mesActual = 11; anioActual--; }
            renderizarCalendario();
        });
        document.getElementById('cal-mes-sig')?.addEventListener('click', function() {
            mesActual++;
            if (mesActual > 11) { mesActual = 0; anioActual++; }
            renderizarCalendario();
        });
        container.querySelectorAll('.cal-evento-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var idUnico = item.dataset.eventoId;
                var tipo = item.dataset.tipo;
                var paciente = item.dataset.paciente;
                var detalle = item.dataset.detalle;
                var fecha = new Date(item.dataset.fecha);
                var medicamento = item.dataset.medicamento;
                var completado = eventosCompletados.has(idUnico);
                var fechaStr = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
                var horaStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                var modalHtml = '<div class="card fade-in"><h3>' + (tipo === 'Cita' ? 'Cita médica' : 'Medicación') + '</h3>' +
                    '<div style="margin-bottom:8px;"><strong>Paciente</strong><br><span>' + paciente + '</span></div>' +
                    '<div style="margin-bottom:8px;"><strong>Fecha</strong><br><span>' + fechaStr + '</span></div>' +
                    '<div style="margin-bottom:8px;"><strong>Hora</strong><br><span>' + horaStr + '</span></div>' +
                    (tipo !== 'Cita' ? '<div style="margin-bottom:8px;"><strong>Medicamento</strong><br><span>' + medicamento + '</span></div>' : '') +
                    '<div style="margin-bottom:12px;"><strong>Detalle</strong><br><span>' + detalle + '</span></div>' +
                    '<div style="padding:12px 16px; border-radius:12px; background:' + (completado ? '#f0fdf4' : '#fefce8') + '; border:1px solid ' + (completado ? '#bbf7d0' : '#fde68a') + ';"><strong>' + (completado ? 'Completado' : 'Pendiente') + '</strong></div>' +
                    '<div style="display:flex; gap:12px; margin-top:18px; padding-top:18px; border-top:1px solid #eef1f0;">' +
                    (!completado ? '<button id="btn-marcar-completado" style="flex:1; padding:12px; background:#16a34a; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Marcar como completado</button>' : '') +
                    '<button id="btn-cerrar-modal-evento" style="flex:1; padding:12px; background:#f3f4f6; border:none; border-radius:8px; cursor:pointer;">Cerrar</button></div></div>';
                openFloatingModal(modalHtml);
                document.getElementById('btn-marcar-completado')?.addEventListener('click', function() {
                    eventosCompletados.add(idUnico);
                    guardarCompletados();
                    closeFloatingModal();
                    renderizarCalendario();
                });
                document.getElementById('btn-cerrar-modal-evento')?.addEventListener('click', closeFloatingModal);
            });
        });
    }
    renderizarCalendario();
}

// ============================================================
// SECCIÓN SOLICITUDES
// ============================================================

async function renderSolicitudesSection(container) {
    const session = obtenerSesionActiva();
    const emailProfesional = session?.email || '';
    var solicitudesPendientes = await obtenerSolicitudesPendientes(emailProfesional);
    var solicitudesEnviadas = await obtenerSolicitudesEnviadas(emailProfesional);
    var html = '<div class="card fade-in section-hero-card" style="margin-bottom:16px;"><div><h3>Solicitudes de Vinculación</h3><p>Gestiona las solicitudes de vinculación de cuidadores y pacientes.</p></div></div>';
    // Solicitudes recibidas
    html += '<div class="card fade-in" style="margin-bottom:16px;"><h4>Solicitudes Recibidas</h4><p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Cuidadores que solicitan vincular pacientes a tu cuenta profesional.</p><div id="solicitudes-recibidas-list">';
    if (solicitudesPendientes && solicitudesPendientes.length > 0) {
        solicitudesPendientes.forEach(function(s) {
            html += '<div class="card" style="margin-bottom:10px; padding:16px; border:1px solid var(--border-subtle); border-radius:12px; background:var(--surface-card);">' +
                '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">' +
                    '<div style="flex:1;">' +
                        '<strong style="font-size:1rem;">' + (s.paciente_nombre || 'Paciente') + '</strong>' +
                        '<p style="font-size:0.85rem; color:var(--text-muted); margin:4px 0;">Solicitante: ' + (s.email_solicitante || 'Cuidador') + ' (Cuidador)</p>' +
                        '<p style="font-size:0.82rem; color:#9ca3af; margin:4px 0;">' + (s.mensaje || 'Solicitud de vinculación de paciente.') + '</p>' +
                        '<span style="font-size:0.75rem; color:var(--text-muted);">' + (s.fecha_solicitud ? new Date(s.fecha_solicitud).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' }) : '') + '</span>' +
                    '</div>' +
                    '<div style="display:flex; gap:8px; flex-shrink:0;">' +
                        '<button class="btn-solicitud-aceptar" data-solicitud-id="' + s.id + '" data-id-paciente="' + s.id_paciente + '" style="padding:8px 16px; background:#16a34a; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Aceptar</button>' +
                        '<button class="btn-solicitud-rechazar" data-solicitud-id="' + s.id + '" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Rechazar</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        });
    } else {
        html += '<p style="color:var(--text-muted); padding:12px 0;">No hay solicitudes pendientes.</p>';
    }
    html += '</div></div>';
    // Solicitudes enviadas
    html += '<div class="card fade-in"><h4>Solicitudes Enviadas</h4><p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Solicitudes que has enviado para relacionar pacientes.</p><div id="solicitudes-enviadas-list">';
    if (solicitudesEnviadas && solicitudesEnviadas.length > 0) {
        solicitudesEnviadas.forEach(function(s) {
            var estadoBg = s.estado === 'aceptada' ? '#f0fdf4; color:#15803d;' : (s.estado === 'rechazada' ? '#fef2f2; color:#991b1b;' : '#fefce8; color:#92400e;');
            html += '<div style="padding:12px 0; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">' +
                '<div><strong>' + (s.paciente_nombre || 'Paciente') + '</strong><span style="display:block; font-size:0.82rem; color:var(--text-muted);">Destinatario: ' + (s.email_destinatario || 'N/E') + '</span></div>' +
                '<span style="font-size:0.78rem; padding:4px 12px; border-radius:20px; background:' + estadoBg + '">' + (s.estado || 'Pendiente') + '</span>' +
            '</div>';
        });
    } else {
        html += '<p style="color:var(--text-muted); padding:12px 0;">No has enviado solicitudes.</p>';
    }
    html += '</div></div>';
    html += '<div id="solicitudes-feedback" style="margin-top:12px;"></div>';
    container.innerHTML = html;
    // Eventos Aceptar
    container.querySelectorAll('.btn-solicitud-aceptar').forEach(function(btn) {
        btn.addEventListener('click', async function() {
            var solicitudId = Number(btn.dataset.solicitudId);
            var idPaciente = Number(btn.dataset.idPaciente);
            var feedback = document.getElementById('solicitudes-feedback');
            if (!solicitudId || !idPaciente) return;
            btn.disabled = true;
            btn.textContent = 'Aceptando...';
            var resp = await aceptarSolicitudVinculacion(solicitudId, idPaciente, emailProfesional);
            if (feedback) {
                if (resp.success) {
                    feedback.innerHTML = '<div style="padding:12px 16px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; color:#15803d; font-weight:600;">Solicitud aceptada con éxito.</div>';
                } else {
                    feedback.innerHTML = '<div style="padding:12px 16px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; color:#991b1b;">' + (resp.message || 'Error al aceptar la solicitud.') + '</div>';
                }
            }
            setTimeout(function() { renderSolicitudesSection(container); }, 1000);
        });
    });
    // Eventos Rechazar
    container.querySelectorAll('.btn-solicitud-rechazar').forEach(function(btn) {
        btn.addEventListener('click', async function() {
            var solicitudId = Number(btn.dataset.solicitudId);
            var feedback = document.getElementById('solicitudes-feedback');
            if (!solicitudId) return;
            btn.disabled = true;
            btn.textContent = 'Rechazando...';
            var resp = await rechazarSolicitudVinculacion(solicitudId);
            if (feedback) {
                if (resp.success) {
                    feedback.innerHTML = '<div style="padding:12px 16px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; color:#991b1b; font-weight:600;">Solicitud rechazada.</div>';
                } else {
                    feedback.innerHTML = '<div style="padding:12px 16px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; color:#991b1b;">' + (resp.message || 'Error al rechazar la solicitud.') + '</div>';
                }
            }
            setTimeout(function() { renderSolicitudesSection(container); }, 1000);
        });
    });
}