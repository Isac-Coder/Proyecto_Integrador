// src/services/auth.services.js

const API_URL = 'http://127.0.0.1:3001/api';

export async function autenticarUsuario(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            // Si el backend envía un mensaje de error, úsalo. Si no, usa un mensaje genérico.
            throw new Error(data.message || 'Error en la autenticación. Por favor, inténtalo de nuevo.');
        }

        if (!data.success || !data.token) {
            throw new Error('Respuesta inesperada del servidor.');
        }

        // Guardar el token para futuras peticiones
        localStorage.setItem('authToken', data.token);

        return {
            // El nombre puede ser opcional, pero el email y el rol son clave.
            nombre: data.user?.nombre,
            rol: data.user?.rol,
            token: data.token,
            email: data.user?.email
        };
    } catch (error) {
        console.error('Error al autenticar con el backend:', error);
        // Relanzamos el error para que el componente que llama pueda manejarlo.
        throw error;
    }
}
