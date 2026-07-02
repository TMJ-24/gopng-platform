import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sites_deploy_status" AS ENUM('none', 'building', 'deployed', 'failed');

   ALTER TABLE "sites" ADD COLUMN "template_id" integer;
   ALTER TABLE "sites" ADD COLUMN "repo_name" varchar;
   ALTER TABLE "sites" ADD COLUMN "repo_url" varchar;
   ALTER TABLE "sites" ADD COLUMN "deploy_status" "enum_sites_deploy_status" DEFAULT 'none';

   ALTER TABLE "sites" ADD CONSTRAINT "sites_template_id_templates_id_fk"
     FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;

   CREATE INDEX "sites_template_idx" ON "sites" USING btree ("template_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sites" DROP CONSTRAINT "sites_template_id_templates_id_fk";
   ALTER TABLE "sites" DROP COLUMN "template_id";
   ALTER TABLE "sites" DROP COLUMN "repo_name";
   ALTER TABLE "sites" DROP COLUMN "repo_url";
   ALTER TABLE "sites" DROP COLUMN "deploy_status";
   DROP TYPE "public"."enum_sites_deploy_status";
  `)
}
