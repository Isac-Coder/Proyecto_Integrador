
DROP TABLE IF EXISTS "public"."usuarios_sistema";
CREATE TABLE "public"."usuarios_sistema" (
  "id_usuario" int4 NOT NULL DEFAULT nextval('usuarios_sistema_id_usuario_seq'::regclass),
  "correo_electronico" text COLLATE "pg_catalog"."default" NOT NULL,
  "contrasena_hash" text COLLATE "pg_catalog"."default" NOT NULL,
  "rol" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "id_profecional" int4,
  "ultimo_acceso" date
)
;


ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_correo_electronico_key" UNIQUE ("correo_electronico");
ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_id_profecional_key" UNIQUE ("id_profecional");


ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_rol_check" CHECK (rol::text = ANY (ARRAY['Administrador'::character varying, 'Profecional'::character varying, 'Cuidador'::character varying]::text[]));


ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_pkey" PRIMARY KEY ("id_usuario");

ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_id_profecional_fkey" FOREIGN KEY ("id_profecional") REFERENCES "public"."profecionales" ("id_profecional") ON DELETE SET NULL ON UPDATE NO ACTION;
