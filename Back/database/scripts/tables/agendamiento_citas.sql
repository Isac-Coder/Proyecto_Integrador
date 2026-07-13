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

 Date: 13/07/2026 14:57:53
*/


-- ----------------------------
-- Table structure for agendamiento_citas
-- ----------------------------
DROP TABLE IF EXISTS "public"."agendamiento_citas";
CREATE TABLE "public"."agendamiento_citas" (
  "id_cita" int4 NOT NULL DEFAULT nextval('agendamiento_citas_id_cita_seq'::regclass),
  "id_paciente" int4 NOT NULL,
  "id_profecional" int4,
  "fecha_hora_cita" timestamp(6) NOT NULL,
  "lugar_cita" text COLLATE "pg_catalog"."default",
  "motivo" text COLLATE "pg_catalog"."default",
  "estado_cita" varchar(30) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Indexes structure for table agendamiento_citas
-- ----------------------------
CREATE INDEX "idx_citas_paciente" ON "public"."agendamiento_citas" USING btree (
  "id_paciente" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table agendamiento_citas
-- ----------------------------
ALTER TABLE "public"."agendamiento_citas" ADD CONSTRAINT "agendamiento_citas_pkey" PRIMARY KEY ("id_cita");

-- ----------------------------
-- Foreign Keys structure for table agendamiento_citas
-- ----------------------------
ALTER TABLE "public"."agendamiento_citas" ADD CONSTRAINT "agendamiento_citas_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes" ("id_paciente") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."agendamiento_citas" ADD CONSTRAINT "agendamiento_citas_id_profecional_fkey" FOREIGN KEY ("id_profecional") REFERENCES "public"."profecionales" ("id_profecional") ON DELETE SET NULL ON UPDATE NO ACTION;
