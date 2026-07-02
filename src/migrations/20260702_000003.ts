import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Applies departments.site_id schema for fresh installs.
// All operations are idempotent — safe to run against production
// where the column was already applied manually.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "departments" ADD COLUMN IF NOT EXISTS "site_id" integer`)

  try {
    await db.execute(sql`
      ALTER TABLE "departments"
        ADD CONSTRAINT "departments_site_id_sites_id_fk"
        FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id")
        ON DELETE set null ON UPDATE no action
    `)
  } catch (e: any) {
    if (!String(e?.message ?? e).includes('already exists')) throw e
  }

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "departments_site_idx"
      ON "departments" USING btree ("site_id")
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "departments_site_idx"`)

  try {
    await db.execute(sql`
      ALTER TABLE "departments"
        DROP CONSTRAINT "departments_site_id_sites_id_fk"
    `)
  } catch (e: any) {
    if (!String(e?.message ?? e).includes('does not exist')) throw e
  }

  await db.execute(sql`ALTER TABLE "departments" DROP COLUMN IF EXISTS "site_id"`)
}
