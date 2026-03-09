import { useState, useEffect, useRef } from "react";

export function AuthPage({ type = "login", onAuth, onNav }) {
  const [formType, setFormType] = useState(type);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const characterRefs = useRef([]);

  const isSignup = formType === "signup";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(iv);
  }, []);

  // Update eye positions based on cursor
  useEffect(() => {
    const updateEyePositions = () => {
      characterRefs.current.forEach((charEl, idx) => {
        if (!charEl) return;
        const rect = charEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = cursorPos.x - centerX;
        const dy = cursorPos.y - centerY;
        const max = 5;
        const offsetX = Math.max(-max, Math.min(max, dx / 25));
        const offsetY = Math.max(-max, Math.min(max, dy / 25));

        const leftIris = document.getElementById(`c${idx + 1}-li`);
        const leftPupil = document.getElementById(`c${idx + 1}-lp`);
        const rightIris = document.getElementById(`c${idx + 1}-ri`);
        const rightPupil = document.getElementById(`c${idx + 1}-rp`);

        if (leftIris) {
          leftIris.setAttribute("cx", String(38 + offsetX));
          leftPupil.setAttribute("cx", String(38 + offsetX));
        }
        if (rightIris) {
          rightIris.setAttribute("cx", String(72 + offsetX));
          rightPupil.setAttribute("cx", String(72 + offsetX));
        }
      });
    };

    updateEyePositions();
  }, [cursorPos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass || (isSignup && !name)) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onAuth({ email, name: isSignup ? name : undefined, id: "user_" + Date.now() });
  };

  const togglePass = (inputId, btn) => {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "Hide";
    } else {
      input.type = "password";
      btn.textContent = "Show";
    }
  };

  return (
    <div className="auth-page">
      {/* Logo */}
      <div className="auth-logo">
        <div className="logo-dot"></div>
        TribeSpace
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        <div className="tabs">
          <div 
            className={`tab ${formType === "login" ? "active" : ""}`} 
            id="tab-login" 
            onClick={() => setFormType("login")}
          >
            Log In
          </div>
          <div 
            className={`tab ${formType === "signup" ? "active" : ""}`} 
            id="tab-signup" 
            onClick={() => setFormType("signup")}
          >
            Sign Up
          </div>
        </div>

        {formType === "login" ? (
          <div id="login-view">
            <div className="auth-title">Welcome back 👋</div>
            <div className="auth-sub">Log in to reconnect with your tribe.</div>

            <div className="field">
              <label>Email</label>
              <input 
                type="email" 
                id="login-email" 
                placeholder="you@example.com" 
                autocomplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="pass-wrap">
                <input 
                  type="password" 
                  id="login-pass" 
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button className="pass-toggle" onClick={(e) => togglePass('login-pass', e.target)}>Show</button>
              </div>
            </div>

            <div className="row-opt">
              <label className="remember">
                <input type="checkbox"/> Remember me
              </label>
              <span className="forgot">Forgot password?</span>
            </div>

            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "..." : "Log In →"}
            </button>
            <div className="divider">or</div>
            <button className="btn-google" onClick={() => onAuth({ email: "google", id: "google_" + Date.now() })}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            <div className="switch-text">
              Don't have an account? <a onClick={() => setFormType("signup")}>Sign up free</a>
            </div>
          </div>
        ) : (
          <div id="signup-view">
            <div className="auth-title">Join the tribe ✨</div>
            <div className="auth-sub">Create your account and find your people.</div>

            <div className="field">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Alex Johnson" 
                autocomplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                autocomplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="pass-wrap">
                <input 
                  type="password" 
                  id="signup-pass" 
                  placeholder="Min. 8 characters"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button className="pass-toggle" onClick={(e) => togglePass('signup-pass', e.target)}>Show</button>
              </div>
            </div>

            <button className="btn-primary" style={{marginTop:6}} onClick={handleSubmit} disabled={loading}>
              {loading ? "..." : "Create Account →"}
            </button>
            <div className="divider">or</div>
            <button className="btn-google" onClick={() => onAuth({ email: "google", id: "google_" + Date.now() })}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign up with Google
            </button>
            <div className="switch-text">
              Already have an account? <a onClick={() => setFormType("login")}>Log in</a>
            </div>
          </div>
        )}
      </div>

      {/* Characters Stage */}
      <div id="characters-stage">
        {/* Character 1: Far Left — curly hair, teal shirt */}
        <div className="char-wrap" ref={el => characterRefs.current[0] = el} style={{left:"2%",transform:"scale(0.72) rotate(-8deg)",zIndex:1}}>
          <svg width="110" height="180" viewBox="0 0 110 180">
            <ellipse cx="55" cy="155" rx="38" ry="28" fill="#26c6da"/>
            <rect x="46" y="115" width="18" height="16" rx="6" fill="#f5c5a3"/>
            <ellipse cx="55" cy="95" rx="38" ry="40" fill="#f5c5a3"/>
            <circle cx="25" cy="72" r="18" fill="#3e1f00"/>
            <circle cx="38" cy="58" r="17" fill="#3e1f00"/>
            <circle cx="55" cy="55" r="17" fill="#4a2600"/>
            <circle cx="72" cy="58" r="17" fill="#3e1f00"/>
            <circle cx="84" cy="72" r="16" fill="#3e1f00"/>
            <circle cx="22" cy="88" r="14" fill="#3e1f00"/>
            <circle cx="88" cy="88" r="14" fill="#3e1f00"/>
            <ellipse cx="17" cy="97" rx="8" ry="10" fill="#f5c5a3"/>
            <ellipse cx="93" cy="97" rx="8" ry="10" fill="#f5c5a3"/>
            <g>
              <circle cx="38" cy="95" r="13" fill="white"/>
              <circle id="c1-li" cx="38" cy="95" r="8" fill="#3b6ef8"/>
              <circle id="c1-lp" cx="38" cy="95" r="4.5" fill="#111"/>
              <circle cx="35" cy="92" r="2" fill="white"/>
              <circle cx="72" cy="95" r="13" fill="white"/>
              <circle id="c1-ri" cx="72" cy="95" r="8" fill="#3b6ef8"/>
              <circle id="c1-rp" cx="72" cy="95" r="4.5" fill="#111"/>
              <circle cx="69" cy="92" r="2" fill="white"/>
            </g>
            <path d="M 28 83 Q 38 78 48 83" stroke="#3e1f00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 62 83 Q 72 78 82 83" stroke="#3e1f00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="55" cy="107" rx="5" ry="4" fill="#e8a882"/>
            <path d="M 42 118 Q 55 128 68 118" stroke="#c07050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 93 140 Q 108 120 105 100 Q 103 88 95 82" stroke="#26c6da" strokeWidth="14" fill="none" strokeLinecap="round"/>
            <circle cx="94" cy="80" r="11" fill="#f5c5a3"/>
          </svg>
        </div>

        {/* Character 2: Left — glasses, warm skin */}
        <div className="char-wrap" ref={el => characterRefs.current[1] = el} style={{left:"14%",transform:"scale(0.82) rotate(-4deg)",zIndex:2}}>
          <svg width="120" height="190" viewBox="0 0 120 190">
            <ellipse cx="60" cy="165" rx="42" ry="28" fill="#e67e22"/>
            <rect x="50" y="123" width="20" height="16" rx="6" fill="#c68642"/>
            <ellipse cx="60" cy="103" rx="42" ry="44" fill="#c68642"/>
            <ellipse cx="60" cy="65" rx="42" ry="22" fill="#1a0a00"/>
            <ellipse cx="20" cy="88" rx="14" ry="20" fill="#1a0a00"/>
            <ellipse cx="100" cy="88" rx="14" ry="20" fill="#1a0a00"/>
            <ellipse cx="18" cy="105" rx="9" ry="11" fill="#c68642"/>
            <ellipse cx="102" cy="105" rx="9" ry="11" fill="#c68642"/>
            <g>
              <circle cx="40" cy="103" r="14" fill="white"/>
              <circle id="c2-li" cx="40" cy="103" r="8.5" fill="#6b3a00"/>
              <circle id="c2-lp" cx="40" cy="103" r="5" fill="#111"/>
              <circle cx="37" cy="100" r="2.2" fill="white"/>
              <circle cx="80" cy="103" r="14" fill="white"/>
              <circle id="c2-ri" cx="80" cy="103" r="8.5" fill="#6b3a00"/>
              <circle id="c2-rp" cx="80" cy="103" r="5" fill="#111"/>
              <circle cx="77" cy="100" r="2.2" fill="white"/>
            </g>
            <rect x="24" y="90" width="32" height="27" rx="10" fill="none" stroke="#222" strokeWidth="3"/>
            <rect x="64" y="90" width="32" height="27" rx="10" fill="none" stroke="#222" strokeWidth="3"/>
            <line x1="56" y1="103" x2="64" y2="103" stroke="#222" strokeWidth="2.5"/>
            <line x1="10" y1="98" x2="24" y2="98" stroke="#222" strokeWidth="2.5"/>
            <line x1="96" y1="98" x2="110" y2="98" stroke="#222" strokeWidth="2.5"/>
            <path d="M 28 88 Q 40 82 52 87" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 68 87 Q 80 82 92 88" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="60" cy="117" rx="5" ry="4" fill="#a05830"/>
            <path d="M 47 128 Q 60 140 73 128" stroke="#8b4513" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Character 3: Center — pink glasses, dark skin */}
        <div className="char-wrap" ref={el => characterRefs.current[2] = el} style={{left:"50%",transform:"translateX(-50%) scale(1.08)",zIndex:6}}>
          <svg width="140" height="210" viewBox="0 0 140 210">
            <ellipse cx="70" cy="185" rx="50" ry="30" fill="#9b59b6"/>
            <rect x="58" y="140" width="24" height="20" rx="7" fill="#4a2040"/>
            <ellipse cx="70" cy="118" rx="50" ry="52" fill="#4a2040"/>
            <circle cx="26" cy="88" r="22" fill="#1a0a00"/>
            <circle cx="42" cy="68" r="22" fill="#1a0a00"/>
            <circle cx="70" cy="62" r="22" fill="#1a0a00"/>
            <circle cx="98" cy="68" r="22" fill="#1a0a00"/>
            <circle cx="114" cy="88" r="20" fill="#1a0a00"/>
            <circle cx="20" cy="108" r="16" fill="#1a0a00"/>
            <circle cx="120" cy="108" r="16" fill="#1a0a00"/>
            <ellipse cx="20" cy="120" rx="10" ry="13" fill="#4a2040"/>
            <ellipse cx="120" cy="120" rx="10" ry="13" fill="#4a2040"/>
            <g>
              <circle cx="46" cy="118" r="17" fill="white"/>
              <circle id="c3-li" cx="46" cy="118" r="10" fill="#e91e63"/>
              <circle id="c3-lp" cx="46" cy="118" r="5.5" fill="#111"/>
              <circle cx="42" cy="113" r="2.5" fill="white"/>
              <circle cx="94" cy="118" r="17" fill="white"/>
              <circle id="c3-ri" cx="94" cy="118" r="10" fill="#e91e63"/>
              <circle id="c3-rp" cx="94" cy="118" r="5.5" fill="#111"/>
              <circle cx="90" cy="113" r="2.5" fill="white"/>
            </g>
            <rect x="26" y="104" width="40" height="30" rx="12" fill="none" stroke="#f06292" strokeWidth="3.5"/>
            <rect x="74" y="104" width="40" height="30" rx="12" fill="none" stroke="#f06292" strokeWidth="3.5"/>
            <line x1="66" y1="118" x2="74" y2="118" stroke="#f06292" strokeWidth="3"/>
            <path d="M 30 102 Q 46 95 62 102" stroke="#2a1020" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M 78 102 Q 94 95 110 102" stroke="#2a1020" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <ellipse cx="70" cy="136" rx="6" ry="5" fill="#3a1030"/>
            <path d="M 55 150 Q 70 164 85 150" stroke="#7b1fa2" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M 52 150 Q 70 168 88 150" fill="white" stroke="#ddd" strokeWidth="1"/>
          </svg>
        </div>

        {/* Character 4: Right — baseball cap, light skin */}
        <div className="char-wrap" ref={el => characterRefs.current[3] = el} style={{right:"22%",transform:"scale(0.88) rotate(3deg)",zIndex:4}}>
          <svg width="125" height="195" viewBox="0 0 125 195">
            <ellipse cx="62" cy="170" rx="44" ry="28" fill="#ff7043"/>
            <rect x="52" y="128" width="20" height="18" rx="6" fill="#fde0c0"/>
            <ellipse cx="62" cy="108" rx="44" ry="46" fill="#fde0c0"/>
            <ellipse cx="62" cy="70" rx="46" ry="22" fill="#ff7043"/>
            <ellipse cx="62" cy="62" rx="44" ry="18" fill="#ff7043"/>
            <ellipse cx="62" cy="56" rx="36" ry="14" fill="#e64a19"/>
            <path d="M 16 70 Q 62 80 108 70" fill="#ff7043" stroke="#e64a19" strokeWidth="1"/>
            <path d="M 16 70 Q 0 72 2 66" fill="#ff7043"/>
            <ellipse cx="18" cy="110" rx="9" ry="11" fill="#fde0c0"/>
            <ellipse cx="106" cy="110" rx="9" ry="11" fill="#fde0c0"/>
            <g>
              <circle cx="40" cy="108" r="14" fill="white"/>
              <circle id="c4-li" cx="40" cy="108" r="8.5" fill="#43a047"/>
              <circle id="c4-lp" cx="40" cy="108" r="5" fill="#111"/>
              <circle cx="37" cy="104" r="2" fill="white"/>
              <circle cx="84" cy="108" r="14" fill="white"/>
              <circle id="c4-ri" cx="84" cy="108" r="8.5" fill="#43a047"/>
              <circle id="c4-rp" cx="84" cy="108" r="5" fill="#111"/>
              <circle cx="81" cy="104" r="2" fill="white"/>
            </g>
            <path d="M 28 93 Q 40 87 52 93" stroke="#c08040" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M 72 93 Q 84 87 96 93" stroke="#c08040" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="62" cy="120" rx="5" ry="4" fill="#e8a882"/>
            <path d="M 50 132 Q 62 144 74 132" stroke="#c07050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <style>{`
        .auth-page {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 36px;
          position: relative;
          overflow: hidden;
          background: #f7f8fc;
          font-family: 'Outfit', sans-serif;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f0f14;
          letter-spacing: -0.5px;
          margin-bottom: 28px;
          z-index: 20;
        }

        .logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3b6ef8;
        }

        .auth-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 36px 40px 32px;
          width: 400px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08);
          position: relative;
          z-index: 20;
        }

        .tabs {
          display: flex;
          background: #f7f8fc;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 26px;
        }

        .tab {
          flex: 1;
          padding: 9px 0;
          text-align: center;
          font-size: 0.88rem;
          font-weight: 600;
          color: #6b7280;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.25s;
          user-select: none;
        }

        .tab.active {
          background: #ffffff;
          color: #0f0f14;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .auth-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: #0f0f14;
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .auth-sub {
          font-size: 0.82rem;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .field {
          margin-bottom: 14px;
        }

        .field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #0f0f14;
          margin-bottom: 6px;
          letter-spacing: 0.2px;
        }

        .field input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          color: #0f0f14;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .field input:focus {
          border-color: #3b6ef8;
          box-shadow: 0 0 0 4px rgba(59,110,248,0.1);
        }

        .field input::placeholder {
          color: #c0c4cc;
        }

        .pass-wrap {
          position: relative;
        }

        .pass-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          font-size: 0.75rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
        }

        .row-opt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 0.78rem;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          cursor: pointer;
        }

        .remember input {
          width: auto;
          padding: 0;
          border: none;
          box-shadow: none;
          accent-color: #3b6ef8;
        }

        .forgot {
          color: #3b6ef8;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: #0f0f14;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1e2030;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          color: #c0c4cc;
          margin-bottom: 14px;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .btn-google {
          width: 100%;
          padding: 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #0f0f14;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-google:hover {
          background: #f7f8fc;
        }

        .switch-text {
          text-align: center;
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 16px;
        }

        .switch-text a {
          color: #3b6ef8;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
        }

        #characters-stage {
          position: absolute;
          bottom: -20px;
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 220px;
          pointer-events: none;
          z-index: 10;
        }

        .char-wrap {
          position: absolute;
          bottom: 0;
          transform-origin: bottom center;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
      `}</style>
    </div>
  );
}

