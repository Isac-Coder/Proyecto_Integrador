// ==========================================
// PROYECTO INTEGRADOR - ZOE CARE
// RAMA: Desarrollo-Backend-IV
// ARCHIVO: src/views/profesionalView.js
// PARTE 1: CONFIGURACIONES E IMPORTACIONES
// ==========================================

import { obtenerDatosSeccion } from '../services/data.service.js';

const URL_BASE_DE_LA_API_DEL_PROFESIONAL = 'http://localhost:3001/api';



// ==========================================
// PARTE 2: OPERACIONES CRUD Y COMPONENTES EMERGENTES (MODALES)
// ==========================================

/**
 * Consulta la base de datos para obtener el historial clínico de un paciente por su identificador.
 */
async function funcion_peticion_http_obtener_historial_clinico_por_id(parametro_id_unico_del_paciente) {
    try {
        const objeto_respuesta_servidor_http = await fetch(`${URL_BASE_DE_LA_API_DEL_PROFESIONAL}/pacientes/${parametro_id_unico_del_paciente}`);
        if (!objeto_respuesta_servidor_http.ok) throw new Error('Servidor offline');
        const objeto_datos_json = await objeto_respuesta_servidor_http.json();
        return objeto_datos_json.data || objeto_datos_json;
    } catch (objeto_error_red) {
        console.warn('[DEBUG CONTROL] No hay respuesta del backend. Retornando objeto vacío para lanzar "undefined".');
        return {}; 
    }
}

/**
 * Registra una nueva indicación médica enviando una solicitud POST a la base de datos.
 */
async function funcion_peticion_http_actualizar_indicaciones_medicas_en_base_de_datos(parametro_id_unico_del_paciente, objeto_cuerpo_datos_indicacion) {
    try {
        const objeto_respuesta_servidor_http = await fetch(`${URL_BASE_DE_LA_API_DEL_PROFESIONAL}/pacientes/${parametro_id_unico_del_paciente}/indicaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objeto_cuerpo_datos_indicacion)
        });
        return objeto_respuesta_servidor_http.ok;
    } catch (objeto_error_red) {
        console.error('Error al insertar las indicaciones médicas:', objeto_error_red);
        return false;
    }
}

/**
 * Despliega un modal flotante interactivo para que el médico edite las instrucciones del paciente.
 */
async function funcion_desplegar_ventana_emergente_formulario_emitir_indicaciones() {
    const cadena_id_paciente_miren_yagoo = "123";
    const objeto_datos_indicacion = await funcion_peticion_http_obtener_historial_clinico_por_id(cadena_id_paciente_miren_yagoo);

    const nodo_contenedor_modal_formulario = document.createElement('div');
    nodo_contenedor_modal_formulario.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; font-family: sans-serif;';
    
    nodo_contenedor_modal_formulario.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 16px; width: 420px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #1f2937;">📝 Emitir Indicaciones Clínicas</h3>
            <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 16px;">Paciente actual: <strong>Miren Yagoo</strong></p>
            <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #4b5563; margin-bottom: 6px;">Instrucciones Médicas</label>
                <textarea id="textarea_modal_instrucciones_profesional" rows="4" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; resize: none; font-family: sans-serif;">${objeto_datos_indicacion.indicaciones_actuales}</textarea>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                <button id="boton_modal_profesional_cancelar" style="background: #f3f4f6; color: #4b5563; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancelar</button>
                <button id="boton_modal_profesional_guardar" style="background: #4f46e5; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">Guardar en BD</button>
            </div>
        </div>
    `;

    document.body.appendChild(nodo_contenedor_modal_formulario);
    document.getElementById('boton_modal_profesional_cancelar').addEventListener('click', () => nodo_contenedor_modal_formulario.remove());
    
    document.getElementById('boton_modal_profesional_guardar').addEventListener('click', async () => {
        const cadena_texto_ingresado = document.getElementById('textarea_modal_instrucciones_profesional').value;
        const objeto_datos_nuevos = { indicaciones_actuales: cadena_texto_ingresado };

        await funcion_peticion_http_actualizar_indicaciones_medicas_en_base_de_datos(cadena_id_paciente_miren_yagoo, objeto_datos_nuevos);
        nodo_contenedor_modal_formulario.remove();
        alert('🔄 Petición HTTP POST enviada al backend.');
    });
}

/**
 * Despliega un modal interactivo para consultar el expediente del paciente.
 */
async function funcion_desplegar_ventana_emergente_historial_clinico_completo() {
    const cadena_id_paciente_miren_yagoo = "123";
    const objeto_datos_expediente = await funcion_peticion_http_obtener_historial_clinico_por_id(cadena_id_paciente_miren_yagoo);

    const nodo_contenedor_modal_historial = document.createElement('div');
    nodo_contenedor_modal_historial.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; font-family: sans-serif;';
    
    nodo_contenedor_modal_historial.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 16px; width: 450px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; color: #1f2937;">📋 Historial Clínico Integrado</h3>
            <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: #374151;">
                <p><strong>Paciente:</strong> Miren Yagoo</p>
                <p><strong>Diagnóstico Base:</strong> ${objeto_datos_expediente.diagnostico_base}</p>
                <p><strong>Tratamiento Asignado:</strong> ${objeto_datos_expediente.tratamiento_actual}</p>
            </div>
            <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
                <button id="boton_modal_cerrar_historial_medico" style="background: #374151; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">Cerrar Historial</button>
            </div>
        </div>
    `;

    document.body.appendChild(nodo_contenedor_modal_historial);
    document.getElementById('boton_modal_cerrar_historial_medico').addEventListener('click', () => nodo_contenedor_modal_historial.remove());
}




// ==========================================
// PARTE 3: DESPACHADOR DE SUB-VISTAS (RESPONSABILIDAD VISUAL EXCLUSIVA)
// ==========================================

/**
 * Toma los datos JSON del dataService y los transforma en el HTML estructural para cada pestaña del menú izquierdo.
 */
function funcion_despachador_de_plantillas_html_subvistas(parametro_nombre_seccion, objeto_datos_crudos) {
    switch (parametro_nombre_seccion) {
        case 'citas':
            return `
                <div class="dashboard-grid fade-in" style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="card" style="width: 100%;">
                        <h3>📅 Agenda de Citas y Visitas</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">Control cronológico de consultas médicas programadas para la jornada.</p>
                        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff;">
                            <h4 style="margin: 0; color: #1f2937;">Paciente: ${objeto_datos_crudos.nombre_paciente_agenda}</h4>
                            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: var(--text-muted);">Hora: ${objeto_datos_crudos.hora_programada} | Motivo: ${objeto_datos_crudos.motivo_consulta}</p>
                        </div>
                    </div>
                </div>
            `;
        case 'mensajes':
            return `
                <div class="dashboard-grid fade-in" style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="card" style="width: 100%;">
                        <h3>💬 Bandeja de Mensajes y Alertas</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">Comunicación directa con los cuidadores y familiares a cargo de los pacientes.</p>
                        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff;">
                            <strong style="color: #1f2937;">Remitente: ${objeto_datos_crudos.nombre_remitente}</strong>
                            <p style="margin: 6px 0 0 0; font-size: 0.9rem; color: #4b5563;">"${objeto_datos_crudos.contenido_del_mensaje}"</p>
                        </div>
                    </div>
                </div>
            `;
        case 'resultados':
            return `
                <div class="dashboard-grid fade-in" style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="card" style="width: 100%;">
                        <h3>🔬 Resultados de Laboratorio y Reportes</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">Historial de analíticas y exámenes cargados en el expediente electrónico.</p>
                        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff;">
                            <h4 style="margin: 0; color: #1f2937;">Estudio: ${objeto_datos_crudos.tipo_de_estudio}</h4>
                            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: var(--text-muted);">Fecha: ${objeto_datos_crudos.fecha_analisis} | Estado: ${objeto_datos_crudos.estado_estudio}</p>
                        </div>
                    </div>
                </div>
            `;
        case 'medicacion':
            return `
                <div class="dashboard-grid fade-in" style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="card" style="width: 100%;">
                        <h3>💊 Historial de Indicaciones Farmacológicas</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">Registro maestro de tratamientos y recetas emitidas por este profesional médico.</p>
                        <div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; border-left: 4px solid #10b981;">
                            <p style="margin: 0; font-size: 0.95rem; color: #1f2937;">${objeto_datos_crudos.texto_indicaciones_maestras}</p>
                        </div>
                    </div>
                </div>
            `;
        case 'perfil':
            return `
                <div class="dashboard-grid fade-in" style="display: flex; flex-direction: column; gap: 20px;">
                    <div class="card" style="width: 100%;">
                        <h3>👤 Mi Perfil Profesional</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">Información de credenciales médicas y registro de usuario en Zoe Care.</p>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <p style="margin:0;"><strong>Médico:</strong> ${objeto_datos_crudos.nombre_medico_titular}</p>
                            <p style="margin:0;"><strong>Especialidad:</strong> ${objeto_datos_crudos.especialidad_clinica}</p>
                        </div>
                    </div>
                </div>
            `;
        default:
            return `<div class="card"><h3>Sección</h3><p>Contenido no definido.</p></div>`;
    }
}




// ==========================================
// PARTE 4: ESTRUCTURA RAÍZ Y MANEJADORES DE NAVEGACIÓN
// ==========================================

export function profesionalView() {
    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/Proyecto_Integrador/Front/Diseño_1/src/styles/styles.css';
        document.head.appendChild(styleLink);
    }
    const estructuraDashboardBase = `
        <div class="dashboard-grid fade-in">
            <section class="main-content-column">
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
                <div class="vitals-grid">
                    <div class="vital-card vital-glucose"><span class="vital-value">102</span><span class="vital-label">Glucosa mg/dL</span></div>
                    <div class="vital-card vital-heart"><span class="vital-value">78</span><span class="vital-label">Ritmo cardíaco</span></div>
                    <div class="vital-card vital-oxygen"><span class="vital-value">98%</span><span class="vital-label">Saturación O2</span></div>
                    <div class="vital-card vital-pressure"><span class="vital-value">139</span><span class="vital-label">Presión arterial</span></div>
                </div>
                <div class="card chart-card">
                    <div class="chart-header"><h3>Evolución Clínica del Paciente</h3></div>
                    <div class="chart-placeholder">
                        <p style="text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                            <i class="ti ti-chart-line" style="font-size: 1.8rem; display: block; margin-bottom: 6px; opacity: 0.7;"></i> [Gráfico de estabilidad del paciente]
                        </p>
                    </div>
                </div>
            </section>
            <aside class="right-content-column">
                <div class="card tracking-card">
                    <h3>Seguimiento del Plan de Cuidado</h3>
                    <div class="progress-bar-container"><div class="progress-bar" style="width: 60%;"></div></div>
                    <div class="progress-labels"><span>60% completado</span></div>
                </div>
                <div class="card quick-actions-card">
                    <h3>Acciones rápidas</h3>
                    <ul class="actions-list">
                        <li class="action-item" id="elemento_lista_emitir_indicaciones" data-target="medicacion">Emitir indicaciones <span class="arrow">›</span></li>
                        <li class="action-item" id="elemento_lista_subir_reporte" data-target="resultados">Subir reporte clínico <span class="arrow">›</span></li>
                    </ul>
                </div>
                <div class="card reminder-card">
                    <div class="rhead"><i class="ti ti-notes"></i> Notas del Turno</div>
                    <p>Revisar observaciones enviadas por el cuidador en la mañana.</p>
                </div>
            </aside>
        </div>
    `;
    setTimeout(() => initProfesionalDashboardEvents(estructuraDashboardBase), 0);
    
    return `
        <div class="dashboard-layout layout-profesional">
            <aside class="sidebar sidebar-profesional">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard">Dashboard</a>
                    <a href="#" class="menu-item" data-view="citas">Citas / Visitas</a>
                    <a href="#" class="menu-item" data-view="mensajes">Mensajes</a>
                    <a href="#" class="menu-item" data-view="resultados">Resultados</a>
                    <a href="#" class="menu-item" data-view="medicacion">Indicaciones</a>
                    <a href="#" class="menu-item" data-view="perfil">Mi Perfil</a>
                    <a href="#/" class="menu-item logout-item">Cerrar Sesión</a>
                </nav>
            </aside>
            <div class="dashboard-main">
                <header class="dashboard-header">
                    <button class="menu-hamburger-btn" id="hamburguesa-toggle" aria-label="Abrir menú"><span></span><span></span><span></span></button>
                    <div class="welcome-text"><h2>Bienvenido Profesional</h2><span>Viernes, 10 julio 2026</span></div>
                </header>
                <div id="dynamic-content-area">${estructuraDashboardBase}</div>
            </div>
        </div>
    `;
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
            } else {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando...</p></div>';
                
                // Consumimos el JSON de datos puros desde el servicio corregido
                const objeto_datos_json_crudos = await obtenerDatosSeccion(vistaSolicitada, 'profesional');
                
                // El despachador visual genera el marcado correspondiente usando las propiedades del JSON
                contentArea.innerHTML = funcion_despachador_de_plantillas_html_subvistas(vistaSolicitada, objeto_datos_json_crudos);
            }
        });
    });
    initCardButtonsEvents();
}

// ============================================================================
// ACTIVACIÓN DEL MENÚ HAMBURGUESA RESPONSIVO (PROFESIONAL)
// ============================================================================
const nodo_boton_hamburguesa_profesional = document.getElementById('hamburguesa-toggle');
const nodo_barra_lateral_profesional = document.querySelector('.sidebar-profesional');

if (nodo_boton_hamburguesa_profesional && nodo_barra_lateral_profesional) {
    nodo_boton_hamburguesa_profesional.addEventListener('click', (evento_objeto_clic) => {
        // Evitamos que el clic propague eventos extraños en la interfaz
        evento_objeto_clic.stopPropagation();
        
        // Alternamos la clase 'active' o 'open' según tengan configurado su SASS
        nodo_barra_lateral_profesional.classList.toggle('active');
        nodo_boton_hamburguesa_profesional.classList.toggle('open');
    });

    // Evento extra de usabilidad: Si el menú está abierto y el usuario da clic fuera de él, se cierra solo
    document.addEventListener('click', (evento_pantalla_clic) => {
        if (!nodo_barra_lateral_profesional.contains(evento_pantalla_clic.target) && !nodo_boton_hamburguesa_profesional.contains(evento_pantalla_clic.target)) {
            nodo_barra_lateral_profesional.classList.remove('active');
            nodo_boton_hamburguesa_profesional.classList.remove('open');
        }
    });
}
