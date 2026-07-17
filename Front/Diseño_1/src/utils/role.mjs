export function normalizarRolParaFrontend(rol) {
  const valor = String(rol || '').trim().toLowerCase();

  if (valor === 'administrador') return 'administrador';
  if (['profesional', 'profecional', 'profecsional', 'medico', 'médico', 'doctor', 'enfermera', 'especialista'].includes(valor)) {
    return 'profesional';
  }
  if (['cuidador', 'cuidadores', 'caregiver', 'asistente'].includes(valor)) {
    return 'cuidador';
  }

  return 'cuidador';
}
