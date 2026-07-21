// src/views/notFoundView.js

export function notFoundView() {
    return `
        <div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f4f3ef; color: #2e2e2e; text-align: center; padding: 20px;">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 6rem; margin: 0; color: #2b4c3f;">404</h1>
            <h2 style="font-size: 1.8rem; margin: 10px 0 20px 0; font-weight: 600;">Página No Encontrada</h2>
            <p style="color: #666; max-width: 400px; line-height: 1.5; margin-bottom: 30px;">Lo sentimos, la ruta a la que estás intentando acceder en Zoe Care no existe o no tienes permisos de visualización.</p>
            <a href="#/" style="background-color: #cf8a72; color: white; text-decoration: none; padding: 14px 28px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: background 0.3s;">Regresar al Inicio</a>
        </div>
    `;
}
