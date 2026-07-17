CREATE TABLE encargados_o_cuidadores(
     id_cuidador SERIAL NOT NULL,
    nombre text NOT NULL,
    telefono varchar(20) NOT NULL,
    email text,
    relacion_paciente text NOT NULL ,
    PRIMARY KEY(id_cuidador) 
); 
CREATE UNIQUE INDEX encargados_o_cuidadores_email_key ON public.encargados_o_cuidadores USING btree (email);