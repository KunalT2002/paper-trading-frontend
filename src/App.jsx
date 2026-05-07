import { useState, useEffect, useRef, useCallback } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #080b0f;
      --surface:   #0d1117;
      --panel:     #111820;
      --border:    #1e2a38;
      --border2:   #243040;
      --text:      #e2eaf5;
      --muted:     #4a6080;
      --accent:    #00d4aa;
      --accent2:   #0099ff;
      --red:       #ff4d6d;
      --green:     #00d4aa;
      --yellow:    #f5c518;
      --font-display: 'Syne', sans-serif;
      --font-mono:    'JetBrains Mono', monospace;
    }

    html, body, #root {
      height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .fade-up { animation: fadeUp 0.4s ease both; }
    .blink   { animation: pulse 1.4s ease infinite; }

    input, select, button {
      font-family: var(--font-mono);
      font-size: 12px;
      outline: none;
      border: none;
    }

    button { cursor: pointer; transition: all 0.15s ease; }
    input  { caret-color: var(--accent); }

    /* ── RESPONSIVE ─────────────────────────────────────────── */
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* Sidebar — desktop default */
    .sidebar {
      width: 72px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20px;
      gap: 4px;
      flex-shrink: 0;
    }

    /* Main area */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    /* Top bar */
    .top-bar {
      height: 48px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      justify-content: space-between;
      flex-shrink: 0;
    }

    /* Tab content wrapper */
    .tab-content {
      flex: 1;
      overflow: hidden;
      display: flex;
    }

    /* Tab inner scroll */
    .tab-inner {
      padding: 24px 28px;
      flex: 1;
      overflow-y: auto;
    }

    /* Stat cards row */
    .stat-cards {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .stat-cards > * {
      flex: 1 1 140px;
      min-width: 0;
    }

    /* Holdings table header/row grid */
    .holdings-grid {
      display: grid;
      grid-template-columns: 1fr 80px 100px 100px 100px 80px;
      gap: 12px;
    }

    /* History/Alerts table */
    .history-grid {
      display: grid;
      grid-template-columns: 80px 1fr 80px 110px 110px 140px;
      gap: 12px;
    }

    /* Bottom nav — hidden on desktop */
    .bottom-nav {
      display: none;
    }

    /* ── TABLET (≤ 900px) ──────────────────────────────────── */
    @media (max-width: 900px) {
      .tab-inner {
        padding: 18px 16px;
      }
      .top-bar {
        padding: 0 16px;
      }
    }

    /* ── MOBILE (≤ 640px) ──────────────────────────────────── */
    @media (max-width: 640px) {
      .sidebar {
        display: none;
      }

      .bottom-nav {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: var(--surface);
        border-top: 1px solid var(--border);
        z-index: 50;
        align-items: stretch;
      }
      .bottom-nav button {
        flex: 1;
        background: transparent;
        border: none;
        border-top: 2px solid transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        color: var(--muted);
        transition: all 0.15s;
        padding: 6px 0;
        cursor: pointer;
      }
      .bottom-nav button.active {
        color: var(--accent);
        border-top-color: var(--accent);
        background: rgba(0,212,170,0.05);
      }
      .bottom-nav button span.nav-icon { font-size: 18px; }
      .bottom-nav button span.nav-label {
        font-size: 9px;
        letter-spacing: 0.05em;
        font-family: var(--font-display);
        font-weight: 600;
      }

      .app-shell {
        height: calc(100vh - 60px);
      }
      .tab-inner {
        padding: 14px 12px;
        padding-bottom: 24px;
      }
      .top-bar {
        height: 44px;
        padding: 0 12px;
      }
      .top-bar .top-title {
        font-size: 11px !important;
      }

      .stat-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 16px;
      }
      .stat-cards > * {
        flex: unset;
        min-width: unset;
      }

      .holdings-grid {
        grid-template-columns: 1fr 60px 85px 85px 85px 44px;
        gap: 6px;
      }

      .section-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 10px !important;
        margin-bottom: 16px !important;
      }
      .section-header-right {
        width: 100%;
        display: flex;
        gap: 8px;
      }
      .section-header-right > * {
        flex: 1;
      }
    }
  `}</style>
);

// ─── API LAYER ─────────────────────────────────────────────────────────────────
// Custom error for 401/403 responses
class AuthError extends Error {
  constructor(msg = "Invalid or missing API key") { super(msg); this.name = "AuthError"; }
}

function createApi(baseUrl, apiKey, onAuthError) {
  const headers = { "Content-Type": "application/json", "X-API-Key": apiKey };

  const handle = async (res) => {
    if (res.status === 401 || res.status === 403) {
      onAuthError?.();
      throw new AuthError();
    }
    return res.json();
  };

  const get  = (path)        => fetch(`${baseUrl}${path}`, { headers }).then(handle);
  const post = (path, body)  => fetch(`${baseUrl}${path}`, { method: "POST", headers, body: JSON.stringify(body) }).then(handle);
  const put  = (path, body)  => fetch(`${baseUrl}${path}`, { method: "PUT",  headers, body: JSON.stringify(body) }).then(handle);
  return { get, post, put };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt  = (n) => n == null ? "—" : `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtN = (n) => n == null ? "—" : Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sign = (n) => n >= 0 ? "+" : "";
const clr  = (n) => n == null ? "" : n >= 0 ? "var(--green)" : "var(--red)";

// ─── MARKET HOURS HELPER ──────────────────────────────────────────────────────
function isMarketOpen() {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day  = ist.getDay();
  const hour = ist.getHours();
  const min  = ist.getMinutes();
  const time = hour * 60 + min;
  const marketOpen  = 9  * 60 + 15;
  const marketClose = 15 * 60 + 30;
  const isWeekday = day >= 1 && day <= 5;
  const isInHours = time >= marketOpen && time <= marketClose;
  return isWeekday && isInHours;
}

// ─── LIVE PRICE HOOK ──────────────────────────────────────────────────────────
function useLivePrices(api, symbols, intervalMs = 15000) {
  const [prices, setPrices]   = useState({});
  const [status, setStatus]   = useState("closed");
  const intervalRef           = useRef(null);
  const marketCheckRef        = useRef(null);
  const isMounted             = useRef(true);

  const fetchAll = useCallback(async () => {
    if (!api || !symbols.length) return;
    if (!isMarketOpen()) { setStatus("closed"); return; }
    setStatus("polling");
    const results = await Promise.allSettled(
        symbols.map(sym => api.get(`/price/${sym}`))
    );
    if (!isMounted.current) return;
    const updated = {};
    let anyError = false;
    results.forEach((r, i) => {
      if (r.status === "fulfilled" && r.value?.price) {
        updated[symbols[i]] = { price: r.value.price, updatedAt: new Date() };
      } else {
        anyError = true;
      }
    });
    setPrices(prev => ({ ...prev, ...updated }));
    setStatus(anyError && Object.keys(updated).length === 0 ? "error" : "live");
  }, [api, symbols.join(",")]); // eslint-disable-line

  useEffect(() => {
    isMounted.current = true;
    if (!api || !symbols.length) return;

    const startPolling = () => {
      fetchAll();
      intervalRef.current = setInterval(fetchAll, intervalMs);
    };

    const stopPolling = () => {
      clearInterval(intervalRef.current);
      setStatus("closed");
    };

    let wasOpen = false;
    const checkMarket = () => {
      const open = isMarketOpen();
      if (open && !wasOpen) startPolling();
      if (!open && wasOpen) stopPolling();
      wasOpen = open;
      if (!open) setStatus("closed");
    };

    checkMarket();
    marketCheckRef.current = setInterval(checkMarket, 60000);

    return () => {
      isMounted.current = false;
      clearInterval(intervalRef.current);
      clearInterval(marketCheckRef.current);
    };
  }, [fetchAll, intervalMs]);

  return { prices, status };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SettingsModal({ onSave, authError }) {
  const [url, setUrl]       = useState(localStorage.getItem("pt_url") || "");
  const [key, setKey]       = useState(localStorage.getItem("pt_key") || "");
  const [uid, setUid]       = useState(localStorage.getItem("pt_uid") || "demo_user");
  const [error, setError]   = useState(authError || null);
  const [testing, setTest]  = useState(false);

  // Show incoming authError (e.g. after redirect from 401/403)
  const displayError = error || authError;

  const save = async () => {
    if (!url || !key) { setError("API URL and API Key are required."); return; }
    if (!uid || !uid.trim()) { setError("User ID is required."); return; }
    const cleanUrl = url.replace(/\/$/, "");
    const cleanUid = uid.trim();
    setTest(true);
    setError(null);
    try {
      // Step 1: verify API key is valid
      const res = await fetch(`${cleanUrl}/register?user_id=${encodeURIComponent(cleanUid)}`, {
        method: "POST",
        headers: { "X-API-Key": key, "Content-Type": "application/json" }
      });
      if (res.status === 401 || res.status === 403) {
        setError("Invalid API key. Please double-check your X-API-Key and try again.");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.detail || "Failed to connect. Check your API URL.");
        return;
      }
      // Step 2: success — persist and launch
      localStorage.setItem("pt_url", cleanUrl);
      localStorage.setItem("pt_key", key);
      localStorage.setItem("pt_uid", cleanUid);
      onSave({ url: cleanUrl, key, uid: cleanUid });
    } catch (e) {
      // Network error (e.g. Render cold start) — still save so user can retry
      localStorage.setItem("pt_url", cleanUrl);
      localStorage.setItem("pt_key", key);
      localStorage.setItem("pt_uid", cleanUid);
      onSave({ url: cleanUrl, key, uid: cleanUid });
    } finally {
      setTest(false);
    }
  };

  return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        backdropFilter: "blur(6px)"
      }}>
        <div className="fade-up" style={{
          background: "var(--panel)", border: "1px solid var(--border2)",
          borderRadius: 12, padding: "32px 36px", width: 440, maxWidth: "90vw"
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            ⚡ Connect API
          </div>
          <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: displayError ? 16 : 28 }}>
            Configure your paper trading backend
          </div>

          {/* Auth error banner */}
          {displayError && (
              <div className="fade-up" style={{
                background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.4)",
                borderRadius: 8, padding: "12px 14px", marginBottom: 20,
                display: "flex", alignItems: "flex-start", gap: 10
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>🔐</span>
                <div>
                  <div style={{ color: "var(--red)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, marginBottom: 3 }}>
                    UNAUTHORIZED
                  </div>
                  <div style={{ color: "var(--red)", fontSize: 11, opacity: 0.85 }}>{displayError}</div>
                </div>
              </div>
          )}

          {[
            { label: "API Base URL", val: url, set: setUrl, placeholder: "https://your-api.onrender.com" },
            { label: "X-API-Key",   val: key, set: setKey, placeholder: "your-secret-api-key", type: "password" },
            { label: "User ID",     val: uid, set: setUid, placeholder: "demo_user" },
          ].map(({ label, val, set, placeholder, type }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
                <input
                    value={val} onChange={e => { set(e.target.value); setError(null); }}
                    placeholder={placeholder}
                    type={type || "text"}
                    onKeyDown={e => e.key === "Enter" && save()}
                    style={{
                      width: "100%", background: "var(--surface)", border: `1px solid ${displayError && label === "X-API-Key" ? "rgba(255,77,109,0.5)" : "var(--border)"}`,
                      color: "var(--text)", borderRadius: 6, padding: "10px 12px",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = displayError && label === "X-API-Key" ? "var(--red)" : "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = displayError && label === "X-API-Key" ? "rgba(255,77,109,0.5)" : "var(--border)"}
                />
              </div>
          ))}

          <button onClick={save} disabled={testing} style={{
            marginTop: 8, width: "100%", padding: "12px 0",
            background: testing ? "var(--border2)" : "var(--accent)", color: testing ? "var(--muted)" : "#000",
            borderRadius: 8, fontWeight: 700, fontSize: 13,
            letterSpacing: "0.05em", fontFamily: "var(--font-display)",
            cursor: testing ? "not-allowed" : "pointer", transition: "all 0.2s"
          }}
                  onMouseEnter={e => { if (!testing) e.target.style.opacity = "0.85"; }}
                  onMouseLeave={e => { e.target.style.opacity = "1"; }}
          >
            {testing ? "⟳ VERIFYING KEY…" : "LAUNCH TRADING DESK →"}
          </button>
        </div>
      </div>
  );
}

const NAV_ITEMS = [
  { id: "portfolio", icon: "◈", label: "Portfolio" },
  { id: "trade",     icon: "⟁", label: "Trade" },
  { id: "price",     icon: "◎", label: "Quote" },
  { id: "history",   icon: "≡", label: "History" },
  { id: "alerts",    icon: "⚡", label: "Perf." },
];

function Sidebar({ tab, setTab }) {
  return (
      <div className="sidebar">
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--accent)", marginBottom: 24, letterSpacing: "-0.02em" }}>
          PT
        </div>
        {NAV_ITEMS.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              width: 52, height: 52, background: tab === id ? "var(--panel)" : "transparent",
              borderRadius: 10, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 3,
              border: tab === id ? "1px solid var(--border2)" : "1px solid transparent",
              color: tab === id ? "var(--accent)" : "var(--muted)",
              transition: "all 0.2s"
            }}
                    onMouseEnter={e => { if (tab !== id) e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={e => { if (tab !== id) e.currentTarget.style.color = "var(--muted)"; }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontSize: 9, letterSpacing: "0.05em", fontFamily: "var(--font-display)", fontWeight: 600 }}>{label.toUpperCase()}</span>
            </button>
        ))}
        <div style={{ marginTop: "auto", marginBottom: 16 }}>
          <div className="blink" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", margin: "0 auto" }} />
          <div style={{ fontSize: 8, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>LIVE</div>
        </div>
      </div>
  );
}

function BottomNav({ tab, setTab }) {
  return (
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setTab(id)} className={tab === id ? "active" : ""}>
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label.toUpperCase()}</span>
            </button>
        ))}
      </nav>
  );
}

function StatCard({ label, value, sub, color, delay = 0 }) {
  return (
      <div className="fade-up" style={{
        animationDelay: `${delay}ms`,
        background: "var(--panel)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "16px 20px", flex: 1, minWidth: 0
      }}>
        <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: color || "var(--text)", letterSpacing: "-0.01em" }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{sub}</div>}
      </div>
  );
}

function HoldingRow({ h, onSell, onSetLevels, liveOverride }) {
  const [expanded, setExpanded] = useState(false);
  const [sellQty, setSellQty]   = useState(1);
  const [tp, setTp]             = useState(h.target_price || "");
  const [sl, setSl]             = useState(h.stop_loss || "");
  const [flash, setFlash]       = useState(null); // "up" | "down" | null
  const prevPriceRef            = useRef(null);

  // Use live override price if available, else fall back to portfolio price
  const livePrice = liveOverride?.price ?? h.live_price;
  const invested  = h.avg_buy_price * h.quantity;
  const current   = livePrice ? livePrice * h.quantity : null;
  const pnl       = current != null ? current - invested : h.pnl;
  const pnlPct    = pnl != null && invested > 0 ? (pnl / invested) * 100 : h.pnl_percent;
  const pnlColor  = (pnl ?? 0) >= 0 ? "var(--green)" : "var(--red)";

  // Flash green/red when price changes
  useEffect(() => {
    if (!liveOverride?.price) return;
    if (prevPriceRef.current == null) { prevPriceRef.current = liveOverride.price; return; }
    if (liveOverride.price !== prevPriceRef.current) {
      const dir = liveOverride.price > prevPriceRef.current ? "up" : "down";
      setFlash(dir);
      setTimeout(() => setFlash(null), 800);
      prevPriceRef.current = liveOverride.price;
    }
  }, [liveOverride?.price]);

  const flashBg = flash === "up"
      ? "rgba(0,212,170,0.18)"
      : flash === "down"
          ? "rgba(255,77,109,0.18)"
          : null;

  return (
      <div style={{ borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div onClick={() => setExpanded(!expanded)}
             className="holdings-grid"
             style={{
               padding: "14px 20px", cursor: "pointer",
               transition: "background 0.4s",
               background: flashBg || (expanded ? "var(--panel)" : "transparent")
             }}
             onMouseEnter={e => { if (!expanded && !flash) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
             onMouseLeave={e => { if (!expanded && !flash) e.currentTarget.style.background = "transparent"; }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>{h.symbol.replace(".NS", "")}</div>
            <div style={{ color: "var(--muted)", fontSize: 10, marginTop: 2 }}>{h.company_name}</div>
            {h.alert && <div style={{ fontSize: 10, color: "var(--yellow)", marginTop: 2 }}>{h.alert}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--muted)", fontSize: 10 }}>QTY</div>
            <div style={{ fontWeight: 500 }}>{h.quantity}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--muted)", fontSize: 10 }}>AVG</div>
            <div>{fmt(h.avg_buy_price)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--muted)", fontSize: 10 }}>LTP</div>
            <div style={{ color: flash === "up" ? "var(--green)" : flash === "down" ? "var(--red)" : "var(--text)", transition: "color 0.4s", fontWeight: 600 }}>
              {livePrice ? fmt(livePrice) : <span style={{ color: "var(--muted)" }}>—</span>}
            </div>
            {liveOverride?.updatedAt && (
                <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>
                  {liveOverride.updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--muted)", fontSize: 10 }}>P&L</div>
            <div style={{ color: pnlColor, fontWeight: 600 }}>
              {pnl != null ? `${sign(pnl)}${fmtN(pnl)}` : "—"}
            </div>
            {pnlPct != null && (
                <div style={{ fontSize: 10, color: pnlColor }}>{sign(pnlPct)}{pnlPct?.toFixed(2)}%</div>
            )}
          </div>
          <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 18 }}>{expanded ? "▲" : "▼"}</div>
        </div>

        {expanded && (
            <div className="fade-up" style={{ background: "var(--surface)", padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {/* Quick Sell */}
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 10 }}>QUICK SELL</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" value={sellQty} onChange={e => setSellQty(+e.target.value)}
                           min={1} max={h.quantity}
                           style={{
                             width: 80, background: "var(--panel)", border: "1px solid var(--border)",
                             color: "var(--text)", borderRadius: 6, padding: "8px 10px"
                           }} />
                    <button onClick={() => onSell(h.symbol, sellQty)} style={{
                      flex: 1, background: "var(--red)", color: "#fff", borderRadius: 6,
                      fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 12
                    }}
                            onMouseEnter={e => e.target.style.opacity = 0.8}
                            onMouseLeave={e => e.target.style.opacity = 1}
                    >
                      SELL {sellQty} SHARES
                    </button>
                  </div>
                </div>
                {/* Set Levels */}
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 10 }}>TARGET / STOP LOSS</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="number" placeholder="Target ₹" value={tp} onChange={e => setTp(e.target.value)}
                           style={{
                             flex: 1, background: "var(--panel)", border: "1px solid var(--border)",
                             color: "var(--green)", borderRadius: 6, padding: "8px 10px"
                           }} />
                    <input type="number" placeholder="SL ₹" value={sl} onChange={e => setSl(e.target.value)}
                           style={{
                             flex: 1, background: "var(--panel)", border: "1px solid var(--border)",
                             color: "var(--red)", borderRadius: 6, padding: "8px 10px"
                           }} />
                    <button onClick={() => onSetLevels(h.symbol, tp || null, sl || null)} style={{
                      padding: "0 14px", background: "var(--accent2)", color: "#fff", borderRadius: 6,
                      fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 11
                    }}
                            onMouseEnter={e => e.target.style.opacity = 0.8}
                            onMouseLeave={e => e.target.style.opacity = 1}
                    >SET</button>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 20, color: "var(--muted)", fontSize: 11, flexWrap: "wrap" }}>
                <span>Current TP: <span style={{ color: "var(--green)" }}>{h.target_price ? fmt(h.target_price) : "—"}</span></span>
                <span>Current SL: <span style={{ color: "var(--red)" }}>{h.stop_loss ? fmt(h.stop_loss) : "—"}</span></span>
                <span>Invested: <span style={{ color: "var(--text)" }}>{fmt(invested)}</span></span>
                <span>Current: <span style={{ color: "var(--text)" }}>{fmt(current ?? h.current_value)}</span></span>
                {h.bought_at && (
                    <span>Bought on: <span style={{ color: "var(--text)" }}>
                {new Date(h.bought_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span></span>
                )}
              </div>
            </div>
        )}
      </div>
  );
}

function PortfolioTab({ api, userId }) {
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(false);
  const [toast, setToast]   = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoad(true);
    try {
      const r = await api.get(`/portfolio/${userId}`);
      if (r.detail) throw new Error(r.detail);
      setData(r);
    } catch (e) { showToast(e.message, false); }
    finally { setLoad(false); }
  }, [api, userId]);

  useEffect(() => { load(); }, [load]);

  // Extract symbols from holdings for live polling
  const symbols = data?.holdings?.filter(h => !h.alert || h.alert === "Price unavailable").map(h => h.symbol) ?? [];
  const { prices: livePrices, status: liveStatus } = useLivePrices(api, symbols, 15000);

  // Recompute summary totals using live prices
  const computedSummary = (() => {
    if (!data?.summary) return null;
    const s = data.summary;
    if (!data.holdings?.length || Object.keys(livePrices).length === 0) return s;
    let totalCurrent = 0;
    let totalInvested = 0;
    data.holdings
        .filter(h => !h.alert || h.alert === "Price unavailable")
        .forEach(h => {
          const lp = livePrices[h.symbol]?.price ?? h.live_price;
          totalInvested += h.avg_buy_price * h.quantity;
          totalCurrent  += (lp ?? h.avg_buy_price) * h.quantity;
        });
    const totalPnl = totalCurrent - totalInvested;
    return {
      ...s,
      total_invested: totalInvested,
      total_current_value: totalCurrent,
      total_pnl: totalPnl,
      portfolio_value: s.cash_balance + totalCurrent,
    };
  })();

  const s = computedSummary;

  const handleSell = async (symbol, qty) => {
    try {
      const r = await api.post("/sell", { user_id: userId, symbol, quantity: qty });
      if (r.detail) throw new Error(r.detail);
      showToast(`Sold ${qty} × ${symbol.replace(".NS","")} @ ${fmt(r.trade.price)}`);
      load();
    } catch (e) { showToast(e.message, false); }
  };

  const handleLevels = async (symbol, tp, sl) => {
    try {
      const r = await api.put("/levels", { user_id: userId, symbol, target_price: tp ? +tp : null, stop_loss: sl ? +sl : null });
      if (r.detail) throw new Error(r.detail);
      showToast("Levels updated ✓");
      load();
    } catch (e) { showToast(e.message, false); }
  };

  const statusDot = {
    closed:  { color: "var(--muted)",  label: "MARKET CLOSED" },
    idle:    { color: "var(--muted)",  label: "IDLE" },
    polling: { color: "var(--yellow)", label: "UPDATING" },
    live:    { color: "var(--green)",  label: "LIVE" },
    error:   { color: "var(--red)",    label: "ERROR" },
  }[liveStatus] ?? { color: "var(--muted)", label: "" };

  return (
      <div className="tab-inner">
        <div className="section-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Portfolio
            </div>
            <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>{userId} · NSE Paper Trading</div>
          </div>
          <div className="section-header-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Live polling status */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%", background: statusDot.color,
                boxShadow: liveStatus === "live" ? `0 0 6px ${statusDot.color}` : "none",
                animation: liveStatus === "polling" ? "pulse 0.8s ease infinite" : liveStatus === "live" ? "pulse 2s ease infinite" : "none"
              }} />
              <span style={{ fontSize: 10, color: statusDot.color, fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.08em" }}>
              {statusDot.label}
            </span>
              {liveStatus === "live" && (
                  <span style={{ fontSize: 9, color: "var(--muted)" }}>· auto 15s</span>
              )}
            </div>
            <button onClick={load} disabled={loading} style={{
              padding: "8px 16px", background: "var(--panel)", border: "1px solid var(--border)",
              color: loading ? "var(--muted)" : "var(--text)", borderRadius: 8,
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11
            }}>
              {loading ? "⟳ LOADING…" : "⟳ REFRESH"}
            </button>
          </div>
        </div>

        {/* Stats */}
        {s && (
            <div className="stat-cards">
              <StatCard label="Portfolio Value"  value={fmt(s.portfolio_value)}     delay={0} />
              <StatCard label="Cash Available"   value={fmt(s.cash_balance)}         delay={60} />
              <StatCard label="Total Invested"   value={fmt(s.total_invested)}       delay={120} />
              <StatCard label="Unrealised P&L"   value={`${sign(s.total_pnl)}${fmtN(s.total_pnl)}`}
                        color={clr(s.total_pnl)}
                        sub={s.total_invested > 0 ? `${sign(s.total_pnl / s.total_invested * 100)}${(s.total_pnl / s.total_invested * 100).toFixed(2)}%` : null}
                        delay={180} />
            </div>
        )}

        {/* Holdings Table */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div className="holdings-grid"
               style={{
                 padding: "10px 20px",
                 background: "var(--panel)", borderBottom: "1px solid var(--border)",
                 fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em"
               }}>
            <div>SYMBOL</div>
            <div style={{ textAlign: "right" }}>QTY</div>
            <div style={{ textAlign: "right" }}>AVG COST</div>
            <div style={{ textAlign: "right" }}>LIVE PRICE</div>
            <div style={{ textAlign: "right" }}>P&L</div>
            <div />
          </div>

          {loading && !data && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                <div className="blink">Fetching live prices…</div>
              </div>
          )}

          {(data?.holdings?.filter(h => !h.alert || h.alert === "Price unavailable").length === 0) && !loading && data && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                No holdings yet. Go buy some stocks! ↗
              </div>
          )}

          {data?.holdings
              ?.filter(h => !h.alert || h.alert === "Price unavailable")
              .map(h => (
                  <HoldingRow key={h.id} h={h} onSell={handleSell} onSetLevels={handleLevels}
                              liveOverride={livePrices[h.symbol] ?? null}
                  />
              ))}
        </div>

        {/* Toast */}
        {toast && (
            <div style={{
              position: "fixed", bottom: 24, right: 24,
              background: toast.ok ? "var(--green)" : "var(--red)",
              color: "#000", padding: "12px 20px", borderRadius: 8,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
              zIndex: 200, animation: "fadeUp 0.3s ease"
            }}>
              {toast.msg}
            </div>
        )}
      </div>
  );
}

function TradeTab({ api, userId }) {
  const [symbol, setSymbol]   = useState("");
  const [qty, setQty]         = useState(1);
  const [tp, setTp]           = useState("");
  const [sl, setSl]           = useState("");
  const [quote, setQuote]     = useState(null);
  const [loading, setLoad]    = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchQuote = async () => {
    if (!symbol) return;
    setLoad(true);
    try {
      const r = await api.get(`/price/${symbol.trim().toUpperCase()}`);
      if (r.detail) throw new Error(r.detail);
      setQuote(r);
    } catch (e) { showToast(e.message, false); setQuote(null); }
    finally { setLoad(false); }
  };

  const handleBuy = async () => {
    if (!symbol || qty <= 0) return;
    setLoad(true);
    try {
      const body = { user_id: userId, symbol: symbol.trim().toUpperCase(), quantity: +qty };
      if (tp) body.target_price = +tp;
      if (sl) body.stop_loss = +sl;
      const r = await api.post("/buy", body);
      if (r.detail) throw new Error(r.detail);
      showToast(`✓ Bought ${r.trade.quantity} × ${r.trade.symbol.replace(".NS","")} @ ${fmt(r.trade.price)}`);
      setQuote(null); setSymbol(""); setQty(1); setTp(""); setSl("");
    } catch (e) { showToast(e.message, false); }
    finally { setLoad(false); }
  };

  const total = quote ? quote.price * qty : null;

  const popular = [
    "ADANIENT","ADANIPORTS","APOLLOHOSP","ASIANPAINT","AXISBANK",
    "BAJAJ-AUTO","BAJFINANCE","BAJAJFINSV","BPCL","BHARTIARTL",
    "BRITANNIA","CIPLA","COALINDIA","DIVISLAB","DRREDDY",
    "EICHERMOT","GRASIM","HCLTECH","HDFCBANK","HDFCLIFE",
    "HEROMOTOCO","HINDALCO","HINDUNILVR","ICICIBANK","ITC",
    "INDUSINDBK","INFY","JSWSTEEL","KOTAKBANK","LTIM",
    "LT","MARUTI","NTPC","NESTLEIND","ONGC",
    "POWERGRID","RELIANCE","SBILIFE","SHRIRAMFIN","SBIN",
    "SUNPHARMA","TCS","TATACONSUM","TATAMOTORS","TATASTEEL",
    "TECHM","TITAN","ULTRACEMCO","WIPRO","ZOMATO"
  ];

  return (
      <div className="tab-inner">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Buy Order
        </div>
        <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 28 }}>NSE stocks · virtual money</div>

        {/* Popular stocks */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>
            Popular Stocks
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {popular.map(s => (
                <button key={s} onClick={() => { setSymbol(s); setQuote(null); }}
                        style={{
                          padding: "5px 12px", borderRadius: 20,
                          background: symbol === s ? "var(--accent)" : "var(--panel)",
                          border: `1px solid ${symbol === s ? "var(--accent)" : "var(--border)"}`,
                          color: symbol === s ? "#000" : "var(--text)",
                          fontWeight: symbol === s ? 700 : 400,
                          fontFamily: "var(--font-display)", fontSize: 11
                        }}>
                  {s}
                </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "24px", maxWidth: 540
        }}>
          {/* Symbol + Quote */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 8 }}>SYMBOL</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                  value={symbol} onChange={e => { setSymbol(e.target.value.toUpperCase()); setQuote(null); }}
                  placeholder="e.g. RELIANCE"
                  onKeyDown={e => e.key === "Enter" && fetchQuote()}
                  style={{
                    flex: 1, background: "var(--panel)", border: "1px solid var(--border)",
                    color: "var(--text)", borderRadius: 8, padding: "11px 14px", fontSize: 14,
                    fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.05em"
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <button onClick={fetchQuote} disabled={!symbol || loading} style={{
                padding: "0 20px", background: "var(--accent2)", color: "#fff",
                borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                opacity: (!symbol || loading) ? 0.5 : 1
              }}>
                {loading ? "…" : "GET QUOTE"}
              </button>
            </div>
          </div>

          {/* Quote display */}
          {quote && (
              <div className="fade-up" style={{
                background: "var(--panel)", border: "1px solid var(--border2)",
                borderRadius: 8, padding: "14px 16px", marginBottom: 20,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{quote.company}</div>
                  <div style={{ color: "var(--muted)", fontSize: 11 }}>{quote.symbol}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>
                    {fmt(quote.price)}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>LIVE NSE</div>
                </div>
              </div>
          )}

          {/* Qty */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 8 }}>QUANTITY</div>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} min={1}
                   style={{
                     width: "100%", background: "var(--panel)", border: "1px solid var(--border)",
                     color: "var(--text)", borderRadius: 8, padding: "11px 14px",
                     fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 600
                   }}
                   onFocus={e => e.target.style.borderColor = "var(--accent)"}
                   onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* Target + SL */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "TARGET PRICE (optional)", val: tp, set: setTp, color: "var(--green)" },
              { label: "STOP LOSS (optional)",    val: sl, set: setSl, color: "var(--red)" },
            ].map(({ label, val, set, color }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>
                  <input type="number" placeholder="₹" value={val} onChange={e => set(e.target.value)}
                         style={{
                           width: "100%", background: "var(--panel)", border: `1px solid var(--border)`,
                           color, borderRadius: 8, padding: "10px 12px"
                         }}
                         onFocus={e => e.target.style.borderColor = color}
                         onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
            ))}
          </div>

          {/* Total & Buy */}
          {total && (
              <div style={{ marginBottom: 16, padding: "12px 16px", background: "var(--panel)", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Order Value</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text)" }}>{fmt(total)}</span>
              </div>
          )}

          <button onClick={handleBuy} disabled={!symbol || !qty || loading} style={{
            width: "100%", padding: "14px 0",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            color: "#000", borderRadius: 8,
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14,
            letterSpacing: "0.05em",
            opacity: (!symbol || !qty || loading) ? 0.5 : 1,
            transition: "opacity 0.2s, transform 0.1s"
          }}
                  onMouseEnter={e => { if (symbol && qty && !loading) e.target.style.transform = "scale(1.01)"; }}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            {loading ? "PLACING ORDER…" : "BUY NOW →"}
          </button>
        </div>

        {toast && (
            <div style={{
              position: "fixed", bottom: 24, right: 24,
              background: toast.ok ? "var(--green)" : "var(--red)",
              color: "#000", padding: "12px 20px", borderRadius: 8,
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
              zIndex: 200, animation: "fadeUp 0.3s ease"
            }}>
              {toast.msg}
            </div>
        )}
      </div>
  );
}

function QuoteTab({ api }) {
  const [symbol, setSymbol] = useState("");
  const [quote, setQuote]   = useState(null);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState(null);

  const fetch = async () => {
    if (!symbol) return;
    setLoad(true); setError(null); setQuote(null);
    try {
      const r = await api.get(`/price/${symbol.trim().toUpperCase()}`);
      if (r.detail) throw new Error(r.detail);
      setQuote(r);
    } catch (e) { setError(e.message); }
    finally { setLoad(false); }
  };

  return (
      <div className="tab-inner">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Live Quote
        </div>
        <div style={{ color: "var(--muted)", fontSize: 11, marginBottom: 28 }}>Real-time NSE price via Yahoo Finance</div>

        <div style={{ maxWidth: 480 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())}
                   placeholder="Enter NSE symbol (e.g. TCS)"
                   onKeyDown={e => e.key === "Enter" && fetch()}
                   style={{
                     flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
                     color: "var(--text)", borderRadius: 8, padding: "12px 16px",
                     fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 700
                   }}
                   onFocus={e => e.target.style.borderColor = "var(--accent)"}
                   onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <button onClick={fetch} disabled={!symbol || loading} style={{
              padding: "0 24px", background: "var(--accent)", color: "#000",
              borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: 13, opacity: (!symbol || loading) ? 0.5 : 1
            }}>
              {loading ? "…" : "FETCH"}
            </button>
          </div>

          {error && <div style={{ color: "var(--red)", fontSize: 12, marginBottom: 16 }}>{error}</div>}

          {quote && (
              <div className="fade-up" style={{
                background: "var(--surface)", border: "1px solid var(--border2)",
                borderRadius: 12, padding: "28px 28px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800 }}>{quote.company}</div>
                    <div style={{ color: "var(--muted)", marginTop: 4, fontSize: 12 }}>{quote.symbol} · NSE</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.02em" }}>
                      {fmt(quote.price)}
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: 20, padding: "12px 0", borderTop: "1px solid var(--border)",
                  fontSize: 11, color: "var(--muted)", display: "flex", gap: 20
                }}>
                  <span className="blink">● LIVE</span>
                  <span>Yahoo Finance / NSE Data</span>
                  <span>{new Date().toLocaleTimeString("en-IN")}</span>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

function HistoryTab({ api, userId }) {
  const [trades, setTrades] = useState(null);
  const [loading, setLoad]  = useState(false);

  const load = useCallback(async () => {
    setLoad(true);
    try {
      const r = await api.get(`/trades/${userId}`);
      setTrades(r.trades || []);
    } catch (e) { console.error(e); }
    finally { setLoad(false); }
  }, [api, userId]);

  useEffect(() => { load(); }, [load]);

  return (
      <div className="tab-inner">
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Trade History</div>
            <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>{trades?.length ?? "…"} trades</div>
          </div>
          <div className="section-header-right">
            <button onClick={load} style={{
              padding: "8px 16px", background: "var(--panel)", border: "1px solid var(--border)",
              color: "var(--text)", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11
            }}>⟳ REFRESH</button>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div className="history-grid"
               style={{
                 padding: "10px 20px",
                 background: "var(--panel)", borderBottom: "1px solid var(--border)",
                 fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em"
               }}>
            <div>TYPE</div>
            <div>SYMBOL</div>
            <div style={{ textAlign: "right" }}>QTY</div>
            <div style={{ textAlign: "right" }}>PRICE</div>
            <div style={{ textAlign: "right" }}>TOTAL</div>
            <div style={{ textAlign: "right" }}>TIME</div>
          </div>

          {loading && !trades && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                <div className="blink">Loading trades…</div>
              </div>
          )}

          {trades?.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                No trades yet. Make your first trade! →
              </div>
          )}

          {trades?.map((t, i) => (
              <div key={t.id} className="fade-up history-grid" style={{
                padding: "13px 20px", borderBottom: "1px solid var(--border)",
                animationDelay: `${Math.min(i * 30, 300)}ms`
              }}>
                <div>
              <span style={{
                padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                fontFamily: "var(--font-display)",
                background: t.trade_type === "BUY" ? "rgba(0,212,170,0.15)" : "rgba(255,77,109,0.15)",
                color: t.trade_type === "BUY" ? "var(--green)" : "var(--red)"
              }}>{t.trade_type}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{t.symbol.replace(".NS","")}</div>
                  <div style={{ color: "var(--muted)", fontSize: 10 }}>{t.company_name}</div>
                </div>
                <div style={{ textAlign: "right" }}>{t.quantity}</div>
                <div style={{ textAlign: "right" }}>{fmt(t.price)}</div>
                <div style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 600 }}>{fmt(t.total_amount)}</div>
                <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 11 }}>
                  {new Date(t.traded_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

function AlertsTab({ api, userId }) {
  const [alerts, setAlerts] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoad]  = useState(false);

  const load = useCallback(async () => {
    setLoad(true);
    try {
      const [ra, rt] = await Promise.all([
        api.get(`/alerts/${userId}`),
        api.get(`/trades/${userId}`),
      ]);
      setAlerts(ra.alerts || []);
      setTrades(rt.trades  || []);
    } catch (e) { console.error(e); }
    finally { setLoad(false); }
  }, [api, userId]);

  useEffect(() => { load(); }, [load]);

  const typeStyle = (type) => type === "TARGET_HIT"
      ? { bg: "rgba(0,212,170,0.12)", color: "var(--green)", label: "TARGET HIT 🎯" }
      : { bg: "rgba(255,77,109,0.12)", color: "var(--red)",   label: "STOP LOSS HIT ⚠️" };

  // For each alert find the matching BUY and SELL trades by proximity to triggered_at.
  // Works for both past manual transactions and new auto-exit sells.
  const getTradeInfo = (symbol, triggeredAt) => {
    const sym       = symbol.replace(".NS", "");
    const alertTime = triggeredAt ? new Date(triggeredAt) : null;
    const bySymbol  = trades.filter(t => t.symbol.replace(".NS", "") === sym);

    // Most recent BUY on or before the alert time
    const buys = bySymbol
        .filter(t => t.trade_type === "BUY" && (!alertTime || new Date(t.traded_at) <= alertTime))
        .sort((a, b) => new Date(b.traded_at) - new Date(a.traded_at));

    // Closest SELL to the alert time — could be before (manual sell) or after (auto-exit)
    const sells = bySymbol
        .filter(t => t.trade_type === "SELL")
        .sort((a, b) => {
          const distA = alertTime ? Math.abs(new Date(a.traded_at) - alertTime) : 0;
          const distB = alertTime ? Math.abs(new Date(b.traded_at) - alertTime) : 0;
          return distA - distB;
        });

    return { buy: buys[0] || null, sell: sells[0] || null };
  };

  const fmtDT = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  };

  // grid: TYPE | SYMBOL | SET AT | HIT PRICE | QTY | BUY PRICE | BUY DATE & TIME | SELL PRICE | SELL DATE & TIME
  const COLS = "150px 180px 110px 120px 60px 110px 160px 110px 160px";
  const MIN_W = 1200;

  return (
      <div className="tab-inner">
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Performance</div>
            <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>
              {alerts == null ? "…" : alerts.length} events · auto-exited trades from target & stop-loss hits
            </div>
          </div>
          <div className="section-header-right">
            <button onClick={load} style={{
              padding: "8px 16px", background: "var(--panel)", border: "1px solid var(--border)",
              color: "var(--text)", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 11
            }}>⟳ REFRESH</button>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", overflowX: "auto" }}>
          {/* Header row */}
          <div style={{
            display: "grid", gridTemplateColumns: COLS,
            alignItems: "center",
            gap: 8, padding: "10px 20px",
            background: "var(--panel)", borderBottom: "1px solid var(--border)",
            fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em",
            minWidth: MIN_W,
          }}>
            <div>TYPE</div>
            <div>SYMBOL</div>
            <div style={{ textAlign: "right" }}>SET AT</div>
            <div style={{ textAlign: "right" }}>HIT PRICE</div>
            <div style={{ textAlign: "right" }}>QTY</div>
            <div style={{ textAlign: "right", color: "var(--accent2)" }}>BUY PRICE</div>
            <div style={{ textAlign: "right", color: "var(--accent2)" }}>BUY DATE & TIME</div>
            <div style={{ textAlign: "right", color: "var(--red)" }}>SELL PRICE</div>
            <div style={{ textAlign: "right", color: "var(--red)" }}>SELL DATE & TIME</div>
          </div>

          {loading && !alerts && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                <div className="blink">Loading alerts…</div>
              </div>
          )}

          {alerts?.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                No alerts yet. Set a target or stop-loss on your holdings and they'll appear here when hit.
              </div>
          )}

          {alerts?.map((a, i) => {
            const ts = typeStyle(a.alert_type);
            const { buy, sell } = getTradeInfo(a.symbol, a.triggered_at);
            return (
                <div key={a.id} className="fade-up" style={{
                  display: "grid", gridTemplateColumns: COLS,
                  alignItems: "center",
                  gap: 8, padding: "11px 20px", borderBottom: "1px solid var(--border)",
                  animationDelay: `${Math.min(i * 30, 300)}ms`,
                  minWidth: MIN_W,
                }}>
                  {/* TYPE */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{
                  padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                  fontFamily: "var(--font-display)", whiteSpace: "nowrap",
                  background: ts.bg, color: ts.color
                }}>{ts.label}</span>
                  </div>

                  {/* SYMBOL */}
                  <div style={{ overflow: "hidden" }}>
                    <div style={{
                      fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                    }}>
                      {a.symbol.replace(".NS", "")}
                    </div>
                    <div style={{
                      color: "var(--muted)", fontSize: 10, marginTop: 2,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                    }}>{a.company_name}</div>
                  </div>

                  {/* SET AT (trigger_price) */}
                  <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 11, whiteSpace: "nowrap" }}>
                    {fmt(a.trigger_price)}
                  </div>

                  {/* HIT PRICE */}
                  <div style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 600, color: ts.color, whiteSpace: "nowrap" }}>
                    {fmt(a.hit_price)}
                  </div>

                  {/* QUANTITY */}
                  <div style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--text)" }}>
                    {buy ? buy.quantity : sell ? sell.quantity : <span style={{ color: "var(--muted)" }}>—</span>}
                  </div>

                  {/* BUY PRICE */}
                  <div style={{ textAlign: "right", fontSize: 11, color: "var(--accent2)", fontFamily: "var(--font-display)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {buy ? fmt(buy.price) : <span style={{ color: "var(--muted)" }}>—</span>}
                  </div>

                  {/* BUY DATE & TIME */}
                  <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 10, whiteSpace: "nowrap" }}>
                    {buy ? fmtDT(buy.traded_at) : "—"}
                  </div>

                  {/* SELL PRICE — use hit_price from alert (auto-exit) or matched SELL trade (manual) */}
                  <div style={{ textAlign: "right", fontSize: 11, color: "var(--red)", fontFamily: "var(--font-display)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {a.hit_price ? fmt(a.hit_price) : sell ? fmt(sell.price) : <span style={{ color: "var(--muted)" }}>—</span>}
                  </div>

                  {/* SELL DATE & TIME — use triggered_at from alert (auto-exit) or matched SELL trade (manual) */}
                  <div style={{ textAlign: "right", color: "var(--muted)", fontSize: 10, whiteSpace: "nowrap" }}>
                    {a.triggered_at ? fmtDT(a.triggered_at) : sell ? fmtDT(sell.traded_at) : "—"}
                  </div>
                </div>
            );
          })}
        </div>
      </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [config, setConfig] = useState(null);
  const [checking, setChecking] = useState(true); // verifying saved credentials on load
  const [tab, setTab]           = useState("portfolio");
  const [authError, setAuthError] = useState(null);

  // On mount: if localStorage has credentials, verify the user actually exists in DB
  useEffect(() => {
    const url = localStorage.getItem("pt_url");
    const key = localStorage.getItem("pt_key");
    const uid = localStorage.getItem("pt_uid");
    if (!url || !key || !uid) {
      setChecking(false);
      return;
    }
    // Verify user exists — GET /portfolio/:uid returns 404 if user was deleted
    fetch(`${url}/portfolio/${uid}`, {
      headers: { "X-API-Key": key, "Content-Type": "application/json" }
    })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            // Bad key
            localStorage.clear();
            setAuthError("Invalid or expired API key. Please check your credentials.");
            setChecking(false);
          } else if (res.status === 404) {
            // User was deleted from DB — force them back to login
            localStorage.clear();
            setChecking(false);
          } else if (res.ok) {
            // All good, restore session
            setConfig({ url, key, uid });
            setChecking(false);
          } else {
            // Unknown error, clear to be safe
            localStorage.clear();
            setChecking(false);
          }
        })
        .catch(() => {
          // Network error (server cold start etc.) — restore session optimistically
          setConfig({ url, key, uid });
          setChecking(false);
        });
  }, []);

  const handleAuthError = () => {
    localStorage.clear();
    setConfig(null);
    setAuthError("Invalid or expired API key. Please check your credentials and try again.");
  };

  const api = config ? createApi(config.url, config.key, handleAuthError) : null;

  // Show nothing while we verify saved credentials
  if (checking) return (
      <>
        <GlobalStyle />
        <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
          <span className="blink">Verifying session…</span>
        </div>
      </>
  );

  if (!config) return (
      <>
        <GlobalStyle />
        <SettingsModal onSave={(cfg) => { setAuthError(null); setConfig(cfg); }} authError={authError} />
      </>
  );

  return (
      <>
        <GlobalStyle />
        <div className="app-shell">
          <Sidebar tab={tab} setTab={setTab} />

          {/* Main content */}
          <div className="main-area">
            {/* Top bar */}
            <div className="top-bar">
              <div className="top-title" style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em" }}>
                PAPER TRADING DESK · NSE
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  <span style={{ color: "var(--text)" }}>{config.uid}</span>
                </div>
                <button onClick={() => { localStorage.clear(); setConfig(null); }} style={{
                  fontSize: 10, color: "var(--muted)", background: "transparent",
                  border: "1px solid var(--border)", borderRadius: 4, padding: "3px 8px",
                  letterSpacing: "0.05em"
                }}>
                  SETTINGS
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="tab-content">
              {tab === "portfolio" && <PortfolioTab api={api} userId={config.uid} />}
              {tab === "trade"     && <TradeTab api={api} userId={config.uid} />}
              {tab === "price"     && <QuoteTab api={api} />}
              {tab === "history"   && <HistoryTab api={api} userId={config.uid} />}
              {tab === "alerts"    && <AlertsTab api={api} userId={config.uid} />}
            </div>
          </div>
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </>
  );
}
