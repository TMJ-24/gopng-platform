import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments" ADD COLUMN "site_id" integer;

   ALTER TABLE "departments" ADD CONSTRAINT "departments_site_id_sites_id_fk"
     FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;

   CREATE INDEX "departments_site_idx" ON "departments" USING btree ("site_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "departments_site_idx";
   ALTER TABLE "departments" DROP CONSTRAINT IF EXISTS "departments_site_id_sites_id_fk";
   ALTER TABLE "departments" DROP COLUMN IF EXISTS "site_id";
  `)
}
