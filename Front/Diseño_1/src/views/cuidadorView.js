// src/views/cuidadorView.js
import { obtenerDatosSeccion, obtenerPacientes, obtenerProfesionales, crearPaciente, obtenerPacienteDetalle, actualizarPaciente, obtenerBitacoraPlantillas, crearBitacoraPlantilla, obtenerBitacoraRegistros, crearBitacoraRegistro, obtenerMedicamentosPaciente, crearMedicamentoPaciente, actualizarMedicamentoPaciente, obtenerCitasPaciente, crearCitaPaciente } from '../services/data.service.js';
import { cerrarSesion, obtenerSesionActiva } from '../services/auth.services.js';

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
                        <div class="doctor-meta">
                            <h4>Don Alberto Gómez</h4>
                            <p>Asistencia y Monitoreo del Adulto Mayor</p>
                        </div>
                    </div>
                    <div class="appointment-date">
                        <span><i class="ti ti-clock"></i> Turno actual: Mañana</span>
                        <span><i class="ti ti-activity"></i> Estado: Estable</span>
                    </div>
                </div>

                <div class="vitals-grid">
                    <div class="vital-card vital-pressure">
                        <span class="vital-value">110/70</span>
                        <span class="vital-label">Presión Arterial (Normal)</span>
                    </div>
                    <div class="vital-card vital-oxygen">
                        <span class="vital-value">97%</span>
                        <span class="vital-label">Saturación de Oxígeno</span>
                    </div>
                </div>
                
            </section>

            <aside class="right-content-column">
                <div class="card">
                    <h3>Medicamentos del Turno</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Progreso de suministro diario</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 33%;"></div>
                    </div>
                    <div class="progress-labels">
                        <span>1 de 3 dosis entregadas</span>
                    </div>
                </div>

                <div class="card">
                    <h3>Controles Rápidos</h3>
                    <ul class="actions-list">
                        <li id="btn-med">Suministrar Pastilla Mañana <span class="arrow">›</span></li>
                        <li id="btn-alerta" style="color: #ef4444;">Notificar Alerta Familiar <span class="arrow" style="color: #ef4444;">›</span></li>
                    </ul>
                </div>
            </aside>
        </div>
    `;

    setTimeout(() => {
        initCuidadorEvents(estructuraCuidadorBase);
        initLogoutEvents();
    }, 0);

    // Activamos la clase layout-cuidador e inyectamos el botón hamburguesa con id="hamburguesa-toggle"
    return `
        <div class="dashboard-layout layout-cuidador">
            <aside class="sidebar sidebar-cuidador">
                <div class="sidebar-logo">Zoe Care</div>
                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" data-view="dashboard"><i class="ti ti-smart-home"></i> Inicio Asistencia</a>
                    <a href="#" class="menu-item" data-view="pacientes"><i class="ti ti-users"></i> Mis Pacientes</a>
                    <a href="#" class="menu-item" data-view="bitacora"><i class="ti ti-notes"></i> Bitácora Diaria</a>
                    <a href="#" class="menu-item" data-view="citas"><i class="ti ti-calendar-event"></i> Citas</a>
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
                        <h2>Hola, Juana Pérez</h2>
                        <span class="current-date">Viernes, 10 julio 2026</span>
                    </div>
                    <div class="header-actions-group">
                        <div class="header-search">
                            <input type="text" placeholder="Buscar pacientes, bitácora...">
                        </div>
                        <div class="avatar">JP</div>
                    </div>
                </header>

                <div id="cuidador-content-area">
                    ${estructuraCuidadorBase}
                </div>
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

    initActionButtons();
    initLogoutEvents();
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

function openPacienteDetalleModal(idPaciente, rol = 'cuidador') {
    openFloatingModal('<div id="modal-paciente-detail" class="modal-scrollable"></div>');
    const modalContent = document.getElementById('modal-paciente-detail');
    if (modalContent) {
        renderPacienteDetalle(modalContent, idPaciente, rol);
    }
}

function openCrearPacienteModal(profesionales, emailCuidador) {
    const profesionalesOptions = profesionales.map((prof) => `
        <option value="${prof.id}">${prof.nombre} (${prof.email || prof.especialidad || 'Sin email'})</option>
    `).join('');

    const formHtml = `
        <div class="card fade-in">
            <h3>Crear paciente</h3>
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
                <div class="form-group"><label>Médico asignado</label><select name="id_profesional">
                    <option value="">Sin asignar</option>
                    ${profesionalesOptions}
                </select></div>
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="button" id="cancelar-crear-paciente" class="btn-outline-login">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar paciente</button>
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
            id_profesional: formData.get('id_profesional') ? Number(formData.get('id_profesional')) : null
        };

        const errorDiv = modalContent.querySelector('#paciente-form-error');
        const successDiv = modalContent.querySelector('#paciente-form-success');
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

        if (form) form.reset();
        closeFloatingModal();
        const pageContainer = document.getElementById('cuidador-content-area');
        if (pageContainer) await renderPacientesSection(pageContainer);
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
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="button" id="cancelar-crear-cita" class="btn-outline-login">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar cita</button>
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
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="button" id="cancelar-crear-medicamento" class="btn-outline-login">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar medicamento</button>
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
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="button" id="cancelar-editar-medicamento" class="btn-outline-login">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar cambios</button>
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
            <div class="card paciente-card">
              <h4>${paciente.nombre}</h4>
              <p><strong>Fecha de nacimiento:</strong> ${paciente.fecha_nacimiento}</p>
              <p><strong>Dirección:</strong> ${paciente.direccion || 'No registrada'}</p>
              <p><strong>Médico asignado:</strong> ${paciente.profesional_nombre || 'Sin médico asignado'}</p>
              <button class="btn-detalles btn-ver-paciente" data-paciente-id="${paciente.id}" style="margin-top:10px;">Ver / Editar</button>
            </div>
          `).join('')
        : '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados aún.</p></div>';

    container.innerHTML = `
        <div class="card fade-in" style="margin-bottom: 18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;">
                <div>
                    <h3>Mis Pacientes</h3>
                    <p>Registra nuevos pacientes y relacionalos con un profesional.</p>
                </div>
                <button id="btn-crear-paciente" class="btn-detalles" style="padding: 0.8rem 1rem;">Crear paciente</button>
            </div>
        </div>
        <div id="pacientes-list" class="pacientes-list">${pacientesHtml}</div>
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
        citas.map((cita) => ({ ...cita, paciente: paciente.nombre }))
    );

    container.innerHTML = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                    <h3>Gestión de Citas</h3>
                    <p>Registra nuevas citas para tus pacientes y revisa el historial programado.</p>
                </div>
                <button id="btn-crear-cita" class="btn-detalles" style="padding:0.85rem 1rem;">Crear cita</button>
            </div>
        </div>
        <div class="card fade-in">
            <h4>Citas próximas</h4>
            <div class="pacientes-list">
                ${citas.length ? citas.map((cita) => `
                    <div class="paciente-card">
                        <h4>${cita.paciente}</h4>
                        <p><strong>Fecha:</strong> ${new Date(cita.fecha_hora).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                        <p><strong>Hora:</strong> ${new Date(cita.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>Motivo:</strong> ${cita.motivo || 'No especificado'}</p>
                        <p><strong>Estado:</strong> ${cita.estado || 'Agendada'}</p>
                    </div>
                `).join('') : '<p style="color:var(--text-muted);">No hay citas registradas todavía.</p>'}
            </div>
        </div>
    `;

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
        medicamentos: await obtenerMedicamentosPaciente(paciente.id),
        citas: await obtenerCitasPaciente(paciente.id)
    })));

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
                detalle: `Cita: ${cita.motivo || 'Sin motivo'} · ${cita.lugar || 'Lugar no definido'} · Estado: ${cita.estado || 'Agendada'}`
            });
        });
        return lista;
    }, []);

    const eventosOrdenados = eventos.sort((a, b) => a.fecha - b.fecha);
    const eventosHtml = eventosOrdenados.length
        ? eventosOrdenados.map((evento) => `
            <div class="registro-value">
                <strong>${formatearFechaHora(evento.fecha)}</strong>
                <span>${evento.paciente} — ${evento.tipo === 'Cita' ? 'Cita' : evento.medicamento}</span>
                <small style="display:block; margin-top:6px; color:var(--text-muted);">${evento.detalle}</small>
            </div>
          `).join('')
        : '<p style="color:var(--text-muted);">No hay eventos programados para los próximos días.</p>';

    container.innerHTML = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                    <h3>Calendario de Monitoreo</h3>
                    <p>Se muestran los horarios de medicación y citas programadas para tus pacientes.</p>
                </div>
            </div>
        </div>
        <div class="card fade-in">
            <h4>Próximos eventos</h4>
            <div class="registro-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top: 12px; gap: 12px;">
                ${eventosHtml}
            </div>
        </div>
    `;
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
                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                    <div class="form-group" style="margin:0;">
                        <label>Paciente</label>
                        <select id="medicamento-paciente-select">${pacienteOptions}</select>
                    </div>
                    <button id="btn-registrar-medicamento" class="btn-detalles" style="padding:0.85rem 1rem;">Registrar medicamento</button>
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
                <button class="btn-detalles btn-editar-medicamento" data-medicamento-id="${med.id}">Editar</button>
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
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="button" id="cancelar-crear-paciente" class="btn-outline-login">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar paciente</button>
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

async function renderPacienteDetalle(container, idPaciente, rol) {
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
        if (container.closest('#floating-modal-root')) {
            closeFloatingModal();
            return;
        }
        renderPacientesSection(container);
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

function limpiarSesionYRedirigir() {
    cerrarSesion();
    window.location.hash = '#/login';
}

function initActionButtons() {
    const btnMed = document.getElementById('btn-med');
    const btnAlerta = document.getElementById('btn-alerta');

    if (btnMed) {
        btnMed.addEventListener('click', () => {
            alert('💊 Dosis marcada como suministrada con éxito a Don Alberto.');
        });
    }
    if (btnAlerta) {
        btnAlerta.addEventListener('click', () => {
            alert('🚨 Alerta enviada inmediatamente a los familiares de Don Alberto Gómez.');
        });
    }
}

async function renderBitacoraSection(container) {
    const session = obtenerSesionActiva();
    const emailCuidador = session?.email || '';
    const pacientes = await obtenerPacientes('cuidador', emailCuidador);

    if (!pacientes.length) {
        container.innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">No tienes pacientes asignados para registrar bitácora.</p></div>';
        return;
    }

    const pacienteOptions = pacientes.map((paciente) => `
        <option value="${paciente.id}">${paciente.nombre} - ${paciente.direccion || 'Sin dirección'}</option>
    `).join('');

    container.innerHTML = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <h3>Bitácora diaria</h3>
                    <p>Gestiona la plantilla de bitácora y registra datos clínicos frecuentes del paciente.</p>
                </div>
                <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                    <label style="font-weight:600;">Paciente:</label>
                    <select id="bitacora-paciente-select">${pacienteOptions}</select>
                </div>
            </div>
        </div>
        <div id="bitacora-detail-area"></div>
    `;

    const select = document.getElementById('bitacora-paciente-select');
    if (!select) return;

    select.addEventListener('change', async () => {
        const idPaciente = Number(select.value);
        await renderBitacoraDetail(container, idPaciente);
    });

    await renderBitacoraDetail(container, Number(select.value) || pacientes[0].id);
}

async function renderBitacoraDetail(container, idPaciente) {
    const detailArea = document.getElementById('bitacora-detail-area');
    if (!detailArea) return;

    detailArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando bitácora del paciente...</p></div>';

    const [plantillas, registros] = await Promise.all([
        obtenerBitacoraPlantillas(idPaciente),
        obtenerBitacoraRegistros(idPaciente)
    ]);

    const plantillasHtml = plantillas.length
        ? plantillas.map((plantilla) => `
            <li class="list-item plantilla-item" data-id="${plantilla.id}" data-name="${plantilla.nombre}">${plantilla.nombre} <span style="color:var(--text-muted); font-size:0.9rem;">(${new Date(plantilla.fecha_creacion).toLocaleDateString('es-ES')})</span></li>
          `).join('')
        : '<li style="color:var(--text-muted);">Aún no hay plantillas creadas.</li>';

    const registrosHtml = registros.length
        ? registros.map((registro) => `
            <div class="registro-card">
                <div class="registro-header">
                    <div>
                        <h4>${registro.plantilla_nombre || 'Registro sin plantilla'}</h4>
                        <span>${new Date(registro.fecha_registro).toLocaleString('es-ES')}</span>
                    </div>
                </div>
                <div class="registro-body">
                    <div class="registro-grid">
                        ${Object.entries(registro.valores || {}).map(([key, value]) => `
                            <div class="registro-value"><strong>${key}</strong><span>${value}</span></div>
                        `).join('')}
                    </div>
                    ${registro.notas ? `<p class="registro-notas"><strong>Notas:</strong> ${registro.notas}</p>` : ''}
                </div>
            </div>
          `).join('')
        : '<p style="color:var(--text-muted);">No hay registros diarios para este paciente.</p>';

    detailArea.innerHTML = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; align-items:flex-start;">
                <div>
                    <h4>Plantilla de bitácora</h4>
                    <p>Define los datos generales que deseas capturar cada vez que registras la bitácora.</p>
                </div>
                <button id="btn-crear-plantilla" class="btn-detalles" style="padding:0.75rem 1rem;">Nueva plantilla</button>
            </div>
            <ul class="plantilla-list" style="margin-top:14px; padding-left:18px;">${plantillasHtml}</ul>
        </div>
        <div id="plantilla-builder-area"></div>
        <div id="registro-form-area" class="card fade-in" style="margin-bottom:18px;"></div>
        <div class="card fade-in">
            <h4>Registros diarios recientes</h4>
            <div id="registro-list">${registrosHtml}</div>
        </div>
    `;

    document.getElementById('btn-crear-plantilla')?.addEventListener('click', () => {
        renderPlantillaBuilder(idPaciente, detailArea);
    });

    detailArea.querySelectorAll('.plantilla-item').forEach((item) => {
        item.addEventListener('click', async () => {
            const idPlantilla = Number(item.dataset.id);
            const plantillaNombre = item.dataset.name;
            await renderRegistroForm(detailArea, idPaciente, idPlantilla, plantillaNombre);
        });
    });
}

function renderPlantillaBuilder(idPaciente, detailArea) {
    const builderHtml = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <h4>Crear plantilla de bitácora</h4>
            <form id="plantilla-builder-form" class="patient-form">
                <div class="form-group"><label>Nombre de la plantilla</label><input type="text" name="nombre" required></div>
                <div id="campos-dinamicos" class="form-group">
                    <label>Campos de registro</label>
                    <div class="dynamic-fields"></div>
                    <button type="button" id="btn-agregar-campo" class="btn-outline-login" style="margin-top:8px;">Agregar campo</button>
                </div>
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="button" id="cancelar-plantilla" class="btn-outline-login">Cancelar</button>
                    <button type="submit" class="btn-submit">Guardar plantilla</button>
                </div>
                <div id="plantilla-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="plantilla-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    const builderArea = document.getElementById('plantilla-builder-area');
    if (!builderArea) return;
    builderArea.innerHTML = builderHtml;

    const fieldsContainer = builderArea.querySelector('.dynamic-fields');
    if (fieldsContainer) {
        addDynamicField(fieldsContainer, 'Ritmo cardiaco', 'ritmo_cardiaco');
        addDynamicField(fieldsContainer, 'Azúcar', 'azucar');
        addDynamicField(fieldsContainer, 'Temperatura', 'temperatura');
    }

    document.getElementById('btn-agregar-campo')?.addEventListener('click', () => {
        addDynamicField(fieldsContainer, '', 'campo_personalizado');
    });

    document.getElementById('cancelar-plantilla')?.addEventListener('click', () => {
        builderArea.innerHTML = '';
    });

    const form = document.getElementById('plantilla-builder-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nombre = String(form.nombre.value || '').trim();
        const campos = Array.from(fieldsContainer.querySelectorAll('.dynamic-field')).map((field) => ({
            label: String(field.querySelector('.campo-label')?.value || '').trim(),
            key: String(field.querySelector('.campo-key')?.value || '').trim(),
            type: String(field.querySelector('.campo-type')?.value || 'text').trim()
        })).filter((item) => item.label && item.key);

        const errorDiv = document.getElementById('plantilla-error');
        const successDiv = document.getElementById('plantilla-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        if (!nombre || !campos.length) {
            if (errorDiv) {
                errorDiv.textContent = 'Necesitas un nombre y al menos un campo válido.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        const respuesta = await crearBitacoraPlantilla(idPaciente, { nombre, campos });
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo guardar la plantilla.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Plantilla guardada correctamente.';
            successDiv.style.display = 'block';
        }

        await renderBitacoraDetail(container, idPaciente);
        builderArea.innerHTML = '';
    });
}

function addDynamicField(container, label = '', key = '') {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'dynamic-field';
    fieldWrapper.style.marginBottom = '10px';
    fieldWrapper.innerHTML = `
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start;">
            <input type="text" class="campo-label" placeholder="Etiqueta" value="${label}">
            <input type="text" class="campo-key" placeholder="Clave interna" value="${key}">
            <select class="campo-type">
                <option value="text">Texto</option>
                <option value="number">Número</option>
            </select>
            <button type="button" class="btn-outline-login btn-remove-campo">Eliminar</button>
        </div>
    `;

    container.appendChild(fieldWrapper);
    fieldWrapper.querySelector('.btn-remove-campo')?.addEventListener('click', () => {
        container.removeChild(fieldWrapper);
    });
}

async function renderRegistroForm(detailArea, idPaciente, idPlantilla, plantillaNombre) {
    const plantilla = await obtenerBitacoraPlantillas(idPaciente).then((plantillas) => plantillas.find((item) => item.id === idPlantilla));
    if (!plantilla) {
        detailArea.querySelector('#registro-form-area').innerHTML = '<div class="card fade-in"><p style="color:var(--text-muted);">Plantilla no encontrada.</p></div>';
        return;
    }

    const fieldsHtml = plantilla.campos.map((campo) => `
        <div class="form-group"><label>${campo.label}</label><input type="${campo.type || 'text'}" name="${campo.key}" required></div>
    `).join('');

    const registroHtml = `
        <div class="card fade-in" style="margin-bottom:18px;">
            <h4>Registro diario: ${plantillaNombre}</h4>
            <form id="registro-form" class="patient-form">
                ${fieldsHtml}
                <div class="form-group"><label>Notas adicionales</label><textarea name="notas" rows="3"></textarea></div>
                <div class="form-actions" style="display:flex; gap:12px; justify-content:flex-end; margin-top: 12px;">
                    <button type="submit" class="btn-submit">Guardar registro</button>
                </div>
                <div id="registro-error" style="margin-top:10px; color:#ef4444; display:none;"></div>
                <div id="registro-success" style="margin-top:10px; color:#2f855a; display:none;"></div>
            </form>
        </div>
    `;

    detailArea.querySelector('#registro-form-area').innerHTML = registroHtml;

    const form = document.getElementById('registro-form');
    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const valores = {};
        plantilla.campos.forEach((campo) => {
            valores[campo.label] = String(formData.get(campo.key) || '').trim();
        });

        const registro = {
            id_plantilla: idPlantilla,
            valores,
            notas: String(formData.get('notas') || '').trim()
        };

        const errorDiv = document.getElementById('registro-error');
        const successDiv = document.getElementById('registro-success');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        const respuesta = await crearBitacoraRegistro(idPaciente, registro);
        if (!respuesta.success) {
            if (errorDiv) {
                errorDiv.textContent = respuesta.message || 'No se pudo guardar el registro.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (successDiv) {
            successDiv.textContent = 'Registro diario guardado con éxito.';
            successDiv.style.display = 'block';
        }

        await renderBitacoraDetail(container, idPaciente);
    });
}
