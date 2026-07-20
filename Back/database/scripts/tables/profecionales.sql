CREATE TABLE profecionales(
     id_profecional SERIAL NOT NULL,
    nombre text NOT NULL,
    especialidad text,
    numero_licencia varchar(50) NOT NULL,
    turno varchar(30) ,
    PRIMARY KEY(id_profecional) 
); 
CREATE UNIQUE INDEX profecionales_numero_licencia_key ON public.profecionales USING btree (numero_licencia);