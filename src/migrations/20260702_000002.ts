import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "departments" ADD COLUMN IF NOT EXISTS "site_id" integer;

   DO $$ BEGIN
     IF NOT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'departments_site_id_sites_id_fk'
     ) THEN
       ALTER TABLE "departments" ADD CONSTRAINT "departments_site_id_sites_id_fk"
         FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
     END IF;
   END $$;

   CREATE INDEX IF NOT EXISTS "departments_site_idx" ON "departments" USING btree ("site_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "departments_site_idx";
   ALTER TABLE "departments" DROP CONSTRAINT IF EXISTS "departments_site_id_sites_id_fk";
   ALTER TABLE "departments" DROP COLUMN IF EXISTS "site_id";
  `)
}
