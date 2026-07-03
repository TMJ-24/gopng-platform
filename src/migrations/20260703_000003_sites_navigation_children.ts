import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "sites_navigation_children" (
     "_order" integer NOT NULL,
     "_parent_id" varchar NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "label" varchar NOT NULL,
     "href" varchar NOT NULL,
     "description" varchar,
     "open_in_new_tab" boolean DEFAULT false
   );
  `)

  // Guarded like 20260702_000003 — a stray dev-mode push can create this
  // constraint ahead of the migration, and ADD CONSTRAINT has no IF NOT EXISTS.
  const existing = await db.execute(sql`
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name        = 'sites_navigation_children'
      AND constraint_name   = 'sites_navigation_children_parent_id_fk'
  `)
  if ((existing as any).rows?.length === 0) {
    await db.execute(sql`
      ALTER TABLE "sites_navigation_children"
        ADD CONSTRAINT "sites_navigation_children_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."sites_navigation"("id")
        ON DELETE cascade ON UPDATE no action
    `)
  }

  await db.execute(sql`
   CREATE INDEX IF NOT EXISTS "sites_navigation_children_order_idx" ON "sites_navigation_children" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "sites_navigation_children_parent_id_idx" ON "sites_navigation_children" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "sites_navigation_children" CASCADE;
  `)
}
