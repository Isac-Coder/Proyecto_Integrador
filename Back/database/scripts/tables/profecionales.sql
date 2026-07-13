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

 Date: 13/07/2026 15:00:17
*/


-- ----------------------------
-- Table structure for profecionales
-- ----------------------------
DROP TABLE IF EXISTS "public"."profecionales";
CREATE TABLE "public"."profecionales" (
  "id_profecional" int4 NOT NULL DEFAULT nextval('profecionales_id_profecional_seq'::regclass),
  "nombre" text COLLATE "pg_catalog"."default" NOT NULL,
  "especialidad" text COLLATE "pg_catalog"."default",
  "numero_licencia" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "turno" varchar(30) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Uniques structure for table profecionales
-- ----------------------------
ALTER TABLE "public"."profecionales" ADD CONSTRAINT "profecionales_numero_licencia_key" UNIQUE ("numero_licencia");

-- ----------------------------
-- Primary Key structure for table profecionales
-- ----------------------------
ALTER TABLE "public"."profecionales" ADD CONSTRAINT "profecionales_pkey" PRIMARY KEY ("id_profecional");
