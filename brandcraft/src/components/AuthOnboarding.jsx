import { useState } from "react";
import { YetiCharacter } from "./YetiCharacter";

// ─── Auth Page ─────────────────────────────────────────────────────────────────
export function AuthPage({ type, onAuth, onNav }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = type === "signup";

  const handleSubmit = async () => {
    if (!email || !pass) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onAuth({ email, id: "user_" + Date.now() });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, #080B14 0%, #0D1120 50%, #111827 100%)", position: "relative", overflow: "hidden" }}>
      {/* Decorative orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(78,205,196,0.05), transparent 70%)", top: -100, left: -100 }} />
      <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(135,206,235,0.08), transparent 70%)", bottom: -50, right: -50 }} />

      {/* Left Panel - Yeti */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #E8F4F8 0%, #87CEEB 50%, #4A90E2 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: 40,
        }}
      >
        {/* Sky gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(ellipse at center top, rgba(255,255,255,0.3), rgba(135,206,235,0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Yeti Character */}
        <div style={{ width: "100%", maxWidth: "400px", height: "400px", position: "relative", zIndex: 1 }}>
          <YetiCharacter />
        </div>

        {/* Footer text */}
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            position: "relative",
            zIndex: 2,
            color: "#1e5a96",
            fontWeight: 700,
            fontSize: 18,
            fontFamily: "Syne, sans-serif",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: "0 2px 4px rgba(255,255,255,0.3)",
          }}
        >
          EXPLORE. LEARN.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 40,
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            animation: "fadeSlideIn 0.5s ease",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "Syne",
                fontSize: 22,
                fontWeight: 800,
                background: "linear-gradient(135deg, #87CEEB, #4ECDC4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 8,
              }}
            >
              BrandCraft
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>
              {isSignup ? "Start building your brand today" : "Sign in to your workspace"}
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => onAuth({ email: "demo@brandcraft.ai", id: "demo_user" }), 600);
            }}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              color: "var(--text)",
              fontFamily: "DM Sans",
              fontSize: 15,
              cursor: "pointer",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--teal)";
              e.currentTarget.style.background = "var(--teal-glow)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--card)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ color: "var(--text3)", fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <input
            className="input-base"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <input
            className="input-base"
            type="password"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            style={{ marginBottom: 24 }}
          />
          <button
            className="btn-primary"
            style={{ width: "100%", fontSize: 16, padding: "14px" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading…" : isSignup ? "Create Account" : "Sign In"}
          </button>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text2)", fontSize: 14 }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span
              style={{ color: "var(--teal)", cursor: "pointer" }}
              onClick={() => onNav(isSignup ? "login" : "signup")}
            >
              {isSignup ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Onboarding Page ───────────────────────────────────────────────────────────
export function OnboardingPage({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    business: "", industry: "", stage: "", ageGroup: [], gender: "",
    colorMood: "", logoStyle: "", aesthetic: "", imagery: "",
    sliders: { playfulness: 50, boldness: 50, modernity: 50 },
    voice: "", goals: [],
  });

  const total = 12;
  const update = (key, val) => setAnswers(p => ({ ...p, [key]: val }));
  const toggleArr = (key, val) => setAnswers(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }));

  const steps = [
    {
      q: "What does your business do?",
      content: <textarea className="input-base" rows={4} placeholder="Describe your business, products or services..." value={answers.business} onChange={e => update("business", e.target.value)} style={{ resize: "none" }} />
    },
    {
      q: "What industry are you in?",
      content: (
        <select className="select-base" value={answers.industry} onChange={e => update("industry", e.target.value)}>
          <option value="">Select industry...</option>
          {["Fashion","Tech","Food & Beverage","Health & Wellness","Finance","Education","Entertainment","E-commerce","Real Estate","Sports"].map(i => <option key={i}>{i}</option>)}
        </select>
      )
    },
    {
      q: "What stage is your business at?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Idea","Startup","Growing","Established"].map(s => (
            <span key={s} className={`pill ${answers.stage === s ? "active" : ""}`} onClick={() => update("stage", s)}>{s}</span>
          ))}
        </div>
      )
    },
    {
      q: "Who is your target age group?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Gen Z","Millennial","Gen X","Boomer","All"].map(a => (
            <span key={a} className={`pill ${answers.ageGroup.includes(a) ? "active" : ""}`} onClick={() => toggleArr("ageGroup", a)}>{a}</span>
          ))}
        </div>
      )
    },
    {
      q: "What is your gender focus?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Male","Female","Neutral","All"].map(g => (
            <span key={g} className={`pill ${answers.gender === g ? "active" : ""}`} onClick={() => update("gender", g)}>{g}</span>
          ))}
        </div>
      )
    },
    {
      q: "What color mood fits your brand?",
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { name: "Warm", colors: ["#FF6B6B","#FFA500","#FFD700"] },
            { name: "Cool", colors: ["#4ECDC4","#6BB5FF","#9B59B6"] },
            { name: "Dark", colors: ["#2C3E50","#1A1A2E","#16213E"] },
            { name: "Pastel", colors: ["#FFB3BA","#FFDFBA","#FFFFBA"] },
            { name: "Vibrant", colors: ["#FF0080","#00FF80","#0080FF"] },
            { name: "Neutral", colors: ["#B5B5B5","#8A8A8A","#5C5C5C"] },
          ].map(m => (
            <div key={m.name} onClick={() => update("colorMood", m.name)}
              style={{ padding: 14, borderRadius: 12, border: `1px solid ${answers.colorMood === m.name ? "var(--teal)" : "var(--border)"}`, background: answers.colorMood === m.name ? "var(--teal-glow)" : "var(--card)", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {m.colors.map(c => <div key={c} style={{ width: 20, height: 20, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: answers.colorMood === m.name ? "var(--teal)" : "var(--text2)" }}>{m.name}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      q: "What logo style do you want?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Wordmark","Icon","Monogram","Abstract","Combination"].map(s => (
            <span key={s} className={`pill ${answers.logoStyle === s ? "active" : ""}`} onClick={() => update("logoStyle", s)}>{s}</span>
          ))}
        </div>
      )
    },
    {
      q: "What design aesthetic fits your brand?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Minimal","Bold","Playful","Elegant","Futuristic","Retro"].map(a => (
            <span key={a} className={`pill ${answers.aesthetic === a ? "active" : ""}`} onClick={() => update("aesthetic", a)}>{a}</span>
          ))}
        </div>
      )
    },
    {
      q: "What imagery style fits your brand?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Photography","Illustration","3D","Flat"].map(i => (
            <span key={i} className={`pill ${answers.imagery === i ? "active" : ""}`} onClick={() => update("imagery", i)}>{i}</span>
          ))}
        </div>
      )
    },
    {
      q: "Set your brand personality",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[["Playful","Professional","playfulness"],["Minimal","Bold","boldness"],["Modern","Classic","modernity"]].map(([l, r, key]) => (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>
                <span>{l}</span><span>{r}</span>
              </div>
              <input type="range" min={0} max={100} value={answers.sliders[key]}
                onChange={e => update("sliders", { ...answers.sliders, [key]: +e.target.value })}
                style={{ width: "100%", accentColor: "var(--teal)" }} />
            </div>
          ))}
        </div>
      )
    },
    {
      q: "What is your brand voice?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Friendly","Authoritative","Witty","Inspiring","Luxurious","Edgy"].map(v => (
            <span key={v} className={`pill ${answers.voice === v ? "active" : ""}`} onClick={() => update("voice", v)}>{v}</span>
          ))}
        </div>
      )
    },
    {
      q: "What are your brand goals?",
      content: (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Build Trust","Go Viral","Look Premium","Appeal Globally","Build Community"].map(g => (
            <span key={g} className={`pill ${answers.goals.includes(g) ? "active" : ""}`} onClick={() => toggleArr("goals", g)}>{g}</span>
          ))}
        </div>
      )
    },
  ];

  const isLast = step === total - 1;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 600 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, color: "var(--teal)", marginBottom: 4 }}>BrandCraft</div>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Let's build your brand profile</p>
        </div>

        <div className="progress-bar" style={{ marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text2)", fontSize: 12, marginBottom: 40 }}>
          <span>Step {step + 1} of {total}</span>
          <span>{Math.round(((step + 1) / total) * 100)}% complete</span>
        </div>

        <div key={step} style={{ animation: "slideUp 0.35s ease" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 28 }}>{steps[step].q}</h2>
          {steps[step].content}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
          {step > 0 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn-primary" style={{ marginLeft: "auto" }}
            onClick={() => isLast ? onComplete(answers) : setStep(s => s + 1)}>
            {isLast ? "Generate My Brand Profile ✨" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
