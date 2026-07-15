CREATE TABLE asistencia_pacientes(
     id_asistencia SERIAL NOT NULL,
    id_paciente integer NOT NULL,
    id_cuidador integer NOT NULL,
    horario_monitoreo text,
    observaciones text ,
    PRIMARY KEY(id_asistencia) ,
    CONSTRAINT asistencia_pacientes_id_paciente_fkey FOREIGN key(id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT asistencia_pacientes_id_cuidador_fkey FOREIGN key(id_cuidador) REFERENCES encargados_o_cuidadores(id_cuidador) 
); 
CREATE UNIQUE INDEX uq_paciente_cuidador ON public.asistencia_pacientes USING btree (id_paciente, id_cuidador);
CREATE INDEX idx_asistencia_paciente ON public.asistencia_pacientes USING btree (id_paciente);