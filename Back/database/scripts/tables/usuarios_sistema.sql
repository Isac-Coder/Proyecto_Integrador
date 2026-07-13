/*
 Navicat Premium Dump SQL

 Source Server         : Zoe-Care.db
 Source Server Type    : PostgreSQL
 Source Server Version : 170010 (170010)
 Source Host           : localhost:5432
 Source Catalog        : zoe_care_db
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170010 (170010)
 File Encoding         : 65001

 Date: 13/07/2026 15:00:26
*/


-- ----------------------------
-- Table structure for usuarios_sistema
-- ----------------------------
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

-- ----------------------------
-- Uniques structure for table usuarios_sistema
-- ----------------------------
ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_correo_electronico_key" UNIQUE ("correo_electronico");
ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_id_profecional_key" UNIQUE ("id_profecional");

-- ----------------------------
-- Checks structure for table usuarios_sistema
-- ----------------------------
ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_rol_check" CHECK (rol::text = ANY (ARRAY['Administrador'::character varying, 'Profecional'::character varying, 'Cuidador'::character varying]::text[]));

-- ----------------------------
-- Primary Key structure for table usuarios_sistema
-- ----------------------------
ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_pkey" PRIMARY KEY ("id_usuario");

-- ----------------------------
-- Foreign Keys structure for table usuarios_sistema
-- ----------------------------
ALTER TABLE "public"."usuarios_sistema" ADD CONSTRAINT "usuarios_sistema_id_profecional_fkey" FOREIGN KEY ("id_profecional") REFERENCES "public"."profecionales" ("id_profecional") ON DELETE SET NULL ON UPDATE NO ACTION;
