import { useState } from "react";
import chargeKaroLogo from "../../assets/chargekaro_logo_transparent.png";

function Signup({ onComplete, onLogin }) {
  const [role, setRole] = useState("personal");

  const isPersonal = role === "personal";
  const isFleet = role === "fleet";
  const actionLabel = isPersonal
    ? "Continue as Normal User"
    : isFleet
      ? "Continue Driver"
      : "Register Home";

  return (
    <main className="signup-page">
      <header className="signup-header">
        <button
          className="signup-icon-button"
          aria-label="Go back"
          type="button"
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className="signup-brand">
          <img alt="ChargeKaro" src={chargeKaroLogo} />
        </div>
        <button
          className="signup-icon-button"
          aria-label="Support and help"
          type="button"
        >
          <span aria-hidden="true">?</span>
        </button>
      </header>

      <section className="signup-content">
        <div className="auth-tabs" role="tablist" aria-label="Account action">
          <button
            className="active"
            role="tab"
            aria-selected="true"
            type="button"
          >
            Create Account
          </button>
          <button
            onClick={onLogin}
            role="tab"
            aria-selected="false"
            type="button"
          >
            Log In
          </button>
        </div>

        <div className="signup-intro">
          <span className="signup-step">
            <i /> STEP 1 OF 2
          </span>
          <h1>Choose Account Type</h1>
          <p>Select how you plan to charge with our clean energy network.</p>
        </div>

        <div className="role-options">
          <button
            className={`role-card ${isPersonal ? "selected" : ""}`}
            onClick={() => setRole("personal")}
            type="button"
          >
            <span className="role-card-top">
              <span className="role-tag personal-tag">Personal Account</span>
              <span className="role-check" aria-hidden="true">
                {isPersonal ? "✓" : ""}
              </span>
            </span>
            <span className="role-card-main">
              <span className="role-symbol" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M5 17h14M6.5 17v1.5M17.5 17v1.5M5 17l1.2-6h11.6l1.2 6M7.2 11 8.5 7h7l1.3 4M7 14h.01M17 14h.01" />
                </svg>
              </span>
              <strong>Normal EV Driver / Commuter</strong>
            </span>
          </button>

          <button
            className={`role-card ${isFleet ? "selected" : ""}`}
            onClick={() => setRole("fleet")}
            type="button"
          >
            <span className="role-card-top">
              <span className="role-tag fleet-tag">Commercial Partner</span>
              <span className="role-check" aria-hidden="true">
                {!isPersonal ? "✓" : ""}
              </span>
            </span>
            <span className="role-card-main">
              <span className="role-symbol fleet-symbol" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path d="M3 7h11v10H3zM14 10h3l3 3v4h-6zM6.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
              </span>
              <strong>Commercial Fleet Driver</strong>
            </span>
            <span className="supported-networks">
              <small>Supported Networks:</small>
              <span>Uber</span>
              <span>Ola</span>
              <span>BluSmart</span>
            </span>
          </button>

          <button
            className={`role-card home-role-card ${role === "home" ? "selected" : ""}`}
            onClick={() => setRole("home")}
            type="button"
          >
            <span className="role-card-top">
              <span className="role-tag home-tag">EV Station Host</span>
              <span className="role-check" aria-hidden="true">
                {role === "home" ? "✓" : ""}
              </span>
            </span>
            <span className="role-card-main">
              <span className="role-symbol home-symbol" aria-hidden="true">
                ⌂
              </span>
              <strong>Register Your Home as an EV Station</strong>
            </span>
            <span className="supported-networks">
              <small>Share your home charger with nearby EV drivers.</small>
            </span>
          </button>
        </div>

        <div className="signup-actions">
          <button
            className="signup-primary"
            onClick={() => onComplete(role)}
            type="button"
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </button>
          <div className="signup-divider">
            <span>Sign in</span>
          </div>
          <div className="social-actions">
            <button type="button">
              <svg
                className="google-mark"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.7-.06-1.38-.18-2.03H12v3.84h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.2Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.75Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.53 13.84a5.85 5.85 0 0 1 0-3.68V7.63H3.28a9.75 9.75 0 0 0 0 8.74l3.25-2.53Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.13c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.28 14.62 2.25 12 2.25a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53C7.3 7.85 9.46 6.13 12 6.13Z"
                />
              </svg>{" "}
              Google
            </button>
            <button type="button">
              <svg
                className="apple-mark"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M16.77 12.74c.02 2.25 1.97 3 1.99 3.01-.02.05-.31 1.07-1.03 2.12-.62.92-1.27 1.84-2.3 1.86-1.01.02-1.34-.6-2.5-.6-1.16 0-1.53.58-2.49.62-1 .04-1.76-.99-2.38-1.91-1.29-1.87-2.27-5.28-.95-7.59.65-1.15 1.81-1.88 3.07-1.9 1-.02 1.94.67 2.5.67.57 0 1.63-.83 2.74-.71.47.02 1.79.19 2.64 1.43-.07.04-1.58.92-1.56 3Zm-1.8-5.6c.5-.61.83-1.47.74-2.32-.72.03-1.59.48-2.1 1.08-.46.53-.87 1.4-.76 2.22.8.06 1.62-.4 2.12-.98Z" />
              </svg>{" "}
              Apple
            </button>
          </div>
        </div>

        <footer className="signup-footer">
          <div>
            <span className="lock-mark" aria-hidden="true">
              ▣
            </span>{" "}
            256-bit encrypted • ISO 15118 EV Security Certified
          </div>
          <p>
            By continuing, you agree to our{" "}
            <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>.
          </p>
        </footer>
      </section>
    </main>
  );
}

export default Signup;
