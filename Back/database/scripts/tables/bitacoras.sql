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

 Date: 13/07/2026 14:59:12
*/


-- ----------------------------
-- Table structure for bitacoras
-- ----------------------------
DROP TABLE IF EXISTS "public"."bitacoras";
CREATE TABLE "public"."bitacoras" (
  "id_bitacora" int4 NOT NULL DEFAULT nextval('bitacoras_id_bitacora_seq'::regclass),
  "id_paciente" int4 NOT NULL,
  "id_profecional" int4,
  "fecha" date NOT NULL DEFAULT CURRENT_DATE,
  "notas_u_observaciones" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Indexes structure for table bitacoras
-- ----------------------------
CREATE INDEX "idx_bitacoras_paciente" ON "public"."bitacoras" USING btree (
  "id_paciente" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table bitacoras
-- ----------------------------
ALTER TABLE "public"."bitacoras" ADD CONSTRAINT "bitacoras_pkey" PRIMARY KEY ("id_bitacora");

-- ----------------------------
-- Foreign Keys structure for table bitacoras
-- ----------------------------
ALTER TABLE "public"."bitacoras" ADD CONSTRAINT "bitacoras_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes" ("id_paciente") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."bitacoras" ADD CONSTRAINT "bitacoras_id_profecional_fkey" FOREIGN KEY ("id_profecional") REFERENCES "public"."profecionales" ("id_profecional") ON DELETE SET NULL ON UPDATE NO ACTION;
