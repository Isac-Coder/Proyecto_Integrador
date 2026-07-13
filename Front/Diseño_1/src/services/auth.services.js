// src/services/auth.services.js

const API_URL = 'http://localhost:3001/api';

export async function autenticarUsuario(email, password) {
    const correo = email.toLowerCase().trim();

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: correo, password })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return null;
        }

        return {
            nombre: data.user?.nombre || data.user?.email,
            rol: data.user?.rol,
            token: data.token,
            email: data.user?.email
        };
    } catch (error) {
        console.error('Error al autenticar con el backend:', error);
        return null;
    }
}
