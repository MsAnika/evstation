import { useState } from 'react'
import chargeKaroLogo from '../../assets/chargekaro_logo_transparent.png'

function Registration({ onComplete, onBack }) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [accepted, setAccepted] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '' })

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (form.name.trim() && form.mobile.trim() && form.email.trim() && form.password.length >= 8 && accepted) onComplete(form.mobile)
  }

  return (
    <main className="registration-page">
      <header className="registration-header">
        <button className="registration-icon-button" aria-label="Back to account type" onClick={onBack} type="button"><span aria-hidden="true">←</span></button>
        <div className="registration-brand"><img alt="ChargeKaro" src={chargeKaroLogo} /></div>
        <button className="registration-icon-button" aria-label="Support and help" type="button"><span aria-hidden="true">?</span></button>
      </header>

      <section className="registration-content">
        <div className="registration-progress-head"><span><i /> Step 1 of 2: Personal Details</span><strong>50% Completed</strong></div>
        <div className="registration-progress"><span /></div>
        <div className="registration-title"><h1>Create EV Driver Profile</h1><p>Power your electric journey</p></div>

        <form className="registration-form" onSubmit={submit} noValidate>
          <label className="registration-field" htmlFor="full-name"><span className="field-label"><b>Full Name</b><small>Official ID</small></span><span className="input-wrap"><span className="field-icon" aria-hidden="true">♙</span><input id="full-name" name="name" onChange={updateField} value={form.name} placeholder="e.g., Rohan Sharma" required /></span></label>
          <label className="registration-field" htmlFor="mobile-number"><span className="field-label"><b>Mobile Number</b><small className="verified-label">✓ Verified</small></span><span className="input-wrap"><span className="country-code"><span aria-hidden="true">🇮🇳</span> +91</span><input id="mobile-number" name="mobile" onChange={updateField} value={form.mobile} inputMode="tel" required /><span className="verified-icon" aria-hidden="true">✓</span></span></label>
          <label className="registration-field" htmlFor="email-address"><span className="field-label"><b>Email Address</b></span><span className="input-wrap"><span className="field-icon" aria-hidden="true">✉</span><input id="email-address" name="email" onChange={updateField} value={form.email} type="email" placeholder="rohan.sharma@example.com" required /></span></label>
          <div className="registration-field"><label className="field-label" htmlFor="password"><b>Create Password</b></label><span className="input-wrap"><span className="field-icon" aria-hidden="true">▣</span><input id="password" name="password" onChange={updateField} value={form.password} type={passwordVisible ? 'text' : 'password'} required /><button className="password-toggle" aria-label="Toggle password visibility" onClick={() => setPasswordVisible((visible) => !visible)} type="button">{passwordVisible ? '◉' : '◌'}</button></span><span className="strength-row"><span>Security Rating:</span><strong>{form.password.length >= 8 ? 'Strong' : 'Weak'}</strong></span><span className="strength-bars"><i /><i /><i /><i /></span></div>
          <label className="terms-check"><input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" /><span>I accept ChargeKaro <a href="#terms">Terms of Service</a> &amp; <a href="#privacy">Privacy Policy</a>.</span></label>
          {submitted && (!accepted || form.password.length < 8) && <p className="form-error">Please accept the terms and use a password with at least 8 characters.</p>}
          <button className="registration-submit" type="submit">Continue to Verification <span aria-hidden="true">→</span></button>
        </form>

        <footer className="registration-footer"><p>Already a ChargeKaro Driver? <button onClick={onComplete} type="button">Log in to Hub</button></p><div><span aria-hidden="true">⚡</span> Secure driver onboarding <span aria-hidden="true">♢</span> Encrypted</div></footer>
      </section>
    </main>
  )
}

export default Registration