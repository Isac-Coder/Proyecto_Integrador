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

 Date: 13/07/2026 14:59:20
*/


-- ----------------------------
-- Table structure for encargados_o_cuidadores
-- ----------------------------
DROP TABLE IF EXISTS "public"."encargados_o_cuidadores";
CREATE TABLE "public"."encargados_o_cuidadores" (
  "id_cuidador" int4 NOT NULL DEFAULT nextval('encargados_o_cuidadores_id_cuidador_seq'::regclass),
  "nombre" text COLLATE "pg_catalog"."default" NOT NULL,
  "telefono" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default",
  "relacion_paciente" text COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Uniques structure for table encargados_o_cuidadores
-- ----------------------------
ALTER TABLE "public"."encargados_o_cuidadores" ADD CONSTRAINT "encargados_o_cuidadores_email_key" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table encargados_o_cuidadores
-- ----------------------------
ALTER TABLE "public"."encargados_o_cuidadores" ADD CONSTRAINT "encargados_o_cuidadores_pkey" PRIMARY KEY ("id_cuidador");
