/**
 * Devuelve las secciones visibles para cada tipo de usuario.
 * El contenido actual es información de demostración mantenida en memoria.
 */
function obtenerSeccionesPorRol(rol) {
  if (rol === 'cuidador') {
    return {
      pacientes: {
        title: 'Mis Pacientes Asignados',
        description: 'Lista de adultos mayores o pacientes bajo tu cuidado activo.',
        items: [
          {
            nombre: 'Don Alberto Gómez',
            edad: '78 años',
            direccion: 'Calle 45 #12-34',
            turno: 'Mañana'
          }
        ]
      },
      bitacora: {
        title: 'Bitácora de Novedades Diaria',
        description: 'Registra el comportamiento, alimentación y novedades del día.',
        items: []
      }
    };
  }

  return {
    citas: {
      title: 'Gestión de Citas Médicas',
      description: 'Agenda y seguimiento clínico.',
      items: [
        { paciente: 'Miren Yagoo', hora: '10:30 AM', motivo: 'Control Prenatal' }
      ]
    },
    mensajes: {
      title: 'Bandeja de Mensajes Médicos',
      description: 'Mensajes del cuidador y del equipo clínico.',
      items: [{ remitente: 'Cuidador - Juana', texto: 'El paciente Alberto presentó presión alta.' }]
    },
    resultados: {
      title: 'Resultados Clínicos',
      description: 'Exámenes y reportes cargados para el paciente.',
      items: [{ nombre: 'Examen de Sangre Completo', tipo: 'PDF' }]
    },
    medicacion: {
      title: 'Control de Medicación',
      description: 'Recetas y seguimiento del tratamiento.',
      items: []
    },
    perfil: {
      title: 'Perfil Profesional',
      description: 'Información pública del profesional.',
      items: [{ nombre: 'Dr. Jack', especialidad: 'Medicina General' }]
    }
  };
}

/** Devuelve todas las secciones disponibles para el rol indicado. */
exports.getDashboard = (req, res) => {
  // Normaliza el parámetro para evitar diferencias por mayúsculas o valores vacíos.
  const rol = String(req.params.rol || 'profesional').toLowerCase();
  const secciones = obtenerSeccionesPorRol(rol);

  if (!secciones || Object.keys(secciones).length === 0) {
    return res.status(400).json({ success: false, message: 'Rol no válido.' });
  }

  return res.json({ success: true, rol, secciones });
};

/** Devuelve una única sección del panel solicitada por el cliente. */
exports.getSection = (req, res) => {
  // Normaliza ambos parámetros antes de buscar el contenido.
  const rol = String(req.params.rol || 'profesional').toLowerCase();
  const seccion = String(req.params.seccion || '').toLowerCase();
  const secciones = obtenerSeccionesPorRol(rol);

  if (!secciones[seccion]) {
    return res.status(404).json({ success: false, message: 'Sección no encontrada.' });
  }

  return res.json({ success: true, rol, seccion, data: secciones[seccion] });
};
