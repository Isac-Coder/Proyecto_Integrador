// src/views/cuidadorView.js
import { obtenerDatosSeccion, obtenerPacientes, obtenerProfesionales, crearPaciente, obtenerPacienteDetalle, actualizarPaciente, obtenerBitacoraPlantillas, crearBitacoraPlantilla, obtenerBitacoraRegistros, crearBitacoraRegistro, obtenerMedicamentosPaciente, crearMedicamentoPaciente, actualizarMedicamentoPaciente, obtenerCitasPaciente, crearCitaPaciente, actualizarCitaPaciente, eliminarCitaPaciente, crearSolicitudVinculacion, obtenerSolicitudesEnviadas } from '../services/data.service.js';
import { cerrarSesion, obtenerSesionActiva } from '../services/auth.services.js';

export function cuidadorView() {
    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/styles/styles.css';
        document.head.appendChild(styleLink);
    }

        const estructuraCuidadorBase = `
            <div class="dashboard-grid fade-in">

                <section class="main-content-column">

                    <div class="card caregiver-hero-card">
                        <div style="display:flex; align-items:flex-start; gap:16px;">
                            <div class="caregiver-hero-icon">
                                <i class="ti ti-users"></i>
                            </div>
                            <div>
                                <span class="caregiver-pill">Tu rol de cuidado hoy</span>
                                <h3 id="caregiver-hero-title">Acompanas a tu paciente con calma, observacion y carino</h3>
                                <p id="caregiver-hero-description">Tu trabajo diario ayuda a mantener la rutina, prevenir riesgos y dar tranquilidad a la familia. Cada registro cuenta para cuidar mejor.</p>
                            </div>
                        </div>
                        <div class="caregiver-hero-meta">
                            <div class="caregiver-highlight">
                                <strong>Proximo turno</strong>
                                <span id="caregiver-next-turn">Cargando informacion...</span>
                            </div>
                            <div class="caregiver-highlight">
                                <strong>Estado general</strong>
                                <span id="caregiver-status">Esperando datos del paciente</span>
                            </div>
                        </div>
                    </div>

                                        <div id="caregiver-kpi-row" class="caregiver-kpi-row">
                        <div class="kpi-card kpi-clickable" data-tipo="pacientes" title="Click para ver detalle"><i class="ti ti-users kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Pacientes</span></div>
                        <div class="kpi-card kpi-clickable" data-tipo="medicamentos" title="Click para ver detalle"><i class="ti ti-pill kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Medicamentos</span></div>
                        <div class="kpi-card kpi-clickable" data-tipo="citas" title="Click para ver detalle"><i class="ti ti-calendar-event kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Citas hoy</span></div>
                        <div class="kpi-card kpi-clickable" data-tipo="registros" title="Click para ver detalle"><i class="ti ti-notes kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Registros</span></div>
                    </div>

                    <div id="caregiver-dashboard-summary" class="card caregiver-dashboard-summary"></div>

                                        <div class="card">
                                            <div class="section-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                                                <h3><i class="ti ti-chart-line" style="margin-right:8px;"></i>Graficos de Bitacora</h3>
                                                <div class="form-group-inline" style="display:flex; align-items:center; gap:6px;">
                                                    <label style="font-size:0.8rem; font-weight:600;">Paciente:</label>
                                                    <select id="vitals-paciente-select" class="form-input" style="font-size:0.8rem; padding:4px 8px;">
                                                        <option value="">Cargando...</option>
                                                    </select>
                                                    <label style="font-size:0.8rem; font-weight:600;">Plantilla:</label>
                                                    <select id="vitals-plantilla-select" class="form-input" style="font-size:0.8rem; padding:4px 8px;">
                                                        <option value="">Sin plantillas</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div id="caregiver-vitals-table-container">
                                                <p style="color:var(--text-muted); padding:8px 0;">Selecciona un paciente y una plantilla de bitacora para visualizar los datos en graficos.</p>
                                            </div>
                                        </div>

                    <div class="caregiver-grid">
                        <div class="card caregiver-panel">
                            <h4><i class="ti ti-checklist" style="margin-right:8px;"></i>Checklist de apoyo diario</h4>
                            <ul id="caregiver-checklist-list" class="caregiver-checklist">
                                <li><span>&#10003;</span>Medicacion de la manana registrada correctamente</li>
                                <li><span>&#10003;</span>Ingreso de liquidos y alimentacion revisado</li>
                                <li><span>&#10003;</span>Observaciones clinicas actualizadas</li>
                            </ul>
                        </div>

                        <div class="card caregiver-panel">
                            <h4><i class="ti ti-droplet" style="margin-right:8px;"></i>Recordatorio de cuidado</h4>
                            <div class="caregiver-tip">
                                <i class="ti ti-droplet"></i>
                                <p>Revisa la hidratacion, mantén la rutina y comunica cualquier cambio en la respiracion o energia.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <aside class="right-content-column">

                    <div class="card">
                        <h3><i class="ti ti-pill" style="margin-right:8px;"></i>Medicamentos del Turno</h3>
                        <p style="font-size: 0.85rem; color: #6a7a77; margin-bottom: 8px;">Progreso de suministro diario</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="caregiver-meds-progress" style="width: 0%;"></div>
                        </div>
                        <div class="progress-labels">
                            <span id="caregiver-meds-label">Cargando...</span>
                        </div>
                        <p id="caregiver-meds-subtitle" style="font-size:0.82rem; color:var(--text-muted); margin-top:6px;"></p>
                    </div>

                    <div class="card">
                        <h3><i class="ti ti-calendar-event" style="margin-right:8px;"></i>Proximas citas</h3>
                        <div id="caregiver-next-citas-content">
                            <p style="color: #5f6e6b; line-height: 1.6;">Cargando...</p>
                        </div>
                    </div>

                    <div class="card" id="caregiver-enfoque-card">
                        <h3><i class="ti ti-notes" style="margin-right:8px;"></i>Ultimo registro de bitacora</h3>
                        <div id="caregiver-enfoque-content">
                            <p style="color: #5f6e6b; line-height: 1.6;">Cargando...</p>
                        </div>
                    </div>

                    <div class="card caregiver-register-meds-card">
                        <h3><i class="ti ti-plus" style="margin-right:8px;"></i>Registrar Medicamento</h3>
                        <p style="font-size: 0.85rem; color: #6a7a77; margin-bottom: 12px;">Agrega un nuevo medicamento al tratamiento de un paciente</p>
                        <div id="caregiver-register-meds-form">
                            <div class="form-group" style="margin-bottom:10px;">
                                <label>Selecciona un paciente</label>
                                <select id="caregiver-register-paciente-select" class="form-input">
                                    <option value="">Cargando pacientes...</option>
                                </select>
                            </div>
                            <button id="btn-ir-a-registrar-medicamento" class="btn btn-primary" style="width:100%;">
                                <i class="ti ti-pill" style="margin-right:6px;"></i>Ir a Registrar Medicamento
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        `;

    setTimeout(() => {
        initCuidadorEvents(estructuraCuidadorBase);
        initLogoutEvents();
        actualizarIndicadoresDeNotificacion();
        cargarContenidoDashboardCuidador();
    }, 0);

    // Activamos la clase layout-cuidador e inyectamos el botón hamburguesa con id="hamburguesa-toggle"
    return `
        <div class="dashboard-layout layout-cuidador">
            <aside class="sidebar sidebar-cuidador">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Inicio</a>
                    <a href="#" class="menu-item" data-view="pacientes"><i class="ti ti-users"></i> Mis Pacientes <span class="notification-badge"></span></a>
                    <a href="#" class="menu-item" data-view="bitacora"><i class="ti ti-notes"></i> Bitácora Diaria</a>
                    <a href="#" class="menu-item" data-view="citas"><i class="ti ti-calendar-event"></i> Citas <span class="notification-badge"></span></a>
                    <a href="#" class="menu-item" data-view="medicamentos"><i class="ti ti-pill"></i> Medicamentos</a>
                    <a href="#" class="menu-item" data-view="calendario"><i class="ti ti-calendar"></i> Calendario</a>
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
                        <h2 id="header-cuidador-nombre">Hola, cargando...</h2>
                        <span class="current-date" id="header-cuidador-fecha"></span>
                    </div>
                    <div class="header-actions-group">
                                                <div class="header-search">
                            <i class="ti ti-search" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:1rem;pointer-events:none;z-index:1;"></i>
                            <input type="text" placeholder="Buscar pacientes, bitácora..." style="padding-left:44px;">
                        </div>
                        <div class="avatar" id="header-cuidador-avatar">CU</div>
                    </div>
                </header>

                <div id="cuidador-content-area">
                    ${estructuraCuidadorBase}
                </div>
            </div>
        </div>
    `;
}

function populateRegisterMedsSelect(pacientes) {
    const select = document.getElementById('caregiver-register-paciente-select');
    if (!select) return;
    if (!pacientes || pacientes.length === 0) {
        select.innerHTML = '<option value="">Sin pacientes asignados</option>';
        return;
    }
    select.innerHTML = pacientes.map(p =>
        `<option value="${p.id}">${p.nombre || 'Paciente sin nombre'}</option>`
    ).join('');
}

function initDashboardMedsRedirect() {
    const btn = document.getElementById('btn-ir-a-registrar-medicamento');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const select = document.getElementById('caregiver-register-paciente-select');
        if (!select) return;
        const idPaciente = select.value;
        if (!idPaciente) {
            alert('Selecciona un paciente primero.');
            return;
        }
        // Navegar a la vista de medicamentos
        const navItem = document.querySelector('.sidebar-cuidador .menu-item[data-view="medicamentos"]');
        if (navItem) navItem.click();
    });
}

async function cargarContenidoDashboardCuidador() {
    const session = obtenerSesionActiva();
    const emailCuidador = session?.email || '';
    const nombreCuidador = session?.nombre || session?.email || 'Cuidador';
    const pacientes = await obtenerPacientes('cuidador', emailCuidador);

    // === HEADER DINÁMICO ===
    const headerNombre = document.getElementById('header-cuidador-nombre');
    if (headerNombre) headerNombre.textContent = `Hola, ${nombreCuidador}`;

    const headerFecha = document.getElementById('header-cuidador-fecha');
    if (headerFecha) {
        const ahora = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        headerFecha.textContent = ahora.toLocaleDateString('es-ES', opciones);
    }

    const avatar = document.getElementById('header-cuidador-avatar');
    if (avatar) {
        const iniciales = nombreCuidador.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        avatar.textContent = iniciales || 'CU';
    }

    // === HERO Y LISTA DE PACIENTES ===
    const heroTitle = document.getElementById('caregiver-hero-title');
    const heroDescription = document.getElementById('caregiver-hero-description');
    const nextTurn = document.getElementById('caregiver-next-turn');
    const status = document.getElementById('caregiver-status');
    const summaryContainer = document.getElementById('caregiver-dashboard-summary');
    const kpiRow = document.getElementById('caregiver-kpi-row');
        const checklistList = document.getElementById('caregiver-checklist-list');
    const medsProgress = document.getElementById('caregiver-meds-progress');
    const medsLabel = document.getElementById('caregiver-meds-label');
    const medsSubtitle = document.getElementById('caregiver-meds-subtitle');
    const citasContent = document.getElementById('caregiver-next-citas-content');

        // Poblar el select de "Registrar Medicamento" y activar el boton
    populateRegisterMedsSelect(pacientes);
    initDashboardMedsRedirect();

    if (pacientes.length) {
        const pacientePrincipal = pacientes[0];

        // Hero
        if (heroTitle) heroTitle.textContent = `Acompañas a ${pacientePrincipal.nombre || 'tu paciente'} con calma y seguimiento`;
        if (heroDescription) heroDescription.textContent = `Tienes ${pacientes.length} paciente${pacientes.length > 1 ? 's' : ''} bajo tu cuidado. Los datos se cargan desde el sistema.`;
        if (nextTurn) nextTurn.textContent = pacientePrincipal.direccion ? `Revisión · ${pacientePrincipal.direccion}` : 'Revisión programada';
        if (status) status.textContent = pacientePrincipal.profesional_nombre ? `Con ${pacientePrincipal.profesional_nombre}` : 'Esperando profesional';

        // Lista resumen de pacientes
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <h3>Pacientes bajo tu cuidado</h3>
                <ul class="caregiver-patient-list">
                    ${pacientes.map((paciente) => `<li><strong>${paciente.nombre || 'Paciente sin nombre'}</strong>${paciente.profesional_nombre ? ` · Médico: ${paciente.profesional_nombre}` : ''}${paciente.nivel_alerta ? ` · Alerta: ${paciente.nivel_alerta}` : ''}</li>`).join('')}
                </ul>
            `;
        }

                // === Cargar medicamentos, citas y bitácora de TODOS los pacientes (PARALELO) ===
        const todosLosMeds = [];
        const todasLasCitas = [];
        const todasLasBitacoras = [];

        const resultadosPacientes = await Promise.all(pacientes.map(async (paciente) => {
            const [medicamentos, citas, registros] = await Promise.all([
                obtenerMedicamentosPaciente(paciente.id),
                obtenerCitasPaciente(paciente.id),
                obtenerBitacoraRegistros(paciente.id)
            ]);
            return { paciente, medicamentos, citas, registros };
        }));

        for (const { paciente, medicamentos, citas, registros } of resultadosPacientes) {
            medicamentos.forEach(m => m._pacienteNombre = paciente.nombre);
            todosLosMeds.push(...medicamentos);
            citas.forEach(c => c._pacienteNombre = paciente.nombre);
            todasLasCitas.push(...citas);
            registros.forEach(r => r._pacienteNombre = paciente.nombre);
            todasLasBitacoras.push(...registros);
        }

                // === KPIs dinámicos ===
        if (kpiRow) {
            const totalMeds = todosLosMeds.length;
            const citasHoy = todasLasCitas.filter(c => {
                const fecha = new Date(c.fecha_hora);
                const hoy = new Date();
                return fecha.toDateString() === hoy.toDateString();
            }).length;
            const totalRegistros = todasLasBitacoras.length;

                                                kpiRow.innerHTML = `
                <div class="kpi-card kpi-clickable" data-tipo="pacientes" title="Click para ver detalle"><i class="ti ti-users kpi-icon"></i><span class="kpi-value">${pacientes.length}</span><span class="kpi-label">Pacientes</span></div>
                <div class="kpi-card kpi-clickable" data-tipo="medicamentos" title="Click para ver detalle"><i class="ti ti-pill kpi-icon"></i><span class="kpi-value">${totalMeds}</span><span class="kpi-label">Medicamentos</span></div>
                <div class="kpi-card kpi-clickable" data-tipo="citas" title="Click para ver detalle"><i class="ti ti-calendar-event kpi-icon"></i><span class="kpi-value">${citasHoy}</span><span class="kpi-label">Citas hoy</span></div>
                <div class="kpi-card kpi-clickable" data-tipo="registros" title="Click para ver detalle"><i class="ti ti-notes kpi-icon"></i><span class="kpi-value">${totalRegistros}</span><span class="kpi-label">Registros</span></div>
            `;
        }

        // Inicializar eventos click en los KPIs
        initKpiClickEvents(pacientes, todosLosMeds, todasLasCitas, todasLasBitacoras);

        // === Checklist dinámico ===
        if (checklistList) {
            const items = [];
            if (pacientes.length > 0) items.push(`<li><span>✓</span>${pacientes.length} paciente(s) asignado(s)</li>`);
            if (todosLosMeds.length > 0) items.push(`<li><span>✓</span>${todosLosMeds.length} medicamento(s) registrado(s)</li>`);
            if (todasLasCitas.length > 0) items.push(`<li><span>✓</span>${todasLasCitas.length} cita(s) programada(s)</li>`);
            if (todasLasBitacoras.length > 0) items.push(`<li><span>✓</span>${todasLasBitacoras.length} registro(s) de bitácora</li>`);
            items.push('<li><span>&#10003;</span>Revisa hidratacion, rutina y cambios en respiracion o energia</li>');
            checklistList.innerHTML = items.join('');
        }

                                // === Graficos de bitacora seleccionable por paciente y plantilla ===
        initBitacoraGraficos(pacientes);

        // === Barra de progreso de medicamentos ===
        // === Barra de progreso de medicamentos ===
        if (todosLosMeds.length > 0 && medsProgress && medsLabel && medsSubtitle) {
            const activos = todosLosMeds.filter(m => m.estado === 'En tratamiento' || !m.estado);
            const pct = Math.min((activos.length / todosLosMeds.length) * 100, 100);

            medsProgress.style.width = `${pct}%`;
            medsLabel.textContent = `${activos.length} de ${todosLosMeds.length} en tratamiento activo`;
            medsSubtitle.textContent = `${activos.length} medicamento(s) activo(s) de ${pacientes.length} paciente(s)`;
        } else if (medsLabel) {
            medsLabel.textContent = 'Sin medicamentos registrados';
            if (medsSubtitle) medsSubtitle.textContent = 'Registra medicacion desde la seccion Medicamentos';
        }

                // === Próximas citas ===
        if (citasContent) {
            const ahora = new Date();
            const proximas = todasLasCitas
                .filter(c => new Date(c.fecha_hora) > ahora)
                .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
                .slice(0, 3);

            if (proximas.length > 0) {
                citasContent.innerHTML = proximas.map(c => `
                    <div style="margin-bottom:10px; padding:8px 0; border-bottom:1px solid #e5e7eb;">
                        <strong style="color:#1f2937;">${c._pacienteNombre || 'Paciente'}</strong>
                        <p style="font-size:0.85rem; color:#6b7280; margin:2px 0;">
                            ${new Date(c.fecha_hora).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' })} ·
                            ${new Date(c.fecha_hora).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })}
                        </p>
                        <p style="font-size:0.8rem; color:#9ca3af;">${c.motivo || c.estado || 'Sin detalles'}</p>
                    </div>
                `).join('');
            } else {
                citasContent.innerHTML = '<p style="color: #5f6e6b; line-height: 1.6;">No hay próximas citas programadas.</p>';
            }
        }

        // === Último registro de bitácora (reemplaza "Enfoque del día") ===
        const enfoqueContent = document.getElementById('caregiver-enfoque-content');
        if (enfoqueContent && todasLasBitacoras.length > 0) {
            const ultimoRegistro = todasLasBitacoras.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))[0];
            const fecha = new Date(ultimoRegistro.fecha_registro).toLocaleDateString('es-ES', { day:'2-digit', month:'long', hour:'2-digit', minute:'2-digit' });

            let notasHtml = '';
            if (ultimoRegistro.notas) {
                notasHtml = `<p style="color:#5f6e6b; line-height:1.6; margin-top:8px; font-size:0.9rem;">"${ultimoRegistro.notas}"</p>`;
            }

            enfoqueContent.innerHTML = `
                <p style="color:#6a7a77; font-size:0.82rem; margin-bottom:4px;">
                    ${ultimoRegistro._pacienteNombre || 'Paciente'} · ${fecha}
                </p>
                ${notasHtml || '<p style="color:#5f6e6b; line-height:1.6;">Sin notas adicionales en el último registro.</p>'}
            `;
        } else if (enfoqueContent) {
            enfoqueContent.innerHTML = '<p style="color: #5f6e6b; line-height: 1.6;">Completa registros en la bitácora para verlos reflejados aquí.</p>';
        }

    } else {
        // Sin pacientes
        if (heroTitle) heroTitle.textContent = 'Aún no tienes pacientes asignados';
        if (heroDescription) heroDescription.textContent = 'Cuando un paciente sea creado y vinculado a tu perfil, aparecerá aquí con su información y seguimiento.';
        if (nextTurn) nextTurn.textContent = 'Sin pacientes aún';
        if (status) status.textContent = 'Esperando información';
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <h3>Pacientes bajo tu cuidado</h3>
                <p style="color:var(--text-muted); margin-top:8px;">Aún no hay pacientes relacionados con tu cuenta. El contenido aparecerá automáticamente cuando el backend registre uno.</p>
            `;
        }
        if (kpiRow) {
                                                                                                kpiRow.innerHTML = `
                <div class="kpi-card kpi-clickable" data-tipo="pacientes" title="Click para ver detalle"><i class="ti ti-users kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Pacientes</span></div>
                <div class="kpi-card kpi-clickable" data-tipo="medicamentos" title="Click para ver detalle"><i class="ti ti-pill kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Medicamentos</span></div>
                <div class="kpi-card kpi-clickable" data-tipo="citas" title="Click para ver detalle"><i class="ti ti-calendar-event kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Citas hoy</span></div>
                <div class="kpi-card kpi-clickable" data-tipo="registros" title="Click para ver detalle"><i class="ti ti-notes kpi-icon"></i><span class="kpi-value">0</span><span class="kpi-label">Registros</span></div>
            `;
        }
                if (checklistList) {
            checklistList.innerHTML = '<li><span>✓</span>Esperando asignación de pacientes...</li>';
        }

        // Inicializar eventos click en los KPIs (aunque esten vacios)
        initKpiClickEvents(pacientes, [], [], []);

                const vitalsTableEmpty = document.getElementById('caregiver-vitals-table-container');
                if (vitalsTableEmpty) {
                    vitalsTableEmpty.innerHTML = '<p style="color:var(--text-muted); padding:8px 0;">Sin pacientes asignados. Los datos apareceran cuando haya pacientes vinculados.</p>';
                }
                if (medsLabel) medsLabel.textContent = 'Sin pacientes asignados';
        if (citasContent) citasContent.innerHTML = '<p style="color: #5f6e6b; line-height: 1.6;">Sin pacientes asignados.</p>';
        const enfoqueEmpty = document.getElementById('caregiver-enfoque-content');
        if (enfoqueEmpty) enfoqueEmpty.innerHTML = '<p style="color: #5f6e6b; line-height: 1.6;">Esperando datos del paciente...</p>';
    }
}

// === KPIs interactivos: abrir modal con detalle al hacer click ===
function initKpiClickEvents(pacientes, todosLosMeds, todasLasCitas, todasLasBitacoras) {
    const kpiRow = document.getElementById('caregiver-kpi-row');
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
                            <span><strong>${p.nombre || 'Sin nombre'}</strong>${p.profesional_nombre ? '<br><small style="color:#6b7280;">Medico: ' + p.profesional_nombre + '</small>' : ''}</span>
                            <span style="font-size:0.75rem; padding:2px 8px; border-radius:20px; background:${p.nivel_alerta && p.nivel_alerta.toLowerCase() !== 'bajo' && p.nivel_alerta.toLowerCase() !== 'normal' ? '#fef2f2; color:#991b1b;' : '#f0fdf4; color:#15803d;'};}">${p.nivel_alerta || 'Normal'}</span>
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
                        modalContent = '<div class="card fade-in"><h3>Citas hoy</h3><p style="color:var(--text-muted);">No hay citas programadas para hoy.</p></div>';
                        break;
                    }
                    const hoy = new Date();
                    const citasHoy = todasLasCitas.filter(c => {
                        const fecha = new Date(c.fecha_hora);
                        return fecha.toDateString() === hoy.toDateString();
                    });
                    if (citasHoy.length === 0) {
                        modalContent = '<div class="card fade-in"><h3>Citas hoy</h3><p style="color:var(--text-muted);">No hay citas programadas para hoy.</p></div>';
                        break;
                    }
                    const citaItems = citasHoy.map(c =>
                        `<div style="padding:8px 0; border-bottom:1px solid #f3f4f6;">
                            <strong>${c._pacienteNombre || 'Paciente'}</strong>
                            <span style="display:block; font-size:0.85rem; color:#6b7280;">
                                ${new Date(c.fecha_hora).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })} 
                                ${c.lugar ? '· ' + c.lugar : ''}
                            </span>
                            <span style="font-size:0.8rem; color:#9ca3af;">${c.motivo || 'Sin motivo'} · ${c.estado || 'Agendada'}</span>
                        </div>`
                    ).join('');
                    modalContent = `<div class="card fade-in"><h3>Citas de hoy (${citasHoy.length})</h3>${citaItems}</div>`;
                    break;
                }
                case 'registros': {
                    if (!todasLasBitacoras || todasLasBitacoras.length === 0) {
                        modalContent = '<div class="card fade-in"><h3>Registros de Bitacora</h3><p style="color:var(--text-muted);">No hay registros de bitacora.</p></div>';
                        break;
                    }
                    const ultimosRegistros = [...todasLasBitacoras]
                        .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
                        .slice(0, 10);
                    const regItems = ultimosRegistros.map(r =>
                        `<div style="padding:8px 0; border-bottom:1px solid #f3f4f6;">
                            <strong>${r._pacienteNombre || 'Paciente'}</strong>
                            <span style="display:block; font-size:0.82rem; color:#6b7280;">
                                ${new Date(r.fecha_registro).toLocaleString('es-ES', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })} 
                                ${r.plantilla_nombre ? '· ' + r.plantilla_nombre : ''}
                            </span>
                            ${r.notas ? '<span style="font-size:0.8rem; color:#9ca3af; font-style:italic;">"' + r.notas.substring(0, 80) + (r.notas.length > 80 ? '..."' : '"') + '</span>' : ''}
                        </div>`
                    ).join('');
                    modalContent = `<div class="card fade-in"><h3>Registros de Bitacora (${todasLasBitacoras.length})</h3><p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">Ultimos ${ultimosRegistros.length} registros</p>${regItems}</div>`;
                    break;
                }
                default:
                    modalContent = '<div class="card fade-in"><p>Informacion no disponible.</p></div>';
            }

            openFloatingModal(modalContent);
        });
    });
}

// === Graficos de Bitacora: seleccion por paciente y plantilla ===
let bitacoraGraficosInstancias = [];

function destruirGraficosPrevios() {
    bitacoraGraficosInstancias.forEach(g => {
        if (g && typeof g.destroy === 'function') g.destroy();
    });
    bitacoraGraficosInstancias = [];
}

async function initBitacoraGraficos(pacientes) {
    const selectPaciente = document.getElementById('vitals-paciente-select');
    const selectPlantilla = document.getElementById('vitals-plantilla-select');
    const container = document.getElementById('caregiver-vitals-table-container');
    if (!selectPaciente || !selectPlantilla || !container) return;

    selectPaciente.innerHTML = pacientes.length
        ? pacientes.map(p => `<option value="${p.id}">${p.nombre || 'Paciente'}</option>`).join('')
        : '<option value="">Sin pacientes</option>';

    let ultimoIdPaciente = null;

    async function onPacienteChange() {
        const idPaciente = Number(selectPaciente.value);
        if (!idPaciente) {
            selectPlantilla.innerHTML = '<option value="">Selecciona un paciente</option>';
            container.innerHTML = '<p style="color:var(--text-muted); padding:8px 0;">Selecciona un paciente para cargar sus plantillas.</p>';
            return;
        }
        if (idPaciente === ultimoIdPaciente) return;
        ultimoIdPaciente = idPaciente;

        const plantillas = await obtenerBitacoraPlantillas(idPaciente);
        selectPlantilla.innerHTML = plantillas.length
            ? '<option value="">Selecciona una plantilla</option>' + plantillas.map(p =>
                `<option value="${p.id}">${p.nombre}</option>`
              ).join('')
            : '<option value="">Sin plantillas</option>';

        container.innerHTML = '<p style="color:var(--text-muted); padding:8px 0;">Selecciona una plantilla para visualizar los graficos.</p>';
    }

    async function onPlantillaChange() {
        const idPaciente = Number(selectPaciente.value);
        const idPlantilla = Number(selectPlantilla.value);
        if (!idPaciente || !idPlantilla) {
            container.innerHTML = '<p style="color:var(--text-muted); padding:8px 0;">Selecciona paciente y plantilla para ver los graficos.</p>';
            return;
        }

        const registros = await obtenerBitacoraRegistros(idPaciente);
        // El backend devuelve el id de plantilla como 'plantilla_id'
        const filtrados = registros.filter(r => {
            const pid = r.plantilla_id || r.id_plantilla;
            return pid === idPlantilla;
        });

        if (filtrados.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted); padding:8px 0;">No hay registros con esta plantilla. Completa registros en la Bitacora Diaria.</p>';
            return;
        }

        const plantillas = await obtenerBitacoraPlantillas(idPaciente);
        const plantilla = plantillas.find(p => p.id === idPlantilla);
        const campos = plantilla ? plantilla.campos : [];
        const camposNumericos = campos.filter(c => c.type === 'number');
        const camposTexto = campos.filter(c => c.type !== 'number');

        if (camposNumericos.length === 0 && camposTexto.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted); padding:8px 0;">La plantilla no tiene campos definidos.</p>';
            return;
        }

        const ordenados = filtrados.sort((a, b) => new Date(a.fecha_registro) - new Date(b.fecha_registro));
        const labels = ordenados.map(r => {
            const d = new Date(r.fecha_registro);
            return d.toLocaleDateString('es-ES', { day:'2-digit', month:'short' }) + ' ' + d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
        });

        destruirGraficosPrevios();

        // Construir el HTML con contenedores para graficos
        let html = '<div style="margin-bottom:12px;">';
        html += `<p style="font-size:0.85rem; color:var(--text-muted);">Mostrando ${ordenados.length} registro(s) de la plantilla "<strong>${plantilla.nombre}</strong>"</p>`;
        html += '</div>';

        // Graficos para campos numericos (lineas)
        camposNumericos.forEach((campo, idx) => {
            const valores = ordenados.map(r => {
                const v = parseFloat((r.valores && r.valores[campo.label]) || '');
                return isNaN(v) ? null : v;
            }).filter(v => v !== null);

            if (valores.length === 0) return;

            const chartId = 'bitacora-chart-num-' + idx;
            html += `<div style="margin-bottom:24px;">
                <h4 style="font-size:0.9rem; margin-bottom:6px; color:#1f2937;">${campo.label}</h4>
                <div style="position:relative; height:200px; width:100%;">
                    <canvas id="${chartId}"></canvas>
                </div>
            </div>`;
            html += '</div>';
        });

        // Tabla compacta para campos de texto (si hay)
        if (camposTexto.length > 0) {
            html += '<div style="margin-top:16px;"><h4 style="font-size:0.9rem; margin-bottom:6px; color:#1f2937;">Campos de texto / notas</h4>';
            html += '<table style="width:100%; border-collapse:collapse; font-size:0.82rem;">';
            html += '<thead><tr style="background:#f3f4f6;">';
            html += '<th style="padding:6px 8px; text-align:left; border-bottom:2px solid #e5e7eb;">Fecha</th>';
            camposTexto.forEach(c => {
                html += `<th style="padding:6px 8px; text-align:left; border-bottom:2px solid #e5e7eb;">${c.label}</th>`;
            });
            html += '<th style="padding:6px 8px; text-align:left; border-bottom:2px solid #e5e7eb;">Notas</th>';
            html += '</tr></thead><tbody>';
            ordenados.forEach(reg => {
                const fecha = new Date(reg.fecha_registro).toLocaleString('es-ES', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
                html += '<tr style="border-bottom:1px solid #f3f4f6;">';
                html += `<td style="padding:6px 8px; white-space:nowrap;">${fecha}</td>`;
                camposTexto.forEach(c => {
                    const val = (reg.valores && reg.valores[c.label]) || '-';
                    html += `<td style="padding:6px 8px;">${val}</td>`;
                });
                html += `<td style="padding:6px 8px; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${reg.notas || '-'}</td>`;
                html += '</tr>';
            });
            html += '</tbody></table></div>';
        }

        container.innerHTML = html;

        // Renderizar los graficos despues de insertar el HTML
        camposNumericos.forEach((campo, idx) => {
            const chartId = 'bitacora-chart-num-' + idx;
            const canvas = document.getElementById(chartId);
            if (!canvas) return;

            const valores = ordenados.map(r => {
                const v = parseFloat((r.valores && r.valores[campo.label]) || '');
                return isNaN(v) ? null : v;
            });

            const ctx = canvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 0, 200);
            grad.addColorStop(0, 'rgba(210,150,127,0.25)');
            grad.addColorStop(1, 'rgba(210,150,127,0.01)');

            try {
                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: campo.label,
                            data: valores,
                            borderColor: '#d2967f',
                            backgroundColor: grad,
                            borderWidth: 2,
                            pointBackgroundColor: '#d2967f',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 1,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: '#1f2937',
                                titleColor: '#fff',
                                bodyColor: '#e5e7eb',
                                cornerRadius: 8,
                                padding: 10
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { font: { size: 10 }, color: '#6b7280' }
                            },
                            y: {
                                grid: { color: 'rgba(0,0,0,0.05)' },
                                ticks: { font: { size: 10 }, color: '#6b7280' },
                                beginAtZero: false
                            }
                        },
                        interaction: {
                            mode: 'index',
                            intersect: false
                        }
                    }
                });
                bitacoraGraficosInstancias.push(chart);
            } catch (e) {
                console.warn('Error creando grafico para', campo.label, e);
            }
        });
    }

    selectPaciente.addEventListener('change', onPacienteChange);
    selectPlantilla.addEventListener('change', onPlantillaChange);

    if (pacientes.length > 0) {
        selectPaciente.value = pacientes[0].id;
        await onPacienteChange();
    }
}

function initCuidadorEvents(baseHtml) {
    const menuItems = document.querySelectorAll('.sidebar-cuidador .menu-item[data-view]');
    const contentArea = document.getElementById('cuidador-content-area');

    if (!contentArea) return;

    menuItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const vista = item.getAttribute('data-view');
            if (vista === 'dashboard') {
                contentArea.innerHTML = baseHtml;
                cargarContenidoDashboardCuidador();
            } else if (vista === 'pacientes') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando pacientes...</p></div>';
                await renderPacientesSection(contentArea);
            } else if (vista === 'bitacora') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando bitácora...</p></div>';
                await renderBitacoraSection(contentArea);
            } else if (vista === 'citas') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando citas...</p></div>';
                await renderCitasSection(contentArea);
            } else if (vista === 'medicamentos') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando medicamentos...</p></div>';
                await renderMedicamentosSection(contentArea);
            } else if (vista === 'calendario') {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando calendario...</p></div>';
                await renderCalendarioSection(contentArea);
            } else {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando...</p></div>';
                contentArea.innerHTML = await obtenerDatosSeccion(vista, 'cuidador');
            }
        });
    });

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









function initLogoutEvents() {
    const logoutLink = document.querySelector('.sidebar-cuidador .logout-item');
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
                <button type="button" class="modal-close-btn" aria-label="Cerrar">X</button>
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

function openPacienteDetalleModal(idPaciente, rol = 'cuidador') {
    openFloatingModal('<div id="modal-paciente-detail" class="modal-scrollable"></div>');
    const modalContent = document.getElementById('modal-paciente-detail');
    if (modalContent) {
        renderPacienteDetalle(modalContent, idPaciente, rol);
    }
}

function openCrearPacienteModal(profesionales, emailCuidador) {
    const profesionalesOptionsTodas = profesionales.map((prof) => `
        <option value="${prof.id}" data-email="${prof.email || ''}" data-nombre="${prof.nombre}">${prof.nombre} (${prof.email || prof.especialidad || 'Sin email'})</option>
    `).join('');

    const formHtml = `
        <div class="card fade-in">
            <h3>Crear paciente</h3>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">Al seleccionar un médico, se le enviará una solicitud de vinculación que deberá aceptar para asociar al paciente.</p>
            <form id="crear-paciente-form" class="patient-form">
                <div class="form-group"><label>Nombre</label><input type="text" name="nombre" required></div>
                <div class="form-group"><label>Fecha de nacimiento</label><input type="date" name="fecha_nacimiento" required></div>
                <div class="form-group"><label>Dirección</label><input type="text" name="direccion" placeholder="Opcional"></div>
                <div class="form-group"><label>Historial médico</label><textarea name="historial_medico" placeholder="Opcional"></textarea></div>
                <div class="form-group"><label>Horario de monitoreo</label><input type="text" name="horario_monitoreo" placeholder="Opcional"></div>
                <div class="form-group"><label>Observaciones</label><textarea name="observaciones" placeholder="Opcional"></textarea></div>
                <div class="form-group"><label>Nivel alerta</label><input type="text" name="nivel_alerta" placeholder="Opcional"></div>
                <div class="form-group"><label>Estado general</label><input type="text" name="estado_general" placeholder="Opcional"></div>
                <div class="form-group"><label>Ubicación</label><input type="text" name="ubicacion" placeholder="Opcional"></div>
                <div class="form-group"><label>Solicitar vinculación con médico</label><select name="id_profesional">
                    <option value="">Sin médico (solo cuidador)</option>
                    ${profesionalesOptionsTodas}
                </select></div>
                <div class="form-actions">
                    <button type="button" id="cancelar-crear-paciente" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar paciente</button>
                </div>
                <div id="paciente-form-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="paciente-form-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    openFloatingModal(formHtml);
    const modalContent = document.getElementById('floating-modal-content');
    if (!modalContent) return;

    modalContent.querySelector('#cancelar-crear-paciente')?.addEventListener('click', closeFloatingModal);
    const form = modalContent.querySelector('#crear-paciente-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const idProfesional = formData.get('id_profesional') ? Number(formData.get('id_profesional')) : null;

        // Buscar el email del profesional seleccionado
        const selectProf = form.querySelector('select[name="id_profesional"]');
        let emailProfesional = '';
        if (idProfesional && selectProf) {
            const option = selectProf.querySelector(`option[value="${idProfesional}"]`);
            emailProfesional = option?.dataset?.email || '';
        }

        const paciente = {
            nombre: String(formData.get('nombre') || '').trim(),
            fecha_nacimiento: String(formData.get('fecha_nacimiento') || '').trim(),
            direccion: String(formData.get('direccion') || '').trim(),
            historial_medico: String(formData.get('historial_medico') || '').trim(),
            horario_monitoreo: String(formData.get('horario_monitoreo') || '').trim(),
            observaciones: String(formData.get('observaciones') || '').trim(),
            nivel_alerta: String(formData.get('nivel_alerta') || '').trim(),
            estado_general: String(formData.get('estado_general') || '').trim(),
            ubicacion: String(formData.get('ubicacion') || '').trim(),
            email_cuidador: emailCuidador,
            id_profesional: idProfesional
        };

        const errorDiv = modalContent.querySelector('#paciente-form-error');
        const successDiv = modalContent.querySelector('#paciente-form-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        // 1. Crear paciente
        const respuesta = await crearPaciente(paciente);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo crear el paciente.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        // 2. Si se seleccionó un médico, enviar solicitud de vinculación
        if (idProfesional && emailProfesional && respuesta.paciente?.id) {
            const solicitud = {
                id_paciente: respuesta.paciente.id,
                email_solicitante: emailCuidador,
                rol_solicitante: 'cuidador',
                email_destinatario: emailProfesional,
                mensaje: `El cuidador solicita vincular al paciente "${paciente.nombre}" a su cuenta profesional.`
            };
            const respSolicitud = await crearSolicitudVinculacion(solicitud);
            if (!respSolicitud.success) {
                if (errorDiv) {
                    errorDiv.textContent = 'Paciente creado, pero no se pudo enviar la solicitud al médico. ' + (respSolicitud.message || '');
                    errorDiv.style.display = 'block';
                }
                return;
            }
        }

        // 3. Mostrar mensaje de éxito según el caso
        if (successDiv) {
            const msj = idProfesional
                ? `Paciente creado con éxito. Se ha enviado una solicitud de vinculación al médico.`
                : 'Paciente creado con éxito.';
            successDiv.textContent = msj;
            successDiv.style.display = 'block';
        }

        if (form) form.reset();
        setTimeout(() => {
            closeFloatingModal();
            const pageContainer = document.getElementById('cuidador-content-area');
            if (pageContainer) renderPacientesSection(pageContainer);
        }, 800);
    });
}

function openCrearCitaModal(pacientes, onSuccess) {
    const pacientesOptions = pacientes.map((paciente) => `
        <option value="${paciente.id}">${paciente.nombre}</option>
    `).join('');

    const formHtml = `
        <div class="card fade-in">
            <h3>Crear cita</h3>
            <form id="crear-cita-form" class="patient-form">
                <div class="form-group"><label>Paciente</label><select name="id_paciente" required>${pacientesOptions}</select></div>
                <div class="form-group"><label>Fecha y hora</label><input type="datetime-local" name="fecha_hora" required></div>
                <div class="form-group"><label>Lugar</label><input type="text" name="lugar" placeholder="Opcional"></div>
                <div class="form-group"><label>Motivo</label><textarea name="motivo" rows="3" placeholder="Opcional"></textarea></div>
                <div class="form-group"><label>Estado</label><select name="estado">
                    <option value="Agendada">Agendada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Pendiente">Pendiente</option>
                </select></div>
                <div class="form-actions">
                    <button type="button" id="cancelar-crear-cita" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar cita</button>
                </div>
                <div id="cita-form-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="cita-form-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    openFloatingModal(formHtml);
    const modalContent = document.getElementById('floating-modal-content');
    if (!modalContent) return;

    modalContent.querySelector('#cancelar-crear-cita')?.addEventListener('click', closeFloatingModal);
    const form = modalContent.querySelector('#crear-cita-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const cita = {
            fecha_hora: String(formData.get('fecha_hora') || '').trim(),
            lugar: String(formData.get('lugar') || '').trim(),
            motivo: String(formData.get('motivo') || '').trim(),
            estado: String(formData.get('estado') || 'Agendada').trim()
        };
        const idPaciente = Number(formData.get('id_paciente')) || null;

        const errorDiv = modalContent.querySelector('#cita-form-error');
        const successDiv = modalContent.querySelector('#cita-form-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        if (!idPaciente || !cita.fecha_hora) {
            if (errorDiv) {
                errorDiv.textContent = 'Selecciona un paciente e ingresa fecha y hora de la cita.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        const respuesta = await crearCitaPaciente(idPaciente, cita);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo crear la cita.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Cita creada con éxito.';
            successDiv.style.display = 'block';
        }

        setTimeout(() => {
            closeFloatingModal();
            if (typeof onSuccess === 'function') onSuccess();
        }, 600);
    });
}

function openEditarCitaModal(cita, onSuccess) {
    const fechaHoraLocal = new Date(cita.fecha_hora).toISOString().slice(0, 16);

    const formHtml = `
        <div class="card fade-in">
            <h3>Editar cita de ${cita.paciente}</h3>
            <form id="editar-cita-form" class="patient-form">
                <div class="form-group"><label>Fecha y hora</label><input type="datetime-local" name="fecha_hora" value="${fechaHoraLocal}" required></div>
                <div class="form-group"><label>Lugar</label><input type="text" name="lugar" value="${cita.lugar || ''}" placeholder="Opcional"></div>
                <div class="form-group"><label>Motivo</label><textarea name="motivo" rows="3" placeholder="Opcional">${cita.motivo || ''}</textarea></div>
                <div class="form-group"><label>Estado</label><select name="estado">
                    <option value="Agendada" ${cita.estado === 'Agendada' ? 'selected' : ''}>Agendada</option>
                    <option value="Confirmada" ${cita.estado === 'Confirmada' ? 'selected' : ''}>Confirmada</option>
                    <option value="Pendiente" ${cita.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Cancelada" ${cita.estado === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                </select></div>
                <div class="form-actions">
                    <button type="button" id="cancelar-editar-cita" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                </div>
                <div id="cita-form-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="cita-form-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    openFloatingModal(formHtml);
    const modalContent = document.getElementById('floating-modal-content');
    if (!modalContent) return;

    modalContent.querySelector('#cancelar-editar-cita')?.addEventListener('click', closeFloatingModal);
    const form = modalContent.querySelector('#editar-cita-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const citaActualizada = {
            fecha_hora: String(formData.get('fecha_hora') || '').trim(),
            lugar: String(formData.get('lugar') || '').trim(),
            motivo: String(formData.get('motivo') || '').trim(),
            estado: String(formData.get('estado') || 'Agendada').trim()
        };

        const errorDiv = modalContent.querySelector('#cita-form-error');
        const successDiv = modalContent.querySelector('#cita-form-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        if (!citaActualizada.fecha_hora) {
            if (errorDiv) {
                errorDiv.textContent = 'La fecha y hora de la cita son obligatorias.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        const respuesta = await actualizarCitaPaciente(cita.id_paciente, cita.id, citaActualizada);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo actualizar la cita.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) successDiv.textContent = 'Cita actualizada con éxito.';
        if (successDiv) successDiv.style.display = 'block';

        setTimeout(() => {
            closeFloatingModal();
            if (typeof onSuccess === 'function') onSuccess();
        }, 600);
    });
}

function openCrearMedicamentoModal(idPaciente, onSuccess) {
    const formHtml = `
        <div class="card fade-in">
            <h3>Registrar medicamento</h3>
            <form id="crear-medicamento-form" class="patient-form">
                <div class="form-group"><label>Nombre del medicamento</label><input type="text" name="nombre_medicamento" required></div>
                <div class="form-group"><label>Dosis</label><input type="text" name="dosis" required></div>
                <div class="form-group"><label>Frecuencia</label><input type="text" name="frecuencia" required></div>
                <div class="form-group"><label>Cantidad de dosis</label><input type="number" min="1" name="cantidad_dosis" required></div>
                <div class="form-group"><label>Estado</label><select name="estado" required>
                    <option value="En tratamiento">En tratamiento</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Suspendido">Suspendido</option>
                </select></div>
                <div class="form-group"><label>Fecha de inicio</label><input type="date" name="fecha_inicio" required></div>
                <div class="form-actions">
                    <button type="button" id="cancelar-crear-medicamento" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar medicamento</button>
                </div>
                <div id="medicamento-form-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="medicamento-form-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    openFloatingModal(formHtml);
    const modalContent = document.getElementById('floating-modal-content');
    if (!modalContent) return;

    modalContent.querySelector('#cancelar-crear-medicamento')?.addEventListener('click', closeFloatingModal);
    const form = modalContent.querySelector('#crear-medicamento-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const medicamento = {
            nombre_medicamento: String(formData.get('nombre_medicamento') || '').trim(),
            dosis: String(formData.get('dosis') || '').trim(),
            frecuencia: String(formData.get('frecuencia') || '').trim(),
            cantidad_dosis: Number(formData.get('cantidad_dosis') || 0),
            estado: String(formData.get('estado') || 'En tratamiento').trim(),
            fecha_inicio: String(formData.get('fecha_inicio') || '').trim()
        };

        const errorDiv = modalContent.querySelector('#medicamento-form-error');
        const successDiv = modalContent.querySelector('#medicamento-form-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        if (!medicamento.nombre_medicamento || !medicamento.dosis || !medicamento.frecuencia || !medicamento.fecha_inicio || !medicamento.cantidad_dosis) {
            if (errorDiv) {
                errorDiv.textContent = 'Completa todos los campos del medicamento.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        const respuesta = await crearMedicamentoPaciente(idPaciente, medicamento);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo guardar el medicamento.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Medicamento registrado con éxito.';
            successDiv.style.display = 'block';
        }

        setTimeout(() => {
            closeFloatingModal();
            if (typeof onSuccess === 'function') onSuccess();
        }, 700);
    });
}

function openEditarMedicamentoModal(idPaciente, medicamento, onSuccess) {
    const formHtml = `
        <div class="card fade-in">
            <h3>Editar medicamento</h3>
            <form id="editar-medicamento-form" class="patient-form">
                <div class="form-group"><label>Nombre del medicamento</label><input type="text" name="nombre_medicamento" value="${medicamento.nombre || ''}" required></div>
                <div class="form-group"><label>Dosis</label><input type="text" name="dosis" value="${medicamento.dosis || ''}" required></div>
                <div class="form-group"><label>Frecuencia</label><input type="text" name="frecuencia" value="${medicamento.frecuencia || ''}" required></div>
                <div class="form-group"><label>Cantidad de dosis</label><input type="number" min="1" name="cantidad_dosis" value="${medicamento.cantidad_dosis || ''}" required></div>
                <div class="form-group"><label>Estado</label><select name="estado" required>
                    <option value="En tratamiento" ${medicamento.estado === 'En tratamiento' ? 'selected' : ''}>En tratamiento</option>
                    <option value="Finalizado" ${medicamento.estado === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                    <option value="Suspendido" ${medicamento.estado === 'Suspendido' ? 'selected' : ''}>Suspendido</option>
                </select></div>
                <div class="form-group"><label>Fecha de inicio</label><input type="date" name="fecha_inicio" value="${medicamento.fecha_inicio || ''}" required></div>
                <div class="form-actions">
                    <button type="button" id="cancelar-editar-medicamento" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                </div>
                <div id="medicamento-form-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="medicamento-form-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    openFloatingModal(formHtml);
    const modalContent = document.getElementById('floating-modal-content');
    if (!modalContent) return;

    modalContent.querySelector('#cancelar-editar-medicamento')?.addEventListener('click', closeFloatingModal);
    const form = modalContent.querySelector('#editar-medicamento-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const medicamentoActualizado = {
            nombre_medicamento: String(formData.get('nombre_medicamento') || '').trim(),
            dosis: String(formData.get('dosis') || '').trim(),
            frecuencia: String(formData.get('frecuencia') || '').trim(),
            cantidad_dosis: Number(formData.get('cantidad_dosis') || 0),
            estado: String(formData.get('estado') || 'En tratamiento').trim(),
            fecha_inicio: String(formData.get('fecha_inicio') || '').trim()
        };

        const errorDiv = modalContent.querySelector('#medicamento-form-error');
        const successDiv = modalContent.querySelector('#medicamento-form-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        if (!medicamentoActualizado.nombre_medicamento || !medicamentoActualizado.dosis || !medicamentoActualizado.frecuencia || !medicamentoActualizado.fecha_inicio || !medicamentoActualizado.cantidad_dosis) {
            if (errorDiv) {
                errorDiv.textContent = 'Completa todos los campos del medicamento.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        const respuesta = await actualizarMedicamentoPaciente(idPaciente, medicamento.id, medicamentoActualizado);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo actualizar el medicamento.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Medicamento actualizado con éxito.';
            successDiv.style.display = 'block';
        }

        setTimeout(() => {
            closeFloatingModal();
            if (typeof onSuccess === 'function') onSuccess();
        }, 700);
    });
}

async function renderPacientesSection(container) {
    const session = obtenerSesionActiva();
    const emailCuidador = session?.email || '';
    const pacientes = await obtenerPacientes('cuidador', emailCuidador);
    const profesionales = await obtenerProfesionales();

    const pacientesHtml = pacientes.length
        ? pacientes.map((paciente) => `
            <div class="card patient-dashboard-card">
              <div class="patient-card-header">
                <div>
                  <h4>${paciente.nombre || 'Paciente sin nombre'}</h4>
                  <p>${paciente.direccion ? `Dirección: ${paciente.direccion}` : 'Sin dirección registrada'}</p>
                </div>
                <span class="patient-card-badge">${paciente.profesional_nombre ? 'Con médico' : 'Sin médico'}</span>
              </div>
              <div class="patient-card-body">
                <div><strong>Fecha de nacimiento</strong><span>${paciente.fecha_nacimiento || 'No registrada'}</span></div>
                <div><strong>Médico asignado</strong><span>${paciente.profesional_nombre || 'Sin médico asignado'}</span></div>
                <div><strong>Estado</strong><span>${paciente.nivel_alerta || 'Sin alerta'}</span></div>
              </div>
              <button class="btn btn-secondary btn-ver-paciente" data-paciente-id="${paciente.id}">Ver / Editar</button>
            </div>
          `).join('')
        : '<div class="card empty-state-card"><div class="empty-state-icon"><i class="ti ti-users"></i></div><h4>Aun no tienes pacientes asignados</h4><p>Cuando un paciente sea creado y vinculado a tu perfil, aparecera aqui con su informacion de seguimiento.</p></div>';

    container.innerHTML = `
        <div class="card fade-in section-hero-card" style="margin-bottom: 18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
                <div>
                    <h3>Mis Pacientes</h3>
                    <p>Registra nuevos pacientes y relacionalos con un profesional desde la base de datos del sistema.</p>
                </div>
                <button id="btn-crear-paciente" class="btn btn-primary">Crear paciente</button>
            </div>
        </div>
        <div id="pacientes-list" class="section-grid">${pacientesHtml}</div>
        <div id="paciente-form-container"></div>
    `;

    document.getElementById('btn-crear-paciente')?.addEventListener('click', () => {
        openCrearPacienteModal(profesionales, emailCuidador);
    });

    container.querySelectorAll('.btn-ver-paciente').forEach((button) => {
        button.addEventListener('click', async () => {
            const idPaciente = Number(button.dataset.pacienteId);
            if (!idPaciente) return;
            openPacienteDetalleModal(idPaciente, 'cuidador');
        });
    });
}

async function renderCitasSection(container) {
    const session = obtenerSesionActiva();
    const emailCuidador = session?.email || '';
    const pacientes = await obtenerPacientes('cuidador', emailCuidador);

    if (!pacientes.length) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados para crear citas.</p></div>';
        return;
    }

    const citasPorPaciente = await Promise.all(pacientes.map(async (paciente) => ({
        paciente,
        citas: await obtenerCitasPaciente(paciente.id)
    })));

    const citas = citasPorPaciente.flatMap(({ paciente, citas }) =>
        citas.map((cita) => ({ ...cita, paciente: paciente.nombre, id_paciente: paciente.id }))
    );

    container.innerHTML = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                    <h3>Gestión de Citas</h3>
                    <p>Registra nuevas citas para tus pacientes y revisa el historial programado.</p>
                </div>
                <button id="btn-crear-cita" class="btn btn-primary">Crear cita</button>
            </div>
        </div>
        <div class="card fade-in">
            <h4>Citas próximas</h4>
            <div class="pacientes-list">
                ${citas.length ? citas.map((cita) => `
                    <div class="paciente-card" data-cita-id="${cita.id}">
                        <h4>${cita.paciente}</h4>
                        <p><strong>Fecha:</strong> ${new Date(cita.fecha_hora).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                        <p><strong>Hora:</strong> ${new Date(cita.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>Motivo:</strong> ${cita.motivo || 'No especificado'}</p>
                        <p><strong>Estado:</strong> ${cita.estado || 'Agendada'}</p>
                        <div class="card-actions">
                            <button class="btn btn-secondary btn-editar-cita">Editar</button>
                            <button class="btn btn-danger btn-eliminar-cita">Eliminar</button>
                        </div>
                    </div>
                `).join('') : '<p style="color:var(--text-muted);">No hay citas registradas todavía.</p>'}
            </div>
        </div>
    `;

    container.querySelectorAll('.btn-editar-cita').forEach(button => {
        button.addEventListener('click', () => {
            const citaId = Number(button.closest('.paciente-card').dataset.citaId);
            const cita = citas.find(c => c.id === citaId);
            if (cita) openEditarCitaModal(cita, () => renderCitasSection(container));
        });
    });

    container.querySelectorAll('.btn-eliminar-cita').forEach(button => {
        button.addEventListener('click', async () => {
            const citaId = Number(button.closest('.paciente-card').dataset.citaId);
            const cita = citas.find(c => c.id === citaId);
            if (cita && confirm(`¿Estás seguro de que deseas eliminar la cita de ${cita.paciente} del ${new Date(cita.fecha_hora).toLocaleDateString()}?`)) {
                await eliminarCitaPaciente(cita.id_paciente, cita.id);
                renderCitasSection(container);
            }
        });
    });

    document.getElementById('btn-crear-cita')?.addEventListener('click', () => {
        openCrearCitaModal(pacientes, () => renderCitasSection(container));
    });
}

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

    if (totalDosis <= 0) {
        return eventos;
    }

    let actual = new Date(inicio);
    for (let i = 0; i < totalDosis; i++) {
        eventos.push({
            fecha: new Date(actual),
            paciente: pacienteNombre,
            medicamento: medicamento.nombre,
            estado: medicamento.estado || 'En tratamiento',
            detalle: `Dosis ${i + 1}/${totalDosis} · ${medicamento.dosis} · Estado: ${medicamento.estado || 'En tratamiento'}`
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

function formatearFechaHora(fecha) {
    return fecha.toLocaleString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getIdUnico(e) {
    // Usamos una representación de fecha estable (sin milisegundos) para que
    // al regenerar eventos desde los mismos datos, el ID sea el mismo
    const d = new Date(e.fecha);
    const fechaKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    return e.tipo + '-' + (e.idOriginal || e.medicamento || '') + '-' + e.paciente + '-' + fechaKey;
}

async function renderCalendarioSection(container) {
    const session = obtenerSesionActiva();
    const emailCuidador = session?.email || '';
    const pacientes = await obtenerPacientes('cuidador', emailCuidador);

    if (!pacientes.length) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados para registrar el calendario de medicación.</p></div>';
        return;
    }

    const pacienteDatos = await Promise.all(pacientes.map(async (paciente) => ({
        paciente: paciente.nombre,
        idPaciente: paciente.id,
        medicamentos: await obtenerMedicamentosPaciente(paciente.id),
        citas: await obtenerCitasPaciente(paciente.id)
    })));

        // Cache de estados: "completado" por id único del evento (persistente en localStorage)
    const STORAGE_KEY = 'zoe_calendario_completados_' + (session?.email || 'anon');
    const eventosCompletados = new Set();
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        saved.forEach(id => eventosCompletados.add(id));
    } catch (e) {
        // ignorar
    }

    function guardarCompletados() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...eventosCompletados]));
        } catch (e) {
            // ignorar
        }
    }

    const eventos = pacienteDatos.reduce((lista, item) => {
        item.medicamentos.forEach((medicamento) => {
            lista.push(...generarEventosMedicacion(medicamento, item.paciente));
        });
        item.citas.forEach((cita) => {
            const fecha = new Date(cita.fecha_hora);
            if (isNaN(fecha)) return;
            lista.push({
                fecha,
                paciente: item.paciente,
                tipo: 'Cita',
                idOriginal: cita.id,
                idPaciente: item.idPaciente,
                detalle: `Cita: ${cita.motivo || 'Sin motivo'} · ${cita.lugar || 'Lugar no definido'} · Estado: ${cita.estado || 'Agendada'}`
            });
        });
        return lista;
    }, []);

    // Variables de navegación
    let mesActual = new Date().getMonth();
    let añoActual = new Date().getFullYear();

        function renderizarCalendario() {
    const mesNombre = new Date(añoActual, mesActual).toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    // Filtrar eventos del mes actual
    const eventosDelMes = eventos.filter(e => {
        const f = new Date(e.fecha);
        return f.getMonth() === mesActual && f.getFullYear() === añoActual;
    });

    // --- Generar la cuadrícula de días ---
    const primerDia = new Date(añoActual, mesActual, 1);
    const ultimoDia = new Date(añoActual, mesActual + 1, 0);
    const diaSemanaInicio = primerDia.getDay(); // 0=domingo, 1=lunes...
    const diasEnMes = ultimoDia.getDate();
    const hoy = new Date();
    const hoyStr = hoy.toDateString();

    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Cabecera de días de la semana
    let htmlDias = '<div class="cal-grid-dias">';
    nombresDias.forEach(n => {
        htmlDias += `<div class="cal-dia-header">${n}</div>`;
    });

    // Celdas vacías antes del primer día
    for (let i = 0; i < diaSemanaInicio; i++) {
        htmlDias += '<div class="cal-dia cal-dia-vacio"></div>';
    }

    // Cada día del mes
    for (let d = 1; d <= diasEnMes; d++) {
        const fechaDia = new Date(añoActual, mesActual, d);
        const eventosDelDia = eventosDelMes.filter(e => {
            const f = new Date(e.fecha);
            return f.getDate() === d && f.getMonth() === mesActual && f.getFullYear() === añoActual;
        });
        const esHoy = fechaDia.toDateString() === hoyStr;
        const tieneEventos = eventosDelDia.length > 0;

        let clases = 'cal-dia';
        if (esHoy) clases += ' cal-hoy';
        if (tieneEventos) clases += ' cal-con-evento';

        htmlDias += `<div class="${clases}" data-dia="${d}" data-mes="${mesActual}" data-año="${añoActual}">`;
        htmlDias += `<span class="cal-numero">${d}</span>`;

        if (tieneEventos) {
            // Mostrar hasta 3 burbujas y luego "+N"
            const completadosDelDia = eventosDelDia.filter(e => eventosCompletados.has(getIdUnico(e)));
            htmlDias += '<div class="cal-evento-burbujas">';
            const maxBurbujas = 3;
            const mostrar = eventosDelDia.slice(0, maxBurbujas);
            mostrar.forEach(e => {
                const estaCompletado = completadosDelDia.includes(e);
                htmlDias += `<span class="cal-burbuja ${estaCompletado ? 'cal-completado' : ''}"></span>`;
            });
            if (eventosDelDia.length > maxBurbujas) {
                htmlDias += `<span class="cal-mas">+${eventosDelDia.length - maxBurbujas}</span>`;
            }
            htmlDias += '</div>';
        }

        htmlDias += '</div>';
    }

    htmlDias += '</div>'; // .cal-grid-dias

    const totalPendientes = eventosDelMes.filter(e => !eventosCompletados.has(getIdUnico(e))).length;

    const htmlContenido = `
    <div class="calendario-view fade-in">
        <div class="card" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                    <h3>Calendario de Monitoreo</h3>
                    <p>Horarios de medicación y citas programadas. Haz clic en un evento para ver detalle y marcar como completado.</p>
                </div>
            </div>
        </div>

        <div class="card calendario-card">
            <div class="cal-navegacion">
                <button class="cal-btn-nav" id="cal-mes-ant"><i class="ti ti-chevron-left"></i></button>
                <h4 class="cal-mes-titulo" style="text-transform:capitalize;">${mesNombre}</h4>
                <button class="cal-btn-nav" id="cal-mes-sig"><i class="ti ti-chevron-right"></i></button>
            </div>
            ${htmlDias}
        </div>

        <div class="card" style="margin-top:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:12px;">
                <h4 style="margin:0;">Eventos del mes</h4>
                <span style="font-size:0.82rem; color:var(--text-muted); background:#f3f4f6; padding:4px 12px; border-radius:20px;">
                    ${totalPendientes} pendientes
                </span>
            </div>
            <div class="cal-lista-eventos">
                ${eventosDelMes.length > 0 ? eventosDelMes.sort((a, b) => a.fecha - b.fecha).map(e => {
                    const idUnico = getIdUnico(e);
                    const completado = eventosCompletados.has(idUnico);
                    return `<div class="cal-evento-item ${completado ? 'cal-evento-completado' : ''}" data-evento-id="${idUnico}" data-tipo="${e.tipo}" data-detalle="${e.detalle}" data-paciente="${e.paciente}" data-fecha="${e.fecha.toISOString()}" data-medicamento="${e.medicamento || ''}">
                        <div class="cal-evento-icono">
                            <i class="ti ti-${e.tipo === 'Cita' ? 'calendar-event' : 'pill'}"></i>
                        </div>
                        <div class="cal-evento-info">
                            <strong>${e.paciente}</strong>
                            <span>${e.tipo === 'Cita' ? 'Cita' : e.medicamento} · ${e.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} · ${e.fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                            <small>${e.detalle}</small>
                        </div>
                        <span class="cal-evento-estado ${completado ? 'estado-completado' : 'estado-pendiente'}">${completado ? '✓ Completado' : '○ Pendiente'}</span>
                    </div>`;
                }).join('') : '<p style="color:var(--text-muted); padding:16px 0; text-align:center;">No hay eventos este mes.</p>'}
            </div>
        </div>
    </div>
    `;

    container.innerHTML = htmlContenido;

    // Navegación
    document.getElementById('cal-mes-ant')?.addEventListener('click', () => {
        mesActual--;
        if (mesActual < 0) { mesActual = 11; añoActual--; }
        renderizarCalendario();
    });
    document.getElementById('cal-mes-sig')?.addEventListener('click', () => {
        mesActual++;
        if (mesActual > 11) { mesActual = 0; añoActual++; }
        renderizarCalendario();
    });

    // Click en un día del calendario -> hacer scroll a los eventos de ese día
    container.querySelectorAll('.cal-dia:not(.cal-dia-vacio)').forEach(dia => {
        dia.addEventListener('click', () => {
            const diaNum = dia.dataset.dia;
            if (!diaNum) return;
            // Scroll suave hacia la lista de eventos
            const listaEventos = container.querySelector('.cal-lista-eventos');
            if (listaEventos) {
                listaEventos.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Resaltar visualmente los eventos de ese día
                container.querySelectorAll('.cal-evento-item').forEach(item => {
                    const fechaEvento = new Date(item.dataset.fecha);
                    if (fechaEvento.getDate() === parseInt(diaNum) && fechaEvento.getMonth() === mesActual && fechaEvento.getFullYear() === añoActual) {
                        item.style.boxShadow = '0 0 0 3px rgba(210,150,127,0.5)';
                        item.style.borderColor = '#d2967f';
                        setTimeout(() => {
                            item.style.boxShadow = '';
                            item.style.borderColor = '';
                        }, 2000);
                    }
                });
            }
        });
    });

    // Click en evento
    container.querySelectorAll('.cal-evento-item').forEach(item => {
        item.addEventListener('click', () => {
            const idUnico = item.dataset.eventoId;
            const tipo = item.dataset.tipo;
            const paciente = item.dataset.paciente;
            const detalle = item.dataset.detalle;
            const fecha = new Date(item.dataset.fecha);
            const medicamento = item.dataset.medicamento;
            const completado = eventosCompletados.has(idUnico);

            const fechaStr = fecha.toLocaleDateString('es-ES', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
            });
            const horaStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                        const modalHtml = `
                <div class="card fade-in">
                    <h3>${tipo === 'Cita' ? 'Cita médica' : 'Medicación'}</h3>
                    <div class="registro-value" style="margin-bottom:8px;"><strong>Paciente</strong><span>${paciente}</span></div>
                    <div class="registro-value" style="margin-bottom:8px;"><strong>Fecha</strong><span>${fechaStr}</span></div>
                    <div class="registro-value" style="margin-bottom:8px;"><strong>Hora</strong><span>${horaStr}</span></div>
                    ${tipo !== 'Cita' ? `<div class="registro-value" style="margin-bottom:8px;"><strong>Medicamento</strong><span>${medicamento}</span></div>` : ''}
                    <div class="registro-value" style="margin-bottom:12px;"><strong>Detalle</strong><span>${detalle}</span></div>
                    <div style="padding:14px 16px; border-radius:14px; background:${completado ? '#f0fdf4' : '#fefce8'}; border:1px solid ${completado ? '#bbf7d0' : '#fde68a'}; display:flex; align-items:center; gap:10px;">
                        <span style="font-size:1.2rem;">${completado ? '' : ''}</span>
                        <div>
                            <strong style="display:block; color:${completado ? '#166534' : '#92400e'};">${completado ? 'Completado' : 'Pendiente'}</strong>
                            <span style="font-size:0.82rem; color:${completado ? '#15803d' : '#b45309'};">${completado ? 'Ya fue marcado como completado.' : 'Aún no completado.'}</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:12px; border-top:1px solid #eef1f0; padding-top:18px; margin-top:18px;">
                        ${!completado ? `<button id="btn-marcar-completado" class="btn btn-primary" style="background:#16a34a; flex:1; padding:14px 20px;">
                            <i class="ti ti-check" style="margin-right:8px;"></i>Marcar como completado
                        </button>` : `<button disabled class="btn btn-secondary" style="flex:1; opacity:0.6; padding:14px 20px;">
                            <i class="ti ti-check" style="margin-right:8px;"></i>Ya completado
                        </button>`}
                        <button id="btn-cerrar-modal-evento" class="btn btn-secondary" style="padding:14px 20px;">Cerrar</button>
                    </div>
                </div>
            `;

                        openFloatingModal(modalHtml);

            document.getElementById('btn-marcar-completado')?.addEventListener('click', () => {
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

async function renderMedicamentosSection(container) {
    const session = obtenerSesionActiva();
    const emailCuidador = session?.email || '';
    const pacientes = await obtenerPacientes('cuidador', emailCuidador);

    if (!pacientes.length) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados para gestionar medicamentos.</p></div>';
        return;
    }

    const pacienteOptions = pacientes.map((paciente) => `
        <option value="${paciente.id}">${paciente.nombre}</option>
    `).join('');

    container.innerHTML = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                    <h3>Gestión de Medicamentos</h3>
                    <p>Revisa el tratamiento activo y registra nuevos medicamentos mediante un modal.</p>
                </div>
                <div class="section-actions">
                    <div class="form-group-inline">
                        <label>Paciente</label>
                        <select id="medicamento-paciente-select">${pacienteOptions}</select>
                    </div>
                    <button id="btn-registrar-medicamento" class="btn btn-primary">Registrar medicamento</button>
                </div>
            </div>
        </div>
        <div id="medicamento-list-area" class="card fade-in"></div>
    `;

    const selectPaciente = document.getElementById('medicamento-paciente-select');
    if (!selectPaciente) return;

    selectPaciente.addEventListener('change', async () => {
        await renderMedicamentoDetail(container, Number(selectPaciente.value));
    });

    document.getElementById('btn-registrar-medicamento')?.addEventListener('click', () => {
        openCrearMedicamentoModal(Number(selectPaciente.value) || pacientes[0].id, () => renderMedicamentoDetail(container, Number(selectPaciente.value) || pacientes[0].id));
    });

    await renderMedicamentoDetail(container, Number(selectPaciente.value) || pacientes[0].id);
}

async function renderMedicamentoDetail(container, idPaciente) {
    const medicamentoListArea = document.getElementById('medicamento-list-area');
    if (!medicamentoListArea) return;

    medicamentoListArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando medicamentos...</p></div>';

    const medicamentos = await obtenerMedicamentosPaciente(idPaciente);
    const listHtml = medicamentos.length
        ? medicamentos.map((med) => `
            <div class="paciente-card medicamento-card" data-medicamento-id="${med.id}">
                <h4>${med.nombre}</h4>
                <p><strong>Dosis:</strong> ${med.dosis}</p>
                <p><strong>Frecuencia:</strong> ${med.frecuencia}</p>
                <p><strong>Cantidad de dosis:</strong> ${med.cantidad_dosis || 'No especificado'}</p>
                <p><strong>Estado:</strong> ${med.estado || 'En tratamiento'}</p>
                <p><strong>Inicio:</strong> ${med.fecha_inicio || 'No especificado'}</p>
                <p><strong>Registrado:</strong> ${med.fecha_registro ? new Date(med.fecha_registro).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour:'2-digit', minute:'2-digit' }) : 'No especificado'}</p>
                <button class="btn btn-secondary btn-editar-medicamento" data-medicamento-id="${med.id}">Editar</button>
            </div>
          `).join('')
        : '<p style="color:var(--text-muted);">Aún no hay tratamientos registrados para este paciente.</p>';

    medicamentoListArea.innerHTML = `
        <h4>Medicamentos asociados</h4>
        <div class="pacientes-list">${listHtml}</div>
    `;

    medicamentoListArea.querySelectorAll('.btn-editar-medicamento').forEach((button) => {
        button.addEventListener('click', () => {
            const medicamentoId = Number(button.dataset.medicamentoId);
            const medicamento = medicamentos.find((med) => med.id === medicamentoId);
            if (!medicamento) return;
            openEditarMedicamentoModal(idPaciente, medicamento, () => renderMedicamentoDetail(container, idPaciente));
        });
    });
}

function renderCrearPacienteForm(container, profesionales, emailCuidador) {
    const profesionalesOptions = profesionales.map((prof) => `
        <option value="${prof.id}">${prof.nombre} (${prof.email || prof.especialidad || 'Sin email'})</option>
    `).join('');

    const formHtml = `
        <div class="card fade-in" style="margin-top: 16px;">
            <h3>Crear paciente</h3>
            <form id="crear-paciente-form" class="patient-form">
                <div class="form-group"><label>Nombre</label><input type="text" name="nombre" required></div>
                <div class="form-group"><label>Fecha de nacimiento</label><input type="date" name="fecha_nacimiento" required></div>
                <div class="form-group"><label>Dirección</label><input type="text" name="direccion" placeholder="Opcional"></div>
                <div class="form-group"><label>Historial médico</label><textarea name="historial_medico" rows="3" placeholder="Opcional"></textarea></div>
                <div class="form-group"><label>Horario de monitoreo</label><input type="text" name="horario_monitoreo" placeholder="Opcional"></div>
                <div class="form-group"><label>Observaciones</label><textarea name="observaciones" rows="3" placeholder="Opcional"></textarea></div>
                <div class="form-group"><label>Nivel alerta</label><input type="text" name="nivel_alerta" placeholder="Opcional"></div>
                <div class="form-group"><label>Estado general</label><input type="text" name="estado_general" placeholder="Opcional"></div>
                <div class="form-group"><label>Ubicación</label><input type="text" name="ubicacion" placeholder="Opcional"></div>
                <div class="form-group"><label>Médico asignado</label><select name="id_profesional">
                    <option value="">Sin asignar</option>
                    ${profesionalesOptions}
                </select></div>
                <div class="form-actions">
                    <button type="button" id="cancelar-crear-paciente" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar paciente</button>
                </div>
                <div id="paciente-form-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="paciente-form-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    const formContainer = document.getElementById('paciente-form-container');
    if (!formContainer) return;
    formContainer.innerHTML = formHtml;

    document.getElementById('cancelar-crear-paciente')?.addEventListener('click', () => {
        formContainer.innerHTML = '';
    });

    const form = document.getElementById('crear-paciente-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const paciente = {
            nombre: String(formData.get('nombre') || '').trim(),
            fecha_nacimiento: String(formData.get('fecha_nacimiento') || '').trim(),
            direccion: String(formData.get('direccion') || '').trim(),
            historial_medico: String(formData.get('historial_medico') || '').trim(),
            email_cuidador: emailCuidador,
            id_profecional: formData.get('id_profesional') ? Number(formData.get('id_profesional')) : null
        };

        const errorDiv = document.getElementById('paciente-form-error');
        const successDiv = document.getElementById('paciente-form-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        const respuesta = await crearPaciente(paciente);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo crear el paciente.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Paciente creado con éxito.';
            successDiv.style.display = 'block';
        }

        form.reset();
        renderPacientesSection(container);
    });
}

function openResumenPacienteModal(paciente, medicamentos, citas, bitacora) {
    const resumenTexto = `
Resumen del Paciente: ${paciente.nombre}
------------------------------------------------
Médico Asignado: ${paciente.profesional_nombre || 'No asignado'}
Cuidador: ${paciente.cuidador_nombre || 'No asignado'}
Estado General: ${paciente.estado_general || 'No especificado'}
Nivel de Alerta: ${paciente.nivel_alerta || 'Normal'}

Medicamentos Actuales:
${medicamentos.length ? medicamentos.map(m => `- ${m.nombre}: ${m.dosis}, ${m.frecuencia}`).join('\n') : 'Sin medicamentos registrados.'}

Próximas Citas:
${citas.length ? citas.filter(c => new Date(c.fecha_hora) > new Date()).sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)).map(c => `- ${new Date(c.fecha_hora).toLocaleString('es-ES')}: ${c.motivo || 'Control'}`).join('\n') : 'Sin próximas citas.'}

Últimos Registros de Bitácora:
${bitacora.length ? bitacora.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro)).slice(0, 5).map(r => `- ${new Date(r.fecha_registro).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}: ${r.notas || 'Sin notas.'}`).join('\n') : 'Sin registros de bitácora.'}
    `.trim();

    const modalHtml = `
        <div class="card fade-in">
            <h3>Resumen para Compartir</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Copia este resumen para compartirlo con familiares o responsables.</p>
            <textarea readonly style="width:100%; height: 250px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:12px; font-family:monospace; font-size:0.8rem; line-height:1.6;">${resumenTexto}</textarea>
            <div class="form-actions" style="margin-top:12px;">
                <button id="btn-copiar-resumen" class="btn btn-primary" style="width:100%;">Copiar Resumen</button>
            </div>
            <div id="copiar-resumen-feedback" style="margin-top:8px; text-align:center; color:#16a34a; font-weight:600; display:none;">¡Resumen copiado!</div>
        </div>
    `;

    openFloatingModal(modalHtml);

    document.getElementById('btn-copiar-resumen')?.addEventListener('click', () => {
        navigator.clipboard.writeText(resumenTexto).then(() => {
            const feedback = document.getElementById('copiar-resumen-feedback');
            if (feedback) {
                feedback.style.display = 'block';
                setTimeout(() => { feedback.style.display = 'none'; }, 2000);
            }
        });
    });
}

async function renderPacienteDetalle(container, idPaciente, rol) {
    const paciente = await obtenerPacienteDetalle(idPaciente);
    if (!paciente) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No se encontró el paciente seleccionado.</p></div>';
        return;
    }

    const session = obtenerSesionActiva();
    const emailCuidador = session?.email || '';
    const profesionales = await obtenerProfesionales();

    // Excluir al profesional ya asignado de las opciones
    const profesionalesOptions = profesionales
        .filter(p => p.email !== paciente.profesional_email)
        .map((prof) => `
            <option value="${prof.id}" data-email="${prof.email || ''}">${prof.nombre} (${prof.email || prof.especialidad || 'Sin email'})</option>
        `).join('');

    const detalleHtml = `
        <div class="card fade-in">
            <h3>Detalle del paciente</h3>
            ${!paciente.profesional_nombre ? `
            <div style="background:#fef3c7; border:1px solid #f59e0b; border-radius:8px; padding:10px 14px; margin-bottom:16px;">
                <strong style="color:#92400e;">Pendiente de médico</strong>
                <p style="font-size:0.85rem; color:#78350f; margin-top:4px;">Este paciente no tiene un médico asignado. Puedes solicitar vinculación con un profesional desde este formulario.</p>
            </div>
            ` : `
            <div style="background:#f0fdf4; border:1px solid #22c55e; border-radius:8px; padding:10px 14px; margin-bottom:16px;">
                <strong style="color:#166534;">Médico asignado: ${paciente.profesional_nombre}</strong>
            </div>
            `}
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
                <div id="solicitud-medico-section" style="margin-top:16px; padding-top:16px; border-top:1px solid var(--border-subtle);">
                    <label style="font-weight:600; display:block; margin-bottom:8px;">${paciente.profesional_nombre ? 'Cambiar o solicitar nuevo médico' : 'Solicitar vinculación con médico'}</label>
                    <select id="solicitar-profesional-select" style="width:100%; padding:10px 12px; border-radius:8px; border:1px solid var(--border-subtle); background:var(--surface-card); color:var(--text-primary);">
                        <option value="">Selecciona un profesional</option>
                        ${profesionalesOptions}
                    </select>
                    <button type="button" id="btn-enviar-solicitud-medico" class="btn btn-primary" style="margin-top:10px; width:100%;" disabled>Enviar solicitud de vinculación</button>
                    <div id="solicitud-medico-msg" style="margin-top:8px; font-size:0.85rem; display:none;"></div>
                </div>
                <div class="form-actions" style="margin-top:16px;">
                    <button type="button" id="volver-paciente-lista" class="btn btn-secondary">Volver</button>
                    <button type="button" id="btn-compartir-resumen" class="btn btn-primary" style="background-color: #5a9a8c;"><i class="ti ti-share" style="margin-right: 6px;"></i>Compartir Resumen</button>
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                </div>
                <div id="editar-paciente-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="editar-paciente-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    container.innerHTML = detalleHtml;

    // Lógica del botón de solicitud de vinculación
    const solicitarSelect = document.getElementById('solicitar-profesional-select');
    const btnSolicitar = document.getElementById('btn-enviar-solicitud-medico');
    const solicitudMsg = document.getElementById('solicitud-medico-msg');

    if (solicitarSelect && btnSolicitar) {
        solicitarSelect.addEventListener('change', () => {
            btnSolicitar.disabled = !solicitarSelect.value;
        });

        btnSolicitar.addEventListener('click', async () => {
            const option = solicitarSelect.options[solicitarSelect.selectedIndex];
            if (!option || !option.value) return;

            const emailProfesional = option.dataset.email || '';
            if (!emailProfesional) {
                if (solicitudMsg) {
                    solicitudMsg.textContent = 'El profesional seleccionado no tiene un email registrado.';
                    solicitudMsg.style.color = '#ef4444';
                    solicitudMsg.style.display = 'block';
                }
                return;
            }

            btnSolicitar.disabled = true;
            btnSolicitar.textContent = 'Enviando...';

            const solicitud = {
                id_paciente: idPaciente,
                email_solicitante: emailCuidador,
                rol_solicitante: 'cuidador',
                email_destinatario: emailProfesional,
                mensaje: `El cuidador solicita vincular al paciente "${paciente.nombre}" a su cuenta profesional.`
            };

                        const resp = await crearSolicitudVinculacion(solicitud);
            if (resp.success) {
                if (solicitudMsg) {
                    solicitudMsg.textContent = 'Solicitud de vinculacion enviada al medico. Debe aceptarla para completar la relacion.';
                    solicitudMsg.style.color = '#16a34a';
                    solicitudMsg.style.display = 'block';
                }
                btnSolicitar.disabled = true;
                btnSolicitar.textContent = 'Solicitud enviada';
            } else {
                if (solicitudMsg) {
                    solicitudMsg.textContent = resp.message || 'Error al enviar la solicitud.';
                    solicitudMsg.style.color = '#ef4444';
                    solicitudMsg.style.display = 'block';
                }
                btnSolicitar.disabled = false;
                btnSolicitar.textContent = 'Enviar solicitud de vinculacion';
            }
        });
    }

    // Boton Volver
    document.getElementById('volver-paciente-lista')?.addEventListener('click', closeFloatingModal);

    // Botón Compartir Resumen
    document.getElementById('btn-compartir-resumen')?.addEventListener('click', async () => {
        const [medicamentos, citas, bitacora] = await Promise.all([
            obtenerMedicamentosPaciente(idPaciente),
            obtenerCitasPaciente(idPaciente),
            obtenerBitacoraRegistros(idPaciente)
        ]);
        openResumenPacienteModal(paciente, medicamentos, citas, bitacora);
    });

    // Submit del formulario de edicion
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
            successDiv.textContent = 'Paciente actualizado con exito.';
            successDiv.style.display = 'block';
        }

        setTimeout(() => {
            closeFloatingModal();
            const pageContainer = document.getElementById('cuidador-content-area');
            if (pageContainer) renderPacientesSection(pageContainer);
        }, 800);
    });
}
