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

 Date: 13/07/2026 14:59:37
*/


-- ----------------------------
-- Table structure for examenes_pacientes
-- ----------------------------
DROP TABLE IF EXISTS "public"."examenes_pacientes";
CREATE TABLE "public"."examenes_pacientes" (
  "id_examen" int4 NOT NULL DEFAULT nextval('examenes_pacientes_id_examen_seq'::regclass),
  "id_paciente" int4 NOT NULL,
  "id_profecional" int4,
  "fecha_examen" date NOT NULL,
  "tipo_examen" text COLLATE "pg_catalog"."default",
  "nombre_examen" text COLLATE "pg_catalog"."default" NOT NULL,
  "resultado" text COLLATE "pg_catalog"."default",
  "estado_examen" varchar(30) COLLATE "pg_catalog"."default",
  "documento_url" text COLLATE "pg_catalog"."default",
  "id_medico_solicita" int4
)
;

-- ----------------------------
-- Indexes structure for table examenes_pacientes
-- ----------------------------
CREATE INDEX "idx_examenes_paciente" ON "public"."examenes_pacientes" USING btree (
  "id_paciente" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table examenes_pacientes
-- ----------------------------
ALTER TABLE "public"."examenes_pacientes" ADD CONSTRAINT "examenes_pacientes_pkey" PRIMARY KEY ("id_examen");

-- ----------------------------
-- Foreign Keys structure for table examenes_pacientes
-- ----------------------------
ALTER TABLE "public"."examenes_pacientes" ADD CONSTRAINT "examenes_pacientes_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes" ("id_paciente") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."examenes_pacientes" ADD CONSTRAINT "examenes_pacientes_id_profecional_fkey" FOREIGN KEY ("id_profecional") REFERENCES "public"."profecionales" ("id_profecional") ON DELETE SET NULL ON UPDATE NO ACTION;
