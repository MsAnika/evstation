import { useEffect, useRef, useState } from "react";
import { divIcon } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from "react-leaflet";
import chargeKaroLogo from "../../assets/chargekaro_logo_transparent.png";

const homes = [
  {
    id: "greenvolt",
    name: "GreenVolt Community Pod #4",
    owner: "R. Sharma",
    distance: 1.8,
    tariff: 14.5,
    power: 30,
    energy: "94% Solar",
    address: "Sector 43 Tech Corridor",
    coords: [28.4595, 77.0266],
  },
  {
    id: "express",
    name: "Peak Power Express",
    owner: "VoltGrid Station",
    distance: 2.4,
    tariff: 18,
    power: 60,
    energy: "Grid + Solar",
    address: "Golf Course Road",
    coords: [28.4676, 77.081],
  },
  {
    id: "aarav",
    name: "Aarav Residence",
    owner: "Aarav Mehta",
    distance: 3.4,
    tariff: 12.8,
    power: 22,
    energy: "100% Solar",
    address: "Saket Community Lane",
    coords: [28.5245, 77.2066],
  },
  {
    id: "neha",
    name: "Nehru Place Home",
    owner: "Neha Kapoor",
    distance: 4.1,
    tariff: 13.2,
    power: 11,
    energy: "Solar + Grid",
    address: "Nehru Place",
    coords: [28.5494, 77.2501],
  },
];

const markerIcon = (symbol, kind) =>
  divIcon({
    className: "requested-marker-icon",
    html: `<span class="requested-marker ${kind}">${symbol}</span>`,
  });
const blankSession = { seconds: 0, kwh: 0 };
void JourneyScreen;
void BottomNav;

export default function RequestedChargingFlow() {
  const [stage, setStage] = useState("dashboard");
  const [selected, setSelected] = useState(homes[0]);
  const [matchOpen, setMatchOpen] = useState(false);
  const [permission, setPermission] = useState("idle");
  const [pin, setPin] = useState("");
  const [session, setSession] = useState(blankSession);
  const [payment, setPayment] = useState("Google Pay");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  const chooseHome = (home) => {
    setSelected(home);
    setMatchOpen(false);
    setPermission("waiting");
    setStage("journey");
    window.setTimeout(() => {
      setPermission("permitted");
      window.setTimeout(() => setStage("handshake"), 700);
    }, 10000);
  };
  const generatePin = () => {
    setPin(String(Math.floor(1000 + Math.random() * 9000)));
    setStage("charging");
    setSession(blankSession);
  };
  const total = +(session.kwh * selected.tariff).toFixed(2);
  const finish = () => {
    const receipt = {
      id: `VP-${Date.now().toString().slice(-6)}`,
      host: selected.name,
      kwh: session.kwh,
      total,
      date: new Date().toLocaleDateString(),
    };
    setHistory((items) => [receipt, ...items]);
    setStage("payment");
  };

  useEffect(() => {
    if (stage !== "charging") return undefined;
    const timer = setInterval(
      () =>
        setSession((current) => ({
          seconds: current.seconds + 1,
          kwh: +(current.kwh + 0.12).toFixed(2),
        })),
      1000,
    );
    return () => clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    const handleDrawerNavigation = (event) => {
      const button = event.target.closest(".charging-drawer-links button");
      if (!button) return;
      if (button.matches(":nth-child(1)")) setStage("dashboard");
      if (button.matches(":nth-child(2)")) setStage("history");
    };
    document.addEventListener("click", handleDrawerNavigation);
    return () => document.removeEventListener("click", handleDrawerNavigation);
  }, []);

  return (
    <div className="requested-flow">
      {stage === "dashboard" && (
        <Dashboard
          selected={selected}
          onSelect={setSelected}
          onMatch={() => setMatchOpen(true)}
          onRegister={() => setStage("registration")}
        />
      )}
      {stage === "registration" && (
        <HomeRegistrationScreen
          onBack={() => setStage("dashboard")}
          onComplete={() => setStage("dashboard")}
        />
      )}
      {stage === "journey" && (
        <ApprovalScreen
          host={selected}
          permission={permission}
          onBack={() => setStage("dashboard")}
        />
      )}
      {stage === "handshake" && (
        <HandshakeScreen
          host={selected}
          pin={pin}
          onGenerate={generatePin}
          onBack={() => setStage("dashboard")}
        />
      )}
      {stage === "charging" && (
        <ChargingScreen host={selected} session={session} onFinish={finish} />
      )}
      {stage === "payment" && (
        <PaymentScreen
          host={selected}
          total={total}
          payment={payment}
          setPayment={setPayment}
          history={history}
          feedback={feedback}
          setFeedback={setFeedback}
          onPay={() => setStage("history")}
        />
      )}
      {stage === "history" && (
        <HistoryScreen history={history} onHome={() => setStage("dashboard")} />
      )}
      {matchOpen && (
        <MatchModal
          selected={selected}
          onClose={() => setMatchOpen(false)}
          onChoose={chooseHome}
        />
      )}
    </div>
  );
}

function Header({ title, subtitle, action }) {
  return (
    <header className="requested-header">
      <ChargingMenuButton />
      <div>
        <img className="requested-brand-logo" alt="ChargeKaro" src={chargeKaroLogo} />
        <h1>{title}</h1>
      </div>
      {action || <span className="header-live">LIVE</span>}
    </header>
  );
}
function ChargingMenuButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <button
        className="charging-menu approval-menu-button"
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
        type="button"
      >
        ☰
      </button>
      {menuOpen && (
        <>
          <button
            className="charging-drawer-scrim"
            aria-label="Close menu"
            onClick={closeMenu}
            type="button"
          />
          <aside className="charging-drawer">
            <div className="charging-drawer-profile">
              <button
                className="charging-drawer-close"
                aria-label="Close menu"
                onClick={closeMenu}
                type="button"
              >
                ×
              </button>
              <div className="charging-avatar">
                AM
                <i />
              </div>
              <h2>Arjun Mehta</h2>
              <p>
                <b>● Online</b>
                <span>•</span>Tata Nexon EV · 40.5 kWh
              </p>
            </div>
            <nav className="charging-drawer-links">
              <button className="selected" onClick={closeMenu} type="button">
                <span>⌂</span>Explore Map
              </button>
              <button onClick={closeMenu} type="button">
                <span>ϟ</span>Live Session<em>Idle</em>
              </button>
              <button onClick={closeMenu} type="button">
                <span>◉</span>Pump Meter<em>Ready</em>
              </button>
              <button onClick={closeMenu} type="button">
                <span>▣</span>Wallet &amp; Escrow<em>₹1,420</em>
              </button>
              <button onClick={closeMenu} type="button">
                <span>◷</span>Trips &amp; Charge History
              </button>
              <button onClick={closeMenu} type="button">
                <span>⚙</span>Settings &amp; Safety
              </button>
            </nav>
            <div className="charging-drawer-footer">
              ChargeKaro Clean EV · v2.4{" "}
              <b>
                <i /> Connected
              </b>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
function ApprovalScreen({ host, permission }) {
  const [secondsLeft, setSecondsLeft] = useState(20);
  useEffect(() => {
    if (permission === "permitted" || secondsLeft === 0) return undefined;
    const timer = setInterval(
      () => setSecondsLeft((seconds) => Math.max(seconds - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [permission, secondsLeft]);
  const countdown = `00:${String(secondsLeft).padStart(2, "0")}`;
  const progress = `${(secondsLeft / 20) * 100}%`;
  const hostName = host.owner || host.name || "selected host";
  const initials = hostName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <main className="approval-screen">
      <header className="approval-topbar">
        <ChargingMenuButton />
        <img className="approval-brand-logo" alt="ChargeKaro" src={chargeKaroLogo} />
        <button className="charging-notification" aria-label="Notifications" type="button">🔔</button>
      </header>
      <section className="approval-status">
        <div className="approval-status-head">
          <span className="approval-signal">
            ⌁<i />
          </span>
          <div>
            <b>Pinging Smart Charger</b>
            <h1>
              {permission === "permitted"
                ? `${hostName} approved your request`
                : `Waiting for ${hostName}'s approval`}
            </h1>
          </div>
          <em>Auto-Sync</em>
        </div>
        <div className="approval-countdown">
          <span>◷ &nbsp; Host usually responds shortly</span>
          <strong>
            {permission === "permitted" ? "APPROVED" : `${countdown} remaining`}
          </strong>
          <i>
            <b style={{ width: progress }} />
          </i>
        </div>
        <p className="approval-alert">
          ✓ &nbsp; Push alert dispatched to the host's smart wallbox chime &amp;
          mobile screen.
        </p>
      </section>
      <section className="host-card">
        <div className="host-avatar">
          {initials}
          <span>✦</span>
        </div>
        <div className="host-info">
          <div>
            <h2>{hostName}</h2>
            <b>★ 4.8</b>
          </div>
          <p>Verified charging host · {host.distance} km away</p>
          <strong>ϟ Fast responder</strong>
        </div>
        <div className="host-actions">
          <button aria-label="Call host" type="button">
            ⌕
          </button>
          <button aria-label="Message host" type="button">
            ▤
          </button>
        </div>
      </section>
      <section className="requested-charger">
        <div className="charger-heading">
          <div>
            <small>REQUESTED CHARGER</small>
            <h2>{host.name} - Type 2 AC</h2>
          </div>
          <span>
            <i /> Bay Available
          </span>
        </div>
        <div className="charger-metrics">
          <div>
            <span>◴</span>
            <small>
              Charging Power<strong>{host.power} kW Fast AC</strong>
            </small>
          </div>
          <div>
            <span>₹</span>
            <small>
              Host Tariff<strong>₹{host.tariff.toFixed(2)} / kWh</strong>
            </small>
          </div>
          <div>
            <span>◷</span>
            <small>
              Slot Duration<strong>45 min window</strong>
            </small>
          </div>
          <div>
            <span>▣</span>
            <small>
              Est. Charge Cost
              <strong>₹{(host.tariff * 16).toFixed(0)} (16 kWh)</strong>
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}
function ChargingTopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <div className="charging-topbar">
        <button
          className="charging-menu"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          type="button"
        >
          ☰
        </button>
        <button
          className="charging-notification"
          aria-label="Notifications"
          type="button"
        >
          ♧
        </button>
        <img className="charging-brand-logo" alt="ChargeKaro" src={chargeKaroLogo} />
        <div className="charging-route-card">
          <div className="charging-route-dots">
            <i />
            <b />
            <span />
          </div>
          <div className="charging-route-fields">
            <label>
              START LOCATION
              <input placeholder="Enter starting point" />
            </label>
            <label>
              DESTINATION
              <input placeholder="Search destination..." />
            </label>
            <div className="charging-history">
              <button type="button">◷ Recent: Sector 29</button>
              <button type="button">⌂ Home</button>
              <button type="button">▣ Work</button>
              <button type="button">+ Add</button>
            </div>
          </div>
          <button
            className="charging-swap"
            aria-label="Swap locations"
            type="button"
          >
            ↕
          </button>
        </div>
      </div>
      {menuOpen && (
        <>
          <button
            className="charging-drawer-scrim"
            aria-label="Close menu"
            onClick={closeMenu}
            type="button"
          />
          <aside className="charging-drawer">
            <div className="charging-drawer-profile">
              <button
                className="charging-drawer-close"
                aria-label="Close menu"
                onClick={closeMenu}
                type="button"
              >
                ×
              </button>
              <div className="charging-avatar">
                AM
                <i />
              </div>
              <h2>Arjun Mehta</h2>
              <p>
                <b>● Online</b>
                <span>•</span>Tata Nexon EV · 40.5 kWh
              </p>
            </div>
            <nav className="charging-drawer-links">
              <button className="selected" onClick={closeMenu} type="button">
                <span>⌂</span>Explore Map
              </button>
              <button onClick={closeMenu} type="button">
                <span>ϟ</span>Live Session<em>Idle</em>
              </button>
              <button onClick={closeMenu} type="button">
                <span>◉</span>Pump Meter<em>Ready</em>
              </button>
              <button onClick={closeMenu} type="button">
                <span>▣</span>Wallet &amp; Escrow<em>₹1,420</em>
              </button>
              <button onClick={closeMenu} type="button">
                <span>◷</span>Trips &amp; Charge History
              </button>
              <button onClick={closeMenu} type="button">
                <span>⚙</span>Settings &amp; Safety
              </button>
            </nav>
            <div className="charging-drawer-footer">
              ChargeKaro Clean EV · v2.4{" "}
              <b>
                <i /> Connected
              </b>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
function Dashboard({ selected, onSelect, onMatch, onRegister }) {
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const dragStart = useRef(null);
  function startDrag(event) {
    dragStart.current = event.clientY;
  }
  function finishDrag(event) {
    if (dragStart.current === null) return;
    const distance = event.clientY - dragStart.current;
    if (Math.abs(distance) > 24) setSheetExpanded(distance < 0);
    dragStart.current = null;
  }
  return (
    <main className="requested-screen charging-dashboard">
      <ChargingTopBar />
      <div className="dashboard-map">
        <MapContainer
          center={selected.coords}
          zoom={11}
          className="requested-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {homes.map((home) => (
            <Marker
              key={home.id}
              position={home.coords}
              icon={markerIcon(
                home.id === selected.id ? "⚡" : "⌂",
                home.id === selected.id
                  ? "requested-selected"
                  : "requested-home",
              )}
              eventHandlers={{ click: () => onSelect(home) }}
            >
              <Popup>
                <b>{home.name}</b>
                <br />
                {home.owner}
                <br />₹{home.tariff}/kWh · {home.power} kW
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="map-signals">
          <span>⌂ Homes</span>
          <span>⚡ Chargers</span>
          <span>☀ Solar</span>
        </div>
      </div>
      <section
        className={`dashboard-sheet ${sheetExpanded ? "expanded" : ""}`}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
        onPointerDown={startDrag}
        onPointerUp={finishDrag}
      >
        <button
          className="charging-sheet-handle"
          aria-label={
            sheetExpanded ? "Collapse station list" : "Expand station list"
          }
          onClick={() => setSheetExpanded((expanded) => !expanded)}
          type="button"
        >
          <i />
        </button>
        <div className="section-row">
          <b>Nearby Stations</b>
          <button onClick={onMatch}>Match →</button>
        </div>
        <div className="selected-home">
          <small>SELECTED HOUSE · {selected.distance} KM</small>
          <h2>{selected.name}</h2>
          <p>
            {selected.owner} · {selected.address}
          </p>
          <div className="home-stats">
            <span>
              Tariff<strong>₹{selected.tariff}/kWh</strong>
            </span>
            <span>
              Power<strong>{selected.power} kW</strong>
            </span>
            <span>
              Energy<strong>{selected.energy}</strong>
            </span>
          </div>
        </div>
        <button
          className="register-home-action"
          onClick={onRegister}
          type="button"
        >
          <span>⌂</span>
          <div>
            <b>Register home as EV station</b>
            <small>Share your charger with nearby drivers</small>
          </div>
          <em>→</em>
        </button>
        <div className="home-list">
          {homes.map((home) => (
            <button
              key={home.id}
              className={home.id === selected.id ? "selected" : ""}
              onClick={() => onSelect(home)}
            >
              <span>⌂</span>
              <div>
                <b>{home.name}</b>
                <small>
                  {home.owner} · {home.distance} km
                </small>
              </div>
              <em>→</em>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
export function HomeRegistrationScreen({ onBack, onComplete }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    power: "",
    tariff: "",
  });
  const [submitted, setSubmitted] = useState(false);
  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }
  function submit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(form).every((value) => value.trim())) onComplete();
  }
  return (
    <main className="requested-screen home-registration-screen">
      <Header
        title="Register your home"
        subtitle="Turn your charger into a local EV station"
        action={
          <button className="back-button" onClick={onBack} type="button">
            Back
          </button>
        }
      />
      <form className="home-registration-card" onSubmit={submit} noValidate>
        <span className="registration-kicker">HOME STATION ONBOARDING</span>
        <h2>Tell us about your charger</h2>
        <p>
          Drivers will see these details when your home is available for
          charging.
        </p>
        <label>
          Station name
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="e.g. Aarav Residence"
            required
          />
        </label>
        <label>
          Home address
          <input
            name="address"
            value={form.address}
            onChange={updateField}
            placeholder="Area or locality"
            required
          />
        </label>
        <div className="home-registration-grid">
          <label>
            Charging power (kW)
            <input
              name="power"
              value={form.power}
              onChange={updateField}
              inputMode="decimal"
              placeholder="e.g. 11"
              required
            />
          </label>
          <label>
            Tariff (₹/kWh)
            <input
              name="tariff"
              value={form.tariff}
              onChange={updateField}
              inputMode="decimal"
              placeholder="e.g. 12.50"
              required
            />
          </label>
        </div>
        {submitted && !Object.values(form).every((value) => value.trim()) && (
          <p className="home-registration-error">
            Please complete all station details.
          </p>
        )}
        <button className="primary-requested" type="submit">
          Submit station details <span>→</span>
        </button>
      </form>
    </main>
  );
}
function MatchModal({ selected, onClose, onChoose }) {
  const nearest = [
    selected,
    ...homes.filter((home) => home.id !== selected.id),
  ].slice(0, 2);
  return (
    <div className="requested-modal-bg">
      <section className="requested-modal">
        <button className="close-modal" onClick={onClose}>
          ×
        </button>
        <small>MATCH TO NEAREST</small>
        <h2>Choose a host house</h2>
        <p>
          Your selected home is shown first, followed by the nearest available
          option.
        </p>
        {nearest.map((home, index) => (
          <button
            className="match-choice"
            key={home.id}
            onClick={() => onChoose(home)}
          >
            <strong>0{index + 1}</strong>
            <div>
              <b>{home.name}</b>
              <small>
                {home.owner} · {home.distance} km · ₹{home.tariff}/kWh
              </small>
            </div>
            <em>Choose →</em>
          </button>
        ))}
      </section>
    </div>
  );
}
function JourneyScreen({ host, permission, onBack }) {
  return (
    <main className="requested-screen requested-stage">
      <Header
        title="Journey to Host House"
        subtitle={`${host.name} · ${host.owner}`}
        action={
          <button className="back-button" onClick={onBack}>
            Back
          </button>
        }
      />
      <div className="journey-map">
        <MapContainer center={host.coords} zoom={12} className="requested-map">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={host.coords}
            icon={markerIcon("⌂", "requested-selected")}
          />
          <Polyline
            positions={[[28.6139, 77.209], [28.56, 77.16], host.coords]}
            pathOptions={{ color: "#10b981", weight: 5, dashArray: "10 8" }}
          />
        </MapContainer>
      </div>
      <section
        className={`journey-card ${permission === "permitted" ? "permitted" : ""}`}
      >
        <span>
          {permission === "permitted"
            ? "✓ HOUSE PERMITTED"
            : "⌂ WAITING FOR HOUSE PERMISSION"}
        </span>
        <h2>
          {permission === "permitted"
            ? "House has permitted access"
            : "Waiting for house permission..."}
        </h2>
        <p>
          {permission === "permitted"
            ? "Journey starting now. Proceed to the selected host."
            : "The owner has 10 seconds to approve your charging visit."}
        </p>
        {permission !== "permitted" && (
          <div className="permission-progress">
            <i />
          </div>
        )}
      </section>
    </main>
  );
}
function HandshakeScreen({ host, pin, onGenerate }) {
  const [chargingType, setChargingType] = useState("Fast DC");

  return (
    <main className="requested-screen requested-stage booking-screen">
      <header className="booking-topbar">
        <ChargingMenuButton />
        <img className="booking-brand-logo" alt="ChargeKaro" src={chargeKaroLogo} />
        <button className="charging-notification" aria-label="Notifications" type="button">🔔</button>
      </header>
      <section className="booking-card">
        <small>SECOND STAGE · HOUSE HANDSHAKE</small>
        <h2>Charge at this home now</h2>
        <p>
          Choose a connector and generate the house OTP to begin the current
          charging visit.
        </p>
        <label>
          Charging type
          <select
            value={chargingType}
            onChange={(event) => setChargingType(event.target.value)}
          >
            <option>Fast DC</option>
            <option>Type 2 AC</option>
            <option>15A Domestic</option>
          </select>
        </label>
        <div className="booking-summary">
          <span>
            Charging now<b>Start immediately</b>
          </span>
          <span>
            Connector<b>{chargingType}</b>
          </span>
        </div>
        <h3>Generate house OTP</h3>
        <p>
          No verification step. Generate a random four-digit number and give it
          to {host.owner}.
        </p>
        {pin ? (
          <div className="big-pin">{pin}</div>
        ) : (
          <div className="pin-placeholder">----</div>
        )}
        <button className="primary-requested" onClick={onGenerate}>
          {pin ? "Start Charging" : "Generate OTP for Current Charge"}
        </button>
      </section>
    </main>
  );
}
function ChargingScreen({ host, session, onFinish }) {
  const time = new Date(session.seconds * 1000).toISOString().slice(14, 19);
  return (
    <main className="requested-screen requested-stage">
      <Header title="Live Charging" subtitle={`${host.name} · ${host.owner}`} />
      <section className="charging-hero">
        <small>THIRD STAGE · CHARGING</small>
        <strong>
          {session.kwh.toFixed(2)} <i>kWh</i>
        </strong>
        <p>Live incremental meter · {time}</p>
      </section>
      <div className="charging-metrics">
        <span>
          Live cost<strong>₹{(session.kwh * host.tariff).toFixed(2)}</strong>
        </span>
        <span>
          Tariff<strong>₹{host.tariff}/kWh</strong>
        </span>
        <span>
          Power<strong>{host.power} kW</strong>
        </span>
      </div>
      <section className="charging-card">
        <div className="section-row">
          <b>Charging progress</b>
          <strong>{session.kwh.toFixed(2)} kWh</strong>
        </div>
        <div className="charge-track">
          <i style={{ width: `${Math.min(100, session.kwh * 3)}%` }} />
        </div>
        <p>
          Charging is running automatically. Complete when your vehicle is
          ready.
        </p>
        <button className="primary-requested" onClick={onFinish}>
          Finish Charging & Continue to Payment
        </button>
      </section>
    </main>
  );
}
function PaymentScreen({ host, total, payment, setPayment, onPay }) {
  const methods = [
    ["Google Pay", "Fast UPI 1-Tap Authorization", "wallet"],
    ["PhonePe UPI", "Linked to •••• 5590", "qr_code"],
    ["Paytm UPI", "paytm.evdriver@paytm", "contactless"],
    ["HDFC Fleet Visa", "•••• 4129 · Exp 09/28", "credit_card"],
  ];
  const platformCut = +(total * 0.08).toFixed(2);
  const hostPayout = +(total - platformCut).toFixed(2);

  return (
    <main className="requested-screen requested-stage payment-reference-screen">
      <Header
        title="Payment & Receipt"
        subtitle={`${host.name} · ${host.owner}`}
      />
      <main className="payment-reference-content">
        <div className="payment-status-pill">
          <i />
          Session Finished Successfully · 22.10 kWh Delivered
        </div>
        <section className="payment-receipt-card">
          <div className="payment-receipt-head">
            <div>
              <small>GRAND TOTAL DUE</small>
              <strong>₹ {total.toFixed(2)}</strong>
              <p>Inclusive of all taxes &amp; green cess</p>
            </div>
            <span>
              ✓ 100% Solar<small>{host.name}</small>
            </span>
          </div>
          <div className="payment-telemetry">
            <span>
              Duration<b>42 mins</b>
            </span>
            <span>
              Delivered Energy<b>22.10 kWh</b>
            </span>
            <span>
              Peak Speed<b>{host.power} kW</b>
            </span>
          </div>
          <div className="payment-split-head">
            <h2>⇄ Estimated Fee Distribution &amp; Split-Escrow</h2>
            <em>Authorized on Payment</em>
          </div>
          <div className="payment-split-flow">
            <div className="payment-split-line" />
            <div className="payment-split-row">
              <i className="platform" />
              <div>
                <strong>Platform Service Cut (8%)</strong>
                <p>VoltPulse Clean Energy Operations &amp; Grid Maintenance</p>
                <small>✓ Compliance &amp; GST included</small>
              </div>
              <b>
                ₹ {platformCut.toFixed(2)}
                <small>8.00%</small>
              </b>
            </div>
            <div className="payment-split-row host-payout">
              <i />
              <div>
                <strong>Net Payout to Host (92%)</strong>
                <p>To be credited to {host.owner}'s digital wallet</p>
                <small>
                  ϟ Direct smart-contract settlement on authorization
                </small>
              </div>
              <b>
                ₹ {hostPayout.toFixed(2)}
                <small>92.00%</small>
              </b>
            </div>
          </div>
        </section>
        <section className="payment-method-card">
          <div className="payment-section-title">
            <h2>Payment Method</h2>
            <span>⌁ 256-bit Encrypted</span>
          </div>
          <div className="payment-method-list">
            {methods.map(([method, detail, icon]) => (
              <button
                className={`payment-reference-method ${payment === method ? "active" : ""}`}
                key={method}
                onClick={() => setPayment(method)}
                type="button"
              >
                <span className="payment-method-icon">
                  {icon === "credit_card"
                    ? "▣"
                    : icon === "qr_code"
                      ? "▦"
                      : icon === "contactless"
                        ? "⌁"
                        : "◉"}
                </span>
                <span>
                  <strong>{method}</strong>
                  <small>{detail}</small>
                </span>
                <b>{payment === method ? "✓" : "Select"}</b>
              </button>
            ))}
          </div>
          <button
            className="payment-reference-primary"
            onClick={onPay}
            type="button"
          >
            ⌕ Pay ₹{total.toFixed(2)} via {payment}
          </button>
          <div className="payment-secondary-actions">
            <button type="button">⇩ Download Tax Invoice</button>
            <button type="button">★ Rate Host &amp; Socket</button>
          </div>
        </section>
        <div className="payment-guarantee">
          <span>♢</span>
          <div>
            <strong>100% Direct Payout Protocol</strong>
            <p>
              The host receives funds within 60 seconds of checkout completion
              via direct nodal settlement.
            </p>
          </div>
        </div>
      </main>
    </main>
  );
}
function HistoryScreen({ history }) {
  return (
    <main className="requested-screen requested-stage history-reference-screen">
      <Header
        title="Payment & History"
        subtitle="Invoices and completed house sessions"
      />
      <section className="history-list">
        {history.map((receipt) => (
          <article key={receipt.id}>
            <span>✓</span>
            <div>
              <b>{receipt.host}</b>
              <small>
                {receipt.date} · {receipt.kwh.toFixed(2)} kWh
              </small>
            </div>
            <strong>₹{receipt.total.toFixed(2)}</strong>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(
                  new Blob(
                    [
                      `VoltPulse Invoice ${receipt.id}\n${receipt.host}\n${receipt.kwh} kWh\nINR ${receipt.total}`,
                    ],
                    { type: "text/plain" },
                  ),
                );
                link.download = `${receipt.id}.txt`;
                link.click();
              }}
            >
              Download
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
function BottomNav({ stage, onStage }) {
  const items = [
    ["dashboard", "⌂", "Stations"],
    ["charging", "⚡", "Charging"],
    ["payment", "▣", "Payment"],
  ];
  return (
    <nav className="requested-nav">
      {items.map(([key, icon, label]) => (
        <button
          key={key}
          className={stage === key ? "active" : ""}
          onClick={() => onStage(key)}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
