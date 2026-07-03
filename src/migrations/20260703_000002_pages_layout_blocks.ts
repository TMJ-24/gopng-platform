import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_contact_mode" AS ENUM('form', 'info', 'both');

   CREATE TABLE IF NOT EXISTS "pages_blocks_hero" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "image_id" integer,
     "cta_href" varchar,
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_hero_locales" (
     "heading" varchar NOT NULL,
     "subheading" varchar,
     "cta_label" varchar,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_content" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_content_locales" (
     "body" jsonb NOT NULL,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_images" (
     "_order" integer NOT NULL,
     "_parent_id" varchar NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "image_id" integer NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_images_locales" (
     "caption" varchar,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_gallery" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_locales" (
     "heading" varchar,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_statistics_stats" (
     "_order" integer NOT NULL,
     "_parent_id" varchar NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "value" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_statistics_stats_locales" (
     "label" varchar NOT NULL,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_statistics" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_statistics_locales" (
     "heading" varchar,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_downloads_items" (
     "_order" integer NOT NULL,
     "_parent_id" varchar NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "file_id" integer NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_downloads_items_locales" (
     "label" varchar NOT NULL,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_downloads" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_downloads_locales" (
     "heading" varchar,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_quick_links_links" (
     "_order" integer NOT NULL,
     "_parent_id" varchar NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "href" varchar NOT NULL,
     "open_in_new_tab" boolean DEFAULT false
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_quick_links_links_locales" (
     "label" varchar NOT NULL,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_quick_links" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_quick_links_locales" (
     "heading" varchar,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_contact" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "mode" "enum_pages_blocks_contact_mode" DEFAULT 'both',
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_contact_locales" (
     "heading" varchar DEFAULT 'Get in Touch',
     "intro" varchar,
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_latest_news" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "_path" text NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "count" numeric DEFAULT 3,
     "block_name" varchar
   );

   CREATE TABLE IF NOT EXISTS "pages_blocks_latest_news_locales" (
     "heading" varchar DEFAULT 'Latest News',
     "id" serial PRIMARY KEY NOT NULL,
     "_locale" "_locales" NOT NULL,
     "_parent_id" varchar NOT NULL
   );

   ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_content_locales" ADD CONSTRAINT "pages_blocks_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_gallery_images_locales" ADD CONSTRAINT "pages_blocks_gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_gallery_locales" ADD CONSTRAINT "pages_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_statistics_stats" ADD CONSTRAINT "pages_blocks_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_statistics_stats_locales" ADD CONSTRAINT "pages_blocks_statistics_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics_stats"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_statistics" ADD CONSTRAINT "pages_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_statistics_locales" ADD CONSTRAINT "pages_blocks_statistics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_downloads_items" ADD CONSTRAINT "pages_blocks_downloads_items_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   ALTER TABLE "pages_blocks_downloads_items" ADD CONSTRAINT "pages_blocks_downloads_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_downloads_items_locales" ADD CONSTRAINT "pages_blocks_downloads_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads_items"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_downloads" ADD CONSTRAINT "pages_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_downloads_locales" ADD CONSTRAINT "pages_blocks_downloads_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_quick_links_links" ADD CONSTRAINT "pages_blocks_quick_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quick_links"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_quick_links_links_locales" ADD CONSTRAINT "pages_blocks_quick_links_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quick_links_links"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_quick_links" ADD CONSTRAINT "pages_blocks_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_quick_links_locales" ADD CONSTRAINT "pages_blocks_quick_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quick_links"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_contact_locales" ADD CONSTRAINT "pages_blocks_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_latest_news" ADD CONSTRAINT "pages_blocks_latest_news_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "pages_blocks_latest_news_locales" ADD CONSTRAINT "pages_blocks_latest_news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_latest_news"("id") ON DELETE cascade ON UPDATE no action;

   CREATE INDEX IF NOT EXISTS "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
   CREATE INDEX IF NOT EXISTS "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_content_locales_locale_parent_id_unique" ON "pages_blocks_content_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_gallery_images_locales_locale_parent_id_unique" ON "pages_blocks_gallery_images_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_gallery_locales_locale_parent_id_unique" ON "pages_blocks_gallery_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_statistics_stats_order_idx" ON "pages_blocks_statistics_stats" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_statistics_stats_parent_id_idx" ON "pages_blocks_statistics_stats" USING btree ("_parent_id");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_statistics_stats_locales_locale_parent_id_uniqu" ON "pages_blocks_statistics_stats_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_statistics_order_idx" ON "pages_blocks_statistics" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_statistics_parent_id_idx" ON "pages_blocks_statistics" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_statistics_path_idx" ON "pages_blocks_statistics" USING btree ("_path");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_statistics_locales_locale_parent_id_unique" ON "pages_blocks_statistics_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_downloads_items_order_idx" ON "pages_blocks_downloads_items" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_downloads_items_parent_id_idx" ON "pages_blocks_downloads_items" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_downloads_items_file_idx" ON "pages_blocks_downloads_items" USING btree ("file_id");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_downloads_items_locales_locale_parent_id_unique" ON "pages_blocks_downloads_items_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_downloads_order_idx" ON "pages_blocks_downloads" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_downloads_parent_id_idx" ON "pages_blocks_downloads" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_downloads_path_idx" ON "pages_blocks_downloads" USING btree ("_path");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_downloads_locales_locale_parent_id_unique" ON "pages_blocks_downloads_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_quick_links_links_order_idx" ON "pages_blocks_quick_links_links" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_quick_links_links_parent_id_idx" ON "pages_blocks_quick_links_links" USING btree ("_parent_id");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_quick_links_links_locales_locale_parent_id_uniq" ON "pages_blocks_quick_links_links_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_quick_links_order_idx" ON "pages_blocks_quick_links" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_quick_links_parent_id_idx" ON "pages_blocks_quick_links" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_quick_links_path_idx" ON "pages_blocks_quick_links" USING btree ("_path");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_quick_links_locales_locale_parent_id_unique" ON "pages_blocks_quick_links_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_contact_locales_locale_parent_id_unique" ON "pages_blocks_contact_locales" USING btree ("_locale","_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_latest_news_order_idx" ON "pages_blocks_latest_news" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "pages_blocks_latest_news_parent_id_idx" ON "pages_blocks_latest_news" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "pages_blocks_latest_news_path_idx" ON "pages_blocks_latest_news" USING btree ("_path");
   CREATE UNIQUE INDEX IF NOT EXISTS "pages_blocks_latest_news_locales_locale_parent_id_unique" ON "pages_blocks_latest_news_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "pages_blocks_hero" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_hero_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_content" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_content_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_gallery_images" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_gallery_images_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_gallery" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_gallery_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_statistics_stats" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_statistics_stats_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_statistics" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_statistics_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_downloads_items" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_downloads_items_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_downloads" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_downloads_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_quick_links_links" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_quick_links_links_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_quick_links" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_quick_links_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_contact" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_contact_locales" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_latest_news" CASCADE;
   DROP TABLE IF EXISTS "pages_blocks_latest_news_locales" CASCADE;
   DROP TYPE IF EXISTS "public"."enum_pages_blocks_contact_mode";
  `)
}
