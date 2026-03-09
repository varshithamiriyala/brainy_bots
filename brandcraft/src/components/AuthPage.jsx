import { useState, useEffect, useRef } from "react";

export function AuthPage({ type = "login", onAuth, onNav }) {
  const [formType, setFormType] = useState(type);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isStartled, setIsStartled] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const bearRef = useRef(null);

  const isSignup = formType === "signup";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsStartled(e.clientX < w * 0.44 && e.clientY > h * 0.15 && e.clientY < h * 0.9);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onAuth({ email, id: "user_" + Date.now() });
  };

  const getEyePosition = (eyeX, eyeY) => {
    if (!bearRef.current) return { x: 0, y: 0 };
    const rect = bearRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = cursorPos.x - centerX;
    const dy = cursorPos.y - centerY;
    const max = 8;
    return { x: Math.max(-max, Math.min(max, dx / 10)), y: Math.max(-max, Math.min(max, dy / 10)) };
  };

  const getBodyRotation = () => {
    if (!bearRef.current) return 0;
    const rect = bearRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const dx = cursorPos.x - cx;
    const max = 9;
    return Math.max(-max, Math.min(max, dx / 20));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #F5EEFF, #FFF0F8, #EEF4FF)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative blobs */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(124,77,255,0.1), transparent 70%)",
          borderRadius: "50%",
          top: -100,
          left: -100,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(255,107,157,0.1), transparent 70%)",
          borderRadius: "50%",
          bottom: -50,
          right: -50,
          filter: "blur(40px)",
        }}
      />

      {/* left panel - bear */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          position: "relative",
        }}
      >
        {/* floating emojis */}
        <div
          style={{
            position: "absolute",
            fontSize: 32,
            animation: "float 4s ease-in-out infinite",
            top: "20%",
            left: "20%",
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            fontSize: 28,
            animation: "float 5s ease-in-out infinite 1s",
            top: "30%",
            right: "25%",
          }}
        >
          ⭐
        </div>
        <div
          style={{
            position: "absolute",
            fontSize: 30,
            animation: "float 6s ease-in-out infinite 2s",
            bottom: "25%",
            left: "25%",
          }}
        >
          💫
        </div>
        <div
          style={{
            position: "absolute",
            fontSize: 26,
            animation: "float 4.5s ease-in-out infinite 0.5s",
            bottom: "35%",
            right: "20%",
          }}
        >
          🌸
        </div>

        {/* bear SVG */}
        <div
          ref={bearRef}
          style={{
            width: 300,
            height: 300,
            position: "relative",
            animation: "breathe 3s ease-in-out infinite",
            transform: `rotate(${getBodyRotation()}deg)`,
            transition: "transform 0.3s ease",
          }}
        >
          <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%" }}>
            {/* body */}
            <ellipse
              cx="150"
              cy="180"
              rx="80"
              ry="70"
              fill="#EDE0FF"
              stroke="#D4B8FF"
              strokeWidth="3"
            />
            {/* head */}
            <circle
              cx="150"
              cy="100"
              r="65"
              fill="#EDE0FF"
              stroke="#D4B8FF"
              strokeWidth="3"
            />
            {/* ears */}
            <circle
              cx="110"
              cy="60"
              r="20"
              fill="#C4A0FF"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            <circle
              cx="190"
              cy="60"
              r="20"
              fill="#C4A0FF"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            <circle cx="110" cy="60" r="12" fill="#EDE0FF" />
            <circle cx="190" cy="60" r="12" fill="#EDE0FF" />
            {/* eyes */}
            <ellipse
              cx="135"
              cy="90"
              rx={isStartled ? "12" : "10"}
              ry={isBlinking ? "1" : isStartled ? "12" : "10"}
              fill="white"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            <ellipse
              cx="165"
              cy="90"
              rx={isStartled ? "12" : "10"}
              ry={isBlinking ? "1" : isStartled ? "12" : "10"}
              fill="white"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            {/* pupils */}
            <circle
              cx={135 + getEyePosition(135, 90).x}
              cy={90 + getEyePosition(135, 90).y}
              r="6"
              fill="#2D1B69"
            />
            <circle
              cx={165 + getEyePosition(165, 90).x}
              cy={90 + getEyePosition(165, 90).y}
              r="6"
              fill="#2D1B69"
            />
            {/* nose */}
            <ellipse cx="150" cy="110" rx="8" ry="5" fill="#D4B8FF" />
            {/* mouth */}
            {isStartled ? (
              <circle
                cx="150"
                cy="125"
                r="8"
                fill="none"
                stroke="#D4B8FF"
                strokeWidth="3"
              />
            ) : (
              <path
                d="M 140 120 Q 150 135 160 120"
                fill="none"
                stroke="#D4B8FF"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
            {/* arms */}
            <ellipse
              cx="90"
              cy="160"
              rx="15"
              ry="25"
              fill="#C4A0FF"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            <ellipse
              cx="210"
              cy="160"
              rx="15"
              ry="25"
              fill="#C4A0FF"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            {/* legs */}
            <ellipse
              cx="120"
              cy="240"
              rx="18"
              ry="30"
              fill="#C4A0FF"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            <ellipse
              cx="180"
              cy="240"
              rx="18"
              ry="30"
              fill="#C4A0FF"
              stroke="#D4B8FF"
              strokeWidth="2"
            />
            {/* cheeks */}
            <circle
              cx="115"
              cy="105"
              r="12"
              fill={isStartled ? "#FF6B9D" : "#FFB8D9"}
              opacity="0.6"
            />
            <circle
              cx="185"
              cy="105"
              r="12"
              fill={isStartled ? "#FF6B9D" : "#FFB8D9"}
              opacity="0.6"
            />
          </svg>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 24,
            color: "#7C4DFF",
            fontWeight: 800,
          }}
        >
          Let's Write Yours. ✨
        </div>
      </div>

      {/* right panel form */}
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
            maxWidth: 400,
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: 28,
            padding: 40,
            boxShadow: "0 20px 40px rgba(124,77,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "Fredoka One, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#7C4DFF",
                marginBottom: 8,
              }}
            >
              BrandCraft
            </div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {isSignup ? "🎉" : "👋"}
            </div>
            <h2
              style={{
                fontFamily: "Fredoka One, sans-serif",
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 8,
                color: "#2D1B69",
              }}
            >
              {isSignup ? "Join the Magic" : "Welcome Back"}
            </h2>
            <p
              style={{
                color: "#6B5B8A",
                fontSize: 16,
                marginBottom: 0,
              }}
            >
              {isSignup
                ? "Create your account and let the story begin."
                : "Sign in to continue your tale."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                marginBottom: 16,
                borderRadius: 12,
                border: "1px solid #ccc",
                outline: "none",
                transition: "border 0.25s",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                marginBottom: 24,
                borderRadius: 12,
                border: "1px solid #ccc",
                outline: "none",
                transition: "border 0.25s",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 20,
                border: "none",
                background: "#7C4DFF",
                color: "#fff",
                fontFamily: "Fredoka One, sans-serif",
                fontSize: 16,
                cursor: "pointer",
                transition: "background 0.25s",
              }}
            >
              {loading ? "..." : isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>

          <div
            style={{
              marginTop: 16,
              fontSize: 14,
              color: "#6B5B8A",
            }}
          >
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              style={{ color: "#7C4DFF", cursor: "pointer" }}
              onClick={() => setFormType(isSignup ? "login" : "signup")}
            >
              {isSignup ? "Log in" : "Sign up"}
            </span>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
            <div
              style={{ padding: "0 8px", color: "#6B5B8A", fontSize: 12 }}
            >
              OR
            </div>
            <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
          </div>

          <button
            onClick={() => onAuth({ email: "google", id: "google_" + Date.now() })}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px 0",
              borderRadius: 20,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>🔴</span>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes breathe {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
