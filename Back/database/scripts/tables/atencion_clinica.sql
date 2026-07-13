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

 Date: 13/07/2026 14:59:00
*/


-- ----------------------------
-- Table structure for atencion_clinica
-- ----------------------------
DROP TABLE IF EXISTS "public"."atencion_clinica";
CREATE TABLE "public"."atencion_clinica" (
  "id_atencion" int4 NOT NULL DEFAULT nextval('atencion_clinica_id_atencion_seq'::regclass),
  "id_paciente" int4 NOT NULL,
  "fecha" date NOT NULL DEFAULT CURRENT_DATE,
  "medicacion_administrada" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Primary Key structure for table atencion_clinica
-- ----------------------------
ALTER TABLE "public"."atencion_clinica" ADD CONSTRAINT "atencion_clinica_pkey" PRIMARY KEY ("id_atencion");

-- ----------------------------
-- Foreign Keys structure for table atencion_clinica
-- ----------------------------
ALTER TABLE "public"."atencion_clinica" ADD CONSTRAINT "atencion_clinica_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes" ("id_paciente") ON DELETE CASCADE ON UPDATE NO ACTION;
