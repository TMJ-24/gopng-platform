import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Add column — no-op if already exists
  await db.execute(sql`
    ALTER TABLE "departments" ADD COLUMN IF NOT EXISTS "site_id" integer
  `)

  // 2. Remove any orphaned site_id values so the FK constraint can be applied
  //    (rows referencing a site that no longer exists would block ADD CONSTRAINT)
  await db.execute(sql`
    UPDATE "departments"
    SET "site_id" = NULL
    WHERE "site_id" IS NOT NULL
      AND "site_id" NOT IN (SELECT id FROM "sites")
  `)

  // 3. Add FK constraint only if it does not already exist
  const existing = await db.execute(sql`
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name        = 'departments'
      AND constraint_name   = 'departments_site_id_sites_id_fk'
  `)
  if ((existing as any).rows?.length === 0) {
    await db.execute(sql`
      ALTER TABLE "departments"
        ADD CONSTRAINT "departments_site_id_sites_id_fk"
        FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id")
        ON DELETE set null ON UPDATE no action
    `)
  }

  // 4. Create index — no-op if already exists
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "departments_site_idx"
      ON "departments" USING btree ("site_id")
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "departments_site_idx"`)

  const existing = await db.execute(sql`
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name        = 'departments'
      AND constraint_name   = 'departments_site_id_sites_id_fk'
  `)
  if ((existing as any).rows?.length > 0) {
    await db.execute(sql`
      ALTER TABLE "departments"
        DROP CONSTRAINT "departments_site_id_sites_id_fk"
    `)
  }

  await db.execute(sql`
    ALTER TABLE "departments" DROP COLUMN IF EXISTS "site_id"
  `)
}
