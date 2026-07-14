// src/views/cuidadorView.js
import { obtenerDatosSeccion } from '../services/data.service.js';

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
                    <a href="#/" class="menu-item logout-item"><i class="ti ti-logout"></i> Cerrar Sesión</a>
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
            } else {
                contentArea.innerHTML = '<div class="card fade-in" style="text-align:center;"><p style="color:var(--text-muted); font-weight:600;">Cargando...</p></div>';
                contentArea.innerHTML = await obtenerDatosSeccion(vista, 'cuidador');
            }
        });
    });

    initActionButtons();
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
