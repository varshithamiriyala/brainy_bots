import { useState, useEffect, useRef, useCallback } from "react";
import "./styles/global.css";

import { useToast } from "./hooks/useToast";
import { LanguageProvider } from "./hooks/useLanguage";
import { ThemeProvider } from "./hooks/useTheme";
import LandingPage from "./components/LandingPage";
import { AuthPage, OnboardingPage } from "./components/AuthOnboarding";
import { AppShell, Dashboard } from "./components/AppShellDashboard";
import { BrandIdentityPage } from "./components/BrandIdentity";
import { ContentCopyPage } from "./components/ContentCopy";
import { VoiceStylePage, SettingsPage } from "./components/VoiceSettings";
import AIChatWidget from "./components/AIChatWidget";
import Confetti from "react-confetti";

const APP_PAGES = ["dashboard", "brand-identity", "content-copy", "voice-style", "settings"];

const motivationalMessages = [
  "🌟 Amazing choice! Your brand is getting stronger!",
  "✨ Fantastic! You're building something special!",
  "🎯 Perfect pick! Your brand identity is coming together!",
  "💪 Great selection! Keep building your dream brand!",
  "🚀 You're on fire! Your brand is shining brighter!",
  "🌈 Beautiful choice! Your brand story is unfolding!",
  "🏆 Brilliant! You're creating a legendary brand!",
  "💫 Wonderful! Your brand is getting unique!",
];

const celebrationMessages = [
  "🎉 Congratulations! You've completed your brand identity!",
  "🏆 Amazing! Your brand package is ready to shine!",
  "✨ Wow! You've built a complete brand!",
  "🚀 Incredible! Your brand story is complete!",
  "💎 Fantastic! Your brand is ready for the world!",
];

// ─── Command Palette ──────────────────────────────────────────────────────────
function CommandPalette({ open, onClose, onNav, user }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  const allCommands = [
    { icon: "🏠", label: "Dashboard",         shortcut: "G D", action: () => onNav("dashboard"),      group: "Navigate",  requires: "auth" },
    { icon: "🎨", label: "Brand Identity",    shortcut: "G B", action: () => onNav("brand-identity"), group: "Navigate",  requires: "auth" },
    { icon: "✍️", label: "Content & Copy",   shortcut: "G C", action: () => onNav("content-copy"),   group: "Navigate",  requires: "auth" },
    { icon: "🎙️", label: "Voice & Style",   shortcut: "G V", action: () => onNav("voice-style"),    group: "Navigate",  requires: "auth" },
    { icon: "⚙️", label: "Settings",          shortcut: "G S", action: () => onNav("settings"),       group: "Navigate",  requires: "auth" },
    { icon: "✨", label: "Landing Page",       shortcut: "",    action: () => onNav("landing"),        group: "Navigate",  requires: null   },
    { icon: "🔑", label: "Log In",             shortcut: "",    action: () => onNav("login"),          group: "Account",   requires: null   },
    { icon: "🚀", label: "Sign Up",            shortcut: "",    action: () => onNav("signup"),         group: "Account",   requires: null   },
    { icon: "📖", label: "Features",           shortcut: "",    action: () => { onNav("landing"); setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior:"smooth" }), 100); }, group: "Explore", requires: null },
    { icon: "🗺️", label: "How It Works",      shortcut: "",    action: () => { onNav("landing"); setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior:"smooth" }), 100); }, group: "Explore", requires: null },
  ].filter(c => !c.requires || (c.requires === "auth" && user));

  const filtered = query.trim()
    ? allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : allCommands;

  useEffect(() => {
    if (open) { setQuery(""); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const run = useCallback((cmd) => {
    cmd.action();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && filtered[activeIdx]) { run(filtered[activeIdx]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIdx, run, onClose]);

  if (!open) return null;

  // Group commands
  const groups = [...new Set(filtered.map(c => c.group))];

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div style={{ padding: "14px 18px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, opacity: 0.5 }}>🔍</span>
          <input
            ref={inputRef}
            className="cmd-input"
            style={{ flex: 1, padding: "4px 0", border: "none", borderBottom: "none" }}
            placeholder="Search commands, pages, actions…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd style={{ fontSize: 11, color: "#A89BC0", background: "rgba(124,77,255,0.08)", border: "1px solid rgba(124,77,255,0.15)", borderRadius: 6, padding: "3px 8px", fontFamily: "inherit", fontWeight: 700 }}>ESC</kbd>
        </div>
        <div style={{ height: 1, background: "rgba(124,77,255,0.1)", margin: "12px 0 4px" }} />
        <div className="cmd-results">
          {filtered.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "#A89BC0", fontSize: 14, fontFamily: "Nunito" }}>
              No results for "{query}"
            </div>
          )}
          {groups.map(group => (
            <div key={group}>
              <div style={{ padding: "8px 14px 4px", fontSize: 10, fontWeight: 800, color: "#A89BC0", textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: "Nunito" }}>{group}</div>
              {filtered.filter(c => c.group === group).map((cmd, i) => {
                const globalIdx = filtered.indexOf(cmd);
                return (
                  <div
                    key={cmd.label}
                    className={`cmd-item ${globalIdx === activeIdx ? "active" : ""}`}
                    onClick={() => run(cmd)}
                    onMouseEnter={() => setActiveIdx(globalIdx)}
                  >
                    <div className="cmd-item-icon">{cmd.icon}</div>
                    <span style={{ flex: 1 }}>{cmd.label}</span>
                    {cmd.shortcut && (
                      <span style={{ fontSize: 11, color: "#A89BC0", display: "flex", gap: 4 }}>
                        {cmd.shortcut.split(" ").map((k, ki) => (
                          <kbd key={ki} style={{ background: "rgba(124,77,255,0.08)", border: "1px solid rgba(124,77,255,0.15)", borderRadius: 4, padding: "1px 5px", fontFamily: "inherit", fontWeight: 700, color: "#7C4DFF" }}>{k}</kbd>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmd-footer">
          <span><kbd className="cmd-key">↑↓</kbd> Navigate</span>
          <span><kbd className="cmd-key">↵</kbd> Select</span>
          <span><kbd className="cmd-key">⌘K</kbd> Toggle</span>
        </div>
      </div>
    </div>
  );
}

// ─── Animated Toast ───────────────────────────────────────────────────────────
function AnimatedToast({ msg }) {
  const [exiting, setExiting] = useState(false);
  const prev = useRef(msg);

  useEffect(() => {
    if (msg && !prev.current) {
      setExiting(false);
    }
    if (!msg && prev.current) {
      setExiting(true);
    }
    prev.current = msg;
  }, [msg]);

  if (!msg && !exiting) return null;

  return (
    <div className={`toast ${exiting ? "toast-exit" : ""}`}>
      {msg || prev.current}
    </div>
  );
}

// ─── Page Transition Wrapper ──────────────────────────────────────────────────
function PageWrapper({ pageKey, children }) {
  const [animKey, setAnimKey] = useState(pageKey);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    setEntering(true);
    setAnimKey(pageKey);
    const t = setTimeout(() => setEntering(false), 450);
    return () => clearTimeout(t);
  }, [pageKey]);

  return (
    <div
      key={animKey}
      className={entering ? "page-enter" : ""}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [brandProfile, setBrandProfile] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedOutputs, setSelectedOutputs] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const [toolOutputs, setToolOutputs] = useState({
    "brand-names": [], "color-palette": [], "font-pairing": [],
    "logo-creator": [], "ad-copy": [], "social-bio": [],
    "email-builder": [], "content-calendar": [],
  });
  const [confettiType, setConfettiType] = useState("default");
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const { msg: toastMsg, show: showToast } = useToast();

  const requiredOutputs = ["Brand Names","Color Palette","Font Pairing","Logo Creator","Ad Copy","Social Bio","Email Templates"];

  // ⌘K / Ctrl+K to open command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navigate = (target) => {
    if (APP_PAGES.includes(target) && !user) { setPage("login"); return; }
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuth = (userData) => {
    setUser(userData);
    setPage(brandProfile ? "dashboard" : "onboarding");
    showToast("🎉 Welcome to BrandCraft!");
  };

  const handleOnboardingComplete = (data) => {
    setBrandProfile(data);
    setPage("dashboard");
    showToast("✨ Brand profile created!");
  };

  const handleOutput = (feature, preview) => {
    setOutputs(o => [...o, { feature, preview, time: Date.now() }]);
  };

  const saveToolOutput = (toolKey, outputData) => {
    setToolOutputs(prev => ({
      ...prev,
      [toolKey]: [...(prev[toolKey] || []), { ...outputData, time: Date.now() }]
    }));
  };

  const getToolOutputs = (toolKey) => toolOutputs[toolKey] || [];

  const handleFavorite = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    showToast("⭐ Added to favourites!");
  };

  const handleSelect = (feature, outputId) => {
    const wasAllSelected = requiredOutputs.every(key => selectedOutputs[key]);
    setSelectedOutputs(s => ({ ...s, [feature]: outputId }));
    setConfettiType("default");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    showToast(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);

    const allSelectedNow = requiredOutputs.every(key => key === feature ? true : selectedOutputs[key]);
    if (allSelectedNow && !wasAllSelected) {
      setTimeout(() => {
        setConfettiType("celebration");
        setShowConfetti(true);
        setCelebrationMessage(celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]);
        setShowCelebration(true);
        setTimeout(() => { setShowConfetti(false); setShowCelebration(false); }, 6000);
      }, 3500);
    }
  };

  const handleDownloadPDF = () => {
    showToast("📄 Preparing your Brand PDF…");
    setTimeout(() => showToast("✅ Your Brand PDF is ready!"), 2000);
  };

  const appProps = {
    brandProfile, onOutput: handleOutput, favorites, onFavorite: handleFavorite,
    selectedOutputs, onSelect: handleSelect, onDownloadPDF: handleDownloadPDF,
    toolOutputs, saveToolOutput, getToolOutputs,
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {/* Confetti */}
        {showConfetti && <Confetti numberOfPieces={confettiType === "celebration" ? 300 : 100} recycle={false} />}

        {/* Animated Toast */}
        <AnimatedToast msg={toastMsg} />

        {/* Command Palette */}
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNav={navigate} user={user} />

        {/* ⌘K hint badge — only on landing */}
        {page === "landing" && !cmdOpen && (
          <div
            onClick={() => setCmdOpen(true)}
            style={{
              position: "fixed", bottom: 28, right: 28, zIndex: 500,
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,252,248,0.88)",
              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(124,77,255,0.2)",
              borderRadius: 99, padding: "10px 16px",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(124,77,255,0.15)",
              fontSize: 13, fontWeight: 700, color: "#7C4DFF",
              fontFamily: "Nunito",
              transition: "all 0.2s var(--ease-spring)",
              animation: "slideUp 0.5s 1.5s both",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(124,77,255,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,77,255,0.15)"; }}
          >
            <span style={{ fontSize: 15 }}>⌘</span>
            <span>Quick Actions</span>
            <kbd style={{ background: "rgba(124,77,255,0.12)", border: "1px solid rgba(124,77,255,0.2)", borderRadius: 5, padding: "2px 6px", fontSize: 11, color: "#7C4DFF" }}>K</kbd>
          </div>
        )}

        {/* Pages with transition */}
        <PageWrapper pageKey={page}>
          {page === "landing"    && <LandingPage onNav={navigate} />}
          {page === "signup"     && <AuthPage type="signup" onAuth={handleAuth} onNav={navigate} />}
          {page === "login"      && <AuthPage type="login"  onAuth={handleAuth} onNav={navigate} />}
          {page === "onboarding" && <OnboardingPage user={user} onComplete={handleOnboardingComplete} />}

          {APP_PAGES.includes(page) && user && (
            <AppShell page={page} onNav={navigate} user={user}>
              {page === "dashboard"      && <Dashboard brandProfile={brandProfile} onNav={navigate} outputs={outputs} favorites={favorites} selectedOutputs={selectedOutputs} onDownloadPDF={handleDownloadPDF} />}
              {page === "brand-identity" && <BrandIdentityPage {...appProps} />}
              {page === "content-copy"   && <ContentCopyPage {...appProps} />}
              {page === "voice-style"    && <VoiceStylePage brandProfile={brandProfile} onOutput={handleOutput} />}
              {page === "settings"       && <SettingsPage user={user} onNav={navigate} />}
            </AppShell>
          )}
        </PageWrapper>

        {user && <AIChatWidget brandProfile={brandProfile} />}

        {/* Celebration Modal */}
        {showCelebration && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(15,10,40,0.65)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2000, animation: "fadeIn 0.3s ease",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
              borderRadius: 28, padding: 52, textAlign: "center",
              color: "white", maxWidth: 500, width: "90%",
              boxShadow: "0 32px 80px rgba(124,77,255,0.4)",
              animation: "bounceIn 0.5s var(--ease-spring)",
            }}>
              <div style={{ fontSize: 84, marginBottom: 16, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}>🎉</div>
              <h2 style={{ fontSize: 34, fontWeight: 700, marginBottom: 16, fontFamily: "Fredoka One" }}>Congratulations!</h2>
              <p style={{ fontSize: 18, marginBottom: 24, opacity: 0.95, lineHeight: 1.6 }}>{celebrationMessage}</p>
              <p style={{ fontSize: 14, marginBottom: 36, opacity: 0.82 }}>
                You've selected all your brand assets! Download your complete brand PDF now.
              </p>
              <button
                onClick={() => { handleDownloadPDF(); setShowCelebration(false); }}
                style={{
                  background: "white", color: "#7C4DFF", border: "none",
                  borderRadius: 99, padding: "16px 36px", fontSize: 16, fontWeight: 700,
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  transition: "all 0.2s var(--ease-spring)",
                  fontFamily: "Nunito",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                📥 Download Brand PDF
              </button>
            </div>
          </div>
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}
