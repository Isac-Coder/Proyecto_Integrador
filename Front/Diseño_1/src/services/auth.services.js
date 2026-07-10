// src/services/auth.services.js

export function autenticarUsuario(email, password) {
    const correo = email.toLowerCase().trim();

    // 1. Cuentas maestras por defecto fijas en el código
    if (correo === 'profesional@zoecare.com' && password === '1234') {
        return { nombre: 'Jack (Especialista)', rol: 'profesional', token: 'jwt-fijo-prof' };
    }
    if (correo === 'cuidador@zoecare.com' && password === '1234') {
        return { nombre: 'Juana Pérez', rol: 'cuidador', token: 'jwt-fijo-cuid' };
    }

    // 2. 🔍 BUSQUEDA DINÁMICA EN LOS USUARIOS REGISTRADOS EN LOCALSTORAGE
    const usuariosEnMemoria = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    
    // Buscamos si existe algún usuario que coincida con el correo y contraseña ingresados
    const usuarioEncontrado = usuariosEnMemoria.find(user => user.email.toLowerCase().trim() === correo && user.password === password);

    if (usuarioEncontrado) {
        return {
            nombre: usuarioEncontrado.nombre,
            rol: usuarioEncontrado.rol,
            token: 'jwt-dinamico-' + Math.random().toString(36).substr(2, 9) // Genera un token aleatorio simulado
        };
    }

    return null; // Credenciales inválidas si no se encuentra en ningún lado
}
