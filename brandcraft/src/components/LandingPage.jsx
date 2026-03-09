import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import ToolsCarousel from "./ToolsCarousel";

// ─── Floating Pill Nav ────────────────────────────────────────────────────────
function FloatingPillNav() {
  const [visible, setVisible] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "Features", emoji: "✨", id: "features" },
    { label: "How It Works", emoji: "🗺️", id: "how-it-works" },
    { label: "Blog", emoji: "✍️", id: "blog" },
  ];
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveLink(id);
  };
  return (
    <div style={{
      position: "fixed", top: 20, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? "0" : "-80px"})`,
      opacity: visible ? 1 : 0,
      transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      zIndex: 200, pointerEvents: visible ? "auto" : "none",
    }}>
      <div className="glass" style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 99, padding: "6px 8px" }}>
        {links.map(link => (
          <button key={link.id} onClick={() => scrollTo(link.id)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer",
            fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
            transition: "all 0.22s ease",
            background: activeLink === link.id ? "linear-gradient(135deg,#7C4DFF,#FF6B9D)" : "transparent",
            color: activeLink === link.id ? "#fff" : "#6B5B8A",
            boxShadow: activeLink === link.id ? "0 4px 12px rgba(124,77,255,0.35)" : "none",
          }}
          onMouseEnter={e => { if (activeLink !== link.id) { e.currentTarget.style.background="rgba(124,77,255,0.1)"; e.currentTarget.style.color="#7C4DFF"; }}}
          onMouseLeave={e => { if (activeLink !== link.id) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#6B5B8A"; }}}
          >
            <span style={{ fontSize: 14 }}>{link.emoji}</span>{link.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Kinetic Hero Text ────────────────────────────────────────────────────────
function KineticText({ text, delay = 0, className = "" }) {
  return (
    <span aria-label={text} style={{ display: "inline" }}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="kinetic-word" style={{ animationDelay: `${delay + wi * 0.08}s`, display: "inline-block", marginRight: "0.25em" }}>
          {word}
        </span>
      ))}
    </span>
  );
}

// ─── Infinite Marquee ─────────────────────────────────────────────────────────
const marqueeItems = [
  { emoji: "✨", text: "Brand Names" }, { emoji: "🎨", text: "Logo Creator" },
  { emoji: "🌈", text: "Color Palette" }, { emoji: "🖋️", text: "Typography" },
  { emoji: "📣", text: "Ad Copy" }, { emoji: "🌟", text: "Social Bio" },
  { emoji: "💌", text: "Email Builder" }, { emoji: "📅", text: "Content Calendar" },
  { emoji: "🎙️", text: "Voice & Tone" }, { emoji: "💡", text: "Sentiment AI" },
  { emoji: "🌍", text: "Multilanguage" }, { emoji: "🤖", text: "AI Assistant" },
  { emoji: "📊", text: "Brand Score" },
];

function Marquee({ reverse = false }) {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-wrapper" style={{ padding: "14px 0" }}>
      <div className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 24px", margin: "0 8px",
            background: "rgba(255,252,248,0.85)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(124,77,255,0.12)",
            borderRadius: 99,
            fontSize: 14, fontWeight: 700, color: "#2D1B69",
            fontFamily: "Nunito", whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(124,77,255,0.08)",
          }}>
            <span style={{ fontSize: 18 }}>{item.emoji}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sticky Scroll Story ──────────────────────────────────────────────────────
const storySteps = [
  { chapter: "Step 01", title: "Whisper Your Vision", desc: "Tell us your industry, vibe, and goals. Our AI learns what makes your brand unique before creating a single asset.", emoji: "💬", accent: "#7C4DFF" },
  { chapter: "Step 02", title: "AI Weaves the Magic", desc: "Watch as 13 powerful tools generate names, colors, logos, typography and more — all tailored to your exact profile.", emoji: "⚡", accent: "#FF6B9D" },
  { chapter: "Step 03", title: "Curate & Refine", desc: "Pick your favorites, regenerate with one click, and fine-tune every element until it feels perfectly you.", emoji: "🎯", accent: "#FFB300" },
  { chapter: "Step 04", title: "Launch Your Legend", desc: "Download your complete brand package as a PDF. Every asset, every format — ready to go live.", emoji: "🚀", accent: "#4ECDC4" },
];

function StickyStory() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -top / (height - window.innerHeight)));
      setActiveStep(Math.min(storySteps.length - 1, Math.floor(progress * storySteps.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const step = storySteps[activeStep];

  return (
    <div ref={containerRef} style={{ height: `${storySteps.length * 80}vh`, position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, rgba(124,77,255,0.04) 0%, rgba(255,107,157,0.04) 100%)",
        overflow: "hidden",
      }}>
        {/* Animated mesh blob */}
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${step.accent}22 0%, transparent 65%)`,
          filter: "blur(60px)",
          transition: "background 0.8s ease, transform 0.8s ease",
          transform: `translate(${activeStep % 2 === 0 ? "-10%" : "10%"}, ${activeStep > 1 ? "10%" : "-10%"})`,
          pointerEvents: "none",
        }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, maxWidth: 1000, padding: "0 48px", zIndex: 1, width: "100%" }}>
          {/* Left — step indicators */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
            {storySteps.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                opacity: i === activeStep ? 1 : 0.35,
                transform: `translateX(${i === activeStep ? "0" : "-8px"})`,
                transition: "all 0.5s var(--ease-spring)",
              }}>
                <div style={{
                  width: i === activeStep ? 48 : 36, height: i === activeStep ? 48 : 36,
                  borderRadius: "50%",
                  background: i === activeStep ? `linear-gradient(135deg, ${s.accent}, ${s.accent}88)` : "rgba(124,77,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: i === activeStep ? 22 : 18,
                  transition: "all 0.4s var(--ease-spring)",
                  boxShadow: i === activeStep ? `0 8px 24px ${s.accent}44` : "none",
                  flexShrink: 0,
                }}>
                  {s.emoji}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: i === activeStep ? s.accent : "#A89BC0", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Nunito" }}>{s.chapter}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#2D1B69", fontFamily: "Fredoka One" }}>{s.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — active step detail */}
          <div key={activeStep} style={{ display: "flex", flexDirection: "column", justifyContent: "center", animation: "pageEnter 0.5s var(--ease-spring)" }}>
            <div style={{ fontSize: 80, marginBottom: 24, filter: `drop-shadow(0 8px 20px ${step.accent}44)` }}>{step.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: step.accent, textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "Nunito", marginBottom: 12 }}>{step.chapter}</div>
            <h3 style={{ fontFamily: "Fredoka One", fontSize: 42, color: "#2D1B69", marginBottom: 20, lineHeight: 1.1 }}>{step.title}</h3>
            <p style={{ fontSize: 17, color: "#6B5B8A", lineHeight: 1.8, fontFamily: "Nunito", fontWeight: 500, maxWidth: 380 }}>{step.desc}</p>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
              {storySteps.map((_, i) => (
                <div key={i} style={{
                  height: 4, borderRadius: 99,
                  width: i === activeStep ? 32 : 8,
                  background: i === activeStep ? step.accent : "rgba(124,77,255,0.2)",
                  transition: "all 0.4s var(--ease-spring)",
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Stars (memoized) ────────────────────────────────────────────────
const stars = Array.from({ length: 10 }, (_, i) => ({
  left: `${(i * 37 + 5) % 100}%`,
  top: `${(i * 53 + 10) % 80}%`,
  size: i % 3 === 0 ? "24px" : "16px",
  duration: 3 + (i % 3),
  delay: (i * 0.4) % 3,
}));

const HanddrawnDivider = () => (
  <svg width="100%" height="50" viewBox="0 0 1200 50" style={{ margin: "32px 0", opacity: 0.2 }}>
    <path d="M 0 25 Q 150 8 300 25 T 600 25 T 900 25 T 1200 25" stroke="#7C4DFF" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

// ─── Main LandingPage ─────────────────────────────────────────────────────────
export default function LandingPage({ onNav }) {
  useScrollReveal();

  return (
    <div className="mesh-bg" style={{ minHeight: "100vh", overflowX: "hidden", background: "linear-gradient(180deg, #FDF6EC 0%, #FFF8F0 50%, #FFFAF3 100%)" }}>
      <FloatingPillNav />

      {/* NAV */}
      <nav className="glass" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none",
      }}>
        <div style={{ fontFamily: "Fredoka One", fontSize: 24, color: "#7C4DFF" }}>📖 BrandCraft</div>
        <button className="btn-primary btn-sm" onClick={() => onNav("signup")}>Start Story ✨</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 60px", position: "relative", overflow: "hidden" }}>
        {stars.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.left, top: s.top, fontSize: s.size, animation: `float ${s.duration}s ease-in-out infinite`, animationDelay: `${s.delay}s`, pointerEvents: "none" }}>✨</div>
        ))}

        {/* Animated book */}
        <div style={{ position: "relative", width: "260px", height: "190px", marginBottom: 40, perspective: "1000px", animation: "wobble 4s ease-in-out infinite" }}>
          <div style={{ position: "absolute", width: "100%", height: "100%", background: "linear-gradient(135deg, #FFB300 0%, #FF6B9D 50%, #7C4DFF 100%)", borderRadius: "8px 0 0 8px", transform: "rotateY(-15deg)", transformOrigin: "right", boxShadow: "-4px 4px 16px rgba(124,77,255,0.2)" }} />
          <div style={{ position: "absolute", width: "100%", height: "100%", background: "linear-gradient(135deg, #7C4DFF 0%, #FF6B9D 50%, #FFB300 100%)", borderRadius: "0 8px 8px 0", transform: "rotateY(15deg)", transformOrigin: "left", right: 0, boxShadow: "4px 4px 16px rgba(124,77,255,0.2)" }} />
          <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "72px", animation: "bounce 3s ease-in-out infinite", zIndex: 10 }}>✨</div>
        </div>

        <div style={{ position: "relative", maxWidth: 820, zIndex: 5 }}>
          <div className="kinetic-word" style={{ animationDelay: "0s", display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(124,77,255,0.1)", border: "2px solid rgba(124,77,255,0.2)", borderRadius: 24, fontSize: 14, color: "#7C4DFF", marginBottom: 32, fontWeight: 700, fontFamily: "Nunito" }}>
            <span>🎉</span> Free · Unlimited · No Credit Card · Pure Magic
          </div>

          <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.02em", color: "#2D1B69", fontFamily: "Fredoka One", overflow: "hidden" }}>
            <KineticText text="Every Brand Has" delay={0.1} />
            <br />
            <span className="grad-text" style={{ fontFamily: "Fredoka One" }}>
              <KineticText text="a Story. Let's Write Yours." delay={0.4} />
            </span>
          </h1>

          <p className="kinetic-word" style={{ animationDelay: "0.7s", fontSize: "clamp(16px, 2.5vw, 20px)", color: "#6B5B8A", lineHeight: 1.8, marginBottom: 48, maxWidth: 580, margin: "0 auto 48px", fontFamily: "Nunito", fontWeight: 500 }}>
            Your brand deserves more than templates. With AI-powered storytelling, create a brand identity as unique as you are — in minutes, not months. 🌟
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px", fontFamily: "Nunito", fontWeight: 700, animation: "kineticReveal 0.7s 0.9s both" }} onClick={() => onNav("signup")}>Begin the Journey ✨</button>
            <button className="btn-ghost" style={{ fontSize: 16, padding: "16px 40px", fontFamily: "Nunito", fontWeight: 700, animation: "kineticReveal 0.7s 1.05s both" }} onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Explore Magic →</button>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ background: "rgba(124,77,255,0.04)", borderTop: "1px solid rgba(124,77,255,0.1)", borderBottom: "1px solid rgba(124,77,255,0.1)", padding: "4px 0" }}>
        <Marquee />
        <Marquee reverse />
      </div>

      <HanddrawnDivider />

      {/* ── CHAPTER 1: Features Fan Carousel ── */}
      <section id="features" style={{ scrollMarginTop: 80 }}>
        <ToolsCarousel onNav={onNav} />
      </section>

      <HanddrawnDivider />

      {/* ── CHAPTER 2: Sticky Scroll Story (How It Works) ── */}
      <section id="how-it-works" style={{ scrollMarginTop: 80 }}>
        <div className="reveal" style={{ textAlign: "center", padding: "72px 24px 40px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>📖 Chapter 2</div>
          <h2 style={{ fontSize: 52, fontWeight: 800, color: "#2D1B69", fontFamily: "Fredoka One", marginBottom: 12 }}>The Storytelling Journey</h2>
          <p style={{ color: "#6B5B8A", fontSize: 18, fontFamily: "Nunito", fontWeight: 500 }}>Scroll to walk through the magic.</p>
        </div>
        <StickyStory />
      </section>

      <HanddrawnDivider />

      {/* ── FINALE: CTA ── */}
      <section id="blog" style={{ padding: "100px 48px", textAlign: "center", background: "linear-gradient(135deg, rgba(124,77,255,0.08) 0%, rgba(255,107,157,0.08) 100%)", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
        {/* Mesh blobs */}
        <div style={{ position: "absolute", top: "-30%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,77,255,0.15) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div className="reveal" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#7C4DFF", fontFamily: "Nunito", marginBottom: 16, textTransform: "uppercase", letterSpacing: "1px" }}>🎬 The Finale</div>
          <h2 style={{ fontSize: "clamp(40px,5vw,64px)", fontWeight: 800, marginBottom: 16, color: "#2D1B69", fontFamily: "Fredoka One" }}>Your Story Awaits</h2>
          <p className="reveal reveal-delay-1" style={{ color: "#6B5B8A", fontSize: 18, marginBottom: 48, fontFamily: "Nunito", maxWidth: 600, margin: "0 auto 48px", fontWeight: 500 }}>
            Free forever. No tricks. No surprises. Just magnificent branding magic. ✨
          </p>
          <button className="btn-primary reveal reveal-delay-2" style={{ fontSize: 18, padding: "18px 48px", fontFamily: "Nunito", fontWeight: 700 }} onClick={() => onNav("signup")}>
            Begin Your Story →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "2px solid rgba(124,77,255,0.1)", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, background: "rgba(255,250,243,0.5)" }}>
        <div>
          <div style={{ fontFamily: "Fredoka One", fontSize: 20, color: "#7C4DFF", marginBottom: 6 }}>📖 BrandCraft</div>
          <div style={{ color: "#6B5B8A", fontSize: 14, fontFamily: "Nunito" }}>Where brand dreams come true. ✨</div>
        </div>
        <div style={{ display: "flex", gap: 16, color: "#6B5B8A" }}>
          {["twitter","instagram","linkedin"].map(s => (
            <span key={s} className="hover-glow" style={{ cursor: "pointer", transition: "color 0.2s", fontSize: 18 }}
              onMouseEnter={e => e.currentTarget.style.color = "#7C4DFF"}
              onMouseLeave={e => e.currentTarget.style.color = "#6B5B8A"}>
              <Icon name={s} size={20} />
            </span>
          ))}
        </div>
        <div style={{ width: "100%", textAlign: "center", color: "#A89BC0", fontSize: 13, marginTop: 8, fontFamily: "Nunito" }}>
          © 2026 BrandCraft. Written with ✨ and 💜. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
