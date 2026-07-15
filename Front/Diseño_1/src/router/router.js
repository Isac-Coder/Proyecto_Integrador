// src/router/router.js

import { HomeView } from '../views/homeView.js';
import { loginView } from '../views/loginView.js';
import { registerView } from '../views/registerView.js'; // <-- ¡Importamos la nueva vista de Registro!
import { profesionalView } from '../views/profesionalView.js';
import { cuidadorView } from '../views/cuidadorView.js';
import { notFoundView } from '../views/notFoundView.js';

const routes = {
    '/': HomeView,       
    '/login': loginView,  
    '/register': registerView, // <-- ¡Ruta de Registro añadida al sistema SPA!
    '/profesional': profesionalView, 
    '/cuidador': cuidadorView 
};

export function router() {
    const appContainer = document.getElementById('app');
    
    if (!appContainer) return;
    
    let hash = window.location.hash.slice(1) || '/';
    const viewFunction = routes[hash];
    
    if (viewFunction) {
        appContainer.innerHTML = viewFunction();
    } else {
        appContainer.innerHTML = notFoundView();
    }
}
