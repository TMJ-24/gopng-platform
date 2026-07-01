'use client'

import { useEffect } from 'react'

const CSS = `
/* ── GoPNG Admin — Global style overrides ───────────────────────────── */

/* Font consistency across every admin element */
.payload-admin,
.payload-admin * {
  font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif !important;
}

/* Subtle brand accent on the top edge of the content area */
.template-default__wrap {
  background: #F2F3F3 !important;
}

/* Nav transition when collapsing */
.template-default__nav {
  transition: width 0.2s ease, min-width 0.2s ease !important;
  overflow: hidden !important;
}

/* Neutralise the default Payload logo block inside the header
   (our custom AdminNav already renders the header) */
.template-default__header {
  display: none !important;
}

/* Make the breadcrumb area sit flush */
.render-title {
  padding-top: 4px !important;
}

/* Primary button — match design system blue */
.btn--style-primary,
a.btn--style-primary {
  background-color: #0972D3 !important;
  border-color: #0972D3 !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  border-radius: 4px !important;
}
.btn--style-primary:hover,
a.btn--style-primary:hover {
  background-color: #033160 !important;
  border-color: #033160 !important;
}

/* Secondary / outline buttons */
.btn--style-secondary {
  border-radius: 4px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}

/* Table header row */
.table th {
  font-size: 11px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.07em !important;
  font-weight: 700 !important;
  color: #545B64 !important;
  background: #F4F6F8 !important;
}

/* Table rows */
.table td {
  font-size: 13px !important;
  color: #000716 !important;
}
.table tr:hover td {
  background: #F2F8FD !important;
}

/* Input fields */
.field-type input,
.field-type textarea,
.field-type select {
  border-radius: 4px !important;
  font-size: 14px !important;
}
.field-type input:focus,
.field-type textarea:focus {
  box-shadow: 0 0 0 2px rgba(9,114,211,0.25) !important;
  border-color: #0972D3 !important;
}

/* Sidebar group labels */
.nav__label {
  font-size: 10px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  font-weight: 700 !important;
  color: #687078 !important;
}

/* Toast / flash messages */
.toast-success { border-color: #1D8348 !important; }
.toast-error   { border-color: #D13212 !important; }

/* Card containers inside the admin */
.render-fields__field-schema-form {
  gap: 16px !important;
}

/* ── Header → content gap on all admin pages ── */

/* Breathing room at the top of every main content pane */
.template-default__wrap .gutter {
  padding-top: 24px !important;
}

/* Extra space below the page render-title breadcrumb area */
.render-title {
  margin-bottom: 16px !important;
}
`

export function AdminGlobalStyles({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const id = 'gopng-admin-styles'
    if (document.getElementById(id)) return
    const el = document.createElement('style')
    el.id = id
    el.textContent = CSS
    document.head.appendChild(el)
    return () => { document.getElementById(id)?.remove() }
  }, [])

  return <>{children}</>
}
