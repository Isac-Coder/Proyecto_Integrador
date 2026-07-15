// ============================================================================
// PARTE 1: CONFIGURACIÓN GENERAL Y ESTADO DE TRABAJO EN MEMORIA
// ============================================================================
const URL_BASE_DE_LA_API_DEL_BACKEND = 'http://localhost:3001/api';

// Variables globales para el control de dosis de medicamentos en la pantalla principal
let dosisEntregadas = 1;
const dosisTotales = 3;




// ============================================================================
// PARTE 2: PETICIONES HTTP / OPERACIONES CRUD DE COMUNICACIÓN
// ============================================================================

/**
 * Realiza una consulta HTTP GET a la Base de Datos para traer todos los pacientes.
 * @returns {Promise<Array>} Lista de registros médicos activos.
 */
async function funcion_peticion_http_obtener_lista_de_pacientes() {
    try {
        const respuesta_http = await fetch(`${URL_BASE_DE_LA_API_DEL_BACKEND}/pacientes`);
        if (!respuesta_http.ok) throw new Error('Error de conexión.');
        const datos_decodificados = await respuesta_http.json();
        return datos_decodificados.data || datos_decodificados;
    } catch (error_detectado) {
        console.warn('[ZOE CARE SYSTEM] Backend offline. Cargando datos simulados de respaldo.');
        return [
            { id: "1", nombre_completo: "Don Alberto Gómez", habitacion_asignada: "204", presion_arterial: "110/70", saturacion_oxigeno: "97%", estado_salud: "estable", iniciales_avatar: "AG" },
            { id: "2", nombre_completo: "Doña María López", habitacion_asignada: "101", presion_arterial: "135/85", saturacion_oxigeno: "95%", estado_salud: "observacion", iniciales_avatar: "ML" }
        ];
    }
}

/**
 * Realiza una inserción HTTP POST a la Base de Datos para registrar un nuevo paciente.
 * @param {Object} objeto_datos_nuevo_paciente - Datos recopilados del formulario.
 * @returns {Promise<boolean>} Estado de éxito de la operación.
 */
async function funcion_peticion_http_guardar_nuevo_paciente_en_bd(objeto_datos_nuevo_paciente) {
    try {
        const respuesta_http = await fetch(`${URL_BASE_DE_LA_API_DEL_BACKEND}/pacientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objeto_datos_nuevo_paciente)
        });
        return respuesta_http.ok;
    } catch (error) {
        console.error('Error de red al insertar en Base de Datos:', error);
        return false;
    }
}

/**
 * Realiza una consulta HTTP GET de un paciente específico para desplegar su historial clínico.
 * @param {string} parametro_identificador_id - ID único del registro del paciente.
 * @returns {Promise<Object>} Datos del expediente clínico del paciente.
 */
async function funcion_peticion_http_obtener_expediente_por_id(parametro_identificador_id) {
    try {
        const respuesta_http = await fetch(`${URL_BASE_DE_LA_API_DEL_BACKEND}/pacientes/${parametro_identificador_id}`);
        const datos = await respuesta_http.json();
        return datos.data || datos;
    } catch (error) {
        console.warn('[ZOE CARE INTEGRATION] Sincronizando historial local de respaldo.');
        
        // Corrección de propiedades explístas mapeadas para evitar valores undefined en pantalla
        return {
            nombre_completo: parametro_identificador_id === "2" ? "Doña María López" : "Don Alberto Gómez",
            edad: "82 años",
            alergias: "Penicilina y Sulfas",
            antecedentes: "Hipertensión Arterial Crónica, Diabetes Mellitus Tipo 2.",
            observaciones_medicas: "Mantener monitoreo estricto de presión arterial cada mañana antes de administrar medicamentos. Reposo absoluto por las tardes."
        };
    }
}





// ============================================================================
// PARTE 3: GENERADORES DE INTERFACES DINÁMICAS (SUB-VISTAS)
// ============================================================================

/**
 * Genera el listado dinámico de pacientes consumiendo la información desde la base de datos o fallback.
 * @returns {Promise<string>} Cadena de texto HTML structured.
 */
async function funcion_renderizar_html_subvista_mis_pacientes() {
    const arreglo_pacientes_bd = await funcion_peticion_http_obtener_lista_de_pacientes();

    const cadena_html_tarjetas = arreglo_pacientes_bd.map(objeto_paciente => {
        const cadena_color_badge = objeto_paciente.estado_salud === 'estable' ? '#dcfce7' : '#fff9db';
        const cadena_color_texto = objeto_paciente.estado_salud === 'estable' ? '#15803d' : '#b45309';

        return `
            <div class="tarjeta-paciente-individual" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 44px; height: 44px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #4f46e5;">
                        ${objeto_paciente.iniciales_avatar || 'P'}
                    </div>
                    <div>
                        <h4 style="margin: 0; color: #1f2937;">${objeto_paciente.nombre_completo}</h4>
                        <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">
                            Habitación ${objeto_paciente.habitacion_asignada} | PA: ${objeto_paciente.presion_arterial || '120/80'} | SatO2: ${objeto_paciente.saturacion_oxigeno || '98%'}
                        </p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="background: ${cadena_color_badge}; color: ${cadena_color_texto}; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize;">
                        ${objeto_paciente.estado_salud}
                    </span>
                    <button class="clase-controlador-btn-ver-perfil" data-id="${objeto_paciente.id || '1'}" style="background: #f3f4f6; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; font-weight: 500;">Ver Perfil</button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="dashboard-grid fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <div class="card" style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3>Listado de Pacientes Asignados</h3>
                    <button id="boton_abrir_ventana_emergente_registro" style="background: #4f46e5; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">
                        + Asignar Nuevo Paciente
                    </button>
                </div>
                <div id="contenedor_listado_dinamico_tarjetas_pacientes">${cadena_html_tarjetas}</div>
            </div>
        </div>
    `;
}

/**
 * Genera la estructura HTML de la Bitácora Diaria.
 * @returns {string} Cadena de texto HTML estructurada.
 */
function funcion_renderizar_html_subvista_bitacora_diaria() {
    return `
        <div class="dashboard-grid fade-in" style="display: flex; flex-direction: column; gap: 20px;">
            <div class="card" style="width: 100%;">
                <h3>Bitácora de Observaciones Diarias</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">Historial cronológico oficial de novedades y reportes clínicos del día.</p>
                <div style="border-left: 2px solid #e5e7eb; margin-left: 10px; padding-left: 20px;">
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">09:30 AM</span>
                    <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: #374151;"><strong>Control Clínico:</strong> Constantes vitales estables en rango normal.</p>
                </div>
            </div>
        </div>
    `;
}





// ============================================================================
// PARTE 4: CONTROL DE VENTANAS EMERGENTES (MODALES ESTILIZADOS)
// ============================================================================

/**
 * Crea e inyecta dinámicamente un modal con el expediente clínico detallado del paciente.
 * @param {string} parametro_id_paciente - ID del paciente seleccionado.
 */
async function funcion_desplegar_ventana_emergente_expediente_clinico(parametro_id_paciente) {
    const datos_expediente = await funcion_peticion_http_obtener_expediente_por_id(parametro_id_paciente);
    
    const nodo_modal_existente = document.getElementById('ventana_emergente_expediente_clinico');
    if (nodo_modal_existente) nodo_modal_existente.remove();

    const nodo_contenedor_modal = document.createElement('div');
    nodo_contenedor_modal.id = 'ventana_emergente_expediente_clinico';
    nodo_contenedor_modal.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';
    
    nodo_contenedor_modal.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 16px; width: 450px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); font-family: sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">
                <h3 style="margin: 0; color: #1f2937; font-size: 1.25rem;">📋 Historial Médico</h3>
                <span id="cerrar_modal_expediente" style="cursor: pointer; font-size: 1.2rem; color: #9ca3af; font-weight: bold;">&times;</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.9rem; color: #374151; line-height: 1.5;">
                <p style="margin: 0;"><strong>Paciente:</strong> ${datos_expediente.nombre_completo}</p>
                <p style="margin: 0;"><strong>Edad:</strong> ${datos_expediente.edad}</p>
                <p style="margin: 0;"><strong>Alergias:</strong> <span style="color: #ef4444; font-weight: 600;">${datos_expediente.alergias}</span></p>
                <p style="margin: 0;"><strong>Antecedentes:</strong> ${datos_expediente.antecedentes}</p>
                <div style="background: #f9fafb; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 6px;">
                    <strong style="color: #4b5563; display: block; margin-bottom: 6px; font-size: 0.85rem;">Indicaciones:</strong>
                    <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">${datos_expediente.observaciones_medicas}</p>
                </div>
            </div>
            <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
                <button id="boton_cerrar_expediente_aceptar" style="background: #374151; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">Cerrar Ventana</button>
            </div>
        </div>
    `;

    document.body.appendChild(nodo_contenedor_modal);
    const funcion_cerrar = () => nodo_contenedor_modal.remove();
    document.getElementById('cerrar_modal_expediente').addEventListener('click', funcion_cerrar);
    document.getElementById('boton_cerrar_expediente_aceptar').addEventListener('click', funcion_cerrar);
}

/**
 * Despliega la ventana emergente interactiva para rellenar los datos del nuevo paciente a registrar en la BD.
 */
function funcion_inyectar_y_mostrar_ventana_emergente_formulario_registro() {
    const nodo_contenedor_modal = document.createElement('div');
    nodo_contenedor_modal.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';
    
    nodo_contenedor_modal.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 16px; width: 400px; font-family: sans-serif;">
            <h3 style="margin-top:0; color: #1f2937;">Registrar Nuevo Paciente</h3>
            <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 16px;">
                <input type="text" id="input_modal_nombre" placeholder="Nombre Completo" style="padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size:0.9rem;">
                <input type="text" id="input_modal_habitacion" placeholder="Número de Habitación" style="padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size:0.9rem;">
                <select id="input_modal_estado" style="padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; background: white; font-size:0.9rem;">
                    <option value="estable">Estable</option>
                    <option value="observacion">En Observación</option>
                </select>
            </div>
            <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px;">
                <button id="boton_modal_cancelar" style="background:#f3f4f6; color:#4b5563; border:none; padding:10px 16px; border-radius:8px; cursor:pointer; font-weight:600;">Cancelar</button>
                <button id="boton_modal_guardar" style="background:#4f46e5; color:white; border:none; padding:10px 16px; border-radius:8px; cursor:pointer; font-weight:600;">Guardar en BD</button>
            </div>
        </div>
    `;

    document.body.appendChild(nodo_contenedor_modal);
    document.getElementById('boton_modal_cancelar').addEventListener('click', () => nodo_contenedor_modal.remove());
    
    document.getElementById('boton_modal_guardar').addEventListener('click', async () => {
        const nombre = document.getElementById('input_modal_nombre').value.trim();
        const habitacion = document.getElementById('input_modal_habitacion').value.trim();
        const estado = document.getElementById('input_modal_estado').value;

        if (!nombre || !habitacion) {
            alert('Por favor, rellene todos los campos requeridos.');
            return;
        }

        const iniciales = nombre.split(' ').map(n => n).join('').substring(0,2).toUpperCase();
        const nuevo_objeto_paciente = { nombre_completo: nombre, habitacion_asignada: habitacion, estado_salud: estado, iniciales_avatar: iniciales };

        await funcion_peticion_http_guardar_nuevo_paciente_en_bd(nuevo_objeto_paciente);
        nodo_contenedor_modal.remove();
        
        const area = document.getElementById('cuidador-content-area');
        if (area) {
            area.innerHTML = await funcion_renderizar_html_subvista_mis_pacientes();
            funcion_vincular_escuchadores_internos_dinamicos();
        }
    });
}

function funcion_vincular_escuchadores_internos_dinamicos() {
    const btnAbrirModal = document.getElementById('boton_abrir_ventana_emergente_registro');
    if (btnAbrirModal) btnAbrirModal.addEventListener('click', funcion_inyectar_y_mostrar_ventana_emergente_formulario_registro);

    const botonesVerPerfil = document.querySelectorAll('.clase-controlador-btn-ver-perfil');
    botonesVerPerfil.forEach(btn => {
        btn.addEventListener('click', () => {
            const id_paciente = btn.getAttribute('data-id');
            funcion_desplegar_ventana_emergente_expediente_clinico(id_paciente);
        });
    });
}






// ============================================================================
// PARTE 5: MAQUETACIÓN BASE DE LA INTERFAZ GENERAL E INICIALIZADORES
// ============================================================================

export function cuidadorView() {
    if (!document.getElementById('zoe-global-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'zoe-global-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/Proyecto_Integrador/Front/Diseño_1/src/styles/styles.css';
        document.head.appendChild(styleLink);
    }

    const estructuraCuidadorBase = `
        <div class="dashboard-grid fade-in">
            <section class="main-content-column">
                <div class="card card-main-cuidador">
                    <h3>PACIENTE BAJO ASISTENCIA ACTUAL</h3>
                    <div class="doctor-info">
                        <div class="doctor-avatar"></div>
                        <div class="doctor-meta"><h4>Don Alberto Gómez</h4><p>Asistencia y Monitoreo</p></div>
                    </div>
                    <div class="appointment-date">
                        <span>Turno actual: Mañana</span> | <span>Estado: Estable</span>
                    </div>
                </div>
                <div class="vitals-grid">
                    <div class="vital-card vital-pressure"><span class="vital-value">110/70</span><span class="vital-label">Presión Arterial</span></div>
                    <div class="vital-card vital-oxygen"><span class="vital-value">97%</span><span class="vital-label">Saturación de Oxígeno</span></div>
                </div>
            </section>
            <aside class="right-content-column">
                <div class="card">
                    <h3>Medicamentos</h3>
                    <div class="progress-bar-container"><div class="progress-bar" style="width: 33%;"></div></div>
                    <div class="progress-labels"><span>1 de 3 dosis entregadas</span></div>
                </div>
                <div class="card">
                    <h3>Controles Rápidos</h3>
                    <ul class="actions-list">
                        <li id="btn-med">Suministrar Pastilla Mañana <span class="arrow">›</span></li>
                        <li id="btn-alerta" style="color:#ef4444;">Notificar Alerta Familiar <span class="arrow">›</span></li>
                    </ul>
                </div>
            </aside>
        </div>
    `;

    setTimeout(() => initCuidadorEvents(estructuraCuidadorBase), 0);

    return `
        <div class="dashboard-layout layout-cuidador">
            <aside class="sidebar sidebar-cuidador">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard">Inicio Asistencia</a>
                    <a href="#" class="menu-item" data-view="pacientes">Mis Pacientes</a>
                    <a href="#" class="menu-item" data-view="bitacora">Bitácora Diaria</a>
                    <a href="#/" class="menu-item logout-item">Cerrar Sesión</a>
                </nav>
            </aside>
            <div class="dashboard-main">
                <header class="dashboard-header">
                    <div class="welcome-text"><h2>Hola, Juana Pérez</h2><span>Viernes, 10 julio 2026</span></div>
                </header>
                <div id="cuidador-content-area">${estructuraCuidadorBase}</div>
            </div>
        </div>
    `;
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
                initActionButtons();
            } 
            else if (vista === 'pacientes') {
                contentArea.innerHTML = await funcion_renderizar_html_subvista_mis_pacientes();
                funcion_vincular_escuchadores_internos_dinamicos();
            } 
            else if (vista === 'bitacora') {
                contentArea.innerHTML = funcion_renderizar_html_subvista_bitacora_diaria();
            }
        });
    });

    initActionButtons();
}

function initActionButtons() {
    const btnMed = document.getElementById('btn-med');
    if (btnMed) {
        btnMed.addEventListener('click', () => {
            btnMed.style.background = '#f0fdf4';
            btnMed.style.color = '#16a34a';
            btnMed.innerHTML = '✅ Pastilla Mañana Suministrada';
        });
    }
}
