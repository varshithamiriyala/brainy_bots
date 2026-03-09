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

const APP_PAGES = ["dashboard", "brand-identity", "content-copy", "voice-style", "settings"];

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [brandProfile, setBrandProfile] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { msg: toastMsg, show: showToast } = useToast();

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

  const handleFavorite = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
    showToast("⭐ Favourited!");
  };

  const appProps = {
    brandProfile,
    onOutput: handleOutput,
    favorites,
    onFavorite: handleFavorite,
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <>
          {toastMsg && <div className="toast">{toastMsg}</div>}

          {page === "landing" && <LandingPage onNav={navigate} />}
        {page === "signup" && <AuthPage type="signup" onAuth={handleAuth} onNav={navigate} />}
        {page === "login" && <AuthPage type="login" onAuth={handleAuth} onNav={navigate} />}
        {page === "onboarding" && <OnboardingPage user={user} onComplete={handleOnboardingComplete} />}

        {APP_PAGES.includes(page) && user && (
          <AppShell page={page} onNav={navigate} user={user}>
            {page === "dashboard" && <Dashboard brandProfile={brandProfile} onNav={navigate} outputs={outputs} favorites={favorites} />}
            {page === "brand-identity" && <BrandIdentityPage {...appProps} />}
            {page === "content-copy" && <ContentCopyPage {...appProps} />}
            {page === "voice-style" && <VoiceStylePage brandProfile={brandProfile} onOutput={handleOutput} />}
            {page === "settings" && <SettingsPage user={user} onNav={navigate} />}
          </AppShell>
        )}

        {user && <AIChatWidget brandProfile={brandProfile} />}
        </>
      </LanguageProvider>
    </ThemeProvider>
  );
}
