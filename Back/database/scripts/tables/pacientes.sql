CREATE TABLE pacientes(
     id_paciente SERIAL NOT NULL,
    nombre text NOT NULL,
    fecha_nacimiento date NOT NULL,
    direccion text,
    historial_medico text ,
    PRIMARY KEY(id_paciente) 
);