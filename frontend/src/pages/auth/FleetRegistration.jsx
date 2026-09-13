import { useState } from 'react'

const initialForm = {
  name: '', mobile: '', email: '', license: '',
  company: '', driverId: '', plate: '', model: '',
  battery: '', port: '', startTime: '', endTime: '', password: 'FleetSuper@2025',
}

function FleetRegistration({ onComplete, onBack }) {
  const [form, setForm] = useState(initialForm)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [accepted, setAccepted] = useState(true)
  const [manualHours, setManualHours] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    setSubmitted(true)
    const requiredFields = ['name', 'mobile', 'email', 'license', 'company', 'driverId', 'plate', 'model', 'battery', 'port', 'password']
    if (requiredFields.every((field) => form[field].trim()) && form.password.length >= 8 && accepted) onComplete(form.mobile)
  }

  return <main className="fleet-page">
    <header className="fleet-header"><button className="fleet-icon-button" aria-label="Go back" onClick={onBack} type="button">←</button><div className="fleet-brand"><span>ϟ</span> ChargeKaro</div><button className="fleet-icon-button" aria-label="Support and help" type="button">?</button></header>
    <div className="fleet-progress"><div><span>STEP 1 OF 2: DRIVER &amp; VEHICLE ONBOARDING</span><strong>50%</strong></div><i><b /></i></div>
    <section className="fleet-content"><div className="fleet-title"><span>✓ VERIFIED ONBOARDING</span><h1>Commercial Driver Sign Up</h1><p>Set up your fleet profile for smarter charging and direct subsidy settlement.</p></div>
      <form className="fleet-form" onSubmit={submit} noValidate>
        <FleetSection title="1. Personal & Identity Details" icon="♙" tone="primary">
          <Field label="Full Legal Name" hint="Must match government database" required name="name" value={form.name} onChange={updateField} placeholder="As printed on Driving License" icon="♙" />
          <Field label="Mobile Number" required name="mobile" value={form.mobile} onChange={updateField} placeholder="10-digit mobile" prefix="+91" verified />
          <Field label="Email Address" required name="email" value={form.email} onChange={updateField} placeholder="name@company.com" icon="✉" type="email" />
          <Field label="Commercial Driver License (DL)" required name="license" value={form.license} onChange={updateField} placeholder="e.g. DL-0420190038411" icon="▣" verified />
        </FleetSection>
        <FleetSection title="2. Company Association" icon="▦" tone="secondary">
          <Field label="Company Name" name="company" value={form.company} onChange={updateField} placeholder="Type your company name" hint="Enter the company you work with." icon="▦" />
          <Field label="Company Driver ID" required name="driverId" value={form.driverId} onChange={updateField} placeholder="e.g. UBER-IND-DEL-4091" icon="♙" />
        </FleetSection>
        <FleetSection title="3. Commercial Vehicle Details" icon="▰" tone="primary">
          <Field label="EV Vehicle Registration Number" required name="plate" value={form.plate} onChange={updateField} placeholder="DL 01 EV 8920" prefix="IND" className="plate-field" />
          <Field label="Vehicle Model / Make" required name="model" value={form.model} onChange={updateField} placeholder="Enter vehicle model or make" icon="▰" />
          <div className="fleet-grid"><Field label="Battery Capacity" required name="battery" value={form.battery} onChange={updateField} placeholder="e.g. 26.0 kWh" icon="▣" /><Field label="Primary Port" required name="port" value={form.port} onChange={updateField} placeholder="e.g. CCS2 Fast DC" icon="ϟ" /></div>
        </FleetSection>
        <FleetSection title="4. Shift & Route Operations" icon="◷" tone="secondary">
          <div className="fleet-field"><label>Working Hours</label><button className="hours-toggle" onClick={() => setManualHours((visible) => !visible)} type="button"><strong>✎ Enter Manual Hours</strong><small>Set your own start and end time</small></button>{manualHours && <div className="fleet-grid time-grid"><Field label="Start Time" name="startTime" value={form.startTime} onChange={updateField} type="time" /><Field label="End Time" name="endTime" value={form.endTime} onChange={updateField} type="time" /></div>}</div>
          <div className="fleet-field"><label htmlFor="routeCorridor">Expected Daily Corridor &amp; Range Demand</label><div className="select-wrap"><span>⌁</span><select id="routeCorridor"><option>Airport Express Corridor (IGI T3 - Cyber Hub) • 180-220 km/day</option><option>Noida Expressway - South Delhi Hub • 140-180 km/day</option><option>Outer Ring Road Logistics • 160-200 km/day</option><option>Intra-City On-Demand Rideshare • 200+ km/day</option></select></div></div>
        </FleetSection>
        <FleetSection title="5. Password & Account Security" icon="▣" tone="primary">
          <div className="fleet-field"><label htmlFor="fleet-password">Create Fleet Driver Password <em>*</em></label><div className="fleet-input-wrap"><span>⚿</span><input id="fleet-password" name="password" onChange={updateField} value={form.password} type={passwordVisible ? 'text' : 'password'} placeholder="Minimum 8 characters" required /><button aria-label="Toggle password visibility" onClick={() => setPasswordVisible((visible) => !visible)} type="button">{passwordVisible ? '◉' : '◌'}</button></div><div className="strength-line"><span>Security Strength:</span><strong>{form.password.length >= 8 ? 'Strong (High Security)' : 'Weak'}</strong></div><div className="strength-bars"><i /><i /><i /><i /></div></div>
          <label className="fleet-terms"><input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" /><span>I accept the <a href="#agreement">Company Agreement</a>, authorize EV telemetry sharing for subsidy settlement, and verify that all transport endorsements are genuine.</span></label>
        </FleetSection>
        {submitted && (!accepted || form.password.length < 8) && <p className="fleet-error">Please accept the company agreement and use a password with at least 8 characters.</p>}
        <button className="fleet-submit" type="submit">Continue to Step 2: Verification <span>→</span></button>
        <p className="fleet-login">Already registered as a ChargeKaro fleet driver? <button onClick={onComplete} type="button">Log In</button></p>
        <div className="fleet-trust"><span>▣ ISO 15118 EV Security</span><i /><span>ϟ Direct Fleet Subsidy</span></div>
      </form>
    </section>
  </main>
}

function FleetSection({ title, icon, tone, children }) { return <section className="fleet-section"><div className={`fleet-section-title ${tone}`}><h2><span>{icon}</span>{title}</h2></div>{children}</section> }
function Field({ label, hint, required: isRequired, name, value, onChange, placeholder, icon, prefix, verified, type = 'text', className = '' }) { return <div className={`fleet-field ${className}`}><label htmlFor={name}>{label} {isRequired && <em>*</em>}</label><div className="fleet-input-wrap">{prefix && <span className={`field-prefix ${prefix === 'IND' ? 'plate-prefix' : ''}`}>{prefix}</span>}{icon && <span className="field-leading">{icon}</span>}<input id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} required={isRequired} />{verified && <span className="field-verified">✓</span>}</div>{hint && <small>{hint}</small>}</div> }

export default FleetRegistration