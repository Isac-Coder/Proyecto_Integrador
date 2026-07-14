// src/views/registerView.js

export function registerView() {
    if (!document.getElementById('login-style')) {
        const styleLink = document.createElement('link');
        styleLink.id = 'login-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = './styles/login.css';
        document.head.appendChild(styleLink);
    }

    // Programamos la ejecución de los eventos de registro
    setTimeout(() => {
        initRegisterEvents();
    }, 0);

    return `
        <div class="login-container">
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
function initRegisterEvents() {
    const form = document.getElementById('register-form');
    const successDiv = document.getElementById('register-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const rol = document.getElementById('reg-role').value;
        const password = document.getElementById('reg-password').value;

        // Estructuramos el nuevo usuario
        const nuevoUsuario = { nombre, email, rol, password };

        // 💾 SIMULACIÓN DE BASE DE DATOS USANDO LOCALSTORAGE
        // Obtenemos los usuarios que ya existan guardados, o creamos un arreglo vacío si es el primero
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_db')) || [];
        
        // Agregamos el nuevo usuario al arreglo
        usuariosRegistrados.push(nuevoUsuario);
        
        // Lo volvemos a guardar en la memoria local texturizado en JSON
        localStorage.setItem('usuarios_db', JSON.stringify(usuariosRegistrados));

        // Mostramos mensaje de éxito dinámico en pantalla
        successDiv.innerText = `🎉 ¡Registro exitoso, ${nombre}! Redirigiéndote al login...`;
        successDiv.style.display = 'block';
        form.reset();

        // Redirigimos automáticamente al Login después de 2.5 segundos para que pueda iniciar sesión
        setTimeout(() => {
            window.location.hash = '#/login';
        }, 2500);
    });
}
