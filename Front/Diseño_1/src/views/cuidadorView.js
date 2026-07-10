// src/views/cuidadorView.js
import { obtenerDatosSeccion } from '../services/data.service.js';

export function cuidadorView() {
    if (!document.getElementById('medico-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'medico-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = '/Proyecto_Integrador/Front/Diseño_1/src/styles/paciente.css';
        document.head.appendChild(styleLink);
    }

    const estructuraCuidadorBase = `
        <div class="dashboard-grid fade-in">
            <section class="main-content-column">
                <div class="card card-main-cuidador">
                    <h3>PACIENTE BAJO ASISTENCIA ACTUAL</h3>
                    <div class="doctor-info">
                        <div class="doctor-avatar" style="background: rgba(255,255,255,0.2);"></div>
                        <div>
                            <h4>Don Alberto Gómez</h4>
                            <p>Asistencia y Monitoreo del Adulto Mayor</p>
                        </div>
                    </div>
                    <div class="appointment-date">
                        <span>Turno actual: Mañana</span>
                        <span>Estado: Estable</span>
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
                    <p>Progreso de suministro diario</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 33%;"></div>
                    </div>
                    <span style="font-size:0.85rem; color:var(--text-muted);">1 de 3 dosis entregadas</span>
                </div>

                <div class="card">
                    <h3>Controles Rápidos</h3>
                    <ul class="actions-list">
                        <li id="btn-med">Suministrar Pastilla Mañana <span class="arrow">›</span></li>
                        <li id="btn-alerta">Notificar Alerta Familiar <span class="arrow">›</span></li>
                    </ul>
                </div>
            </aside>
        </div>
    `;

    setTimeout(() => {
        initCuidadorEvents(estructuraCuidadorBase);
    }, 0);

    return `
        <div class="dashboard-layout">
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
                    <div class="welcome-text">
                        <h2>Hola, Juana Pérez</h2>
                        <span class="current-date">Viernes, 10 julio 2026</span>
                    </div>
                    <div class="avatar">JP</div>
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
        item.addEventListener('click', (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const vista = item.getAttribute('data-view');
            if (vista === 'dashboard') {
                contentArea.innerHTML = baseHtml;
                initActionButtons();
            } else {
                contentArea.innerHTML = obtenerDatosSeccion(vista, 'cuidador');
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
