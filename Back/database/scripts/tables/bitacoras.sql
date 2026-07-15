CREATE TABLE bitacoras(
     id_bitacora SERIAL NOT NULL,
    id_paciente integer NOT NULL,
    id_profecional integer,
    fecha date NOT NULL DEFAULT CURRENT_DATE,
    notas_u_observaciones text ,
    PRIMARY KEY(id_bitacora) ,
    CONSTRAINT bitacoras_id_paciente_fkey FOREIGN key(id_paciente) REFERENCES pacientes(id_paciente),
    CONSTRAINT bitacoras_id_profecional_fkey FOREIGN key(id_profecional) REFERENCES profecionales(id_profecional) 
); 
CREATE INDEX idx_bitacoras_paciente ON public.bitacoras USING btree (id_paciente);