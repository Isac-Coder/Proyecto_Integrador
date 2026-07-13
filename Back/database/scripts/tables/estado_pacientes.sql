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

 Date: 13/07/2026 14:59:29
*/


-- ----------------------------
-- Table structure for estado_pacientes
-- ----------------------------
DROP TABLE IF EXISTS "public"."estado_pacientes";
CREATE TABLE "public"."estado_pacientes" (
  "id_estado" int4 NOT NULL DEFAULT nextval('estado_pacientes_id_estado_seq'::regclass),
  "id_paciente" int4 NOT NULL,
  "fecha_ultimo_registro" date NOT NULL DEFAULT CURRENT_DATE,
  "nivel_alerta" varchar(30) COLLATE "pg_catalog"."default",
  "estado_general" text COLLATE "pg_catalog"."default",
  "ubicacion" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Indexes structure for table estado_pacientes
-- ----------------------------
CREATE INDEX "idx_estado_paciente" ON "public"."estado_pacientes" USING btree (
  "id_paciente" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table estado_pacientes
-- ----------------------------
ALTER TABLE "public"."estado_pacientes" ADD CONSTRAINT "estado_pacientes_pkey" PRIMARY KEY ("id_estado");

-- ----------------------------
-- Foreign Keys structure for table estado_pacientes
-- ----------------------------
ALTER TABLE "public"."estado_pacientes" ADD CONSTRAINT "estado_pacientes_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes" ("id_paciente") ON DELETE CASCADE ON UPDATE NO ACTION;
