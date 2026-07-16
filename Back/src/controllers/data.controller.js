const { connectDatabase } = require('../config/database');

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

async function asegurarTablasPaciente(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.profecionales (
      id_profecional SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      especialidad TEXT,
      numero_licencia VARCHAR(50) NOT NULL UNIQUE,
      turno VARCHAR(30),
      email TEXT UNIQUE
    )
  `);

  await pool.query(`
    ALTER TABLE public.profecionales
    ADD COLUMN IF NOT EXISTS email TEXT UNIQUE
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.pacientes (
      id_paciente SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      fecha_nacimiento DATE NOT NULL,
      direccion TEXT,
      historial_medico TEXT,
      id_profecional INTEGER REFERENCES public.profecionales(id_profecional)
    )
  `);

  await pool.query(`
    ALTER TABLE public.pacientes
    ADD COLUMN IF NOT EXISTS id_profecional INTEGER REFERENCES public.profecionales(id_profecional)
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.asistencia_pacientes (
      id_asistencia SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
      id_cuidador INTEGER NOT NULL REFERENCES public.encargados_o_cuidadores(id_cuidador) ON DELETE CASCADE,
      horario_monitoreo TEXT,
      observaciones TEXT,
      CONSTRAINT uq_paciente_cuidador UNIQUE (id_paciente, id_cuidador)
    )
  `);

  await pool.query(`
    ALTER TABLE public.asistencia_pacientes
    ADD COLUMN IF NOT EXISTS horario_monitoreo TEXT
  `);

  await pool.query(`
    ALTER TABLE public.asistencia_pacientes
    ADD COLUMN IF NOT EXISTS observaciones TEXT
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.estado_pacientes (
      id_estado SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
      nivel_alerta TEXT,
      estado_general TEXT,
      ubicacion TEXT,
      fecha_ultimo_registro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.bitacoras (
      id_bitacora SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
      descripcion TEXT,
      fecha_registro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.examenes_pacientes (
      id_examen SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
      nombre_examen TEXT,
      resultado TEXT,
      fecha_examen DATE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.medicamentos_paciente (
      id_medicamento SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
      nombre_medicamento TEXT,
      dosis TEXT,
      frecuencia TEXT,
      fecha_inicio DATE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.bitacora_plantillas (
      id_plantilla SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      campos JSONB NOT NULL,
      fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.bitacora_registros (
      id_registro SERIAL PRIMARY KEY,
      id_paciente INTEGER NOT NULL REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
      id_plantilla INTEGER REFERENCES public.bitacora_plantillas(id_plantilla) ON DELETE SET NULL,
      valores JSONB NOT NULL,
      notas TEXT,
      fecha_registro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function buscarProfesionalPorEmail(email) {
  const pool = await connectDatabase();
  if (!pool) return null;
  const resultado = await pool.query('SELECT id_profecional AS id, nombre, especialidad, email FROM public.profecionales WHERE email = $1', [String(email).trim()]);
  return resultado.rows[0] || null;
}

async function buscarCuidadorPorEmail(email) {
  const pool = await connectDatabase();
  if (!pool) return null;
  const resultado = await pool.query('SELECT id_cuidador AS id, nombre, telefono, email FROM public.encargados_o_cuidadores WHERE email = $1', [String(email).trim()]);
  return resultado.rows[0] || null;
}

async function obtenerProfesionalesDisponibles() {
  const pool = await connectDatabase();
  if (!pool) return [];
  await asegurarTablasPaciente(pool);
  const resultado = await pool.query('SELECT id_profecional AS id, nombre, especialidad, email FROM public.profecionales ORDER BY nombre');
  return resultado.rows;
}

async function obtenerPacientesParaRol(rol, email) {
  const pool = await connectDatabase();
  if (!pool) return [];
  await asegurarTablasPaciente(pool);

  if (rol === 'cuidador') {
    const cuidador = await buscarCuidadorPorEmail(email);
    if (!cuidador) return [];
    const resultado = await pool.query(
      `SELECT p.id_paciente AS id, p.nombre, p.fecha_nacimiento, p.direccion, p.historial_medico,
        prof.nombre AS profesional_nombre, prof.email AS profesional_email
       FROM public.pacientes p
       JOIN public.asistencia_pacientes ap ON ap.id_paciente = p.id_paciente
       LEFT JOIN public.profecionales prof ON prof.id_profecional = p.id_profecional
       WHERE ap.id_cuidador = $1
       ORDER BY p.nombre`,
      [cuidador.id]
    );
    return resultado.rows;
  }

  if (rol === 'profesional') {
    const profesional = await buscarProfesionalPorEmail(email);
    if (!profesional) return [];
    const resultado = await pool.query(
      `SELECT p.id_paciente AS id, p.nombre, p.fecha_nacimiento, p.direccion, p.historial_medico,
        c.nombre AS cuidador_nombre, c.email AS cuidador_email
       FROM public.pacientes p
       LEFT JOIN public.asistencia_pacientes ap ON ap.id_paciente = p.id_paciente
       LEFT JOIN public.encargados_o_cuidadores c ON c.id_cuidador = ap.id_cuidador
       WHERE p.id_profecional = $1
       ORDER BY p.nombre`,
      [profesional.id]
    );
    return resultado.rows;
  }

  return [];
}

async function obtenerPacientesDisponibles() {
  const pool = await connectDatabase();
  if (!pool) return [];
  await asegurarTablasPaciente(pool);
  const resultado = await pool.query(
    `SELECT p.id_paciente AS id, p.nombre, p.fecha_nacimiento, p.direccion, p.historial_medico,
      c.nombre AS cuidador_nombre
     FROM public.pacientes p
     LEFT JOIN public.asistencia_pacientes ap ON ap.id_paciente = p.id_paciente
     LEFT JOIN public.encargados_o_cuidadores c ON c.id_cuidador = ap.id_cuidador
     WHERE p.id_profecional IS NULL
     ORDER BY p.nombre`
  );
  return resultado.rows;
}

async function crearPacienteConRelacion(datos) {
  const pool = await connectDatabase();
  if (!pool) return null;
  await asegurarTablasPaciente(pool);

  const insertPaciente = await pool.query(
    'INSERT INTO public.pacientes (nombre, fecha_nacimiento, direccion, historial_medico, id_profecional) VALUES ($1, $2, $3, $4, $5) RETURNING id_paciente AS id, nombre, fecha_nacimiento, direccion, historial_medico, id_profecional',
    [String(datos.nombre).trim(), datos.fecha_nacimiento, datos.direccion || null, datos.historial_medico || null, datos.id_profecional || null]
  );

  const paciente = insertPaciente.rows[0];

  if (datos.id_cuidador) {
    await pool.query(
      'INSERT INTO public.asistencia_pacientes (id_paciente, id_cuidador) VALUES ($1, $2) ON CONFLICT (id_paciente, id_cuidador) DO NOTHING',
      [paciente.id, datos.id_cuidador]
    );
  }

  return paciente;
}

async function asignarProfesionalAPaciente(idPaciente, idProfesional) {
  const pool = await connectDatabase();
  if (!pool) return null;
  await asegurarTablasPaciente(pool);
  const resultado = await pool.query(
    'UPDATE public.pacientes SET id_profecional = $1 WHERE id_paciente = $2 RETURNING id_paciente AS id, nombre, fecha_nacimiento, direccion, historial_medico, id_profecional',
    [idProfesional, Number(idPaciente)]
  );
  return resultado.rows[0] || null;
}

async function obtenerBitacoraPlantillas(idPaciente) {
  const pool = await connectDatabase();
  if (!pool) return [];
  await asegurarTablasPaciente(pool);
  const resultado = await pool.query(
    'SELECT id_plantilla AS id, nombre, campos, fecha_creacion FROM public.bitacora_plantillas WHERE id_paciente = $1 ORDER BY fecha_creacion DESC',
    [Number(idPaciente)]
  );
  return resultado.rows;
}

async function crearBitacoraPlantilla(idPaciente, plantilla) {
  const pool = await connectDatabase();
  if (!pool) return null;
  await asegurarTablasPaciente(pool);
  const resultado = await pool.query(
    'INSERT INTO public.bitacora_plantillas (id_paciente, nombre, campos) VALUES ($1, $2, $3) RETURNING id_plantilla AS id, nombre, campos, fecha_creacion',
    [Number(idPaciente), String(plantilla.nombre).trim(), JSON.stringify(plantilla.campos)]
  );
  return resultado.rows[0] || null;
}

async function obtenerBitacoraRegistros(idPaciente) {
  const pool = await connectDatabase();
  if (!pool) return [];
  await asegurarTablasPaciente(pool);
  const resultado = await pool.query(
    `SELECT r.id_registro AS id, r.valores, r.notas, r.fecha_registro,
      t.id_plantilla AS plantilla_id, t.nombre AS plantilla_nombre
     FROM public.bitacora_registros r
     LEFT JOIN public.bitacora_plantillas t ON t.id_plantilla = r.id_plantilla
     WHERE r.id_paciente = $1
     ORDER BY r.fecha_registro DESC`,
    [Number(idPaciente)]
  );
  return resultado.rows;
}

async function crearBitacoraRegistro(idPaciente, registro) {
  const pool = await connectDatabase();
  if (!pool) return null;
  await asegurarTablasPaciente(pool);
  const resultado = await pool.query(
    'INSERT INTO public.bitacora_registros (id_paciente, id_plantilla, valores, notas) VALUES ($1, $2, $3, $4) RETURNING id_registro AS id, id_paciente, id_plantilla, valores, notas, fecha_registro',
    [Number(idPaciente), registro.id_plantilla ? Number(registro.id_plantilla) : null, JSON.stringify(registro.valores), registro.notas || null]
  );
  return resultado.rows[0] || null;
}

async function obtenerPacienteDetallePorId(idPaciente) {
  const pool = await connectDatabase();
  if (!pool) return null;
  await asegurarTablasPaciente(pool);

  const query = `
    SELECT p.id_paciente AS id,
      p.nombre,
      p.fecha_nacimiento,
      p.direccion,
      p.historial_medico,
      p.id_profecional,
      prof.nombre AS profesional_nombre,
      prof.email AS profesional_email,
      c.id_cuidador AS cuidador_id,
      c.nombre AS cuidador_nombre,
      c.email AS cuidador_email,
      ap.horario_monitoreo,
      ap.observaciones,
      ep.nivel_alerta,
      ep.estado_general,
      ep.ubicacion,
      ep.fecha_ultimo_registro,
      (SELECT COUNT(*) FROM public.bitacoras WHERE id_paciente = p.id_paciente) AS bitacoras_count,
      (SELECT COUNT(*) FROM public.examenes_pacientes WHERE id_paciente = p.id_paciente) AS examenes_count,
      (SELECT COUNT(*) FROM public.medicamentos_paciente WHERE id_paciente = p.id_paciente) AS medicamentos_count
    FROM public.pacientes p
    LEFT JOIN public.profecionales prof ON prof.id_profecional = p.id_profecional
    LEFT JOIN public.asistencia_pacientes ap ON ap.id_paciente = p.id_paciente
    LEFT JOIN public.encargados_o_cuidadores c ON c.id_cuidador = ap.id_cuidador
    LEFT JOIN LATERAL (
      SELECT nivel_alerta, estado_general, ubicacion, fecha_ultimo_registro
      FROM public.estado_pacientes
      WHERE id_paciente = p.id_paciente
      ORDER BY fecha_ultimo_registro DESC
      LIMIT 1
    ) ep ON true
    WHERE p.id_paciente = $1
    LIMIT 1;
  `;

  const resultado = await pool.query(query, [Number(idPaciente)]);
  return resultado.rows[0] || null;
}

async function actualizarPacienteGeneral(idPaciente, datos) {
  const pool = await connectDatabase();
  if (!pool) return null;
  await asegurarTablasPaciente(pool);

  const updateQuery = `
    UPDATE public.pacientes
    SET nombre = $1,
        fecha_nacimiento = $2,
        direccion = $3,
        historial_medico = $4
    WHERE id_paciente = $5
    RETURNING id_paciente AS id, nombre, fecha_nacimiento, direccion, historial_medico, id_profecional;
  `;

  const resultado = await pool.query(updateQuery, [
    String(datos.nombre || '').trim(),
    datos.fecha_nacimiento || null,
    datos.direccion || null,
    datos.historial_medico || null,
    Number(idPaciente)
  ]);

  if (datos.nivel_alerta || datos.estado_general || datos.ubicacion) {
    await pool.query(
      'INSERT INTO public.estado_pacientes (id_paciente, nivel_alerta, estado_general, ubicacion) VALUES ($1, $2, $3, $4)',
      [Number(idPaciente), datos.nivel_alerta || null, datos.estado_general || null, datos.ubicacion || null]
    );
  }

  if (datos.horario_monitoreo || datos.observaciones) {
    await pool.query(
      'UPDATE public.asistencia_pacientes SET horario_monitoreo = $1, observaciones = $2 WHERE id_paciente = $3',
      [datos.horario_monitoreo || null, datos.observaciones || null, Number(idPaciente)]
    );
  }

  return await obtenerPacienteDetallePorId(Number(idPaciente));
}

exports.getDashboard = (req, res) => {
  const rol = String(req.params.rol || 'profesional').toLowerCase();
  const secciones = obtenerSeccionesPorRol(rol);

  if (!secciones || Object.keys(secciones).length === 0) {
    return res.status(400).json({ success: false, message: 'Rol no válido.' });
  }

  return res.json({ success: true, rol, secciones });
};

exports.getSection = (req, res) => {
  const rol = String(req.params.rol || 'profesional').toLowerCase();
  const seccion = String(req.params.seccion || '').toLowerCase();
  const secciones = obtenerSeccionesPorRol(rol);

  if (!secciones[seccion]) {
    return res.status(404).json({ success: false, message: 'Sección no encontrada.' });
  }

  return res.json({ success: true, rol, seccion, data: secciones[seccion] });
};

exports.getProfesionales = async (_req, res) => {
  try {
    const profesionales = await obtenerProfesionalesDisponibles();
    return res.json({ success: true, items: profesionales });
  } catch (error) {
    console.error('Error al consultar profesionales:', error);
    return res.status(500).json({ success: false, message: 'Error al cargar los profesionales.' });
  }
};

exports.getPacientes = async (req, res) => {
  try {
    const rol = String(req.query.rol || '').toLowerCase();
    const email = String(req.query.email || '').trim();
    const scope = String(req.query.scope || '').toLowerCase();

    if (rol === 'cuidador' || rol === 'profesional') {
      const pacientes = await obtenerPacientesParaRol(rol, email);
      return res.json({ success: true, items: pacientes });
    }

    if (scope === 'disponibles') {
      const pacientes = await obtenerPacientesDisponibles();
      return res.json({ success: true, items: pacientes });
    }

    return res.json({ success: true, items: [] });
  } catch (error) {
    console.error('Error al consultar pacientes:', error);
    return res.status(500).json({ success: false, message: 'Error al cargar los pacientes.' });
  }
};

exports.getPacienteDetalle = async (req, res) => {
  try {
    const idPaciente = Number(req.params.id);
    if (!idPaciente) {
      return res.status(400).json({ success: false, message: 'ID de paciente inválido.' });
    }

    const paciente = await obtenerPacienteDetallePorId(idPaciente);
    if (!paciente) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado.' });
    }

    return res.json({ success: true, item: paciente });
  } catch (error) {
    console.error('Error al obtener detalle del paciente:', error);
    return res.status(500).json({ success: false, message: 'Error al cargar el detalle del paciente.' });
  }
};

exports.updatePaciente = async (req, res) => {
  try {
    const idPaciente = Number(req.params.id);
    if (!idPaciente) {
      return res.status(400).json({ success: false, message: 'ID de paciente inválido.' });
    }

    const datos = req.body;
    const paciente = await actualizarPacienteGeneral(idPaciente, datos);

    if (!paciente) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado o no se pudo actualizar.' });
    }

    return res.json({ success: true, item: paciente });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar el paciente.' });
  }
};

exports.createPaciente = async (req, res) => {
  const { nombre, fecha_nacimiento, direccion, historial_medico, email_cuidador, id_profecional } = req.body;

  if (!nombre || !fecha_nacimiento || !email_cuidador) {
    return res.status(400).json({ success: false, message: 'Nombre, fecha de nacimiento y correo del cuidador son obligatorios.' });
  }

  try {
    const cuidador = await buscarCuidadorPorEmail(email_cuidador);
    if (!cuidador) {
      return res.status(404).json({ success: false, message: 'No se encontró el cuidador con ese correo.' });
    }

    const paciente = await crearPacienteConRelacion({
      nombre,
      fecha_nacimiento,
      direccion,
      historial_medico,
      id_cuidador: cuidador.id,
      id_profecional: id_profecional || null
    });

    return res.status(201).json({ success: true, item: paciente });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return res.status(500).json({ success: false, message: 'Error al crear el paciente.' });
  }
};

exports.assignPacienteProfesional = async (req, res) => {
  const idPaciente = Number(req.params.id);
  const { email_profesional } = req.body;

  if (!idPaciente || !email_profesional) {
    return res.status(400).json({ success: false, message: 'ID de paciente y correo del profesional son necesarios.' });
  }

  try {
    const profesional = await buscarProfesionalPorEmail(email_profesional);
    if (!profesional) {
      return res.status(404).json({ success: false, message: 'Profesional no encontrado con ese correo.' });
    }

    const paciente = await asignarProfesionalAPaciente(idPaciente, profesional.id);
    if (!paciente) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado.' });
    }

    return res.json({ success: true, item: paciente });
  } catch (error) {
    console.error('Error al asignar profesional al paciente:', error);
    return res.status(500).json({ success: false, message: 'Error al asignar el paciente al profesional.' });
  }
};

exports.getBitacoraPlantillas = async (req, res) => {
  try {
    const idPaciente = Number(req.params.id);
    if (!idPaciente) {
      return res.status(400).json({ success: false, message: 'ID de paciente inválido.' });
    }

    const plantillas = await obtenerBitacoraPlantillas(idPaciente);
    return res.json({ success: true, items: plantillas });
  } catch (error) {
    console.error('Error al consultar plantillas de bitácora:', error);
    return res.status(500).json({ success: false, message: 'Error al cargar las plantillas de bitácora.' });
  }
};

exports.createBitacoraPlantilla = async (req, res) => {
  try {
    const idPaciente = Number(req.params.id);
    const { nombre, campos } = req.body;

    if (!idPaciente || !nombre || !Array.isArray(campos) || campos.length === 0) {
      return res.status(400).json({ success: false, message: 'ID de paciente, nombre y campos son obligatorios.' });
    }

    const plantilla = await crearBitacoraPlantilla(idPaciente, { nombre, campos });
    return res.status(201).json({ success: true, item: plantilla });
  } catch (error) {
    console.error('Error al crear plantilla de bitácora:', error);
    return res.status(500).json({ success: false, message: 'Error al crear la plantilla de bitácora.' });
  }
};

exports.getBitacoraRegistros = async (req, res) => {
  try {
    const idPaciente = Number(req.params.id);
    if (!idPaciente) {
      return res.status(400).json({ success: false, message: 'ID de paciente inválido.' });
    }

    const registros = await obtenerBitacoraRegistros(idPaciente);
    return res.json({ success: true, items: registros });
  } catch (error) {
    console.error('Error al consultar registros de bitácora:', error);
    return res.status(500).json({ success: false, message: 'Error al cargar los registros de bitácora.' });
  }
};

exports.createBitacoraRegistro = async (req, res) => {
  try {
    const idPaciente = Number(req.params.id);
    const { id_plantilla, valores, notas } = req.body;

    if (!idPaciente || typeof valores !== 'object' || valores === null) {
      return res.status(400).json({ success: false, message: 'ID de paciente y valores son obligatorios.' });
    }

    const registro = await crearBitacoraRegistro(idPaciente, { id_plantilla, valores, notas });
    return res.status(201).json({ success: true, item: registro });
  } catch (error) {
    console.error('Error al crear registro de bitácora:', error);
    return res.status(500).json({ success: false, message: 'Error al crear el registro de bitácora.' });
  }
};
