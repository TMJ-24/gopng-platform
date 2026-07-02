import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ADD COLUMN IF NOT EXISTS is native PostgreSQL — safe to re-run
  await db.execute(sql`ALTER TABLE "departments" ADD COLUMN IF NOT EXISTS "site_id" integer`)

  // ADD CONSTRAINT has no IF NOT EXISTS before PG17; catch duplicate instead
  try {
    await db.execute(sql`
      ALTER TABLE "departments" ADD CONSTRAINT "departments_site_id_sites_id_fk"
        FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action
    `)
  } catch (e: any) {
    if (!String(e?.message ?? e).includes('already exists')) throw e
  }

  // CREATE INDEX IF NOT EXISTS is native PostgreSQL — safe to re-run
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "departments_site_idx" ON "departments" USING btree ("site_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "departments_site_idx"`)
  await db.execute(sql`ALTER TABLE "departments" DROP CONSTRAINT IF EXISTS "departments_site_id_sites_id_fk"`)
  await db.execute(sql`ALTER TABLE "departments" DROP COLUMN IF EXISTS "site_id"`)
}
