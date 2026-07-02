// One-off script: create a fresh recovery admin account.
// Avoids payload.update() to sidestep the lock-check that fails when
// payload_locked_documents_rels is missing a column from a pending migration.
// Run via ECS task: node node_modules/.bin/tsx scripts/reset-admin.mjs
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const NEW_PASSWORD = 'GoPNG_Admin_2026!'
const RECOVERY_EMAIL = 'recovery.admin@digital.gov.pg'

async function main() {
  const payload = await getPayload({ config })

  const { docs: existing } = await payload.find({
    collection: 'users',
    where: { email: { equals: RECOVERY_EMAIL } },
    limit: 1,
    depth: 0,
  })

  if (existing.length > 0) {
    console.log(`Recovery account already exists: ${RECOVERY_EMAIL}`)
    console.log('Delete it first if you need to reset the password.')
  } else {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: RECOVERY_EMAIL,
        password: NEW_PASSWORD,
        role: 'admin',
        firstName: 'Recovery',
        lastName: 'Admin',
      },
    })
    console.log(`Created recovery admin: ${user.email}`)
    console.log(`Password: ${NEW_PASSWORD}`)
  }

  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
