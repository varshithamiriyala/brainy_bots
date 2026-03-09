import { useState } from "react";
import { AuthPage } from "./AuthPage";

// re-export for backwards compatibility
export { AuthPage };

// brand profile wizard with 12 questions
export function OnboardingPage({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    businessDo: "",
    industry: "",
    businessStage: "",
    targetAge: [],
    genderFocus: "",
    colorMood: "",
    logoStyle: "",
    designAesthetic: "",
    imageryStyle: "",
    personality: { playful: 50, minimal: 50, modern: 50 },
    brandVoice: "",
    brandGoals: [],
  });

  const questions = [
    {
      key: "businessDo",
      label: "What does your business do?",
      type: "textarea",
      large: true,
    },
    {
      key: "industry",
      label: "What industry are you in?",
      type: "dropdown",
      options: ["Fashion", "Tech", "Food & Beverage", "Health & Wellness", "Finance", "Education", "Entertainment", "E-commerce", "Real Estate", "Sports"],
    },
    {
      key: "businessStage",
      label: "What stage is your business at?",
      type: "pills",
      options: ["Idea", "Startup", "Growing", "Established"],
      single: true,
    },
    {
      key: "targetAge",
      label: "Who is your target age group?",
      type: "pills",
      options: ["Gen Z", "Millennial", "Gen X", "Boomer", "All"],
      multi: true,
    },
    {
      key: "genderFocus",
      label: "What is your gender focus?",
      type: "pills",
      options: ["Male", "Female", "Neutral", "All"],
      single: true,
    },
    {
      key: "colorMood",
      label: "What color mood fits your brand?",
      type: "swatches",
      options: [
        { label: "Warm", color: "#FFB74D" },
        { label: "Cool", color: "#64B5F6" },
        { label: "Dark", color: "#424242" },
        { label: "Pastel", color: "#F8BBD9" },
        { label: "Vibrant", color: "#FF5722" },
        { label: "Neutral", color: "#9E9E9E" },
      ],
      single: true,
    },
    {
      key: "logoStyle",
      label: "What logo style do you want?",
      type: "cards",
      options: ["Wordmark", "Icon", "Monogram", "Abstract", "Combination"],
      single: true,
    },
    {
      key: "designAesthetic",
      label: "What design aesthetic fits your brand?",
      type: "cards",
      options: ["Minimal", "Bold", "Playful", "Elegant", "Futuristic", "Retro"],
      single: true,
    },
    {
      key: "imageryStyle",
      label: "What imagery style fits your brand?",
      type: "cards",
      options: ["Photography", "Illustration", "3D", "Flat"],
      single: true,
    },
    {
      key: "personality",
      label: "Set your brand personality",
      type: "sliders",
      sliders: [
        { left: "Playful", right: "Professional", key: "playful" },
        { left: "Minimal", right: "Bold", key: "minimal" },
        { left: "Modern", right: "Classic", key: "modern" },
      ],
    },
    {
      key: "brandVoice",
      label: "What is your brand voice?",
      type: "pills",
      options: ["Friendly", "Authoritative", "Witty", "Inspiring", "Luxurious", "Edgy"],
      single: true,
    },
    {
      key: "brandGoals",
      label: "What are your brand goals?",
      type: "pills",
      options: ["Build Trust", "Go Viral", "Look Premium", "Appeal Globally", "Build Community"],
      multi: true,
    },
  ];

  const handleChange = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleMultiSelect = (key, option, selected) => {
    const current = profile[key] || [];
    if (selected) {
      setProfile({ ...profile, [key]: [...current, option] });
    } else {
      setProfile({ ...profile, [key]: current.filter(o => o !== option) });
    }
  };

  const handleSlider = (sliderKey, value) => {
    setProfile({
      ...profile,
      personality: { ...profile.personality, [sliderKey]: value },
    });
  };

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = () => {
    onComplete(profile);
  };

  const current = questions[step];

  const renderInput = () => {
    switch (current.type) {
      case "textarea":
        return (
          <textarea
            value={profile[current.key]}
            onChange={(e) => handleChange(current.key, e.target.value)}
            rows={current.large ? 6 : 4}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #ccc",
              outline: "none",
              fontSize: 16,
              resize: "vertical",
              transition: "border 0.25s",
            }}
          />
        );
      case "dropdown":
        return (
          <select
            value={profile[current.key]}
            onChange={(e) => handleChange(current.key, e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #ccc",
              outline: "none",
              fontSize: 16,
              transition: "border 0.25s",
            }}
          >
            <option value="">Select...</option>
            {current.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "pills":
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {current.options.map(opt => {
              const selected = current.multi
                ? (profile[current.key] || []).includes(opt)
                : profile[current.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (current.multi) {
                      handleMultiSelect(current.key, opt, !selected);
                    } else {
                      handleChange(current.key, selected ? "" : opt);
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: "1px solid #ccc",
                    background: selected ? "#7C4DFF" : "#fff",
                    color: selected ? "#fff" : "#7C4DFF",
                    cursor: "pointer",
                    fontFamily: "Fredoka One, sans-serif",
                    fontSize: 14,
                    transition: "all 0.25s",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );
      case "swatches":
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {current.options.map(opt => {
              const selected = profile[current.key] === opt.label;
              return (
                <button
                  key={opt.label}
                  onClick={() => handleChange(current.key, selected ? "" : opt.label)}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    border: selected ? "3px solid #7C4DFF" : "1px solid #ccc",
                    background: opt.color,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#fff",
                    textShadow: "0 0 4px rgba(0,0,0,0.5)",
                    transition: "all 0.25s",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );
      case "cards":
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {current.options.map(opt => {
              const selected = profile[current.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleChange(current.key, selected ? "" : opt)}
                  style={{
                    padding: "16px",
                    borderRadius: 12,
                    border: selected ? "2px solid #7C4DFF" : "1px solid #ccc",
                    background: selected ? "#F5EEFF" : "#fff",
                    cursor: "pointer",
                    fontFamily: "Fredoka One, sans-serif",
                    fontSize: 14,
                    color: selected ? "#7C4DFF" : "#2D1B69",
                    transition: "all 0.25s",
                    minWidth: 100,
                    textAlign: "center",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );
      case "sliders":
        return (
          <div style={{ width: "100%" }}>
            {current.sliders.map(slider => (
              <div key={slider.key} style={{ marginBottom: 24 }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 14,
                  color: "#6B5B8A",
                }}>
                  <span>{slider.left}</span>
                  <span>{slider.right}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profile.personality[slider.key]}
                  onChange={(e) => handleSlider(slider.key, e.target.value)}
                  style={{
                    width: "100%",
                    height: 6,
                    borderRadius: 3,
                    background: "#e0e0e0",
                    outline: "none",
                    appearance: "none",
                  }}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #F5EEFF, #FFF0F8, #EEF4FF)",
      padding: 20,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 700,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        borderRadius: 28,
        padding: 40,
        boxShadow: "0 20px 40px rgba(124,77,255,0.15)",
        border: "1px solid rgba(255,255,255,0.2)",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "Fredoka One, sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: "#7C4DFF",
          marginBottom: 8,
        }}>
          Brand Profile Wizard
        </h2>
        <p style={{
          color: "#6B5B8A",
          fontSize: 16,
          marginBottom: 32,
        }}>
          Question {step + 1} of {questions.length}
        </p>

        <div style={{ marginBottom: 32 }}>
          <label style={{
            display: "block",
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 18,
            color: "#2D1B69",
            marginBottom: 16,
          }}>
            {current.label}
          </label>
          {renderInput()}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <button
            onClick={prev}
            disabled={step === 0}
            style={{
              padding: "12px 24px",
              borderRadius: 20,
              border: "1px solid #ccc",
              background: step === 0 ? "#f0f0f0" : "#fff",
              color: step === 0 ? "#ccc" : "#7C4DFF",
              cursor: step === 0 ? "not-allowed" : "pointer",
              fontFamily: "Fredoka One, sans-serif",
              fontSize: 16,
              transition: "background 0.25s",
            }}
          >
            Previous
          </button>

          {step < questions.length - 1 ? (
            <button
              onClick={next}
              style={{
                padding: "12px 24px",
                borderRadius: 20,
                border: "none",
                background: "#7C4DFF",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "Fredoka One, sans-serif",
                fontSize: 16,
                transition: "background 0.25s",
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={finish}
              style={{
                padding: "12px 24px",
                borderRadius: 20,
                border: "none",
                background: "#7C4DFF",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "Fredoka One, sans-serif",
                fontSize: 16,
                transition: "background 0.25s",
              }}
            >
              Generate My Brand Profile
            </button>
          )}
        </div>

        {/* progress bar */}
        <div style={{
          marginTop: 32,
          width: "100%",
          height: 8,
          background: "#e0e0e0",
          borderRadius: 4,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${((step + 1) / questions.length) * 100}%`,
            height: "100%",
            background: "#7C4DFF",
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
