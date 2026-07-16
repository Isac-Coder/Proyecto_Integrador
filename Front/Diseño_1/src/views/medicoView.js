// src/views/medicoView.js
import { obtenerDatosSeccion } from '../services/data.service.js';

export function profesionalView() {
    // Unificamos el punto de carga de estilos al CSS compilado centralizado
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
                
                <!-- Próxima Cita -->
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

                <!-- Indicadores de Salud -->
                <div class="vitals-grid">
                    <div class="vital-card vital-glucose">
                        <span class="vital-value">102</span>
                        <span class="vital-label">Glucosa mg/dL</span>
                    </div>
                    <div class="vital-card vital-heart">
                        <span class="vital-value">78</span>
                        <span class="vital-label">Ritmo cardíaco</span>
                    </div>
                    <div class="vital-card vital-oxygen">
                        <span class="vital-value">98%</span>
                        <span class="vital-label">Saturación O2</span>
                    </div>
                    <div class="vital-card vital-pressure">
                        <span class="vital-value">139</span>
                        <span class="vital-label">Presión arterial</span>
                    </div>
                </div>

                <!-- Bloque del Gráfico -->
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

            <aside class="right-content-column">
                <div class="card tracking-card">
                    <h3>Seguimiento del Plan de Cuidado</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Progreso General</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 60%;"></div>
                    </div>
                    <div class="progress-labels">
                        <span>60% completado</span>
                    </div>
                </div>

                <div class="card quick-actions-card">
                    <h3>Acciones rápidas</h3>
                    <ul class="actions-list">
                        <li class="action-item" data-target="medicacion">Emitir indicaciones <span class="arrow">›</span></li>
                        <li class="action-item" data-target="resultados">Subir reporte clínico <span class="arrow">›</span></li>
                    </ul>
                </div>

                <div class="card reminder-card">
                    <div class="rhead"><i class="ti ti-notes"></i> Notas del Turno</div>
                    <p>Revisar observaciones enviadas por el cuidador en la mañana.</p>
                </div>
            </aside>
        </div>
    `;

    setTimeout(() => {
        initProfesionalDashboardEvents(estructuraDashboardBase);
    }, 0);

    // Activamos la clase layout-profesional e inyectamos el botón hamburguesa con id="hamburguesa-toggle"
    return `
        <div class="dashboard-layout layout-profesional">
            
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

            <div class="dashboard-main">
                <header class="dashboard-header">
                    <button class="menu-hamburger-btn" id="hamburguesa-toggle" aria-label="Abrir menú">
                        <span></span>
                        <span></span>
                        <span></span>
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

                <div id="dynamic-content-area">
                    ${estructuraDashboardBase}
                </div>

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
                contentArea.innerHTML = await obtenerDatosSeccion(vistaSolicitada, 'profesional');
            }
        });
    });

    initCardButtonsEvents();
}

function initCardButtonsEvents() {
    const btnHistorial = document.getElementById('btn-historial');
    if (btnHistorial) {
        btnHistorial.addEventListener('click', () => alert('📁 Abriendo historial clínico...'));
    }
}
