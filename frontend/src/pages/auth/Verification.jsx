import { useEffect, useRef, useState } from 'react'

function Verification({ phone, onBack, onComplete }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [seconds, setSeconds] = useState(38)
  const inputs = useRef([])

  useEffect(() => {
    if (!seconds) return undefined
    const timer = setInterval(() => setSeconds((current) => Math.max(current - 1, 0)), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  function updateDigit(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item))
    if (digit && index < 3) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) inputs.current[index - 1]?.focus()
  }

  function resend() {
    setDigits(['', '', '', ''])
    setSeconds(38)
    inputs.current[0]?.focus()
  }

  const complete = digits.every(Boolean)
  const clock = `00:${String(seconds).padStart(2, '0')}`

  return <main className="verification-page">
    <div className="verification-glow" />
    <div className="verification-device">
      <div className="verification-status-bar"><strong>09:41</strong><span>▮▮▮ ◉ ▰</span></div>
      <header className="verification-header"><button className="verification-icon-button" aria-label="Back to registration" onClick={onBack} type="button">←</button><div className="verification-brand"><span>ϟ</span> ChargeKaro</div><button className="verification-icon-button" aria-label="Support and help" type="button">?</button></header>
    </div>
    <div className="verification-progress"><div><span>STEP 2 OF 2: VERIFICATION</span><strong>100%</strong></div><i><b /></i></div>
    <section className="verification-content">
      <div className="verification-emblem"><div>✓</div><span>ϟ</span></div>
      <h1>Verify Phone Number</h1>
      <p className="verification-copy">We have sent a 4-digit passcode via SMS to</p>
      <div className="phone-pill"><span>⌕</span><strong>+91 {phone || 'your mobile number'}</strong><button onClick={onBack} type="button">Edit</button></div>
      <div className="otp-inputs" aria-label="One-time passcode">
        {digits.map((digit, index) => <input key={index} ref={(element) => { inputs.current[index] = element }} aria-label={`Digit ${index + 1}`} autoFocus={index === 3} inputMode="numeric" maxLength={1} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} value={digit} />)}
      </div>
      <div className="verification-card"><div className="resend-row"><span><b>◷</b> Resend OTP in</span><strong>{seconds ? clock : <button onClick={resend} type="button">Resend now</button>}</strong></div><div className="card-rule" /></div>
      <div className="verification-trust"><span>▣</span><i /><span>✓</span></div>
    </section>
    <div className="verification-actions"><button className="verification-submit" disabled={!complete} onClick={onComplete} type="button">Verify &amp; Complete Registration <span>→</span></button><p className="verification-support">Didn't receive code? <button onClick={() => window.alert('Support request noted.')} type="button">Contact Support</button></p><div className="home-indicator" /></div>
  </main>
}

export default Verification