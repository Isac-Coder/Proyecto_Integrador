CREATE TABLE medicamentos_paciente(
     id_medicamento SERIAL NOT NULL,
    id_paciente integer NOT NULL,
    nombre_medicamento text NOT NULL,
    dosis varchar(50) NOT NULL,
    frecuencia varchar(50) NOT NULL,
    via_administracion varchar(50),
    fecha_inicio date NOT NULL,
    fecha_fin date ,
    PRIMARY KEY(id_medicamento) ,
    CONSTRAINT medicamentos_paciente_id_paciente_fkey FOREIGN key(id_paciente) REFERENCES pacientes(id_paciente) 
); 
CREATE INDEX idx_medicamentos_paciente ON public.medicamentos_paciente USING btree (id_paciente);