import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_templates_category" AS ENUM('portal', 'ministry', 'department', 'provincial', 'authority');
   CREATE TYPE "public"."enum_templates_default_theme" AS ENUM('default', 'blue', 'green', 'red');
   CREATE TYPE "public"."enum_templates_sections_type" AS ENUM('hero', 'services', 'stats', 'news', 'directory', 'opendata', 'about', 'cta');

   CREATE TABLE "templates_sections" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "type" "enum_templates_sections_type",
     "enabled" boolean DEFAULT true
   );

   CREATE TABLE "templates" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "slug" varchar NOT NULL,
     "description" varchar,
     "thumbnail_id" integer,
     "category" "enum_templates_category" NOT NULL,
     "default_theme" "enum_templates_default_theme" DEFAULT 'default',
     "is_default" boolean DEFAULT false,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   ALTER TABLE "templates_sections" ADD CONSTRAINT "templates_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "templates" ADD CONSTRAINT "templates_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "templates_id" integer;
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_templates_fk" FOREIGN KEY ("templates_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;

   CREATE INDEX "templates_sections_order_idx" ON "templates_sections" USING btree ("_order");
   CREATE INDEX "templates_sections_parent_id_idx" ON "templates_sections" USING btree ("_parent_id");
   CREATE UNIQUE INDEX "templates_slug_idx" ON "templates" USING btree ("slug");
   CREATE INDEX "templates_thumbnail_idx" ON "templates" USING btree ("thumbnail_id");
   CREATE INDEX "templates_updated_at_idx" ON "templates" USING btree ("updated_at");
   CREATE INDEX "templates_created_at_idx" ON "templates" USING btree ("created_at");
   CREATE INDEX "payload_locked_documents_rels_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("templates_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_templates_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "templates_id";
   ALTER TABLE "templates_sections" DROP CONSTRAINT "templates_sections_parent_id_fk";
   ALTER TABLE "templates" DROP CONSTRAINT "templates_thumbnail_id_media_id_fk";
   DROP TABLE "templates_sections" CASCADE;
   DROP TABLE "templates" CASCADE;
   DROP TYPE "public"."enum_templates_category";
   DROP TYPE "public"."enum_templates_default_theme";
   DROP TYPE "public"."enum_templates_sections_type";
  `)
}
