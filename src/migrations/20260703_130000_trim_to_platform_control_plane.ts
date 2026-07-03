import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Hand-written (not generated via `payload migrate:create`) — that command's interactive
// enum-rename disambiguation prompt hangs indefinitely under a non-TTY runner. Schema verified
// directly against the live DB (information_schema) before writing this.
//
// Drops everything that belonged to the dynamic public-content model (Pages/News/Documents/
// Departments/Templates/Media) now that public sites are static (site-template + Tina/Git) and
// this app is just the platform control plane (Users, a lean Sites registry, ContactSubmissions).

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Content tables. NOTE: `DROP TABLE parent CASCADE` only drops the *FK constraint* on a
  // child table that references it — not the child table itself (Postgres CASCADE for
  // DROP TABLE cascades to dependent schema objects like constraints/views, not to tables
  // merely holding a FK pointer). Every block/locale/nested-array sub-table has to be listed
  // explicitly, otherwise it survives orphaned and keeps its enum columns "in use", which
  // then blocks the DROP TYPE statements below.
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_contact_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_contact" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_content_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_content" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_downloads_items_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_downloads_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_downloads_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_downloads" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_images_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_images" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_gallery" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hero_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hero" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_latest_news_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_latest_news" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_quick_links_links_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_quick_links_links" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_quick_links_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_quick_links" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_statistics_stats_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_statistics_stats" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_statistics_locales" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_statistics" CASCADE;
    DROP TABLE IF EXISTS "pages_locales" CASCADE;
    DROP TABLE IF EXISTS "pages" CASCADE;
    DROP TABLE IF EXISTS "news_locales" CASCADE;
    DROP TABLE IF EXISTS "news" CASCADE;
    DROP TABLE IF EXISTS "documents" CASCADE;
    DROP TABLE IF EXISTS "departments" CASCADE;
    DROP TABLE IF EXISTS "media" CASCADE;
    DROP TABLE IF EXISTS "templates_sections" CASCADE;
    DROP TABLE IF EXISTS "templates" CASCADE;
    DROP TABLE IF EXISTS "sites_navigation_children" CASCADE;
    DROP TABLE IF EXISTS "sites_navigation" CASCADE;
  `)

  // Sites: drop content-authoring columns that now live in each site's own
  // content/config/site.json under Tina, plus the FK columns pointing at dropped tables.
  await db.execute(sql`
    ALTER TABLE "sites"
      DROP COLUMN IF EXISTS "logo_id",
      DROP COLUMN IF EXISTS "hero_image_id",
      DROP COLUMN IF EXISTS "template_id",
      DROP COLUMN IF EXISTS "theme",
      DROP COLUMN IF EXISTS "social_links_facebook",
      DROP COLUMN IF EXISTS "social_links_twitter",
      DROP COLUMN IF EXISTS "social_links_instagram",
      DROP COLUMN IF EXISTS "social_links_youtube",
      DROP COLUMN IF EXISTS "contact_info_email",
      DROP COLUMN IF EXISTS "contact_info_phone",
      DROP COLUMN IF EXISTS "contact_info_address",
      DROP COLUMN IF EXISTS "contact_info_po_box";
  `)

  // payload_locked_documents_rels: drop the polymorphic-relationship columns for
  // collections that no longer exist (Payload's locked-docs system references every
  // collection by a nullable FK column on this shared table).
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "media_id",
      DROP COLUMN IF EXISTS "pages_id",
      DROP COLUMN IF EXISTS "news_id",
      DROP COLUMN IF EXISTS "departments_id",
      DROP COLUMN IF EXISTS "documents_id",
      DROP COLUMN IF EXISTS "templates_id";
  `)

  // Now that no column references them, drop the now-unused enum types.
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_documents_category";
    DROP TYPE IF EXISTS "enum_news_status";
    DROP TYPE IF EXISTS "enum_pages_status";
    DROP TYPE IF EXISTS "enum_pages_blocks_contact_mode";
    DROP TYPE IF EXISTS "enum_sites_theme";
    DROP TYPE IF EXISTS "enum_templates_category";
    DROP TYPE IF EXISTS "enum_templates_default_theme";
    DROP TYPE IF EXISTS "enum_templates_sections_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverses the `sites` schema change (the only part of this migration meaningful to roll
  // back). Deliberately does not reconstruct the dropped content tables (pages, news,
  // documents, departments, media, templates and their block/locale sub-tables) — the
  // application code that read/wrote them (Pages/News/Documents/Departments/Templates/Media
  // collections, the dynamic public frontend) is removed in the same change as this migration,
  // so recreating empty tables with no code path using them would be schema theater, not a
  // real rollback. Restore from a pre-migration backup if the data itself is ever needed back.

  await db.execute(sql`
    CREATE TYPE "enum_sites_theme" AS ENUM ('default', 'blue', 'green', 'red');
  `)

  await db.execute(sql`
    ALTER TABLE "sites"
      ADD COLUMN IF NOT EXISTS "logo_id" integer,
      ADD COLUMN IF NOT EXISTS "hero_image_id" integer,
      ADD COLUMN IF NOT EXISTS "template_id" integer,
      ADD COLUMN IF NOT EXISTS "theme" "enum_sites_theme" DEFAULT 'default',
      ADD COLUMN IF NOT EXISTS "social_links_facebook" varchar,
      ADD COLUMN IF NOT EXISTS "social_links_twitter" varchar,
      ADD COLUMN IF NOT EXISTS "social_links_instagram" varchar,
      ADD COLUMN IF NOT EXISTS "social_links_youtube" varchar,
      ADD COLUMN IF NOT EXISTS "contact_info_email" varchar,
      ADD COLUMN IF NOT EXISTS "contact_info_phone" varchar,
      ADD COLUMN IF NOT EXISTS "contact_info_address" varchar,
      ADD COLUMN IF NOT EXISTS "contact_info_po_box" varchar;
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "media_id" integer,
      ADD COLUMN IF NOT EXISTS "pages_id" integer,
      ADD COLUMN IF NOT EXISTS "news_id" integer,
      ADD COLUMN IF NOT EXISTS "departments_id" integer,
      ADD COLUMN IF NOT EXISTS "documents_id" integer,
      ADD COLUMN IF NOT EXISTS "templates_id" integer;
  `)
}
