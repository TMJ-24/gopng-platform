'use client'

import { useEffect } from 'react'

export function PasswordToggle() {
  useEffect(() => {
    const attach = () => {
      const pwInput = document.querySelector<HTMLInputElement>('input[type="password"], input[name="password"]')
      if (!pwInput || pwInput.dataset.toggleAttached) return

      pwInput.dataset.toggleAttached = 'true'

      /* Wrap input in a relative container */
      const parent = pwInput.parentElement
      if (!parent) return

      parent.style.position = 'relative'
      pwInput.style.paddingRight = '44px'

      /* Build the eye button */
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.setAttribute('aria-label', 'Toggle password visibility')
      btn.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #687078;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
      `

      const eyeOpen = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
      const eyeOff  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`

      btn.innerHTML = eyeOpen
      let visible = false

      btn.addEventListener('click', () => {
        visible = !visible
        pwInput.type = visible ? 'text' : 'password'
        btn.innerHTML = visible ? eyeOff : eyeOpen
        btn.style.color = visible ? '#0972D3' : '#687078'
      })

      parent.appendChild(btn)
    }

    /* Try immediately, then watch for Payload to render the form */
    attach()
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
