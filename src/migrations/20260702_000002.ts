import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// This migration was applied manually to production before the CI
// migration pipeline was in place. Making it a no-op so Payload can
// record it as done and unblock CI. The actual schema change
// (departments.site_id) is applied idempotently in 000003.
export async function up(_args: MigrateUpArgs): Promise<void> {}
export async function down(_args: MigrateDownArgs): Promise<void> {}
