const API_URL = 'http://127.0.0.1:3001/api';

export async function registrarUsuarioEnBackend(nombre, email, password, rol) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password, rol })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'No se pudo completar el registro.');
  }

  return data;
}
