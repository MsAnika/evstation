import { useState } from 'react'
import chargeKaroLogo from '../../assets/chargekaro_logo_transparent.png'

function Login({ onComplete, onSignup }) {
  const [role, setRole] = useState('personal')
  const [method, setMethod] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  const isPersonal = role === 'personal'
  const canSubmit = method === 'mobile' ? mobile.replace(/\D/g, '').length === 10 : email.trim() && password.length >= 8

  function submit(event) {
    event.preventDefault()
    if (canSubmit) onComplete({ method, mobile })
  }

  return <main className="login-page">
    <div className="login-glow login-glow-one" /><div className="login-glow login-glow-two" />
    <header className="login-header"><button className="login-icon-button" aria-label="Go back" onClick={onSignup} type="button">←</button><div className="login-brand"><img alt="ChargeKaro" src={chargeKaroLogo} /></div><button className="login-icon-button" aria-label="Customer support" type="button">?</button></header>
    <div className="login-content">
      <div className="login-intro"><h1>Login</h1><p>Welcome back. Charge smarter with clean energy.</p></div>
      <div className="login-role-switch" role="tablist" aria-label="Account type"><button className={isPersonal ? 'active' : ''} onClick={() => setRole('personal')} role="tab" aria-selected={isPersonal} type="button"><span className="role-logo personal-logo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16.5h14M6.5 16.5l1.2-5.5h9.6l1.2 5.5M8.2 11l1.2-3h5.2l1.2 3M7.5 19v-2.5M16.5 19v-2.5M7 14h.01M17 14h.01" /></svg></span><span>Personal EV</span></button><button className={!isPersonal ? 'active commercial' : ''} onClick={() => setRole('fleet')} role="tab" aria-selected={!isPersonal} type="button"><span className="role-logo fleet-logo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v10H3zM14 10h3l3 3v4h-6zM6.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg></span><span>Commercial Fleet</span></button></div>
      {!isPersonal && <div className="fleet-login-banner"><span>✓</span><div><strong>Commercial partner login</strong><p>Use your fleet email or driver credentials.</p></div></div>}
      <div className="login-methods"><button className={method === 'mobile' ? 'active' : ''} onClick={() => setMethod('mobile')} type="button"><span>⌕</span>Mobile Number / OTP</button><button className={method === 'email' ? 'active' : ''} onClick={() => setMethod('email')} type="button"><span>✉</span>Email &amp; Password</button></div>
      <form className="login-form" onSubmit={submit}>
        {method === 'mobile' ? <div className="login-field-group"><label htmlFor="login-mobile">Phone Number</label><div className="login-input phone-input"><span className="country-code-fixed" style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', width: '72px', flexShrink: 0, padding: 0, borderRight: '1px solid rgba(187,202,191,.5)', color: '#131b2e', background: '#f2f3ff', fontSize: '12px', fontWeight: 700 }}><b>+91</b><i aria-hidden="true" style={{ color: '#6c7a71', fontSize: '12px', fontStyle: 'normal' }}>⌄</i></span><input id="login-mobile" inputMode="numeric" maxLength={10} onChange={(event) => setMobile(event.target.value)} placeholder="Enter 10-digit mobile number" value={mobile} /><button type="submit">Verify</button></div><small>⌁ We will send a 6-digit one-time verification code</small></div> : <div className="login-email-fields"><div className="login-field-group"><label htmlFor="login-email">Email Address</label><div className="login-input"><span>✉</span><input id="login-email" onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" type="email" value={email} /></div></div><div className="login-field-group"><div className="login-label-row"><label htmlFor="login-password">Password</label><a href="#forgot">Forgot Password?</a></div><div className="login-input"><span>▣</span><input id="login-password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" type={passwordVisible ? 'text' : 'password'} value={password} /><button aria-label="Toggle password visibility" onClick={() => setPasswordVisible((visible) => !visible)} type="button">{passwordVisible ? '◉' : '◌'}</button></div></div></div>}
        <button className="login-submit" disabled={!canSubmit} type="submit">Log In to ChargeKaro <span>→</span></button>
      </form>
      <div className="login-divider"><span>OR CONTINUE WITH</span></div><div className="login-social"><button type="button"><svg className="google-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.23c0-.7-.06-1.38-.18-2.03H12v3.84h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.2Z" /><path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.75Z" /><path fill="#FBBC05" d="M6.53 13.84a5.85 5.85 0 0 1 0-3.68V7.63H3.28a9.75 9.75 0 0 0 0 8.74l3.25-2.53Z" /><path fill="#EA4335" d="M12 6.13c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.28 14.62 2.25 12 2.25a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53C7.3 7.85 9.46 6.13 12 6.13Z" /></svg><span>Google</span></button><button type="button"><svg className="apple-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.77 12.74c.02 2.25 1.97 3 1.99 3.01-.02.05-.31 1.07-1.03 2.12-.62.92-1.27 1.84-2.3 1.86-1.01.02-1.34-.6-2.5-.6-1.16 0-1.53.58-2.49.62-1 .04-1.76-.99-2.38-1.91-1.29-1.87-2.27-5.28-.95-7.59.65-1.15 1.81-1.88 3.07-1.9 1-.02 1.94.67 2.5.67.57 0 1.63-.83 2.74-.71.47.02 1.79.19 2.64 1.43-.07.04-1.58.92-1.56 3Zm-1.8-5.6c.5-.61.83-1.47.74-2.32-.72.03-1.59.48-2.1 1.08-.46.53-.87 1.4-.76 2.22.8.06 1.62-.4 2.12-.98Z" /></svg><span>Apple</span></button></div>
      <p className="login-signup-prompt">Don't have a ChargeKaro account? <button onClick={onSignup} type="button">Sign Up</button></p>
    </div>
    <footer className="login-footer"><span>▣</span><i /><span>✓</span><small>Secure EV account</small></footer>
  </main>
}

export default Login
