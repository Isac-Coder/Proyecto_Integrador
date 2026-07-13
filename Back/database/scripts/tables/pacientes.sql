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

 Date: 13/07/2026 15:00:07
*/


-- ----------------------------
-- Table structure for pacientes
-- ----------------------------
DROP TABLE IF EXISTS "public"."pacientes";
CREATE TABLE "public"."pacientes" (
  "id_paciente" int4 NOT NULL DEFAULT nextval('pacientes_id_paciente_seq'::regclass),
  "nombre" text COLLATE "pg_catalog"."default" NOT NULL,
  "fecha_nacimiento" date NOT NULL,
  "direccion" text COLLATE "pg_catalog"."default",
  "historial_medico" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Primary Key structure for table pacientes
-- ----------------------------
ALTER TABLE "public"."pacientes" ADD CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id_paciente");
