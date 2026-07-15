CREATE TABLE examenes_pacientes(
     id_examen SERIAL NOT NULL,
    id_paciente integer NOT NULL,
    id_profecional integer,
    fecha_examen date NOT NULL,
    tipo_examen text,
    nombre_examen text NOT NULL,
    resultado text,
    estado_examen varchar(30),
    documento_url text,
    id_medico_solicita integer ,
    PRIMARY KEY(id_examen) ,
    CONSTRAINT examenes_pacientes_id_paciente_fkey FOREIGN key(id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT examenes_pacientes_id_profecional_fkey FOREIGN key(id_profecional) REFERENCES profecionales(id_profecional) 
); 
CREATE INDEX idx_examenes_paciente ON public.examenes_pacientes USING btree (id_paciente);