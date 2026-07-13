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

 Date: 13/07/2026 14:58:49
*/


-- ----------------------------
-- Table structure for asistencia_pacientes
-- ----------------------------
DROP TABLE IF EXISTS "public"."asistencia_pacientes";
CREATE TABLE "public"."asistencia_pacientes" (
  "id_asistencia" int4 NOT NULL DEFAULT nextval('asistencia_pacientes_id_asistencia_seq'::regclass),
  "id_paciente" int4 NOT NULL,
  "id_cuidador" int4 NOT NULL,
  "horario_monitoreo" text COLLATE "pg_catalog"."default",
  "observaciones" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Indexes structure for table asistencia_pacientes
-- ----------------------------
CREATE INDEX "idx_asistencia_paciente" ON "public"."asistencia_pacientes" USING btree (
  "id_paciente" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table asistencia_pacientes
-- ----------------------------
ALTER TABLE "public"."asistencia_pacientes" ADD CONSTRAINT "uq_paciente_cuidador" UNIQUE ("id_paciente", "id_cuidador");

-- ----------------------------
-- Primary Key structure for table asistencia_pacientes
-- ----------------------------
ALTER TABLE "public"."asistencia_pacientes" ADD CONSTRAINT "asistencia_pacientes_pkey" PRIMARY KEY ("id_asistencia");

-- ----------------------------
-- Foreign Keys structure for table asistencia_pacientes
-- ----------------------------
ALTER TABLE "public"."asistencia_pacientes" ADD CONSTRAINT "asistencia_pacientes_id_cuidador_fkey" FOREIGN KEY ("id_cuidador") REFERENCES "public"."encargados_o_cuidadores" ("id_cuidador") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."asistencia_pacientes" ADD CONSTRAINT "asistencia_pacientes_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes" ("id_paciente") ON DELETE CASCADE ON UPDATE NO ACTION;
