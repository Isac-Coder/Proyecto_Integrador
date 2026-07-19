// src/views/registerView.js
import { registrarUsuarioEnBackend } from '../services/registro.service.js';

export function registerView() {
    // Programamos la ejecución de los eventos de registro
    setTimeout(() => {
        initRegisterEvents();
    }, 0);

    return `
        <div class="login-container video-page">
            <div class="video-background">
                <video autoplay muted loop playsinline class="background-video-element">
                    <source src="assets/backgroun_Video%20(1).mp4" type="video/mp4">
                </video>
            </div>
            <div class="login-card" style="max-width: 500px;">
                <div class="login-header">
                    <div class="login-logo">Zoe Care</div>
                    <h1>Crear Cuenta</h1>
                    <p>Regístrate en la plataforma para coordinar y monitorear la asistencia médica.</p>
                    <div id="register-success" style="color: #2b4c3f; background: #e6f4ea; padding: 10px; border-radius: 4px; font-size: 0.9rem; margin-top: 10px; font-weight: 600; display: none;"></div>
                </div>

                <!-- Formulario de Registro -->
                <form id="register-form" class="login-form">
                    <div class="form-group">
                        <label for="reg-name">Nombre Completo</label>
                        <input type="text" id="reg-name" placeholder="Ej: Dra. María Delgado" required>
                    </div>

                    <div class="form-group">
                        <label for="reg-email">Correo Electrónico</label>
                        <input type="email" id="reg-email" placeholder="nombre@zoecare.com" required autocomplete="email">
                    </div>

                    <div class="form-group">
                        <label for="reg-role">Tipo de Usuario / Rol</label>
                        <select id="reg-role" style="padding: 12px 16px; border: 1px solid #cccccc; border-radius: 4px; font-size: 0.95rem; font-family: inherit; color: #2e2e2e; background: white; outline: none; transition: border-color 0.3s;" onfocus="this.style.borderColor='#2b4c3f'" onblur="this.style.borderColor='#ccc'">
                            <option value="profesional">Profesional de la Salud (Médico / Enfermera / Especialista)</option>
                            <option value="cuidador">Cuidador de Asistencia</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="reg-password">Contraseña</label>
                        <input type="password" id="reg-password" placeholder="Mínimo 4 caracteres" required autocomplete="new-password">
                    </div>

                    <div class="form-actions" style="margin-top: 15px;">
                        <a href="#/login" class="btn-back">¿Ya tienes cuenta? Login</a>
                        <button type="submit" class="btn-submit">Registrarme</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Captura el envío del formulario y simula el almacenamiento del nuevo usuario
 */
async function initRegisterEvents() {
    const form = document.getElementById('register-form');
    const successDiv = document.getElementById('register-success');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const rol = document.getElementById('reg-role').value;
        const password = document.getElementById('reg-password').value;

        try {
            const resultado = await registrarUsuarioEnBackend(nombre, email, password, rol);

            successDiv.innerText = `🎉 ¡Registro exitoso, ${resultado.user?.nombre || nombre}! Redirigiéndote al login...`;
            successDiv.style.display = 'block';
            form.reset();

            setTimeout(() => {
                window.location.hash = '#/login';
            }, 2500);
        } catch (error) {
            successDiv.innerText = error.message || 'No se pudo registrar el usuario.';
            successDiv.style.display = 'block';
            successDiv.style.background = '#fde8e8';
            successDiv.style.color = '#b91c1c';
        }
    });
}
