import Icon from "./Icon";

const features = [
  { icon: "zap", name: "Brand Name Generator", desc: "Generate unique names that fit your brand" },
  { icon: "image", name: "Logo Creation", desc: "AI-generated logos in seconds" },
  { icon: "palette", name: "Color Palette", desc: "Perfect colors that match your vibe" },
  { icon: "type", name: "Typography Pairing", desc: "Font combinations that look professional" },
  { icon: "mail", name: "Ad Copy Generator", desc: "Write ads that actually convert" },
  { icon: "user", name: "Social Media Bio", desc: "Bios that make people follow you" },
  { icon: "mail", name: "Email Template Builder", desc: "Emails your audience will open" },
  { icon: "calendar", name: "Content Automation", desc: "Never run out of content ideas" },
  { icon: "voice", name: "Voice & Tone", desc: "Make your brand sound consistent" },
  { icon: "activity", name: "Sentiment Analysis", desc: "Know how your content makes people feel" },
  { icon: "zap", name: "Multilanguage Support", desc: "Available in Settings" },
  { icon: "sparkle", name: "Branding Assistant", desc: "Floating AI widget always available" },
  { icon: "dashboard", name: "Brand Score Dashboard", desc: "Track your brand health in one view" },
];

const testimonials = [
  { name: "Mia Chen", role: "Founder, Lumière Beauty", quote: "BrandCraft gave me a complete brand identity in under an hour. My logo, colors, and copy — all perfectly aligned.", initials: "MC" },
  { name: "James Okafor", role: "CEO, Nexus Tech", quote: "The AI understood my vision instantly. I went from a vague idea to a fully polished brand ready for launch.", initials: "JO" },
  { name: "Sofia Reyes", role: "Owner, Bloom Kitchen", quote: "I was skeptical about AI branding, but this blew me away. Everything felt hand-crafted, not generated.", initials: "SR" },
];

export default function LandingPage({ onNav }) {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(8,11,20,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, var(--teal), #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BrandCraft</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost btn-sm" onClick={() => onNav("login")}>Login</button>
          <button className="btn-primary btn-sm" onClick={() => onNav("signup")}>Sign Up</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div className="orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(78,205,196,0.12), transparent 70%)", top: "10%", left: "10%", animation: "orb1 12s ease-in-out infinite" }} />
        <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)", top: "20%", right: "5%", animation: "orb2 15s ease-in-out infinite" }} />
        <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(78,205,196,0.08), transparent 70%)", bottom: "10%", left: "30%", animation: "orb3 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(78,205,196,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78,205,196,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 760, animation: "fadeSlideIn 0.8s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.25)", borderRadius: 99, fontSize: 13, color: "var(--teal)", marginBottom: 28, fontWeight: 500 }}>
            <Icon name="sparkle" size={13} /> 100% Free · No limits · No credit card
          </div>
          <h1 style={{ fontSize: "clamp(42px, 7vw, 82px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Build Your Brand.<br />
            <span style={{ background: "linear-gradient(135deg, var(--teal), #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Powered by AI.</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--text2)", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            BrandCraft gives you everything you need to create, manage and grow your brand — all in one place.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "14px 34px" }} onClick={() => onNav("signup")}>Get Started Free</button>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "14px 34px" }} onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>See How It Works</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: 44, fontWeight: 800, textAlign: "center", marginBottom: 14 }}>Everything Your Brand Needs</h2>
        <p style={{ textAlign: "center", color: "var(--text2)", marginBottom: 60, fontSize: 17 }}>13 powerful AI tools, all connected to your brand profile.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ animation: `cardIn 0.5s ease ${i * 0.05}s both`, cursor: "default" }}>
              <div style={{ width: 40, height: 40, background: "var(--teal-glow)", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, color: "var(--teal)" }}>
                <Icon name={f.icon} size={18} />
              </div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{f.name}</div>
              <div style={{ color: "var(--text2)", fontSize: 13 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 48px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 44, fontWeight: 800, textAlign: "center", marginBottom: 60 }}>How BrandCraft Works</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {[
            { n: "01", title: "Answer a few questions", desc: "Tell us about your business, audience and style." },
            { n: "02", title: "AI builds your brand profile", desc: "We generate everything based on your answers." },
            { n: "03", title: "Launch with confidence", desc: "Use your brand kit across every channel." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ textAlign: "center", maxWidth: 220 }}>
                <div style={{ fontSize: 36, fontFamily: "Syne", fontWeight: 800, color: "var(--teal)", opacity: 0.5, marginBottom: 10 }}>{s.n}</div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
                <div style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
              {i < 2 && <div style={{ color: "var(--text3)", flexShrink: 0 }}><Icon name="chevronRight" size={24} /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 44, fontWeight: 800, textAlign: "center", marginBottom: 60 }}>Brands Built with BrandCraft</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "#080B14" }}>{t.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: "var(--text2)", fontSize: 12 }}>{t.role}</div>
                </div>
              </div>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}>"{t.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 48px", textAlign: "center", background: "radial-gradient(ellipse at center, rgba(78,205,196,0.08) 0%, transparent 70%)" }}>
        <h2 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>Ready to Build Your Brand?</h2>
        <p style={{ color: "var(--text2)", fontSize: 17, marginBottom: 40 }}>100% free. No credit card. No limits. Just sign up and start building.</p>
        <button className="btn-primary" style={{ fontSize: 17, padding: "16px 40px" }} onClick={() => onNav("signup")}>Start Building Free</button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 800, color: "var(--teal)", marginBottom: 6 }}>BrandCraft</div>
          <div style={{ color: "var(--text2)", fontSize: 13 }}>AI-powered branding for everyone.</div>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 13, color: "var(--text2)" }}>
          {["Features", "How It Works", "About", "Blog"].map(l => (
            <span key={l} style={{ cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "var(--teal)"} onMouseLeave={e => e.target.style.color = "var(--text2)"}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, color: "var(--text2)" }}>
          {["twitter", "instagram", "linkedin"].map(s => (
            <span key={s} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--teal)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text2)"}><Icon name={s} size={18} /></span>
          ))}
        </div>
        <div style={{ width: "100%", textAlign: "center", color: "var(--text3)", fontSize: 12, marginTop: 8 }}>© 2025 BrandCraft. All rights reserved.</div>
      </footer>
    </div>
  );
}
