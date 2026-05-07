"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DEVELOPER NOTE:
//   Place  `moonshine.apk`  inside the  `/public`  directory at the project
//   root so that Next.js serves it at the path  `/moonshine.apk`.
//   e.g.  WishingSite/public/moonshine.apk
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// ── Floating particle ─────────────────────────────────────────────────────────
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.15,
  }));
}

export default function BirthdayVault() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  // Hydration-safe: generate particles only on client
  useEffect(() => {
    setParticles(generateParticles(60));
    // slight mount delay for the entrance animation
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // give the button a moment to fade before revealing the payload
    setTimeout(() => setShowPayload(true), 500);
  };

  return (
    <>
      {/* ── Global keyframes injected as a style tag ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float-up {
          0%   { transform: translateY(0px) scale(1);   opacity: var(--p-op); }
          50%  { transform: translateY(-18px) scale(1.15); opacity: calc(var(--p-op) * 1.6); }
          100% { transform: translateY(0px) scale(1);   opacity: var(--p-op); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0  rgba(167,139,250,0.55); }
          70%  { box-shadow: 0 0 0 18px rgba(167,139,250,0);  }
          100% { box-shadow: 0 0 0 0  rgba(167,139,250,0);   }
        }
        @keyframes glow-breathe {
          0%, 100% { box-shadow: 0 0 28px 6px rgba(139,92,246,0.45), 0 0 60px 14px rgba(99,102,241,0.18); }
          50%       { box-shadow: 0 0 42px 12px rgba(139,92,246,0.7), 0 0 90px 24px rgba(99,102,241,0.30); }
        }
        @keyframes reveal-payload {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes star-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .particle {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(167,139,250,1) 0%, rgba(99,102,241,0.5) 60%, transparent 100%);
          animation: float-up var(--p-dur) ease-in-out var(--p-delay) infinite;
          pointer-events: none;
        }
        .card-glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 2rem;
        }
        .btn-unlock {
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          border: 1px solid rgba(167,139,250,0.4);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.85rem 2.4rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: opacity 0.45s ease, transform 0.2s ease, box-shadow 0.3s ease;
          animation: pulse-ring 2.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        .btn-unlock:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 0 40px 10px rgba(124,58,237,0.55);
        }
        .btn-unlock:active { transform: scale(0.97); }

        .payload-link {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #6d28d9 0%, #3730a3 100%);
          border: 1px solid rgba(167,139,250,0.5);
          color: #ede9fe;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          padding: 1rem 2.8rem;
          border-radius: 9999px;
          text-decoration: none;
          cursor: pointer;
          animation: glow-breathe 3s ease-in-out infinite, reveal-payload 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
        }
        .payload-link:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 60px 16px rgba(109,40,217,0.65);
          color: #fff;
        }
        .payload-link:active { transform: scale(0.97); }

        .divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
          margin: 0 auto;
        }
        .ornament {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: rgba(167,139,250,0.6);
          box-shadow: 0 0 8px 2px rgba(167,139,250,0.4);
        }
      `}</style>

      {/* ── Root container ─────────────────────────────────────────────────── */}
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "linear-gradient(170deg, #020617 0%, #0f0a2a 45%, #1e1b4b 100%)",
          fontFamily: "'Inter', sans-serif",
          padding: "1.5rem",
        }}
      >
        {/* ── Ambient blobs ─────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            overflow: "hidden",
          }}
          aria-hidden
        >
          <div style={{
            position: "absolute", top: "-15%", left: "-10%",
            width: "55vw", height: "55vw", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
          <div style={{
            position: "absolute", bottom: "-10%", right: "-8%",
            width: "50vw", height: "50vw", borderRadius: "9999px",
            background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
          <div style={{
            position: "absolute", top: "40%", left: "50%",
            width: "30vw", height: "30vw", borderRadius: "9999px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }} />
        </div>

        {/* ── Floating particles ────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                ["--p-op" as string]: p.opacity,
                ["--p-dur" as string]: `${p.duration}s`,
                ["--p-delay" as string]: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div
          className="card-glass"
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "640px",
            width: "100%",
            padding: "clamp(2rem, 6vw, 4rem)",
            textAlign: "center",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          {/* ── Top ornament ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
            <div className="divider" style={{ width: "40px" }} />
            <span className="ornament" />
            <span style={{
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(167,139,250,0.6)",
              fontWeight: 500,
            }}>For You</span>
            <span className="ornament" />
            <div className="divider" style={{ width: "40px" }} />
          </div>

          {/* ── Date ── */}
          <p style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(167,139,250,0.45)",
            marginBottom: "1.25rem",
            fontFamily: "'Inter', sans-serif",
          }}>
            May 7th, 2026
          </p>

          {/* ── Main headline ── */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
            fontWeight: 300,
            lineHeight: 1.12,
            color: "#f5f3ff",
            marginBottom: "0.5rem",
            letterSpacing: "-0.01em",
          }}>
            Happy Birthday,
          </h1>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.8rem, 8vw, 5.2rem)",
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "2.25rem",
            letterSpacing: "-0.01em",
          }}>
            Moon ✦
          </h2>

          {/* ── Divider ── */}
          <div className="divider" style={{ marginBottom: "2.25rem" }} />

          {/* ── Personal message ── */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(221, 214, 254, 0.85)",
            lineHeight: 1.85,
            marginBottom: "0.85rem",
          }}>
            Every year you exist makes the world a little softer,
            a little brighter — and infinitely more worth living in.
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            fontWeight: 300,
            color: "rgba(196, 181, 253, 0.65)",
            lineHeight: 1.8,
            marginBottom: "2.75rem",
          }}>
            This one&apos;s been made with every quiet moment I thought of you.
            It&apos;s yours — all of it.
          </p>

          {/* ── CTA area ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>

            {/* Unlock button — fades out on click */}
            {!isUnlocked && (
              <button
                className="btn-unlock"
                onClick={handleUnlock}
                aria-label="Unlock your gift"
                style={{
                  opacity: isUnlocked ? 0 : 1,
                  pointerEvents: isUnlocked ? "none" : "auto",
                  transition: "opacity 0.45s ease",
                }}
              >
                ✦&nbsp;&nbsp;Unlock Your Gift&nbsp;&nbsp;✦
              </button>
            )}

            {/* ── Payload — revealed after unlock ── */}
            {showPayload && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", animation: "reveal-payload 0.55s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "rgba(167,139,250,0.55)",
                  letterSpacing: "0.04em",
                }}>
                  Your secret is waiting ↓
                </p>

                {/* ── PAYLOAD LINK — moonshine.apk must be in /public ── */}
                <a
                  href="/moonshine.apk"
                  download="Moonshine.apk"
                  className="payload-link"
                  aria-label="Download and install Moonshine"
                >
                  {/* Download icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Install Moonshine
                </a>

                <p style={{
                  fontSize: "0.7rem",
                  color: "rgba(167,139,250,0.35)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Android · Enable unknown sources if prompted
                </p>
              </div>
            )}
          </div>

          {/* ── Bottom ornament ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginTop: "3rem" }}>
            <div className="divider" style={{ width: "30px" }} />
            <span style={{ fontSize: "0.6rem", color: "rgba(167,139,250,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Made with love</span>
            <div className="divider" style={{ width: "30px" }} />
          </div>
        </div>

        {/* ── Corner stars ── */}
        {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              ...(pos.includes("top") ? { top: "1rem" } : { bottom: "1rem" }),
              ...(pos.includes("left") ? { left: "1rem" } : { right: "1rem" }),
              fontSize: "0.7rem",
              color: "rgba(167,139,250,0.2)",
              animation: `star-spin ${12 + i * 3}s linear infinite`,
              pointerEvents: "none",
            }}
          >
            ✦
          </div>
        ))}
      </main>
    </>
  );
}
