'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import nodemailer from 'nodemailer'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export type ContactFormState = {
  success?: boolean
  error?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const siteId = String(formData.get('siteId') ?? '').trim()

  if (!name || !email || !subject || !message || !siteId) {
    return { error: 'All fields are required.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }

  const payload = await getPayload({ config })

  // 1. Save to DB
  await payload.create({
    collection: 'contact-submissions',
    data: { name, email, subject, message, site: Number(siteId), status: 'new' },
  })

  // 2. Fetch site for contact email
  const site = await payload.findByID({ collection: 'sites', id: Number(siteId), depth: 0 })

  // 3. Send notification email if SMTP configured and site has contactInfo.email
  const siteEmail = (site as any)?.contactInfo?.email
  if (siteEmail && process.env.SMTP_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'GoPNG Website Platform'}" <${process.env.SMTP_FROM || 'noreply@gov.pg'}>`,
        to: siteEmail,
        replyTo: email,
        subject: `[Contact Form] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${esc(name)}</p><p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p><hr/><p>${esc(message).replace(/\n/g, '<br/>')}</p>`,
      })
    } catch {
      // Email failure is non-fatal — submission is already saved
    }
  }

  return { success: true }
}
