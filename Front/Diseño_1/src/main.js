// src/main.js
import { HomeView } from './views/homeView.js';
import { loginView } from './views/loginView.js';
import { registerView } from './views/registerView.js';
import { profesionalView } from './views/medicoView.js';
import { cuidadorView } from './views/cuidadorView.js';
import { notFoundView } from './views/notFoundView.js';
import { estaAutenticado, obtenerSesionActiva } from './services/auth.services.js';

// 1. Mapeo del Sistema de Rutas de la SPA
const routes = {
    '/': HomeView,
    '/login': loginView,
    '/register': registerView,
    '/profesional': profesionalView,
    '/cuidador': cuidadorView
};

const protectedRoutes = {
    '/profesional': ['profesional'],
    '/cuidador': ['cuidador']
};

// 2. Enrutador Principal Asíncrono
async function router() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    const hash = window.location.hash.slice(1) || '/';
    const normalizedHash = hash.startsWith('/') ? hash : `/${hash}`;
    const viewComponent = routes[normalizedHash] || notFoundView;
    const requiredRoles = protectedRoutes[normalizedHash];

    if (requiredRoles) {
        const session = obtenerSesionActiva();
        if (!estaAutenticado() || !session || !requiredRoles.includes(session.rol)) {
            window.location.hash = '#/login';
            return;
        }
    }

    if ((normalizedHash === '/login' || normalizedHash === '/register') && estaAutenticado()) {
        const session = obtenerSesionActiva();
        window.location.hash = session?.rol === 'cuidador' ? '#/cuidador' : '#/profesional';
        return;
    }

    appContainer.innerHTML = await viewComponent();
}

// 3. Controlador Dinámico Global para el Menú Hamburguesa Psicológico
function inicializarMenuHamburguesaGlobal() {
    const btnHamburguesa = document.getElementById('hamburguesa-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.dashboard-main');

    if (!btnHamburguesa || !sidebar) return;

    // Evento de clic en el botón de hamburguesa
    btnHamburguesa.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita burbujeo no deseado
        btnHamburguesa.classList.toggle('open');       // Anima las barras a una "X"
        sidebar.classList.toggle('sidebar-open');     // Desplaza el panel elásticamente
    });

    // Cerrar el menú automáticamente si el usuario hace clic en el contenido principal para mayor comodidad
    if (mainContent) {
        mainContent.addEventListener('click', () => {
            if (sidebar.classList.contains('sidebar-open')) {
                btnHamburguesa.classList.remove('open');
                sidebar.classList.remove('sidebar-open');
            }
        });
    }
}

// 4. Observador Automatizado de Inyección de Vistas (MutationObserver)
// Detecta de forma nativa cuándo entra un Dashboard privado al DOM y activa el menú responsivo
const observer = new MutationObserver(() => {
    inicializarMenuHamburguesaGlobal();
});

// Inicializar la SPA al cargar el documento y escuchar variaciones
window.addEventListener('DOMContentLoaded', () => {
    router();
    observer.observe(document.getElementById('app'), { childList: true, subtree: true });
});

window.addEventListener('hashchange', router);
