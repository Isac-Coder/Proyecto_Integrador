
// src/views/medicoView.js

// Importamos la función encargada de traer el HTML de las sub-pestañas desde el backend
import { obtenerDatosSeccion } from "../services/data.service.js";

/**
 * Función principal que arma el Layout estructural del panel médico (Zoe Care)
 * @returns {string} El string HTML completo de la interfaz
 */
export function profesionalView() {
    
    // Inyección automática y segura de la hoja de estilos global en la cabecera del documento
    if (!document.getElementById("zoe-global-style")) {
        const styleLink = document.createElement("link");
        styleLink.id = "zoe-global-style";
        styleLink.rel = "stylesheet";
        styleLink.href = "/Proyecto_Integrador/Front/Diseño_1/src/styles/styles.css";
        document.head.appendChild(styleLink);
    }



    // Plantilla HTML del panel central. Se le añadieron IDs descriptivos a cada dato clínico 
    // para poder manipularlos con JavaScript al cambiar de paciente.
    const estructuraDashboardBase = `
        <div class="dashboard-grid fade-in">
            <section class="main-content-column">
                
                <!-- COMPONENTE: SELECTOR DESPLEGABLE DE PACIENTES MÚLTIPLES -->
                <div class="patient-selector-wrapper">
                    <div class="custom-dropdown" id="contenedor-desplegable-paciente">
                        
                        <!-- Botón o caja principal que muestra el nombre del paciente activo -->
                        <div class="dropdown-selected" id="boton-abrir-desplegable-paciente">
                            <div class="selected-info">
                                <div class="avatar-sm"></div>
                                <span id="texto-nombre-paciente-actual">Miren Yagoo</span>
                            </div>
                            <span class="arrow-icon">▼</span>
                        </div>
                        
                        <!-- Lista oculta que JavaScript llenará con todos los pacientes asignados -->
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

                <!-- COMPONENTE: TARJETAS DE CONSTANTES Y SIGNOS VITALES -->
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

                <!-- COMPONENTE: BLOQUE DEL GRÁFICO CLÍNICO -->
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

            <!-- COLUMNA ASIDE DERECHA (MÉTRICAS Y ACCIONES) -->
            <aside class="right-content-column">
                
                <!-- COMPONENTE: SEGUIMIENTO DE LA BARRA DE PROGRESO -->
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

                <!-- COMPONENTE: MENÚ DE ACCIONES RÁPIDAS -->
                <div class="card quick-actions-card">
                    <h3>Acciones rápidas</h3>
                    <ul class="actions-list">
                        <li class="action-item" id="boton-accion-emitir-indicaciones" data-target="medicacion">Emitir indicaciones <span class="arrow">›</span></li>
                        <li class="action-item" id="boton-accion-subir-reporte-clinico" data-target="resultados">Subir reporte clínico <span class="arrow">›</span></li>
                    </ul>
                </div>

                <!-- COMPONENTE: NOTAS ENVIADAS POR EL CUIDADOR -->
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
}



// =========================================================================================
// GESTIÓN DE ENRUTAMIENTO INTERNO DE LA VISTA DEL PROFESIONAL
// =========================================================================================
/**
 * Inicializa y administra la barra de navegación lateral e intercambia las vistas del panel dinámico.
 * @param {string} htmlBaseDashboard - Código HTML limpio de la pestaña del Dashboard principal.
 */
function initProfesionalDashboardEvents(htmlBaseDashboard) {
    const elementosMenuLateral = document.querySelectorAll('.sidebar-profesional .menu-item[data-view]');
    const areaContenidoDinamico = document.getElementById('dynamic-content-area');

    if (!areaContenidoDinamico) return;

    // Asignar el detector de clics para la navegación asíncrona de pestañas
    elementosMenuLateral.forEach(itemMenu => {
        itemMenu.addEventListener('click', async (eventoClic) => {
            eventoClic.preventDefault();
            
            elementosMenuLateral.forEach(item => item.classList.remove('active'));
            itemMenu.classList.add('active');

            const nombreVistaSolicitada = itemMenu.getAttribute('data-view');

            if (nombreVistaSolicitada === 'dashboard') {
                areaContenidoDinamico.innerHTML = htmlBaseDashboard;
                configurarEventosDelDashboardMedico();
            } else {
                areaContenidoDinamico.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando...</p></div>';
                areaContenidoDinamico.innerHTML = await obtenerDatosSeccion(nombreVistaSolicitada, 'profesional');
            }
        });
    });

    configurarEventosDelDashboardMedico();
}




// =========================================================================================
// LOGICA DE NEGOCIO INTERACTIVA DEL PANEL DEL MÉDICO
// =========================================================================================
/**
 * Configura la interactividad de la UI: El cambio de pacientes y la manipulación de modales form.
 */
function configurarEventosDelDashboardMedico() {
    
    // 1. BASE DE DATOS SIMULADA (MOCK DATA) DE PACIENTES ASIGNADOS AL PROFESIONAL ACTUAL
    const listadoPacientesMedicos = [
        { id: "1", nombre: "Miren Yagoo", consulta: "Control General", fecha: "Hoy, 10 Jul", hora: "02:30 PM", sala: "Consultorio 3", glucosa: "102", ritmo: "78", o2: "98%", presion: "139", progreso: "60%", notas: "Revisar observaciones enviadas por el cuidador en la mañana." },
        { id: "2", nombre: "Carlos Mendoza", consulta: "Chequeo Post-Operatorio", fecha: "Mañana, 11 Jul", hora: "09:00 AM", sala: "Consultorio 1", glucosa: "115", ritmo: "82", o2: "96%", presion: "120", progreso: "40%", notas: "Paciente requiere asistencia para caminar debido a debilidad muscular." },
        { id: "3", nombre: "Elena Rostova", consulta: "Revisión de Tratamiento", fecha: "Lunes, 13 Jul", hora: "04:15 PM", sala: "Consultorio 5", glucosa: "95", ritmo: "72", o2: "99%", presion: "115", progreso: "85%", notas: "Controlar rigurosamente la toma de insulina post-almuerzo." }
    ];

    // 2. CONTROL DEL SELECTOR DE MÚLTIPLES PACIENTES (DROPDOWN COMPONENT)
    const listaDesplegablePacientes = document.getElementById('lista-desplegable-de-pacientes');
    const botonAbrirDesplegable = document.getElementById('boton-abrir-desplegable-paciente');

    if (listaDesplegablePacientes && botonAbrirDesplegable) {
        
        // Inyectar en el DOM las opciones del menú desplegable con el listado de pacientes asignados
        listaDesplegablePacientes.innerHTML = listadoPacientesMedicos.map(paciente => `
            <div class="dropdown-item" data-id="${paciente.id}">
                <div class="avatar-sm"></div>
                <span>${paciente.nombre}</span>
            </div>
        `).join('');

        // Intercambiar visibilidad de la lista desplegable al presionar el botón del selector
        botonAbrirDesplegable.onclick = (evento) => {
            evento.stopPropagation(); // Previene el cierre inmediato debido al propagado del clic
            listaDesplegablePacientes.classList.toggle('hidden');
        };

        // Escuchar el clic sobre un paciente nuevo de la lista para actualizar los datos en pantalla
        listaDesplegablePacientes.onclick = (evento) => {
            const itemSeleccionado = evento.target.closest('.dropdown-item');
            if (!itemSeleccionado) return;

            const idPacienteElegido = itemSeleccionado.dataset.id;
            const datosPacienteElegido = listadoPacientesMedicos.find(p => p.id === idPacienteElegido);

            if (datosPacienteElegido) {
                // Actualizar textos generales de la interfaz
                document.getElementById('texto-nombre-paciente-actual').innerText = datosPacienteElegido.nombre;
                document.getElementById('texto-cita-nombre-paciente').innerText = `Paciente: ${datosPacienteElegido.nombre}`;
                document.getElementById('texto-cita-motivo-consulta').innerText = datosPacienteElegido.consulta;
                document.getElementById('texto-cita-fecha').innerHTML = `<i class="ti ti-calendar"></i> ${datosPacienteElegido.fecha}`;
                document.getElementById('texto-cita-hora').innerHTML = `<i class="ti ti-clock"></i> ${datosPacienteElegido.hora}`;
                document.getElementById('texto-cita-consultorio').innerHTML = `<i class="ti ti-map-pin"></i> ${datosPacienteElegido.sala}`;
                
                // Actualizar los números de las tarjetas de constantes vitales
                document.getElementById('valor-signo-glucosa').innerText = datosPacienteElegido.glucosa;
                document.getElementById('valor-signo-ritmo-cardiaco').innerText = datosPacienteElegido.ritmo;
                document.getElementById('valor-signo-saturacion-oxigeno').innerText = datosPacienteElegido.o2;
                document.getElementById('valor-signo-presion-arterial').innerText = datosPacienteElegido.presion;
                
                // Actualizar barra de rendimiento lateral y notas de observaciones
                document.getElementById('barra-visual-progreso-plan').style.width = datosPacienteElegido.progreso;
                document.getElementById('texto-porcentaje-progreso-plan').innerText = `${datosPacienteElegido.progreso} completado`;
                document.getElementById('texto-notas-observaciones-cuidador').innerText = datosPacienteElegido.notas;
            }
            listaDesplegablePacientes.classList.add('hidden'); // Ocultar el dropdown al terminar la selección
        };
    }

    // Ocultar automáticamente el selector si el usuario cliquea en cualquier zona externa de la pantalla
    document.addEventListener('click', () => {
        if (listaDesplegablePacientes) listaDesplegablePacientes.classList.add('hidden');
    });






    // 3. CONTROL CENTRALIZADO DEL APARTADO DE VENTANAS MODALES
    const elementoModalOverlay = document.getElementById('ventana-modal-emergente-global');
    const elementoContenidoModal = document.getElementById('contenedor-contenido-interno-modal');
    const botonCerrarModalCruz = document.getElementById('boton-cerrar-ventana-modal');

    /**
     * Muestra la ventana modal en pantalla acoplando el formulario HTML deseado.
     * @param {string} htmlFormularioInterno - Código estructurado del formulario a renderizar.
     */
    const hacerVisibleVentanaModal = (htmlFormularioInterno) => {
        if (!elementoModalOverlay || !elementoContenidoModal) return;
        elementoContenidoModal.innerHTML = htmlFormularioInterno; // Cargar la estructura interna
        elementoModalOverlay.classList.remove('hidden'); // Retirar el bloqueo de visualización
        setTimeout(() => elementoModalOverlay.classList.add('active'), 10); // Ejecutar transición de opacidad
    };

    /**
     * Remueve de manera segura las clases de animación y esconde la ventana flotante.
     */
    const ocultarYRemoverVentanaModal = () => {
        if (!elementoModalOverlay) return;
        elementoModalOverlay.classList.remove('active'); // Iniciar desvanecimiento difuminado
        setTimeout(() => elementoModalOverlay.classList.add('hidden'), 300); // Bloquear despliegue al cerrar
    };

    // Asignar el cierre de la ventana al presionar el botón de la cruz "×"
    if (botonCerrarModalCruz) botonCerrarModalCruz.onclick = ocultarYRemoverVentanaModal;





    // 4. CONTROLADORES DE ACCIONES PARA LOS BOTONES PRINCIPALES
    
    // BOTÓN: REPROGRAMACIÓN DE CITA MÉDICA
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
                        <button type="button" class="btn-cancelar-modal" id="boton-cancelar-formulario-reprogramar">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal">Confirmar Cambio</button>
                    </div>
                </form>
            `);
            document.getElementById('boton-cancelar-formulario-reprogramar').onclick = ocultarYRemoverVentanaModal;
        };
    }

    // BOTÓN: VISUALIZAR HISTORIAL CLÍNICO CRONOLÓGICO
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





    // ACCIÓN RÁPIDA: REDACTAR Y EMITIR INDICACIONES MÉDICAS
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
                        <button type="button" class="btn-cancelar-modal" id="boton-cancelar-formulario-indicaciones">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal">Publicar Receta</button>
                    </div>
                </form>
            `);
            document.getElementById('boton-cancelar-formulario-indicaciones').onclick = ocultarYRemoverVentanaModal;
        };
    }

    // ACCIÓN RÁPIDA: ADJUNTAR Y SUBIR REPORTE CLÍNICO NUEVO
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
                        <button type="button" class="btn-cancelar-modal" id="boton-cancelar-formulario-reporte">Cancelar</button>
                        <button type="submit" class="btn-guardar-modal">Subir Documento</button>
                    </div>
                </form>
            `);
            document.getElementById('boton-cancelar-formulario-reporte').onclick = ocultarYRemoverVentanaModal;
        };
    }
} // <--- Esta llave cierra correctamente la función configurarEventosDelDashboardMedico









