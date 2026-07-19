// src/views/loginView.js
import { autenticarUsuario } from '../services/auth.services.js';
import { normalizarRolParaFrontend } from '../utils/role.mjs';

export function loginView() {
    // Programamos los eventos inmediatamente después del renderizado en el DOM
    setTimeout(() => {
        initLoginEvents();
    }, 0);

    return `
        <div class="login-container video-page">
            <div class="video-background">
                <video autoplay muted loop playsinline class="background-video-element">
                    <source src="assets/backgroun_Video%20(1).mp4" type="video/mp4">
                </video>
            </div>
            <div class="login-card">
                <div class="login-header">
                    <div class="login-logo">Zoe Care</div>
                    <h1>Iniciar Sesión</h1>
                    <p>Por favor, ingresa tus credenciales para acceder a la plataforma médica.</p>
                    <div id="error-message" style="color: #ef4444; font-size: 0.9rem; margin-top: 10px; font-weight: 600; display: none;"></div>
                </div>

                <!-- Formulario de Acceso -->
                <form id="login-form" class="login-form">
                    <div class="form-group">
                        <label for="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" placeholder="profesional@zoecare.com o cuidador@zoecare.com" required autocomplete="email">
                    </div>

                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" placeholder="Contraseña de prueba: 1234" required autocomplete="current-password">
                    </div>

                    <!-- NUEVA SECCIÓN: ENLACE PARA CREAR CUENTA NUEVA -->
                    <div class="register-invite" style="text-align: center; margin-top: 5px;">
                        <p style="font-size: 0.88rem; color: #666;">¿Eres un nuevo especialista o asistente? 
                            <a href="#/register" style="color: #2b4c3f; font-weight: 600; text-decoration: none; border-bottom: 1px dashed #2b4c3f;">Regístrate aquí</a>
                        </p>
                    </div>

                    <div class="form-actions" style="margin-top: 10px;">
                        <a href="#/" class="btn-back">Volver al Inicio</a>
                        <button type="submit" class="btn-submit">Ingresar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function initLoginEvents() {
    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('error-message');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const usuarioLogueado = await autenticarUsuario(email, password);
            errorDiv.style.display = 'none';
            sessionStorage.setItem('user_session', JSON.stringify(usuarioLogueado));

            const rol = normalizarRolParaFrontend(usuarioLogueado.rol);

            if (rol === 'profesional') {
                window.location.hash = '#/profesional';
            } else if (rol === 'cuidador') {
                window.location.hash = '#/cuidador';
            } else {
                window.location.hash = '#/';
            }
        } catch (error) {
            errorDiv.innerHTML = error.message || '⚠️ Credenciales incorrectas.';
            errorDiv.style.display = 'block';
        }
    });
}
