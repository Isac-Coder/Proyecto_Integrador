CREATE TABLE observaciones_clinicas(
     id_observacion SERIAL NOT NULL,
    id_bitacora integer NOT NULL,
    observaciones text NOT NULL ,
    PRIMARY KEY(id_observacion) ,
    CONSTRAINT observaciones_clinicas_id_bitacora_fkey FOREIGN key(id_bitacora) REFERENCES bitacoras(id_bitacora) 
);