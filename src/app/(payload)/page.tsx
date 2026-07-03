import { redirect } from 'next/navigation'

// This app is the platform control plane only (Sites registry, Users, Contact
// Submissions) — there's no public content at the bare domain root, so send visitors
// straight to the admin console instead of a dead-end 404.
export default function RootPage() {
  redirect('/admin')
}
