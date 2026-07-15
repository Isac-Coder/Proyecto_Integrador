CREATE TABLE estado_pacientes(
     id_estado SERIAL NOT NULL,
    id_paciente integer NOT NULL,
    fecha_ultimo_registro date NOT NULL DEFAULT CURRENT_DATE,
    nivel_alerta varchar(30),
    estado_general text,
    ubicacion text ,
    PRIMARY KEY(id_estado) ,
    CONSTRAINT estado_pacientes_id_paciente_fkey FOREIGN key(id_paciente) REFERENCES pacientes(id_paciente) 
); 
CREATE INDEX idx_estado_paciente ON public.estado_pacientes USING btree (id_paciente);