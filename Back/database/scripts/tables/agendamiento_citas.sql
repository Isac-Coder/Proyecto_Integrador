CREATE TABLE agendamiento_citas (
    id_cita SERIAL NOT NULL,
    id_paciente integer NOT NULL,
    id_profecional integer,
    fecha_hora_cita timestamp without time zone NOT NULL,
    lugar_cita text,
    motivo text,
    estado_cita varchar(30),
    PRIMARY KEY (id_cita),
    CONSTRAINT agendamiento_citas_id_paciente_fkey FOREIGN key (id_paciente) REFERENCES pacientes (id_paciente),
    CONSTRAINT agendamiento_citas_id_profecional_fkey FOREIGN key (id_profecional) REFERENCES profecionales (id_profecional)
);

CREATE INDEX idx_citas_paciente ON public.agendamiento_citas USING btree (id_paciente);