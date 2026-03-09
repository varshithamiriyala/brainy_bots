import { useState } from "react";
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

// Motivational messages for brand selection
const motivationalMessages = [
  "🌟 Amazing choice! Your brand is getting stronger!",
  "✨ Fantastic! You're building something special!",
  "🎯 Perfect pick! Your brand identity is coming together!",
  "💪 Great selection! Keep building your dream brand!",
  "🚀 You're on fire! Your brand is shining brighter!",
  "🌈 Beautiful choice! Your brand story is unfolding!",
  "🏆 Brilliant! You're creating a legendary brand!",
  "💫 Wonderful! Your brand is getting unique!",
  "🔥 Awesome! Keep the momentum going!",
  "🌟 Superb! You're crafting something amazing!",
];

// Celebration messages for completing all selections
const celebrationMessages = [
  "🎉 Congratulations! You've completed your brand identity!",
  "🏆 Amazing! Your brand package is ready to shine!",
  "✨ Wow! You've built a complete brand!",
  "🚀 Incredible! Your brand story is complete!",
  "💎 Fantastic! Your brand is ready for the world!",
];

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [brandProfile, setBrandProfile] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedOutputs, setSelectedOutputs] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Persist tool outputs across navigation - stores all generated content
  const [toolOutputs, setToolOutputs] = useState({
    "brand-names": [],
    "color-palette": [],
    "font-pairing": [],
    "logo-creator": [],
    "ad-copy": [],
    "social-bio": [],
    "email-builder": [],
    "content-calendar": [],
  });
  const [confettiType, setConfettiType] = useState("default");
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const { msg: toastMsg, show: showToast } = useToast();

  // Required outputs for complete brand package
  const requiredOutputs = [
    "Brand Names", "Color Palette", "Font Pairing", "Logo Creator",
    "Ad Copy", "Social Bio", "Email Templates"
  ];

  const getRandomMotivationalMessage = () => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  const getRandomCelebrationMessage = () => {
    return celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
  };

  const checkAllSelected = () => {
    return requiredOutputs.every(key => selectedOutputs[key]);
  };

  const navigate = (target) => {
    if (APP_PAGES.includes(target) && !user) {
      setPage("login");
      return;
    }
    setPage(target);
  };

  const handleAuth = (userData) => {
    setUser(userData);
    setPage(brandProfile ? "dashboard" : "onboarding");
  };

  const handleOnboardingComplete = (data) => {
    setBrandProfile(data);
    setPage("dashboard");
    showToast("✨ Brand profile created!");
  };

  const handleOutput = (feature, preview) => {
    setOutputs(o => [...o, { feature, preview, time: Date.now() }]);
  };

  // Function to save tool outputs for persistence across navigation
  const saveToolOutput = (toolKey, outputData) => {
    setToolOutputs(prev => ({
      ...prev,
      [toolKey]: [...(prev[toolKey] || []), { ...outputData, time: Date.now() }]
    }));
  };

  // Function to get persisted outputs for a specific tool
  const getToolOutputs = (toolKey) => {
    return toolOutputs[toolKey] || [];
  };

  const handleFavorite = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    showToast("⭐ Favourited!");
  };

  const handleSelect = (feature, outputId) => {
    const wasAllSelected = checkAllSelected();
    setSelectedOutputs(s => ({ ...s, [feature]: outputId }));

    // Show confetti and message for selection
    setConfettiType("default");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Show motivational message
    showToast(getRandomMotivationalMessage());

    // Check if all are now selected after this selection
    const allSelectedNow = requiredOutputs.every(key => {
      if (key === feature) return true;
      return selectedOutputs[key];
    });

    if (allSelectedNow && !wasAllSelected) {
      setTimeout(() => {
        setConfettiType("celebration");
        setShowConfetti(true);
        setCelebrationMessage(getRandomCelebrationMessage());
        setShowCelebration(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowCelebration(false);
        }, 6000);
      }, 3500);
    }
  };

  const handleDownloadPDF = () => {
    // Simulate PDF download
    showToast("📄 Downloading your Brand PDF...");
    // In a real app, this would generate and download the PDF
    setTimeout(() => {
      showToast("✅ Your Brand PDF is ready!");
    }, 2000);
  };

  const appProps = {
    brandProfile,
    onOutput: handleOutput,
    favorites,
    onFavorite: handleFavorite,
    selectedOutputs,
    onSelect: handleSelect,
    onDownloadPDF: handleDownloadPDF,
    // Add persistence functions
    toolOutputs,
    saveToolOutput,
    getToolOutputs,
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {showConfetti && <Confetti numberOfPieces={confettiType === "celebration" ? 300 : 100} recycle={false} />}
        {toastMsg && <div className="toast">{toastMsg}</div>}

        {page === "landing" && <LandingPage onNav={navigate} />}
        {page === "signup" && <AuthPage type="signup" onAuth={handleAuth} onNav={navigate} />}
        {page === "login" && <AuthPage type="login" onAuth={handleAuth} onNav={navigate} />}
        {page === "onboarding" && <OnboardingPage user={user} onComplete={handleOnboardingComplete} />}

        {APP_PAGES.includes(page) && user && (
          <AppShell page={page} onNav={navigate} user={user}>
            {page === "dashboard" && <Dashboard brandProfile={brandProfile} onNav={navigate} outputs={outputs} favorites={favorites} selectedOutputs={selectedOutputs} onDownloadPDF={handleDownloadPDF} />}
            {page === "brand-identity" && <BrandIdentityPage {...appProps} />}
            {page === "content-copy" && <ContentCopyPage {...appProps} />}
            {page === "voice-style" && <VoiceStylePage brandProfile={brandProfile} onOutput={handleOutput} />}
            {page === "settings" && <SettingsPage user={user} onNav={navigate} />}
          </AppShell>
        )}

        {user && <AIChatWidget brandProfile={brandProfile} />}

        {/* Celebration Modal */}
        {showCelebration && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
              borderRadius: 24,
              padding: 48,
              textAlign: "center",
              color: "white",
              maxWidth: 500,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              animation: "bounceIn 0.5s ease"
            }}>
              <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, fontFamily: "Fredoka One" }}>
                Congratulations!
              </h2>
              <p style={{ fontSize: 18, marginBottom: 24, opacity: 0.95, lineHeight: 1.6 }}>
                {celebrationMessage}
              </p>
              <p style={{ fontSize: 14, marginBottom: 32, opacity: 0.85 }}>
                You've selected all your brand assets! Download your complete brand PDF now.
              </p>
              <button
                onClick={() => {
                  handleDownloadPDF();
                  setShowCelebration(false);
                }}
                style={{
                  background: "white",
                  color: "#7C4DFF",
                  border: "none",
                  borderRadius: 20,
                  padding: "16px 32px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
                }}
              >
                📥 Download Brand PDF
              </button>
            </div>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes bounceIn { 
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}

