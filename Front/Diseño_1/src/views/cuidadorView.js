// // src/views/cuidadorView.js
// import { obtenerDatosSeccion } from '../services/data.service.js';

// export function cuidadorView() {
//     if (!document.getElementById('zoe-global-style')) {
//         const styleLink = document.createElement('link');
//         styleLink.id = 'zoe-global-style';
//         styleLink.rel = 'stylesheet';
//         styleLink.href = '/Proyecto_Integrador/Front/Diseño_1/src/styles/styles.css';
//         document.head.appendChild(styleLink);
//     }

//     const estructuraCuidadorBase = `
//         <div class="dashboard-grid fade-in">
//             <section class="main-content-column">
                
//                 <div class="card card-main-cuidador">
//                     <h3>PACIENTE BAJO ASISTENCIA ACTUAL</h3>
//                     <div class="doctor-info">
//                         <div class="doctor-avatar"></div>
//                         <div class="doctor-meta">
//                             <h4>Don Alberto Gómez</h4>
//                             <p>Asistencia y Monitoreo del Adulto Mayor</p>
//                         </div>
//                     </div>
//                     <div class="appointment-date">
//                         <span><i class="ti ti-clock"></i> Turno actual: Mañana</span>
//                         <span><i class="ti ti-activity"></i> Estado: Estable</span>
//                     </div>
//                 </div>

//                 <div class="vitals-grid">
//                     <div class="vital-card vital-pressure">
//                         <span class="vital-value">110/70</span>
//                         <span class="vital-label">Presión Arterial (Normal)</span>
//                     </div>
//                     <div class="vital-card vital-oxygen">
//                         <span class="vital-value">97%</span>
//                         <span class="vital-label">Saturación de Oxígeno</span>
//                     </div>
//                 </div>
                
//             </section>

//             <aside class="right-content-column">
//                 <div class="card">
//                     <h3>Medicamentos del Turno</h3>
//                     <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Progreso de suministro diario</p>
//                     <div class="progress-bar-container">
//                         <div class="progress-bar" style="width: 33%;"></div>
//                     </div>
//                     <div class="progress-labels">
//                         <span>1 de 3 dosis entregadas</span>
//                     </div>
//                 </div>

//                 <div class="card">
//                     <h3>Controles Rápidos</h3>
//                     <ul class="actions-list">
//                         <li id="btn-med">Suministrar Pastilla Mañana <span class="arrow">›</span></li>
//                         <li id="btn-alerta" style="color: #ef4444;">Notificar Alerta Familiar <span class="arrow" style="color: #ef4444;">›</span></li>
//                     </ul>
//                 </div>
//             </aside>
//         </div>
//     `;

//     setTimeout(() => {
//         initCuidadorEvents(estructuraCuidadorBase);
//     }, 0);

//     // Activamos la clase layout-cuidador e inyectamos el botón hamburguesa con id="hamburguesa-toggle"
//     return `
//         <div class="dashboard-layout layout-cuidador">
//             <aside class="sidebar sidebar-cuidador">
//                 <div class="sidebar-logo">Zoe Care</div>
//                 <nav class="sidebar-menu">
//                     <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Inicio Asistencia</a>
//                     <a href="#" class="menu-item" data-view="pacientes"><i class="ti ti-users"></i> Mis Pacientes</a>
//                     <a href="#" class="menu-item" data-view="bitacora"><i class="ti ti-notes"></i> Bitácora Diaria</a>
//                     <a href="#/" class="menu-item logout-item"><i class="ti ti-logout"></i> Cerrar Sesión</a>
//                 </nav>
//             </aside>

//             <div class="dashboard-main">
//                 <header class="dashboard-header">
//                     <button class="menu-hamburger-btn" id="hamburguesa-toggle" aria-label="Abrir menú">
//                         <span></span>
//                         <span></span>
//                         <span></span>
//                     </button>
//                     <div class="welcome-text">
//                         <h2>Hola, Juana Pérez</h2>
//                         <span class="current-date">Viernes, 10 julio 2026</span>
//                     </div>
//                     <div class="header-actions-group">
//                         <div class="header-search">
//                             <input type="text" placeholder="Buscar pacientes, bitácora...">
//                         </div>
//                         <div class="avatar">JP</div>
//                     </div>
//                 </header>

//                 <div id="cuidador-content-area">
//                     ${estructuraCuidadorBase}
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function initCuidadorEvents(baseHtml) {
//     const menuItems = document.querySelectorAll('.sidebar-cuidador .menu-item[data-view]');
//     const contentArea = document.getElementById('cuidador-content-area');

//     if (!contentArea) return;

//     menuItems.forEach(item => {
//         item.addEventListener('click', async (e) => {
//             e.preventDefault();
//             menuItems.forEach(i => i.classList.remove('active'));
//             item.classList.add('active');

//             const vista = item.getAttribute('data-view');
//             if (vista === 'dashboard') {
//                 contentArea.innerHTML = baseHtml;
//                 initActionButtons();
//             } else {
//                 contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando...</p></div>';
//                 contentArea.innerHTML = await obtenerDatosSeccion(vista, 'cuidador');
//             }
//         });
//     });

//     initActionButtons();
// }

// function initActionButtons() {
//     const btnMed = document.getElementById('btn-med');
//     const btnAlerta = document.getElementById('btn-alerta');

//     if (btnMed) {
//         btnMed.addEventListener('click', () => {
//             alert('💊 Dosis marcada como suministrada con éxito a Don Alberto.');
//         });
//     }
//     if (btnAlerta) {
//         btnAlerta.addEventListener('click', () => {
//             alert('🚨 Alerta enviada inmediatamente a los familiares de Don Alberto Gómez.');
//         });
//     }
// }




















































// src/views/cuidadorView.js

// Importación unificada del servicio de datos puros
import { obtenerDatosSeccion } from '../services/data.service.js';

/**
 * Función principal encargada de construir y retornar el layout del Cuidador.
 * @returns {string} El string HTML maestro de la interfaz del cuidador.
 */
export function cuidadorView() {
    
    // Inyección de la hoja de estilos compartida en el DOM
    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/Proyecto_Integrador/Front/Diseño_1/src/styles/styles.css';
        document.head.appendChild(styleLink);
    }

    // Estructura HTML del panel de bienvenida (Dashboard) del cuidador
    const estructuraDashboardBase = `
        <div class="dashboard-grid fade-in">
            <section class="main-content-column">
                
                <!-- TARJETA PRINCIPAL DE CONTROL DIARIO -->
                <div class="card card-main-cuidador">
                    <h3>Panel de Monitoreo Diario</h3>
                    <div class="doctor-info">
                        <div class="doctor-avatar"></div>
                        <div class="doctor-meta">
                            <h4>Paciente Asignado: Miren Yagoo</h4>
                            <p>Turno Activo: Mañana y Tarde</p>
                        </div>
                    </div>
                    <div class="appointment-date">
                        <span><i class="ti ti-heart-rate-monitor"></i> Estado: Estable</span>
                        <span><i class="ti ti-clock"></i> Próxima Toma: 08:00 PM</span>
                    </div>
                </div>

                <!-- BLOQUE DE REGISTROS DE BITÁCORA EN TIEMPO REAL -->
                <div class="card">
                    <h3>Bitácora de Eventos Recientes</h3>
                    <div class="caregiver-log-container" id="contenedor-log-eventos-dashboard">
                        <div class="log-entry">
                            <div class="log-info">
                                <span>08:15 AM - Glucosa</span>
                                <p>Registro de glucemia en ayunas: 115 mg/dL. Administrada insulina correspondiente.</p>
                            </div>
                            <span class="badge-status">Registrado</span>
                        </div>
                        <div class="log-entry">
                            <div class="log-info">
                                <span>10:30 AM - Actividad</span>
                                <p>Caminata ligera de 12 minutos por el pasillo. Tolerancia adecuada sin disnea.</p>
                            </div>
                            <span class="badge-status">Registrado</span>
                        </div>
                    </div>
                </div>

            </section>

            <!-- COLUMNA LATERAL DERECHA (RECORDATORIOS Y ACCIONES) -->
            <aside class="right-content-column">
                <div class="card quick-actions-card">
                    <h3>Controles de Turno</h3>
                    <ul class="actions-list">
                        <li class="action-item" id="btn-cuidador-registrar-signos">Registrar Signos Vitales <span class="arrow">›</span></li>
                        <li class="action-item" id="btn-cuidador-añadir-bitacora">Añadir Nota a Bitácora <span class="arrow">›</span></li>
                    </ul>
                </div>

                <div class="card reminder-card">
                    <div class="rhead"><i class="ti ti-alert-circle"></i> Indicación Médica Crítica</div>
                    <p>Si la glucosa en ayunas sobrepasa los 130 mg/dL, notificar de inmediato al Dr. Zoe.</p>
                </div>
            </aside>
        </div>
    `;

    // Temporizador seguro para inyectar los controladores de clics una vez renderizado
    setTimeout(() => {
        initCuidadorDashboardEvents(estructuraDashboardBase);
    }, 0);

    // Retorno del Layout con la estructura responsiva y sidebar-cuidador
    return `
        <div class="dashboard-layout layout-cuidador">
            
            <!-- CAPA OSCURA DE FONDO PARA RESPONSIVE MÓVIL -->
            <div class="sidebar-backdrop" id="capa-oscura-sidebar"></div>

            <!-- MENÚ DE NAVEGACIÓN LATERAL DEL CUIDADOR -->
            <aside class="sidebar sidebar-cuidador" id="menu-lateral-responsive">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Dashboard</a>
                    <a href="#" class="menu-item" data-view="citas"><i class="ti ti-calendar-event"></i> Visitas Médicas</a>
                    <a href="#" class="menu-item" data-view="mensajes"><i class="ti ti-message-circle"></i> Chat con Médico</a>
                    <a href="#" class="menu-item" data-view="resultados"><i class="ti ti-file-report"></i> Historial Clínico</a>
                    <a href="#" class="menu-item" data-view="medicacion"><i class="ti ti-pill"></i> Plan de Medicación</a>
                    <a href="#/" class="menu-item logout-item"><i class="ti ti-logout"></i> Cerrar Sesión</a>
                </nav>
            </aside>

            <!-- CONTENEDOR PRINCIPAL DERECHO -->
            <div class="dashboard-main">
                <header class="dashboard-header">
                    <!-- BOTÓN HAMBURGUESA RESPONSIVE -->
                    <button class="menu-hamburger-btn" id="hamburguesa-toggle" aria-label="Abrir menú">
                        <span></span><span></span><span></span>
                    </button>
                    <div class="welcome-text">
                        <h2>Panel del Cuidador</h2>
                        <span class="current-date">Viernes, 10 julio 2026</span>
                    </div>
                    <div class="avatar">ZC</div>
                </header>

                <!-- Área de visualización cambiante -->
                <div id="dynamic-content-area-cuidador">
                    ${estructuraDashboardBase}
                </div>

            </div>

            <!-- CONTENEDOR DE MODALES REUTILIZADO DESDE EL CSS GLOBAL -->
            <div class="zoe-modal-overlay hidden" id="ventana-modal-emergente-global">
                <div class="zoe-modal-card">
                    <button class="close-modal-btn" id="boton-cerrar-ventana-modal">×</button>
                    <div id="contenedor-contenido-interno-modal"></div>
                </div>
            </div>

        </div>
    `;
}


// =========================================================================================
// ENRUTADOR DE PESTAÑAS Y SOPORTE RESPONSIVE MÓVIL (CUIDADOR)
// =========================================================================================
/**
 * Administra el menú del cuidador y controla la apertura/cierre del menú hamburguesa en celulares.
 * @param {string} htmlBaseDashboard - Código HTML estructurado de la pantalla principal.
 */
function initCuidadorDashboardEvents(htmlBaseDashboard) {
    const elementosMenuLateral = document.querySelectorAll('.sidebar-cuidador .menu-item[data-view]');
    const areaContenidoDinamico = document.getElementById('dynamic-content-area-cuidador');
    
    // Elementos del DOM para controlar el diseño responsivo móvil
    const botonHamburguesa = document.getElementById('hamburguesa-toggle');
    const menuLateralMóvil = document.getElementById('menu-lateral-responsive');
    const capaOscuraFondo = document.getElementById('capa-oscura-sidebar');

    if (!areaContenidoDinamico) return;

    // --- LÓGICA DE DETECCIÓN Y APERTURA RESPONSIVE (MÓVIL) ---
    if (botonHamburguesa && menuLateralMóvil && capaOscuraFondo) {
        // Función unificada para cerrar el menú lateral en celulares
        const cerrarMenuMóvil = () => {
            botonHamburguesa.classList.remove('open');
            menuLateralMóvil.classList.remove('sidebar-open');
            capaOscuraFondo.classList.remove('active');
        };

        // Abrir/Cerrar menú lateral al presionar las tres líneas del botón hamburguesa
        botonHamburguesa.onclick = (e) => {
            e.stopPropagation();
            botonHamburguesa.classList.toggle('open');
            menuLateralMóvil.classList.toggle('sidebar-open');
            capaOscuraFondo.classList.toggle('active');
        };

        // Cerrar automáticamente si el usuario da clic sobre el fondo oscuro translúcido
        capaOscuraFondo.onclick = cerrarMenuMóvil;
    }

    // --- GESTIÓN ASÍNCRONA DE LAS PESTAÑAS LATERALES ---
    elementosMenuLateral.forEach(itemMenu => {
        itemMenu.addEventListener('click', async (eventoClic) => {
            eventoClic.preventDefault();
            
            elementosMenuLateral.forEach(item => item.classList.remove('active'));
            itemMenu.classList.add('active');

            // Si estamos en celular, cerramos el menú automáticamente al seleccionar una pestaña
            if (botonHamburguesa && menuLateralMóvil && capaOscuraFondo) {
                botonHamburguesa.classList.remove('open');
                menuLateralMóvil.classList.remove('sidebar-open');
                capaOscuraFondo.classList.remove('active');
            }

            const nombreVistaSolicitada = itemMenu.getAttribute('data-view');

            if (nombreVistaSolicitada === 'dashboard') {
                areaContenidoDinamico.innerHTML = htmlBaseDashboard;
                configurarEventosDelDashboardCuidador();
                return;
            }

            // Efecto visual limpio de carga interactiva
            areaContenidoDinamico.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando registros de asistencia...</p></div>';
            
            // Consumo de datos puros desde tu archivo data.service.js
            const datosPurosServidor = await obtenerDatosSeccion(nombreVistaSolicitada, 'cuidador');

            if (datosPurosServidor.error) {
                areaContenidoDinamico.innerHTML = `<div class="card fade-in"><p style="color:red; font-weight:600;">${datosPurosServidor.msg}</p></div>`;
                return;
            }

            // Enrutador visual para fabricar las sub-pantallas del cuidador
            switch (nombreVistaSolicitada) {
                case 'citas':
                    renderizarPestañaVisitasMedicas(areaContenidoDinamico, datosPurosServidor);
                    break;
                case 'mensajes':
                    renderizarPestañaChatConMedico(areaContenidoDinamico, datosPurosServidor);
                    break;
                case 'resultados':
                    renderizarPestañaHistorialClinicoPaciente(areaContenidoDinamico, datosPurosServidor);
                    break;
                case 'medicacion':
                    renderizarPestañaPlanMedicaciónDiaria(areaContenidoDinamico, datosPurosServidor);
                    break;
            }
        });
    });

    // Encendido operativo de las funciones del Dashboard en la primera carga
    configurarEventosDelDashboardCuidador();
}





// =========================================================================================
// CONSTRUCTORES DE PESTAÑAS EXCLUSIVAS DEL CUIDADOR (ESTILO PREMIUM)
// =========================================================================================

/**
 * PESTAÑA 1: Listado de Visitas Médicas y Consultas de Agenda
 */
function renderizarPestañaVisitasMedicas(contenedorArea, datos) {
    const listadoCitas = datos.items || [];
    
    const htmlCitas = listadoCitas.map(cita => {
        const hora = cita.hora || cita.Hora || '10:30 AM';
        const motivo = cita.motivo || cita.Motivo || 'Control de Rutina';
        const medico = cita.medico || cita.Medico || 'Dr. Asignado';

        return `
            <div class="cita-schedule-card">
                <div class="cita-time-badge">${hora}</div>
                <div class="cita-body-info">
                    <h4>${medico}</h4>
                    <p class="cita-meta-tag"><i class="ti ti-user-doctor"></i> ${motivo}</p>
                    <span class="badge-status-item pendiente">Agendada</span>
                </div>
            </div>
        `;
    }).join('');

    contenedorArea.innerHTML = `
        <div class="card fade-in">
            <h3>${datos.title || 'Visitas Médicas Programadas'}</h3>
            <p style="color: var(--text-muted); margin-bottom: 24px;">${datos.description || 'Cronograma de asistencia de profesionales en el domicilio o consultorio.'}</p>
            <div class="citas-timeline-grid">${htmlCitas || '<p>No hay visitas médicas registradas para el paciente.</p>'}</div>
        </div>
    `;
}

/**
 * PESTAÑA 2: Canal de Comunicación directo con el Médico Internista
 */
function renderizarPestañaChatConMedico(contenedorArea, datos) {
    contenedorArea.innerHTML = `
        <div class="card fade-in chat-interface-container">
            <h3>Canal de Comunicación Clínico</h3>
            <p style="color: var(--text-muted); margin-bottom: 16px;">Reporte anomalías o variaciones de signos vitales al profesional a cargo.</p>
            
            <div class="chat-messages-box" id="caja-mensajes-cuidador">
                <div class="chat-bubble caregiver-bubble">
                    <span class="bubble-meta">Tú - 08:15 AM</span>
                    <p>Buenos días Doctor, el paciente amaneció con la glucosa un poco alta (115 mg/dL). Ya se le administró el medicamento.</p>
                </div>
                <div class="chat-bubble professional-bubble">
                    <span class="bubble-meta">Dr. Zoe Professional - 09:00 AM</span>
                    <p>Perfecto. Manténgalo en observación y si pasa de 130 me avisa de inmediato para ajustar la dosis.</p>
                </div>
            </div>
            
            <form id="form-enviar-mensaje-cuidador" class="chat-input-bar">
                <input type="text" id="input-texto-chat-cuidador" placeholder="Escriba un reporte inmediato o duda sobre el tratamiento..." required autocomplete="off">
                <button type="submit" class="btn-enviar-chat"><i class="ti ti-send"></i> Enviar</button>
            </form>
        </div>
    `;

    // Manejo interactivo del envío de burbujas en la vista del cuidador
    const formChat = document.getElementById('form-enviar-mensaje-cuidador');
    if (formChat) {
        formChat.onsubmit = (e) => {
            e.preventDefault();
            const inputTxt = document.getElementById('input-texto-chat-cuidador');
            const cajaChat = document.getElementById('caja-mensajes-cuidador');
            
            if (inputTxt.value.trim() === '') return;

            const nuevaBurbuja = document.createElement('div');
            nuevaBurbuja.className = 'chat-bubble caregiver-bubble fade-in';
            nuevaBurbuja.innerHTML = `
                <span class="bubble-meta">Tú - Ahora</span>
                <p>${inputTxt.value}</p>
            `;
            cajaChat.appendChild(nuevaBurbuja);
            inputTxt.value = '';
            cajaChat.scrollTop = cajaChat.scrollHeight; // Auto-scroll dinámico
        };
    }
}




/**
 * PESTAÑA 3: Historial Clínico Resumido del Paciente Activo
 */
function renderizarPestañaHistorialClinicoPaciente(contenedorArea, datos) {
    contenedorArea.innerHTML = `
        <div class="card fade-in">
            <h3>Expediente Clínico y Antecedentes</h3>
            <p style="color: var(--text-muted); margin-bottom: 24px;">Resumen clínico autorizado para la gestión del cuidado diario.</p>
            
            <div class="modal-timeline" style="max-height: none; overflow: visible;">
                <div class="timeline-step">
                    <span class="step-date">Diagnóstico Base</span>
                    <p><strong>Diabetes Mellitus Tipo 2:</strong> Paciente insulinodependiente con picos glucémicos variables en ayunas.</p>
                </div>
                <div class="timeline-step">
                    <span class="step-date">Restricciones</span>
                    <p><strong>Hipertensión Arterial Sistémica:</strong> Controlar la ingesta de sodio. Monitoreo diario si reporta cefalea o mareos.</p>
                </div>
                <div class="timeline-step">
                    <span class="step-date">Alergias</span>
                    <p style="color: var(--vital-heart-color); font-weight: 700;">Alergia Severa a la Penicilina.</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * PESTAÑA 4: Plan de Medicación y Horarios de Toma Diarios
 */
function renderizarPestañaPlanMedicaciónDiaria(contenedorArea, datos) {
    contenedorArea.innerHTML = `
        <div class="card fade-in">
            <h3>Plan de Medicación Diaria</h3>
            <p style="color: var(--text-muted); margin-bottom: 24px;">Horarios establecidos por el médico para la administración segura de fármacos.</p>
            
            <div class="citas-timeline-grid">
                <!-- Toma 1 -->
                <div class="cita-schedule-card">
                    <div class="cita-time-badge" style="background-color: rgba(84, 117, 101, 0.1); color: var(--vital-oxygen-color);">08:00 AM</div>
                    <div class="cita-body-info">
                        <h4>Metformina 850mg</h4>
                        <p class="cita-meta-tag"><i class="ti ti-pill" style="color: var(--vital-glucose-color);"></i> 1 Tableta - Junto con el desayuno</p>
                        <span class="badge-status-item completado" style="background-color: rgba(84, 117, 101, 0.12); color: var(--vital-oxygen-color);">Suministrado</span>
                    </div>
                </div>

                <!-- Toma 2 -->
                <div class="cita-schedule-card">
                    <div class="cita-time-badge" style="background-color: rgba(210, 150, 127, 0.1); color: var(--accent-terracota);">10:00 PM</div>
                    <div class="cita-body-info">
                        <h4>Insulina Glargina</h4>
                        <p class="cita-meta-tag"><i class="ti ti-syringe" style="color: var(--vital-heart-color);"></i> 14 Unidades - Vía subcutánea nocturna</p>
                        <span class="badge-status-item pendiente">Pendiente</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}



// =========================================================================================
// LÓGICA CORE: CONTROL DE CONTROLES DE TURNO Y ACCIONES EN EL DASHBOARD
// =========================================================================================
/**
 * Inicializa y asocia los formularios modales interactivos a los botones de acciones rápidas del cuidador.
 */
function configurarEventosDelDashboardCuidador() {
    
    // SISTEMA DE CONTROL DE LA VENTANA MODAL (REUTILIZANDO LA INFRAESTRUCTURA DE TU LAYOUT GLOBAL)
    const modalOverlay = document.getElementById('ventana-modal-emergente-global');
    const contenidoModal = document.getElementById('contenedor-contenido-interno-modal');
    const btnCerrarModalCruz = document.getElementById('boton-cerrar-ventana-modal');

    const desplegarModal = (htmlFormulario) => {
        if (!modalOverlay || !contenidoModal) return;
        contenidoModal.innerHTML = htmlFormulario;
        modalOverlay.classList.remove('hidden');
        setTimeout(() => modalOverlay.classList.add('active'), 10);
    };

    const ocultarModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        setTimeout(() => modalOverlay.classList.add('hidden'), 300);
    };

    if (btnCerrarModalCruz) btnCerrarModalCruz.onclick = ocultarModal;

    // BOTÓN 1: REGISTRAR SIGNOS VITALES (ABRE FORMULARIO MODAL INTERACTIVO)
    const btnRegistrarSignos = document.getElementById('btn-cuidador-registrar-signos');
    if (btnRegistrarSignos) {
        btnRegistrarSignos.onclick = () => {
            desplegarModal(`
                <h3 class="modal-title">Registrar Signos Vitales</h3>
                <p class="modal-subtitle">Ingrese las constantes clínicas medidas al paciente en este turno.</p>
                <form id="form-modal-cuidador-signos" class="modal-form">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <div class="modal-field">
                            <label>Glucosa (mg/dL)</label>
                            <input type="number" id="input-vital-glucosa" placeholder="Ej: 105" required>
                        </div>
                        <div class="modal-field">
                            <label>Ritmo Cardíaco (ppm)</label>
                            <input type="number" id="input-vital-ritmo" placeholder="Ej: 75" required>
                        </div>
                        <div class="modal-field">
                            <label>Saturación O2 (%)</label>
                            <input type="number" id="input-vital-oxigeno" placeholder="Ej: 98" required>
                        </div>
                        <div class="modal-field">
                            <label>Presión Arterial</label>
                            <input type="number" id="input-vital-presion" placeholder="Ej: 120" required>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancelar-modal" id="btn-cancelar-signos">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal" style="background-color: var(--primary-zoe-salvia);">Guardar Medición</button>
                    </div>
                </form>
            `);

            document.getElementById('btn-cancelar-signos').onclick = ocultarModal;

            // Simulación de guardado: Al hacer submit, avisa al cuidador y cierra de forma limpia
            document.getElementById('form-modal-cuidador-signos').onsubmit = (e) => {
                e.preventDefault();
                alert("✓ Signos vitales registrados y guardados exitosamente en la base de datos.");
                ocultarModal();
            };
        };
    }

    // BOTÓN 2: AÑADIR NOTA A BITÁCORA (INSPECCIONA Y AGREGA RENGLONES EN CALIENTE AL DASHBOARD)
    const btnAñadirBitacora = document.getElementById('btn-cuidador-añadir-bitacora');
    if (btnAñadirBitacora) {
        btnAñadirBitacora.onclick = () => {
            desplegarModal(`
                <h3 class="modal-title">Nueva Entrada de Bitácora</h3>
                <p class="modal-subtitle">Describa cualquier novedad, sintomatología o evento relevante observado.</p>
                <form id="form-modal-cuidador-bitacora" class="modal-form">
                    <div class="modal-field">
                        <label>Categoría / Tipo de Evento</label>
                        <input type="text" id="input-bitacora-categoria" placeholder="Ej: Alimentación, Estado de Ánimo, Incidencia" required>
                    </div>
                    <div class="modal-field">
                        <label>Descripción de Observaciones</label>
                        <textarea id="input-bitacora-observacion" rows="3" placeholder="Ej: El paciente consumió la totalidad del almuerzo y reporta bienestar..." required></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancelar-modal" id="btn-cancelar-bitacora">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal" style="background-color: var(--primary-zoe-salvia);">Registrar Evento</button>
                    </div>
                </form>
            `);

            document.getElementById('btn-cancelar-bitacora').onclick = ocultarModal;

            // Lógica reactiva: Toma lo escrito en el modal e inyecta la nueva nota en el Dashboard al instante
            document.getElementById('form-modal-cuidador-bitacora').onsubmit = (e) => {
                e.preventDefault();

                const categoria = document.getElementById('input-bitacora-categoria').value;
                const observacion = document.getElementById('input-bitacora-observacion').value;
                const contenedorLog = document.getElementById('contenedor-log-eventos-dashboard');

                if (contenedorLog) {
                    // Creamos el nuevo bloque estético de bitácora
                    const nuevoLogHtml = document.createElement('div');
                    nuevoLogHtml.className = 'log-entry fade-in';
                    nuevoLogHtml.innerHTML = `
                        <div class="log-info">
                            <span>Ahora - ${categoria}</span>
                            <p>${observacion}</p>
                        </div>
                        <span class="badge-status">Registrado</span>
                    `;
                    // Lo insertamos al inicio de la lista de novedades del Dashboard
                    contenedorLog.insertBefore(nuevoLogHtml, contenedorLog.firstChild);
                }

                ocultarModal();
            };
        };
    }
}



