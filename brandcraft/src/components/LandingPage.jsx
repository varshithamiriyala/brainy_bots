import Icon from "./Icon";

const features = [
  { icon: "zap", name: "✨ Brand Name Generator", desc: "Magic words that capture your essence" },
  { icon: "image", name: "🎨 Logo Creation", desc: "Beautiful logos conjured by AI" },
  { icon: "palette", name: "🌈 Color Palette", desc: "Colors that feel just right" },
  { icon: "type", name: "📝 Typography Pairing", desc: "Fonts that dance together" },
  { icon: "mail", name: "💬 Ad Copy Generator", desc: "Words that make hearts skip" },
  { icon: "user", name: "👤 Social Media Bio", desc: "Bios that tell your story" },
  { icon: "mail", name: "📧 Email Template Builder", desc: "Messages that connect deeply" },
  { icon: "calendar", name: "📅 Content Automation", desc: "Ideas that flow endless" },
  { icon: "voice", name: "🎤 Voice & Tone", desc: "Your brand's unique voice" },
  { icon: "activity", name: "💭 Sentiment Analysis", desc: "Feelings made visible" },
  { icon: "zap", name: "🌍 Multilanguage Support", desc: "Available in Settings" },
  { icon: "sparkle", name: "🤖 Branding Assistant", desc: "Always by your side" },
  { icon: "dashboard", name: "📊 Brand Score Dashboard", desc: "See your magic grow" },
];

const testimonials = [
  { name: "Mia Chen", role: "Founder, Lumière Beauty", quote: "BrandCraft gave me a complete brand identity in under an hour. It felt like magic.", initials: "MC", emoji: "✨" },
  { name: "James Okafor", role: "CEO, Nexus Tech", quote: "The AI understood my vision instantly. It's like having a creative partner who never sleeps.", initials: "JO", emoji: "🚀" },
  { name: "Sofia Reyes", role: "Owner, Bloom Kitchen", quote: "I was skeptical, but this blew me away. Everything feels hand-crafted, not generated.", initials: "SR", emoji: "🌸" },
];

// Floating elements for storybook feel
const FloatingStars = () => {
  return (
    <>
      {[...Array(12)].map((_, i) => {
        const randomLeft = Math.random() * 100;
        const randomTop = Math.random() * 80;
        const randomDelay = Math.random() * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${randomLeft}%`,
              top: `${randomTop}%`,
              fontSize: Math.random() > 0.5 ? "24px" : "16px",
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${randomDelay}s`,
              pointerEvents: "none",
            }}
          >
            ✨
          </div>
        );
      })}
    </>
  );
};

const HanddrawnDivider = () => (
  <svg width="100%" height="60" viewBox="0 0 1200 60" style={{ margin: "40px 0", opacity: 0.3 }}>
    <path d="M 0 30 Q 150 10 300 30 T 600 30 T 900 30 T 1200 30" stroke="#7C4DFF" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export default function LandingPage({ onNav }) {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: "linear-gradient(180deg, #FDF6EC 0%, #FFF8F0 50%, #FFFAF3 100%)" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(253,246,236,0.85)", backdropFilter: "blur(20px)", borderBottom: "2px solid rgba(124,77,255,0.1)" }}>
        <div style={{ fontFamily: "Fredoka One", fontSize: 24, fontWeight: 800, color: "#7C4DFF" }}>📖 BrandCraft</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost btn-sm" onClick={() => onNav("login")}>Login</button>
          <button className="btn-primary btn-sm" onClick={() => onNav("signup")}>Start Story</button>
        </div>
      </nav>

      {/* HERO - Like opening a book */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 60px", position: "relative", overflow: "hidden" }}>
        <FloatingStars />
        
        {/* Book illustration using CSS */}
        <div style={{ position: "relative", width: "280px", height: "200px", marginBottom: 40, perspective: "1000px", animation: "wobble 4s ease-in-out infinite" }}>
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #FFB300 0%, #FF6B9D 50%, #7C4DFF 100%)",
            borderRadius: "8px 0 0 8px",
            transform: "rotateY(-15deg)",
            transformOrigin: "right",
            boxShadow: "-4px 4px 16px rgba(124,77,255,0.2)",
          }} />
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #7C4DFF 0%, #FF6B9D 50%, #FFB300 100%)",
            borderRadius: "0 8px 8px 0",
            transform: "rotateY(15deg)",
            transformOrigin: "left",
            right: 0,
            boxShadow: "4px 4px 16px rgba(124,77,255,0.2)",
          }} />
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "80px",
            animation: "bounce 3s ease-in-out infinite",
            zIndex: 10,
          }}>
            ✨
          </div>
        </div>

        <div style={{ position: "relative", maxWidth: 800, animation: "fadeSlideIn 0.8s ease", zIndex: 5 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(124,77,255,0.1)", border: "2px solid rgba(124,77,255,0.2)", borderRadius: 24, fontSize: 14, color: "#7C4DFF", marginBottom: 32, fontWeight: 700, fontFamily: "Nunito" }}>
            <span>🎉</span> Free · Unlimited · No Credit Card · Pure Magic
          </div>
          
          <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.02em", color: "#2D1B69", fontFamily: "Fredoka One" }}>
            Every Brand Has<br />
            <span style={{ background: "linear-gradient(135deg, #7C4DFF, #FF6B9D, #FFB300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>a Story. Let's Write Yours.</span>
          </h1>
          
          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "#6B5B8A", lineHeight: 1.8, marginBottom: 48, maxWidth: 580, margin: "0 auto 48px", fontFamily: "Nunito", fontWeight: 500 }}>
            Your brand deserves more than templates. With AI-powered storytelling, create a brand identity as unique as you are — in minutes, not months. 🌟
          </p>
          
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px", fontFamily: "Nunito", fontWeight: 700 }} onClick={() => onNav("signup")}>Begin the Journey ✨</button>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "16px 40px", fontFamily: "Nunito", fontWeight: 700 }} onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Explore Magic →</button>
          </div>
        </div>
      </section>

      <HanddrawnDivider />

      {/* CHAPTER 1: Features */}
      <section id="features" style={{ padding: "80px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>📖 Chapter 1</div>
          <h2 style={{ fontSize: 52, fontWeight: 800, marginBottom: 16, color: "#2D1B69", fontFamily: "Fredoka One" }}>Your Brand's Arsenal</h2>
          <p style={{ textAlign: "center", color: "#6B5B8A", marginBottom: 60, fontSize: 18, fontFamily: "Nunito", maxWidth: 600, margin: "0 auto 60px", fontWeight: 500 }}>13 enchanted tools designed to craft your complete brand story.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ animation: `cardIn 0.5s ease ${i * 0.05}s both`, cursor: "default", background: "rgba(255, 250, 243, 0.95)" }}>
              <div style={{ width: 50, height: 50, background: "linear-gradient(135deg, rgba(124,77,255,0.15) 0%, rgba(255,107,157,0.15) 100%)", border: "2px solid rgba(124,77,255,0.2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 24, color: "#7C4DFF" }}>
                {f.name.split(" ")[0]}
              </div>
              <div style={{ fontFamily: "Fredoka One", fontWeight: 800, fontSize: 17, marginBottom: 8, color: "#2D1B69" }}>{f.name.slice(2)}</div>
              <div style={{ color: "#6B5B8A", fontSize: 14, lineHeight: 1.6, fontFamily: "Nunito" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <HanddrawnDivider />

      {/* CHAPTER 2: How It Works */}
      <section style={{ padding: "80px 48px", background: "linear-gradient(135deg, rgba(124,77,255,0.05) 0%, rgba(255,107,157,0.05) 100%)", borderTop: "2px solid rgba(124,77,255,0.1)", borderBottom: "2px solid rgba(124,77,255,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>📖 Chapter 2</div>
          <h2 style={{ fontSize: 52, fontWeight: 800, marginBottom: 20, color: "#2D1B69", fontFamily: "Fredoka One" }}>The Storytelling Journey</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap", maxWidth: 1000, margin: "0 auto" }}>
          {[
            { n: "1️⃣", title: "Whisper Your Dreams", desc: "Tell us your vision, values, and vibe." },
            { n: "2️⃣", title: "AI Weaves Magic", desc: "Our enchanted algorithms create your perfect brand." },
            { n: "3️⃣", title: "Launch Your Legend", desc: "Own your brand across every platform." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ textAlign: "center", maxWidth: 240 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontFamily: "Fredoka One", fontWeight: 800, fontSize: 18, marginBottom: 10, color: "#2D1B69" }}>{s.title}</div>
                <div style={{ color: "#6B5B8A", fontSize: 15, lineHeight: 1.7, fontFamily: "Nunito" }}>{s.desc}</div>
              </div>
              {i < 2 && <div style={{ color: "#A89BC0", flexShrink: 0, fontSize: 32 }}>→</div>}
            </div>
          ))}
        </div>
      </section>

      <HanddrawnDivider />

      {/* CHAPTER 3: Testimonials as Diary Entries */}
      <section style={{ padding: "80px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>📖 Chapter 3</div>
          <h2 style={{ fontSize: 52, fontWeight: 800, marginBottom: 16, color: "#2D1B69", fontFamily: "Fredoka One" }}>Stories from Our Readers</h2>
          <p style={{ textAlign: "center", color: "#6B5B8A", marginBottom: 60, fontSize: 18, fontFamily: "Nunito", fontWeight: 500 }}>Brands transformed. Dreams realized. Magic happened.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card" style={{ padding: 32, background: "linear-gradient(135deg, rgba(255,250,243,0.95) 0%, rgba(255,245,230,0.95) 100%)", borderLeft: "4px solid #7C4DFF", position: "relative" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>{t.emoji}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fredoka One", fontWeight: 800, fontSize: 16, color: "#FFF" }}>{t.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#2D1B69", fontFamily: "Nunito" }}>{t.name}</div>
                  <div style={{ color: "#6B5B8A", fontSize: 13, fontFamily: "Nunito" }}>{t.role}</div>
                </div>
              </div>
              <p style={{ color: "#2D1B69", fontSize: 15, lineHeight: 1.8, fontFamily: "Nunito", fontStyle: "italic", fontWeight: 500 }}>"{t.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      <HanddrawnDivider />

      {/* FINALE: CTA */}
      <section style={{ padding: "100px 48px", textAlign: "center", background: "linear-gradient(135deg, rgba(124,77,255,0.1) 0%, rgba(255,107,157,0.1) 100%)" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 16, textTransform: "uppercase", letterSpacing: "1px" }}>🎬 The Finale</div>
        <h2 style={{ fontSize: 56, fontWeight: 800, marginBottom: 16, color: "#2D1B69", fontFamily: "Fredoka One" }}>Your Story Awaits</h2>
        <p style={{ color: "#6B5B8A", fontSize: 18, marginBottom: 48, fontFamily: "Nunito", maxWidth: 600, margin: "0 auto 48px", fontWeight: 500 }}>Free forever. No tricks. No surprises. Just magnificent branding magic. ✨</p>
        <button className="btn-primary" style={{ fontSize: 18, padding: "18px 48px", fontFamily: "Nunito", fontWeight: 700 }} onClick={() => onNav("signup")}>Begin Your Story →</button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "2px solid rgba(124,77,255,0.1)", padding: "48px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, background: "rgba(255,250,243,0.5)" }}>
        <div>
          <div style={{ fontFamily: "Fredoka One", fontSize: 20, fontWeight: 800, color: "#7C4DFF", marginBottom: 8 }}>📖 BrandCraft</div>
          <div style={{ color: "#6B5B8A", fontSize: 14, fontFamily: "Nunito" }}>Where brand dreams come true. ✨</div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 14, color: "#6B5B8A", fontFamily: "Nunito", fontWeight: 600 }}>
          {["Features", "How It Works", "About", "Blog"].map(l => (
            <span key={l} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#7C4DFF"} onMouseLeave={e => e.target.style.color = "#6B5B8A"}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, color: "#6B5B8A" }}>
          {["twitter", "instagram", "linkedin"].map(s => (
            <span key={s} style={{ cursor: "pointer", transition: "color 0.2s", fontSize: 18 }} onMouseEnter={e => e.currentTarget.style.color = "#7C4DFF"} onMouseLeave={e => e.currentTarget.style.color = "#6B5B8A"}><Icon name={s} size={20} /></span>
          ))}
        </div>
        <div style={{ width: "100%", textAlign: "center", color: "#A89BC0", fontSize: 13, marginTop: 12, fontFamily: "Nunito" }}>© 2026 BrandCraft. Written with ✨ and 💜. All rights reserved.</div>
      </footer>
    </div>
  );
}
