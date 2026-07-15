CREATE TABLE atencion_clinica(
     id_atencion SERIAL NOT NULL,
    id_paciente integer NOT NULL,
    fecha date NOT NULL DEFAULT CURRENT_DATE,
    medicacion_administrada text ,
    PRIMARY KEY(id_atencion) ,
    CONSTRAINT atencion_clinica_id_paciente_fkey FOREIGN key(id_paciente) REFERENCES pacientes(id_paciente) 
);