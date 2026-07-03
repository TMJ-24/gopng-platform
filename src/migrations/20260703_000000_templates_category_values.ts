import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Postgres forbids using a newly added enum value in the same transaction
// that adds it, so this only extends the enum. The seed migration that
// inserts rows using these values must run afterwards, in its own
// transaction (see 20260703_000001_seed_templates.ts).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_templates_category" ADD VALUE IF NOT EXISTS 'commission';
    ALTER TYPE "public"."enum_templates_category" ADD VALUE IF NOT EXISTS 'statutory-body';
    ALTER TYPE "public"."enum_templates_category" ADD VALUE IF NOT EXISTS 'soe';
  `)
}

// Postgres cannot drop values from an enum type; nothing to revert here.
export async function down(_args: MigrateDownArgs): Promise<void> {}
