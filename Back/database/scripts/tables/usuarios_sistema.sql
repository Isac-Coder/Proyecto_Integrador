
CREATE TABLE usuarios_sistema(
     id_usuario SERIAL NOT NULL,
    correo_electronico text NOT NULL,
    contrasena_hash text NOT NULL,
    rol varchar(30) NOT NULL,
    id_profecional integer,
    ultimo_acceso date,
    nombre text ,
    PRIMARY KEY(id_usuario) ,
    CONSTRAINT usuarios_sistema_id_profecional_fkey FOREIGN key(id_profecional) REFERENCES profecionales(id_profecional) ,
    CONSTRAINT usuarios_sistema_rol_check CHECK ((rol)::text = ANY ((ARRAY['Administrador'::character varying, 'Profecional'::character varying, 'Cuidador'::character varying])::text[])) 
); 
CREATE UNIQUE INDEX usuarios_sistema_correo_electronico_key ON public.usuarios_sistema USING btree (correo_electronico);
CREATE UNIQUE INDEX usuarios_sistema_id_profecional_key ON public.usuarios_sistema USING btree (id_profecional);

