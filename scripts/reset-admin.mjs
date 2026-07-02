// One-off script: find the first admin user and reset their password.
// Run via ECS task: node scripts/reset-admin.mjs
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const NEW_PASSWORD = 'GoPNG_Admin_2026!'
const FALLBACK_EMAIL = 'admin@digital.gov.pg'

async function main() {
  const payload = await getPayload({ config })

  const { docs, totalDocs } = await payload.find({ collection: 'users', limit: 5, depth: 0 })
  console.log(`Users in DB: ${totalDocs}`)

  if (totalDocs === 0) {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: FALLBACK_EMAIL,
        password: NEW_PASSWORD,
        role: 'admin',
        firstName: 'Platform',
        lastName: 'Admin',
      },
    })
    console.log(`Created admin: ${user.email}`)
    console.log(`Password: ${NEW_PASSWORD}`)
  } else {
    const target = docs[0]
    await payload.update({
      collection: 'users',
      id: target.id,
      data: { password: NEW_PASSWORD },
    })
    console.log(`Reset password for: ${target.email}`)
    console.log(`New password: ${NEW_PASSWORD}`)
  }

  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
