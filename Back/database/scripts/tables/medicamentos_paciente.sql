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

 Date: 13/07/2026 14:59:50
*/


-- ----------------------------
-- Table structure for medicamentos_paciente
-- ----------------------------
DROP TABLE IF EXISTS "public"."medicamentos_paciente";
CREATE TABLE "public"."medicamentos_paciente" (
  "id_medicamento" int4 NOT NULL DEFAULT nextval('medicamentos_paciente_id_medicamento_seq'::regclass),
  "id_paciente" int4 NOT NULL,
  "nombre_medicamento" text COLLATE "pg_catalog"."default" NOT NULL,
  "dosis" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "frecuencia" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "via_administracion" varchar(50) COLLATE "pg_catalog"."default",
  "fecha_inicio" date NOT NULL,
  "fecha_fin" date
)
;

-- ----------------------------
-- Indexes structure for table medicamentos_paciente
-- ----------------------------
CREATE INDEX "idx_medicamentos_paciente" ON "public"."medicamentos_paciente" USING btree (
  "id_paciente" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table medicamentos_paciente
-- ----------------------------
ALTER TABLE "public"."medicamentos_paciente" ADD CONSTRAINT "medicamentos_paciente_pkey" PRIMARY KEY ("id_medicamento");

-- ----------------------------
-- Foreign Keys structure for table medicamentos_paciente
-- ----------------------------
ALTER TABLE "public"."medicamentos_paciente" ADD CONSTRAINT "medicamentos_paciente_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes" ("id_paciente") ON DELETE CASCADE ON UPDATE NO ACTION;
