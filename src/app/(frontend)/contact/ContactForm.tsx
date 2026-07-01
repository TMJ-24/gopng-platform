'use client'

import { useActionState } from 'react'
import { submitContactForm } from './actions'
import type { ContactFormState } from './actions'

const initialState: ContactFormState = {}

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #D5DBDB', borderRadius: 4, padding: '10px 14px',
  fontSize: 13, color: '#000716', background: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700, color: '#000716', marginBottom: 5,
}

export function ContactForm({ siteId }: { siteId: number }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState)

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #D5DBDB', padding: '28px', boxShadow: '0 1px 2px rgba(0,28,36,0.08)' }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: '#000716', margin: '0 0 20px' }}>Send a Message</h2>

      {state.success ? (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 36, color: '#067F4C', marginBottom: 10 }}>✓</div>
          <p style={{ fontWeight: 700, color: '#000716', margin: '0 0 6px' }}>Your message has been sent.</p>
          <p style={{ fontSize: 13, color: '#545B64', margin: 0 }}>We will get back to you as soon as possible.</p>
        </div>
      ) : (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {state.error && (
            <div style={{ background: '#FFF5F5', border: '1px solid #F5C6C6', borderRadius: 4, padding: '12px 16px', color: '#C4001A', fontSize: 13 }}>
              {state.error}
            </div>
          )}

          <input type="hidden" name="siteId" value={siteId} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label htmlFor="name" style={labelStyle}>Full Name <span style={{ color: '#C4001A' }}>*</span></label>
              <input id="name" name="name" type="text" required style={inputStyle} />
            </div>
            <div>
              <label htmlFor="email" style={labelStyle}>Email Address <span style={{ color: '#C4001A' }}>*</span></label>
              <input id="email" name="email" type="email" required style={inputStyle} />
            </div>
          </div>

          <div>
            <label htmlFor="subject" style={labelStyle}>Subject <span style={{ color: '#C4001A' }}>*</span></label>
            <input id="subject" name="subject" type="text" required style={inputStyle} />
          </div>

          <div>
            <label htmlFor="message" style={labelStyle}>Message <span style={{ color: '#C4001A' }}>*</span></label>
            <textarea
              id="message" name="message" rows={6} required
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            style={{ background: pending ? '#8D99A8' : '#0972D3', color: '#FFFFFF', fontSize: 14, fontWeight: 700, padding: '12px', borderRadius: 4, border: 'none', cursor: pending ? 'not-allowed' : 'pointer', transition: 'background 0.1s' }}
          >
            {pending ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
