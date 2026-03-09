import { useState, useEffect, useRef } from "react";

const tools = [
  { name: "Brand Name Generator", emoji: "✨", desc: "Generate unique names that fit your brand", color: "#7C4DFF" },
  { name: "Logo Creator", emoji: "🎨", desc: "AI-generated logos in seconds", color: "#FF6B9D" },
  { name: "Color Palette", emoji: "🌈", desc: "Perfect colors that match your vibe", color: "#FF8C42" },
  { name: "Typography Pairing", emoji: "🖋️", desc: "Font combinations that look professional", color: "#26C6DA" },
  { name: "Ad Copy Generator", emoji: "📣", desc: "Words that make hearts skip", color: "#66BB6A" },
  { name: "Social Media Bio", emoji: "🌟", desc: "Bios that tell your story", color: "#FFA726" },
  { name: "Email Template Builder", emoji: "💌", desc: "Messages that connect deeply", color: "#EC407A" },
  { name: "Content Calendar", emoji: "📅", desc: "Ideas that flow endless", color: "#5C6BC0" },
  { name: "Voice & Tone", emoji: "🎙️", desc: "Your brand's unique voice", color: "#AB47BC" },
  { name: "Sentiment Analysis", emoji: "💡", desc: "Feelings made visible", color: "#26A69A" },
];

export default function ToolsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const carouselRef = useRef(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % tools.length);
    resetTimer();
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + tools.length) % tools.length);
    resetTimer();
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
    resetTimer();
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / (3.8 * 10)); // 10 updates per second
      });
    }, 100);

    intervalRef.current = setTimeout(nextSlide, 3800);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const diff = startX - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      setStartX(e.touches[0].clientX);
    }
  };

  const activeTool = tools[activeIndex];

  return (
    <div
      ref={carouselRef}
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        fontFamily: "Nunito, sans-serif",
        background: "#FDF8FF",
        borderRadius: 24,
        padding: 32,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Main Card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${activeTool.color}20, ${activeTool.color}10)`,
          border: `2px solid ${activeTool.color}30`,
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          position: "relative",
          animation: "cardIn 0.5s ease",
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            marginBottom: 20,
            animation: "bounce 0.6s ease",
          }}
        >
          {activeTool.emoji}
        </div>
        <h2
          style={{
            fontFamily: "Fredoka One, sans-serif",
            fontSize: 32,
            color: "#2D1B69",
            marginBottom: 12,
            fontWeight: 800,
          }}
        >
          {activeTool.name}
        </h2>
        <p
          style={{
            color: "#6B5B8A",
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 24,
            maxWidth: 400,
          }}
        >
          {activeTool.desc}
        </p>
        <div
          style={{
            background: activeTool.color,
            color: "white",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          Tool #{activeIndex + 1}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          background: "white",
          border: "2px solid #E0E0E0",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 20,
          transition: "all 0.2s",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1.1)";
          e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          background: "white",
          border: "2px solid #E0E0E0",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 20,
          transition: "all 0.2s",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1.1)";
          e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
      >
        →
      </button>

      {/* Emoji Thumbnails */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 32,
          flexWrap: "wrap",
        }}
      >
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              background: index === activeIndex ? tool.color : "white",
              border: `2px solid ${index === activeIndex ? tool.color : "#E0E0E0"}`,
              borderRadius: 16,
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 24,
              transition: "all 0.3s",
              transform: index === activeIndex ? "scale(1.1)" : "scale(1)",
              boxShadow: index === activeIndex ? `0 4px 16px ${tool.color}40` : "0 2px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              if (index !== activeIndex) {
                e.target.style.transform = "scale(1.05) translateY(-4px)";
              }
            }}
            onMouseLeave={(e) => {
              if (index !== activeIndex) {
                e.target.style.transform = "scale(1) translateY(0)";
              }
            }}
          >
            {tool.emoji}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: 4,
          background: "#E0E0E0",
          borderRadius: 2,
          marginTop: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${activeTool.color}, ${activeTool.color}80)`,
            borderRadius: 2,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}