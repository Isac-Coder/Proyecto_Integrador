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

 Date: 13/07/2026 14:59:58
*/


-- ----------------------------
-- Table structure for observaciones_clinicas
-- ----------------------------
DROP TABLE IF EXISTS "public"."observaciones_clinicas";
CREATE TABLE "public"."observaciones_clinicas" (
  "id_observacion" int4 NOT NULL DEFAULT nextval('observaciones_clinicas_id_observacion_seq'::regclass),
  "id_bitacora" int4 NOT NULL,
  "observaciones" text COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Primary Key structure for table observaciones_clinicas
-- ----------------------------
ALTER TABLE "public"."observaciones_clinicas" ADD CONSTRAINT "observaciones_clinicas_pkey" PRIMARY KEY ("id_observacion");

-- ----------------------------
-- Foreign Keys structure for table observaciones_clinicas
-- ----------------------------
ALTER TABLE "public"."observaciones_clinicas" ADD CONSTRAINT "observaciones_clinicas_id_bitacora_fkey" FOREIGN KEY ("id_bitacora") REFERENCES "public"."bitacoras" ("id_bitacora") ON DELETE CASCADE ON UPDATE NO ACTION;
