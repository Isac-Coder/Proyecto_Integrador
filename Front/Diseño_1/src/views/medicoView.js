


// src/views/medicoView.js

// Importación unificada de tu archivo de servicios centralizado (ahora con datos puros)
import { obtenerDatosSeccion } from '../services/data.service.js';

/**
 * Función principal encargada de construir y retornar el layout del profesional.
 * @returns {string} El string HTML maestro de la interfaz médica.
 */
export function profesionalView() {
    
    // Inyección automática y segura de la hoja de estilos en la cabecera del documento
    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/Proyecto_Integrador/Front/Diseño_1/src/styles/styles.css';
        document.head.appendChild(styleLink);
    }

    // Plantilla HTML del panel central. Posee IDs únicos para actualizar sus textos dinámicamente.
    const estructuraDashboardBase = `
        <div class="dashboard-grid fade-in">
            <section class="main-content-column">
                
                <!-- COMPONENTE: SELECTOR DESPLEGABLE PARA CAMBIAR DE PACIENTE ACTIVO -->
                <div class="patient-selector-wrapper">
                    <div class="custom-dropdown" id="contenedor-desplegable-paciente">
                        <div class="dropdown-selected" id="boton-abrir-desplegable-paciente">
                            <div class="selected-info">
                                <div class="avatar-sm"></div>
                                <span id="texto-nombre-paciente-actual">Miren Yagoo</span>
                            </div>
                            <span class="arrow-icon">▼</span>
                        </div>
                        <div class="dropdown-list hidden" id="lista-desplegable-de-pacientes"></div>
                    </div>
                </div>

                <!-- COMPONENTE: TARJETA DE LA PRÓXIMA CITA CLÍNICA -->
                <div class="card next-appointment-card">
                    <h3>PRÓXIMA CONSULTA / ASISTENCIA</h3>
                    <div class="doctor-info">
                        <div class="doctor-avatar"></div>
                        <div class="doctor-meta">
                            <h4 id="texto-cita-nombre-paciente">Paciente: Miren Yagoo</h4>
                            <p id="texto-cita-motivo-consulta">Control de Monitoreo General</p>
                        </div>
                    </div>
                    <div class="appointment-date">
                        <span id="texto-cita-fecha"><i class="ti ti-calendar"></i> Hoy, 10 Jul</span>
                        <span id="texto-cita-hora"><i class="ti ti-clock"></i> 02:30 PM</span>
                        <span id="texto-cita-consultorio"><i class="ti ti-map-pin"></i> Consultorio 3</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-reprogramar" id="boton-reprogramar-cita">Reprogramar</button>
                        <button class="btn-detalles" id="boton-ver-historial-clinico">Ver Historial</button>
                    </div>
                </div>
                <!-- COMPONENTE: REJILLA DE TARJETAS DE CONSTANTES Y SIGNOS VITALES -->
                <div class="vitals-grid">
                    <div class="vital-card vital-glucose">
                        <span class="vital-value" id="valor-signo-glucosa">102</span>
                        <span class="vital-label">Glucosa mg/dL</span>
                    </div>
                    <div class="vital-card vital-heart">
                        <span class="vital-value" id="valor-signo-ritmo-cardiaco">78</span>
                        <span class="vital-label">Ritmo cardíaco</span>
                    </div>
                    <div class="vital-card vital-oxygen">
                        <span class="vital-value" id="valor-signo-saturacion-oxigeno">98%</span>
                        <span class="vital-label">Saturación O2</span>
                    </div>
                    <div class="vital-card vital-pressure">
                        <span class="vital-value" id="valor-signo-presion-arterial">139</span>
                        <span class="vital-label">Presión arterial</span>
                    </div>
                </div>

                <!-- COMPONENTE: BLOQUE DEL GRÁFICO DE EVOLUCIÓN ESTADÍSTICA -->
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

            <!-- COLUMNA ASIDE DERECHA (PANELES METRICOS Y ACCIONES DE FORMULARIOS) -->
            <aside class="right-content-column">
                
                <!-- COMPONENTE: SEGUIMIENTO VISUAL DE LA BARRA DE PROGRESO -->
                <div class="card tracking-card">
                    <h3>Seguimiento del Plan de Cuidado</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Progreso General</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="barra-visual-progreso-plan" style="width: 60%;"></div>
                    </div>
                    <div class="progress-labels">
                        <span id="texto-porcentaje-progreso-plan">60% completado</span>
                    </div>
                </div>

                <!-- COMPONENTE: MENÚ LATERAL DE ACCIONES RÁPIDAS (ACCESO A MODALES) -->
                <div class="card quick-actions-card">
                    <h3>Acciones rápidas</h3>
                    <ul class="actions-list">
                        <li class="action-item" id="boton-accion-emitir-indicaciones" data-target="medicacion">Emitir indicaciones <span class="arrow">›</span></li>
                        <li class="action-item" id="boton-accion-subir-reporte-clinico" data-target="resultados">Subir reporte clínico <span class="arrow">›</span></li>
                    </ul>
                </div>

                <!-- COMPONENTE: NOTAS CLÍNICAS ENVIADAS DESDE EL MÓDULO CUIDADOR -->
                <div class="card reminder-card">
                    <div class="rhead"><i class="ti ti-notes"></i> Notas del Turno</div>
                    <p id="texto-notas-observaciones-cuidador">Revisar observaciones enviadas por el cuidador en la mañana.</p>
                </div>
            </aside>
        </div>
    `;


    // Temporizador seguro que espera a que el HTML esté inyectado en el DOM para activar los clics
    setTimeout(() => {
        initProfesionalDashboardEvents(estructuraDashboardBase);
    }, 0);

    // Retornamos el Layout maestro del profesional con el menú lateral, encabezado y área dinámica
    return `
        <div class="dashboard-layout layout-profesional">
            
            <!-- MENÚ DE NAVEGACIÓN LATERAL -->
            <aside class="sidebar sidebar-profesional">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Dashboard</a>
                    <a href="#" class="menu-item" data-view="citas"><i class="ti ti-calendar-event"></i> Citas / Visitas</a>
                    <a href="#" class="menu-item" data-view="mensajes"><i class="ti ti-message-circle"></i> Mensajes</a>
                    <a href="#" class="menu-item" data-view="resultados"><i class="ti ti-file-report"></i> Resultados</a>
                    <a href="#" class="menu-item" data-view="medicacion"><i class="ti ti-pill"></i> Indicaciones</a>
                    <a href="#" class="menu-item" data-view="perfil"><i class="ti ti-user"></i> Mi Perfil</a>
                    <a href="#/" class="menu-item logout-item"><i class="ti ti-logout"></i> Cerrar Sesión</a>
                </nav>
            </aside>

            <!-- CONTENEDOR PRINCIPAL DERECHO -->
            <div class="dashboard-main">
                <header class="dashboard-header">
                    <button class="menu-hamburger-btn" id="hamburguesa-toggle" aria-label="Abrir menú">
                        <span></span><span></span><span></span>
                    </button>
                    <div class="welcome-text">
                        <h2>Bienvenido Profesional</h2>
                        <span class="current-date">Viernes, 10 julio 2026</span>
                    </div>
                    <div class="header-actions-group">
                        <div class="header-search">
                            <input type="text" placeholder="Buscar pacientes, bitácora...">
                        </div>
                        <div class="avatar">ZP</div>
                    </div>
                </header>

                <!-- Espacio dinámico donde se pintará el Dashboard o las sub-pestañas -->
                <div id="dynamic-content-area">
                    ${estructuraDashboardBase}
                </div>

            </div>

            <!-- CONTENEDOR GLOBAL OCULTO PARA LAS VENTANAS MODALES EMERGENTES -->
            <div class="zoe-modal-overlay hidden" id="ventana-modal-emergente-global">
                <div class="zoe-modal-card">
                    <button class="close-modal-btn" id="boton-cerrar-ventana-modal">×</button>
                    <div id="contenedor-contenido-interno-modal"></div>
                </div>
            </div>

        </div>
    `;
} // <-- Esta llave cierra la función principal export function profesionalView()



// =========================================================================================
// GESTIÓN DE ENRUTAMIENTO DINÁMICO DE PESTAÑAS (FRONTEND MAESTRO)
// =========================================================================================
/**
 * Administra el menú lateral e intercambia las pantallas inyectando interfaces premium en caliente.
 * @param {string} htmlBaseDashboard - Estructura HTML de la pestaña principal del Dashboard.
 */
function initProfesionalDashboardEvents(htmlBaseDashboard) {
    const elementosMenuLateral = document.querySelectorAll('.sidebar-profesional .menu-item[data-view]');
    const areaContenidoDinamico = document.getElementById('dynamic-content-area');

    if (!areaContenidoDinamico) return;

    elementosMenuLateral.forEach(itemMenu => {
        itemMenu.addEventListener('click', async (eventoClic) => {
            eventoClic.preventDefault();
            
            // Gestión visual del botón activo en la barra lateral
            elementosMenuLateral.forEach(item => item.classList.remove('active'));
            itemMenu.classList.add('active');

            const nombreVistaSolicitada = itemMenu.getAttribute('data-view');

            // 1. EVALUAR REGRESO AL DASHBOARD PRINCIPAL
            if (nombreVistaSolicitada === 'dashboard') {
                areaContenidoDinamico.innerHTML = htmlBaseDashboard;
                configurarEventosDelDashboardMedico();
                return;
            }

            // Pantalla de carga fluida intermedia
            areaContenidoDinamico.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando interfaz médica...</p></div>';
            
            // 2. ADQUISICIÓN DE DATOS PUROS DESDE TU DATA.SERVICE.JS
            const datosPurosServidor = await obtenerDatosSeccion(nombreVistaSolicitada, 'profesional');

            if (datosPurosServidor.error) {
                areaContenidoDinamico.innerHTML = `<div class="card fade-in"><p style="color:red; font-weight:600;">${datosPurosServidor.msg}</p></div>`;
                return;
            }

            // 3. ENRUTADOR VISUAL INTERNO SEGÚN LA PESTAÑA SELECCIONADA
            switch (nombreVistaSolicitada) {
                case 'citas':
                    renderizarPestañaCitasMedicas(areaContenidoDinamico, datosPurosServidor);
                    break;
                case 'mensajes':
                    renderizarPestañaMensajesChat(areaContenidoDinamico, datosPurosServidor);
                    break;
                case 'resultados':
                    renderizarPestañaResultadosExpediente(areaContenidoDinamico, datosPurosServidor);
                    break;
                case 'medicacion':
                    renderizarPestañaIndicacionesClinicas(areaContenidoDinamico, datosPurosServidor);
                    break;
                case 'perfil':
                    renderizarPestañaPerfilProfesional(areaContenidoDinamico, datosPurosServidor);
                    break;
                default:
                    // Renderizado genérico de respaldo por seguridad
                    const listadoItems = datosPurosServidor.items || [];
                    const htmlGenerico = listadoItems.map(item => {
                        const entries = Object.entries(item || {}).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('');
                        return `<ul style="margin-top:10px; padding-left:20px;">${entries}</ul>`;
                    }).join('');
                    areaContenidoDinamico.innerHTML = `<div class="card fade-in"><h3>${datosPurosServidor.title || 'Sección'}</h3>${htmlGenerico}</div>`;
            }
        });
    });

    // Carga inicial operativa del sistema por defecto
    configurarEventosDelDashboardMedico();
}



// =========================================================================================
// CONSTRUCTORES INTERACTIVOS DE PESTAÑAS LATERALES (ZOE CARE PREMIUM)
// =========================================================================================

/**
 * PESTAÑA 1: Gestión Cronológica de Citas con Edición en Caliente
 */
function renderizarPestañaCitasMedicas(contenedorArea, datos) {
    const listadoCitas = datos.items || [];
    
    const htmlCitas = listadoCitas.map((cita, index) => {
        const paciente = cita.paciente || cita.Paciente || 'Paciente Anónimo';
        const hora = cita.hora || cita.Hora || '00:00';
        const motivo = cita.motivo || cita.Motivo || 'Consulta General';

        return `
            <div class="cita-schedule-card">
                <div class="cita-time-badge" id="citas-hora-texto-${index}">${hora}</div>
                <div class="cita-body-info">
                    <h4 id="citas-paciente-texto-${index}">${paciente}</h4>
                    <p class="cita-meta-tag" id="citas-motivo-texto-${index}"><i class="ti ti-activity"></i> ${motivo}</p>
                    <button class="btn-editar-inline-cita" data-index="${index}"><i class="ti ti-edit"></i> Editar</button>
                </div>
            </div>
        `;
    }).join('');

    contenedorArea.innerHTML = `
        <div class="card fade-in">
            <h3>${datos.title || 'Agenda de Consultas'}</h3>
            <p style="color: var(--text-muted); margin-bottom: 24px;">${datos.description || 'Monitoreo de asistencia médica.'}</p>
            <div class="citas-timeline-grid">${htmlCitas || '<p>No hay citas programadas para hoy.</p>'}</div>
        </div>
    `;

    // Activar los controladores de clics para modificar los datos directamente en el DOM
    activarEdiciónDeCitasEnCaliente(listadoCitas);
}

/**
 * PESTAÑA 2: Chat en Vivo con el Cuidador Asignado
 */
function renderizarPestañaMensajesChat(contenedorArea, datos) {
    contenedorArea.innerHTML = `
        <div class="card fade-in chat-interface-container">
            <h3>Mensajería Directa</h3>
            <p style="color: var(--text-muted); margin-bottom: 16px;">Canal seguro de comunicación con el Cuidador del paciente activo.</p>
            
            <div class="chat-messages-box" id="caja-mensajes-chat">
                <div class="chat-bubble caregiver-bubble">
                    <span class="bubble-meta">Cuidador (Mañana) - 08:15 AM</span>
                    <p>Buenos días Doctor, el paciente amaneció con la glucosa un poco alta (115 mg/dL). Ya se le administró el medicamento.</p>
                </div>
                <div class="chat-bubble professional-bubble">
                    <span class="bubble-meta">Tú - 09:00 AM</span>
                    <p>Perfecto. Manténgalo en observación y si pasa de 130 me avisa de inmediato para ajustar la dosis.</p>
                </div>
            </div>
            
            <form id="formulario-enviar-mensaje-chat" class="chat-input-bar">
                <input type="text" id="texto-nuevo-mensaje-chat" placeholder="Escribe un mensaje urgente o actualización para el cuidador..." required autocomplete="off">
                <button type="submit" class="btn-enviar-chat"><i class="ti ti-send"></i> Enviar</button>
            </form>
        </div>
    `;

    // Manejo de envío de mensajes interactivo en pantalla
    const formChat = document.getElementById('formulario-enviar-mensaje-chat');
    if (formChat) {
        formChat.onsubmit = (e) => {
            e.preventDefault();
            const inputMsg = document.getElementById('texto-nuevo-mensaje-chat');
            const cajaChat = document.getElementById('caja-mensajes-chat');
            
            if (inputMsg.value.trim() === '') return;

            const nuevaBurbuja = document.createElement('div');
            nuevaBurbuja.className = 'chat-bubble professional-bubble fade-in';
            nuevaBurbuja.innerHTML = `
                <span class="bubble-meta">Tú - Ahora</span>
                <p>${inputMsg.value}</p>
            `;
            cajaChat.appendChild(nuevaBurbuja);
            inputMsg.value = '';
            cajaChat.scrollTop = cajaChat.scrollHeight; // Auto scroll hacia abajo
        };
    }
}

/**
 * PESTAÑA 3: Expediente Médico y Visualizador de Resultados (Rx / Lab)
 */
function renderizarPestañaResultadosExpediente(contenedorArea, datos) {
    contenedorArea.innerHTML = `
        <div class="card fade-in">
            <h3>Resultados de Exámenes e Imágenes</h3>
            <p style="color: var(--text-muted); margin-bottom: 24px;">Historial de reportes clínicos y placas radiográficas cargadas en el sistema.</p>
            
            <div class="resultados-grid-layout">
                <!-- EXAMEN 1: RADIOGRAFÍA -->
                <div class="resultado-item-card file-rx">
                    <div class="file-icon-area"><i class="ti ti-box"></i></div>
                    <div class="file-meta-area">
                        <h4>Radiografía de Tórax (Rx)</h4>
                        <span>Cargado: 12 Jul 2026 - Dr. Ramírez</span>
                        <button class="btn-visualizar-archivo" data-tipo="rx">Ver Placa / Imagen</button>
                    </div>
                </div>

                <!-- EXAMEN 2: LABORATORIO -->
                <div class="resultado-item-card file-lab">
                    <div class="file-icon-area"><i class="ti ti-file-analytics"></i></div>
                    <div class="file-meta-area">
                        <h4>Hemograma Completo</h4>
                        <span>Cargado: 10 Jul 2026 - Lab Central</span>
                        <button class="btn-visualizar-archivo" data-tipo="pdf">Ver Reporte Analítico</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Activar simulador de visualización de placas/estudios médicos
    activarVisualizadorDeEstudios();
}



/**
 * PESTAÑA 4: Panel de Control de Indicaciones y Recetas Médicas
 * Construye de forma limpia las tarjetas de instrucciones clínicas en la vista.
 */
function renderizarPestañaIndicacionesClinicas(contenedorArea, datos) {
    contenedorArea.innerHTML = `
        <div class="card fade-in">
            <h3>Indicaciones Médicas y Plan Clínico</h3>
            <p style="color: var(--text-muted); margin-bottom: 24px;">Prescripciones activas e instrucciones de cuidado asignadas para los cuidadores.</p>
            
            <div class="indicaciones-list-container" id="contenedor-lista-indicaciones">
                <!-- Indicación 1 -->
                <div class="indicacion-card-item">
                    <div class="indicacion-header">
                        <h4><i class="ti ti-pill"></i> Insulina Glargina</h4>
                        <span class="badge-rol-autor">Médico Asignado</span>
                    </div>
                    <p class="indicacion-body-text">Administrar 14 unidades por vía subcutánea todas las noches antes de acostarse. Controlar rigurosamente la glucemia en ayunas en la mañana.</p>
                    <div class="indicacion-footer">
                        <span><i class="ti ti-clock"></i> Hace 2 días</span>
                        <span class="status-indicator-dot activa">Activa</span>
                    </div>
                </div>

                <!-- Indicación 2 -->
                <div class="indicacion-card-item">
                    <div class="indicacion-header">
                        <h4><i class="ti ti-walk"></i> Terapia de Movilidad Pasiva</h4>
                        <span class="badge-rol-autor">Médico Asignado</span>
                    </div>
                    <p class="indicacion-body-text">Realizar caminatas ligeras de 10 a 15 minutos asistidas por el pasillo interior de la vivienda, únicamente si la presión arterial sistólica se mantiene por debajo de 135.</p>
                    <div class="indicacion-footer">
                        <span><i class="ti ti-clock"></i> Hace 5 días</span>
                        <span class="status-indicator-dot activa">Activa</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * PESTAÑA 5: Mi Perfil Profesional del Médico
 */
function renderizarPestañaPerfilProfesional(contenedorArea, datos) {
    contenedorArea.innerHTML = `
        <div class="card fade-in perfil-profesional-layout">
            <div class="perfil-header-cover">
                <div class="perfil-avatar-large">ZP</div>
                <div class="perfil-title-meta">
                    <h3>Dr. Zoe Professional</h3>
                    <p>Especialista en Medicina Interna y Geriatría</p>
                </div>
            </div>
            
            <div class="perfil-details-grid">
                <div class="perfil-data-box">
                    <h5><i class="ti ti-id"></i> Registro Médico / Licencia</h5>
                    <p>RM-77492-2026</p>
                </div>
                <div class="perfil-data-box">
                    <h5><i class="ti ti-mail"></i> Correo Institucional</h5>
                    <p>contacto.zoe@zoecare.com</p>
                </div>
                <div class="perfil-data-box">
                    <h5><i class="ti ti-building-hospital"></i> Centro Clínico Asignado</h5>
                    <p>Consultorio Médico Central - Planta 3</p>
                </div>
                <div class="perfil-data-box">
                    <h5><i class="ti ti-users"></i> Pacientes Bajo Cobertura</h5>
                    <p>3 Pacientes Activos en Plataforma</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * LÓGICA CORE: Gestiona el selector de múltiples pacientes del Inicio y asocia los modales a los botones del Dashboard.
 */
function configurarEventosDelDashboardMedico() {
    
    // LISTADO DE DATOS CLÍNICOS SIMULADOS DE MÚLTIPLES PACIENTES (MOCK DATA)
    const listadoPacientesMedicos = [
        { id: "1", nombre: "Miren Yagoo", consulta: "Control General", fecha: "Hoy, 10 Jul", hora: "02:30 PM", sala: "Consultorio 3", glucosa: "102", ritmo: "78", o2: "98%", presion: "139", progreso: "60%", notas: "Revisar observaciones enviadas por el cuidador en la mañana." },
        { id: "2", nombre: "Carlos Mendoza", consulta: "Chequeo Post-Operatorio", fecha: "Mañana, 11 Jul", hora: "09:00 AM", sala: "Consultorio 1", glucosa: "115", ritmo: "82", o2: "96%", presion: "120", progreso: "40%", notas: "Paciente requiere asistencia para caminar debido a debilidad muscular." },
        { id: "3", nombre: "Elena Rostova", consulta: "Revisión de Tratamiento", fecha: "Lunes, 13 Jul", hora: "04:15 PM", sala: "Consultorio 5", glucosa: "95", ritmo: "72", o2: "99%", presion: "115", progreso: "85%", notas: "Controlar rigurosamente la toma de insulina post-almuerzo." }
    ];

    // CONTROLADORES DEL DROPDOWN SELECTOR DE PACIENTES DEL INICIO
    const listaDesplegablePacientes = document.getElementById('lista-desplegable-de-pacientes');
    const botonAbrirDesplegable = document.getElementById('boton-abrir-desplegable-paciente');

    if (listaDesplegablePacientes && botonAbrirDesplegable) {
        
        listaDesplegablePacientes.innerHTML = listadoPacientesMedicos.map(paciente => `
            <div class="dropdown-item" data-id="${paciente.id}">
                <div class="avatar-sm"></div>
                <span>${paciente.nombre}</span>
            </div>
        `).join('');

        botonAbrirDesplegable.onclick = (evento) => {
            evento.stopPropagation();
            listaDesplegablePacientes.classList.toggle('hidden');
        };

        listaDesplegablePacientes.onclick = (evento) => {
            const itemSeleccionado = evento.target.closest('.dropdown-item');
            if (!itemSeleccionado) return;

            const idPacienteElegido = itemSeleccionado.dataset.id;
            const datosPacienteElegido = listadoPacientesMedicos.find(p => p.id === idPacienteElegido);

            if (datosPacienteElegido) {
                document.getElementById('texto-nombre-paciente-actual').innerText = datosPacienteElegido.nombre;
                document.getElementById('texto-cita-nombre-paciente').innerText = `Paciente: ${datosPacienteElegido.nombre}`;
                document.getElementById('texto-cita-motivo-consulta').innerText = datosPacienteElegido.consulta;
                document.getElementById('texto-cita-fecha').innerHTML = `<i class="ti ti-calendar"></i> ${datosPacienteElegido.fecha}`;
                document.getElementById('texto-cita-hora').innerHTML = `<i class="ti ti-clock"></i> ${datosPacienteElegido.hora}`;
                document.getElementById('texto-cita-consultorio').innerHTML = `<i class="ti ti-map-pin"></i> ${datosPacienteElegido.sala}`;
                document.getElementById('valor-signo-glucosa').innerText = datosPacienteElegido.glucosa;
                document.getElementById('valor-signo-ritmo-cardiaco').innerText = datosPacienteElegido.ritmo;
                document.getElementById('valor-signo-saturacion-oxigeno').innerText = datosPacienteElegido.o2;
                document.getElementById('valor-signo-presion-arterial').innerText = datosPacienteElegido.presion;
                document.getElementById('barra-visual-progreso-plan').style.width = datosPacienteElegido.progreso;
                document.getElementById('texto-porcentaje-progreso-plan').innerText = `${datosPacienteElegido.progreso} completado`;
                document.getElementById('texto-notas-observaciones-cuidador').innerText = datosPacienteElegido.notes;
            }
            listaDesplegablePacientes.classList.add('hidden');
        };
    }

    document.addEventListener('click', () => {
        if (listaDesplegablePacientes) listaDesplegablePacientes.classList.add('hidden');
    });




    // =========================================================================================
    // MANEJO OPERATIVO DE LA VENTANA MODAL EMERGENTE DEL DASHBOARD PRINCIPAL
    // =========================================================================================
    const elementoModalOverlay = document.getElementById('ventana-modal-emergente-global');
    const elementoContenidoModal = document.getElementById('contenedor-contenido-interno-modal');
    const botonCerrarModalCruz = document.getElementById('boton-cerrar-ventana-modal');

    const hacerVisibleVentanaModal = (htmlFormularioInterno) => {
        if (!elementoModalOverlay || !elementoContenidoModal) return;
        elementoContenidoModal.innerHTML = htmlFormularioInterno;
        elementoModalOverlay.classList.remove('hidden');
        setTimeout(() => elementoModalOverlay.classList.add('active'), 10);
    };

    const ocultarYRemoverVentanaModal = () => {
        if (!elementoModalOverlay) return;
        elementoModalOverlay.classList.remove('active');
        setTimeout(() => elementoModalOverlay.classList.add('hidden'), 300);
    };

    if (botonCerrarModalCruz) botonCerrarModalCruz.onclick = ocultarYRemoverVentanaModal;

    // ASIGNACIÓN DE FORMULARIOS A LOS BOTONES DEL DASHBOARD PRINCIPAL
    
    // BOTÓN 1: REPROGRAMAR CITA
    const botonReprogramarCita = document.getElementById('boton-reprogramar-cita');
    if (botonReprogramarCita) {
        botonReprogramarCita.onclick = () => {
            const nombrePacienteActivo = document.getElementById('texto-nombre-paciente-actual').innerText;
            hacerVisibleVentanaModal(`
                <h3 class="modal-title">Reprogramar Consulta</h3>
                <p class="modal-subtitle">Paciente: <strong>${nombrePacienteActivo}</strong></p>
                <form id="formulario-modal-reprogramar" class="modal-form">
                    <div class="modal-field">
                        <label>Nueva Fecha Propuesta</label>
                        <input type="date" required value="2026-07-10">
                    </div>
                    <div class="modal-field">
                        <label>Nueva Hora Propuesta</label>
                        <input type="time" required value="14:30">
                    </div>
                    <div class="modal-field">
                        <label>Lugar o Consultorio Asignado</label>
                        <input type="text" required value="Consultorio 3">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancelar-modal" id="btn-cancelar-formulario-reprogramar">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal">Confirmar Cambio</button>
                    </div>
                </form>
            `);
            document.getElementById('btn-cancelar-formulario-reprogramar').onclick = ocultarYRemoverVentanaModal;
        };
    }

    // BOTÓN 2: HISTORIAL CLÍNICO
    const botonVerHistorialClinico = document.getElementById('boton-ver-historial-clinico');
    if (botonVerHistorialClinico) {
        botonVerHistorialClinico.onclick = () => {
            const nombrePacienteActivo = document.getElementById('texto-nombre-paciente-actual').innerText;
            hacerVisibleVentanaModal(`
                <h3 class="modal-title">Historial Clínico</h3>
                <p class="modal-subtitle">Línea de tiempo de eventos para: <strong>${nombrePacienteActivo}</strong></p>
                <div class="modal-timeline">
                    <div class="timeline-step">
                        <span class="step-date">10 Jul 2026</span>
                        <p><strong>Control de Monitoreo:</strong> Signos vitales estables registrados por el cuidador asignado en la bitácora.</p>
                    </div>
                    <div class="timeline-step">
                        <span class="step-date">08 Jul 2026</span>
                        <p><strong>Ajuste de Tratamiento:</strong> Modificación de las dosis de insulina debido a picos glucémicos registrados.</p>
                    </div>
                    <div class="timeline-step">
                        <span class="step-date">01 Jul 2026</span>
                        <p><strong>Ingreso a Zoe Care:</strong> Registro inicial del expediente clínico e historial patológico del paciente.</p>
                    </div>
                </div>
            `);
        };
    }

    // BOTÓN 3: EMITIR INDICACIONES
    const botonAccionEmitirIndicaciones = document.getElementById('boton-accion-emitir-indicaciones');
    if (botonAccionEmitirIndicaciones) {
        botonAccionEmitirIndicaciones.onclick = () => {
            const nombrePacienteActivo = document.getElementById('texto-nombre-paciente-actual').innerText;
            hacerVisibleVentanaModal(`
                <h3 class="modal-title">Emitir Indicaciones Médicas</h3>
                <p class="modal-subtitle">Paciente bajo revisión: <strong>${nombrePacienteActivo}</strong></p>
                <form id="formulario-modal-indicaciones" class="modal-form">
                    <div class="modal-field">
                        <label>Medicamento o Instrucción Clínica</label>
                        <input type="text" placeholder="Ej: Paracetamol 500mg" required>
                    </div>
                    <div class="modal-field">
                        <label>Frecuencia de Toma y Dosificación</label>
                        <textarea placeholder="Ej: Tomar una tableta cada 8 horas durante 5 días junto con las comidas principales." rows="3" required></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancelar-modal" id="btn-cancelar-formulario-indicaciones">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal">Publicar Receta</button>
                    </div>
                </form>
            `);
            document.getElementById('btn-cancelar-formulario-indicaciones').onclick = ocultarYRemoverVentanaModal;
        };
    }

    // BOTÓN 4: SUBIR REPORTE CLÍNICO
    const botonAccionSubirReporteClinico = document.getElementById('boton-accion-subir-reporte-clinico');
    if (botonAccionSubirReporteClinico) {
        botonAccionSubirReporteClinico.onclick = () => {
            const nombrePacienteActivo = document.getElementById('texto-nombre-paciente-actual').innerText;
            hacerVisibleVentanaModal(`
                <h3 class="modal-title">Subir Reporte Clínico</h3>
                <p class="modal-subtitle">Adjuntar nuevo informe médico para: <strong>${nombrePacienteActivo}</strong></p>
                <form id="formulario-modal-reporte-clinico" class="modal-form">
                    <div class="modal-field">
                        <label>Título del Documento o Examen</label>
                        <input type="text" placeholder="Ej: Análisis de Laboratorio Clínico - Sangre" required>
                    </div>
                    <div class="modal-field file-field">
                        <label for="input-archivo-subir" class="custom-file-upload">
                            <i class="ti ti-upload"></i> Haga clic aquí para adjuntar el PDF o Imagen de respaldo
                        </label>
                        <input id="input-archivo-subir" type="file" style="display:none;" />
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancelar-modal" id="btn-cancelar-formulario-reporte">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal">Subir Documento</button>
                    </div>
                </form>
            `);
            document.getElementById('btn-cancelar-formulario-reporte').onclick = ocultarYRemoverVentanaModal;
        };
    }
} // <-- Esta llave cierra la función maestra configurarEventosDelDashboardMedico()


// =========================================================================================
// OPERATIVA ADICIONAL PARA LAS VENTANAS DE MODALES DE EDICIÓN INTERNA EN LAS PESTAÑAS
// =========================================================================================

/**
 * Control operativo de la ventana modal emergente para editar citas directamente desde la pestaña.
 */
function activarEdiciónDeCitasEnCaliente(listadoOriginal) {
    const botonesEditar = document.querySelectorAll('.btn-editar-inline-cita');
    
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const indiceCita = e.target.dataset.index;
            const datosCita = listadoOriginal[indiceCita];

            const modalOverlayGlobal = document.getElementById('ventana-modal-emergente-global');
            const contenedorContenidoModal = document.getElementById('contenedor-contenido-interno-modal');

            if (!modalOverlayGlobal || !contenedorContenidoModal) return;

            contenedorContenidoModal.innerHTML = `
                <h3 class="modal-title">Modificar Detalles de Cita</h3>
                <p class="modal-subtitle">Realice los ajustes necesarios para la consulta en agenda.</p>
                <form id="formulario-guardar-cambios-cita" class="modal-form">
                    <div class="modal-field">
                        <label>Hora Programada</label>
                        <input type="text" id="input-editar-hora-cita" value="${datosCita.hora || datosCita.Hora || '10:30 AM'}" required>
                    </div>
                    <div class="modal-field">
                        <label>Nombre del Paciente</label>
                        <input type="text" id="input-editar-paciente-cita" value="${datosCita.paciente || datosCita.Paciente || ''}" required>
                    </div>
                    <div class="modal-field">



                    <div class="modal-field">
                        <label>Motivo Clínico</label>
                        <input type="text" id="input-editar-motivo-cita" value="${datosCita.motivo || datosCita.Motivo || ''}" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancelar-modal" id="btn-cerrar-edicion-cita">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal">Guardar Cambios</button>
                    </div>
                </form>
            `;

            // Mostrar el modal en pantalla
            modalOverlayGlobal.classList.remove('hidden');
            setTimeout(() => modalOverlayGlobal.classList.add('active'), 10);

            // Cierre manual al dar clic en cancelar
            document.getElementById('btn-cerrar-edicion-cita').onclick = () => {
                modalOverlayGlobal.classList.remove('active');
                setTimeout(() => modalOverlayGlobal.classList.add('hidden'), 300);
            };

            // Evento submit para guardar los cambios y repintar la UI al instante
            document.getElementById('formulario-guardar-cambios-cita').onsubmit = (eventoSubmit) => {
                eventoSubmit.preventDefault();

                const nuevaHora = document.getElementById('input-editar-hora-cita').value;
                const nuevoPaciente = document.getElementById('input-editar-paciente-cita').value;
                const nuevoMotivo = document.getElementById('input-editar-motivo-cita').value;

                if (datosCita.hora) datosCita.hora = nuevaHora; else datosCita.Hora = nuevaHora;
                if (datosCita.paciente) datosCita.paciente = nuevoPaciente; else datosCita.Paciente = nuevoPaciente;
                if (datosCita.motivo) datosCita.motivo = nuevoMotivo; else datosCita.Motivo = nuevoMotivo;

                document.getElementById(`citas-hora-texto-${indiceCita}`).innerText = nuevaHora;
                document.getElementById(`citas-paciente-texto-${indiceCita}`).innerText = nuevoPaciente;
                document.getElementById(`citas-motivo-texto-${indiceCita}`).innerHTML = `<i class="ti ti-activity"></i> ${nuevoMotivo}`;

                modalOverlayGlobal.classList.remove('active');
                setTimeout(() => modalOverlayGlobal.classList.add('hidden'), 300);
            };
        });
    });
}

/**
 * Control operativo de la simulación del visualizador de archivos clínicos y placas de rayos X (Rx).
 */
function activarVisualizadorDeEstudios() {
    const botonesVisualizar = document.querySelectorAll('.btn-visualizar-archivo');
    
    botonesVisualizar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tipoArchivo = e.target.dataset.tipo;
            const modalOverlayGlobal = document.getElementById('ventana-modal-emergente-global');
            const contenedorContenidoModal = document.getElementById('contenedor-contenido-interno-modal');

            if (!modalOverlayGlobal || !contenedorContenidoModal) return;

            if (tipoArchivo === 'rx') {
                contenedorContenidoModal.innerHTML = `
                    <h3 class="modal-title">Visualizador de Placas Clínicas (Rx)</h3>
                    <p class="modal-subtitle">Estudio de Imagenología del Torax - Contraste e iluminación digital.</p>
                    <div style="width:100%; height:320px; background-color:#111111; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px; border:3px solid #333333; box-shadow:inset 0 0 30px rgba(255,255,255,0.05);">
                        <div style="width:70%; height:75%; border:2px dashed rgba(255,255,255,0.2); border-radius:8px; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.4); font-size:0.85rem; text-align:center;">
                            [ Simulación de Placa Radiográfica Digital ]<br>Campos pulmonares libres de infiltrados activos.
                        </div>
                    </div>
                    <div class="modal-actions" style="margin-top:16px;">
                        <button class="btn-guardar-modal" id="btn-cerrar-visor-archivo">Cerrar Visor</button>
                    </div>
                `;
            } else {
                contenedorContenidoModal.innerHTML = `
                    <h3 class="modal-title">Informe Clínico de Laboratorio</h3>
                    <p class="modal-subtitle">Análisis analítico completo - Parámetros hematológicos de referencia.</p>
                    <div style="width:100%; max-height:280px; overflow-y:auto; background-color:#ffffff; padding:16px; border:1px solid #e2e8f0; border-radius:10px; font-family:monospace; font-size:0.85rem; color:#222;">
                        <p style="border-bottom:1px solid #eee; padding-bottom:6px;"><strong>ESTUDIO:</strong> HEMOGRAMA COMPLETO</p>
                        <p style="margin-top:8px;">Glóbulos Rojos: 4.8 M/µL ---- [NORMAL]</p>
                        <p>Hemoglobina: 14.2 g/dL ------- [NORMAL]</p>
                        <p style="color:#c46d60; font-weight:700;">Glucosa en Ayunas: 115 mg/dL - [ELEVADO ↑]</p>
                        <p>Plaquetas: 250,000 /µL ------- [NORMAL]</p>
                    </div>
                    <div class="modal-actions" style="margin-top:16px;">
                        <button class="btn-guardar-modal" id="btn-cerrar-visor-archivo">Cerrar Visor</button>
                    </div>
                `;
            }

            modalOverlayGlobal.classList.remove('hidden');
            setTimeout(() => modalOverlayGlobal.classList.add('active'), 10);

            document.getElementById('btn-cerrar-visor-archivo').onclick = () => {
                modalOverlayGlobal.classList.remove('active');
                setTimeout(() => modalOverlayGlobal.classList.add('hidden'), 300);
            };
        });
    });
}
