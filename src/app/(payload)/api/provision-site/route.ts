import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import crypto from 'crypto'

function generatePassword(len = 14): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  return Array.from(crypto.randomBytes(len))
    .map(b => chars[b % chars.length])
    .join('')
}

function welcomeHtml(p: { siteName: string; domain: string; adminEmail: string; password: string }) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;color:#111">
<h1 style="color:#374151">Your Government Website is Live!</h1>
<p>The <strong>${p.siteName}</strong> website has been successfully provisioned on the GoPNG Platform.</p>
<table style="border-collapse:collapse;width:100%;margin:24px 0">
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:600">Website</td>
      <td style="padding:8px"><a href="https://${p.domain}">https://${p.domain}</a></td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:600">Admin Panel</td>
      <td style="padding:8px"><a href="https://${p.domain}/admin">https://${p.domain}/admin</a></td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:600">Login Email</td>
      <td style="padding:8px">${p.adminEmail}</td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:600">Temp Password</td>
      <td style="padding:8px"><code style="background:#f3f4f6;padding:2px 6px">${p.password}</code></td></tr>
</table>
<p style="color:#6b7280">Please change your password on first login. Do not share this email.</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
<p style="color:#9ca3af;font-size:12px">GoPNG Website Platform · gov.pg</p>
</body></html>`
}

function siteLiveHtml(p: { siteName: string; domain: string }) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;color:#111">
<h1 style="color:#374151">Your Government Website is Live!</h1>
<p>The <strong>${p.siteName}</strong> website has been successfully provisioned on the GoPNG Platform and is assigned to your account.</p>
<table style="border-collapse:collapse;width:100%;margin:24px 0">
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:600">Website</td>
      <td style="padding:8px"><a href="https://${p.domain}">https://${p.domain}</a></td></tr>
  <tr><td style="padding:8px;background:#f3f4f6;font-weight:600">Admin Panel</td>
      <td style="padding:8px"><a href="https://${p.domain}/admin">https://${p.domain}/admin</a></td></tr>
</table>
<p style="color:#6b7280">Sign in with your existing GoPNG Platform account to customise and manage it.</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
<p style="color:#9ca3af;font-size:12px">GoPNG Website Platform · gov.pg</p>
</body></html>`
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const headersList = await headers()

    // Verify auth — admins can launch a site for a new org; editors can self-launch their own
    const { user } = await payload.auth({ headers: headersList as any })
    const role = (user as any)?.role
    if (!user || (role !== 'admin' && role !== 'editor')) {
      return Response.json({ error: 'Admin or editor access required' }, { status: 403 })
    }

    const body = await req.json()
    const {
      siteName, domain, agencyType, theme, templateId,
      adminEmail, adminFirstName, adminLastName,
      contactEmail, contactPhone, contactAddress,
    } = body

    if (role === 'admin' && (!siteName || !domain || !agencyType || !adminEmail)) {
      return Response.json({ error: 'siteName, domain, agencyType and adminEmail are required' }, { status: 400 })
    }
    if (role === 'editor' && (!siteName || !domain || !agencyType)) {
      return Response.json({ error: 'siteName, domain and agencyType are required' }, { status: 400 })
    }

    // Check domain uniqueness
    const existing = await payload.find({
      collection: 'sites',
      where: { domain: { equals: domain } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      return Response.json({ error: `Domain "${domain}" is already registered` }, { status: 409 })
    }

    if (role === 'admin') {
      // Check email uniqueness for the new site-admin account
      const existingUser = await payload.find({
        collection: 'users',
        where: { email: { equals: adminEmail } },
        limit: 1,
      })
      if (existingUser.totalDocs > 0) {
        return Response.json({ error: `A user with email "${adminEmail}" already exists` }, { status: 409 })
      }
    }

    // 1 — Create Site
    const site = await payload.create({
      collection: 'sites',
      data: {
        name: siteName,
        domain,
        agencyType,
        theme: theme ?? 'default',
        status: 'active',
        ...(templateId ? { template: templateId } : {}),
        contactInfo: {
          email: contactEmail || adminEmail || (user as any).email,
          phone: contactPhone || '',
          address: contactAddress || '',
        },
      } as any,
    })

    // 2 — Assign an editor: admins create a brand-new site-admin account;
    // editors self-launching are assigned their own new site.
    let ownerEmail: string
    if (role === 'admin') {
      const tempPassword = generatePassword()
      const siteUser = await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          firstName: adminFirstName || '',
          lastName: adminLastName || '',
          role: 'editor',
          assignedSites: [site.id],
          password: tempPassword,
        } as any,
      })
      ownerEmail = siteUser.email

      // Welcome email with temp credentials (non-fatal)
      try {
        await payload.sendEmail({
          to: adminEmail,
          subject: `Your ${siteName} website is live on gov.pg`,
          html: welcomeHtml({ siteName, domain, adminEmail, password: tempPassword }),
        })
      } catch (emailErr) {
        console.warn('[provision-site] Welcome email failed:', emailErr)
      }
    } else {
      const existingAssigned: number[] = ((user as any).assignedSites ?? []).map(
        (s: any) => (typeof s === 'object' ? s.id : s),
      )
      await payload.update({
        collection: 'users',
        id: (user as any).id,
        data: { assignedSites: [...existingAssigned, site.id] } as any,
      })
      ownerEmail = (user as any).email

      // "Your site is live" email — no new credentials, they already have an account (non-fatal)
      try {
        await payload.sendEmail({
          to: ownerEmail,
          subject: `Your ${siteName} website is live on gov.pg`,
          html: siteLiveHtml({ siteName, domain }),
        })
      } catch (emailErr) {
        console.warn('[provision-site] Site-live email failed:', emailErr)
      }
    }

    // 3 — Seed default pages
    await Promise.allSettled([
      payload.create({ collection: 'pages', data: { title: 'Home',     slug: 'home',    site: site.id, status: 'published' } as any }),
      payload.create({ collection: 'pages', data: { title: 'About Us', slug: 'about',   site: site.id, status: 'published' } as any }),
      payload.create({ collection: 'pages', data: { title: 'Contact',  slug: 'contact', site: site.id, status: 'published' } as any }),
    ])

    return Response.json({
      success: true,
      site: { id: site.id, name: site.name, domain: site.domain },
      adminUser: { email: ownerEmail },
      message: `${siteName} is now live at ${domain}`,
    })
  } catch (err: unknown) {
    console.error('[provision-site] Error:', err)
    return Response.json({ success: false, error: 'An internal error occurred. Please try again.' }, { status: 500 })
  }
}
