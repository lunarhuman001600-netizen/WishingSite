"use client";
// NOTE: Place moonshine.apk inside /public so Next.js serves it at /moonshine.apk

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "letter" | "cake" | "gift";
type Particle = { id: number; x: number; y: number; sz: number; dur: number; del: number; op: number };

const S = {
  serif: "'Cormorant Garamond', serif",
  sans: "'Inter', sans-serif",
  purple: "rgba(167,139,250,",
};

function useParticles(n: number) {
  const [p, setP] = useState<Particle[]>([]);
  useEffect(() => {
    setP(Array.from({ length: n }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      sz: Math.random() * 3 + 1, dur: Math.random() * 8 + 6,
      del: Math.random() * 5, op: Math.random() * 0.4 + 0.1,
    })));
  }, []);
  return p;
}

// ── Cake ──────────────────────────────────────────────────────────────────────
function Cake({ onBlow }: { onBlow: () => void }) {
  const [blown, setBlown] = useState(false);
  const blow = () => { if (blown) return; setBlown(true); onBlow(); };

  return (
    <motion.div onClick={blow} role="button" aria-label="Blow the candle"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
      <svg width="180" height="230" viewBox="0 0 180 230">
        <defs>
          <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" /><stop offset="60%" stopColor="#f97316" /><stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="bT" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="bM" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
          <linearGradient id="bB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d28d9" /><stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {/* Bottom layer */}
        <motion.g initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, type: "spring", stiffness: 120 }}>
          <rect x="25" y="175" width="130" height="44" rx="7" fill="url(#bB)" />
          <rect x="25" y="175" width="130" height="9" rx="4" fill="rgba(255,255,255,0.14)" />
          {[42, 62, 82, 102, 122, 142].map((x, i) => <ellipse key={i} cx={x} cy={175} rx={5} ry={7} fill="rgba(255,255,255,0.92)" />)}
          <circle cx="65" cy="198" r="5" fill="rgba(251,191,36,0.8)" />
          <circle cx="90" cy="202" r="4" fill="rgba(244,114,182,0.8)" />
          <circle cx="115" cy="198" r="5" fill="rgba(251,191,36,0.8)" />
        </motion.g>

        {/* Middle layer */}
        <motion.g initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: "spring", stiffness: 120 }}>
          <rect x="40" y="135" width="100" height="43" rx="6" fill="url(#bM)" />
          <rect x="40" y="135" width="100" height="8" rx="3" fill="rgba(255,255,255,0.14)" />
          {[55, 75, 95, 115, 130].map((x, i) => <ellipse key={i} cx={x} cy={135} rx={4} ry={6} fill="rgba(255,255,255,0.92)" />)}
          <circle cx="70" cy="158" r="4" fill="rgba(167,139,250,0.9)" />
          <circle cx="110" cy="158" r="4" fill="rgba(167,139,250,0.9)" />
        </motion.g>

        {/* Top layer */}
        <motion.g initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 120 }}>
          <rect x="58" y="105" width="64" height="33" rx="5" fill="url(#bT)" />
          <rect x="58" y="105" width="64" height="7" rx="3" fill="rgba(255,255,255,0.14)" />
          {[68, 82, 96, 112].map((x, i) => <ellipse key={i} cx={x} cy={105} rx={4} ry={5} fill="rgba(255,255,255,0.92)" />)}
        </motion.g>

        {/* Candle */}
        <rect x="83" y="76" width="14" height="32" rx="3" fill="#f5f3ff" opacity={0.92} />
        <rect x="83" y="76" width="14" height="5" rx="2" fill="rgba(251,191,36,0.5)" />

        {/* Flame */}
        <AnimatePresence>
          {!blown && (
            <motion.g key="flame" exit={{ opacity: 0, y: -22 }} transition={{ duration: 0.45, ease: "easeOut" }}>
              <motion.ellipse cx="90" cy="66" rx="14" ry="18" fill="rgba(251,191,36,0.18)" filter="url(#glow)"
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
              <motion.path d="M90 52 C85 59 81 66 83 73 C85 79 90 83 90 83 C90 83 95 79 97 73 C99 66 95 59 90 52Z"
                fill="url(#fG)"
                animate={{ scaleX: [1, 1.1, 0.93, 1], scaleY: [1, 0.94, 1.06, 1] }}
                transition={{ duration: 0.75, repeat: Infinity }}
                style={{ transformOrigin: "90px 70px" }} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Smoke */}
        <AnimatePresence>
          {blown && (
            <motion.g key="smoke">
              {[0, -6, 5].map((xo, i) => (
                <motion.ellipse key={i} cx={90 + xo} cy={68 - i * 10} rx={4 + i} ry={5 + i}
                  fill="rgba(203,213,225,0.55)"
                  initial={{ opacity: 0.8, scale: 0.4, y: 0 }}
                  animate={{ opacity: 0, scale: 2, y: -35 }}
                  transition={{ duration: 1.6, delay: i * 0.18, ease: "easeOut" }} />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.p animate={{ opacity: blown ? 0 : 0.45 }}
        style={{ fontSize: "0.7rem", color: `${S.purple}0.7)`, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "-0.25rem" }}>
        tap to blow
      </motion.p>
    </motion.div>
  );
}

// ── Gift Box ──────────────────────────────────────────────────────────────────
function GiftBox({ onOpen }: { onOpen: () => void }) {
  const [opened, setOpened] = useState(false);
  const open = () => { if (opened) return; setOpened(true); onOpen(); };

  return (
    <motion.div onClick={open} role="button" aria-label="Open your gift"
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.35 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
      <svg width="170" height="165" viewBox="0 0 170 165">
        <defs>
          <linearGradient id="boxG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="lidG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        {/* Box body */}
        <rect x="18" y="78" width="134" height="78" rx="6" fill="url(#boxG)" />
        <rect x="77" y="78" width="16" height="78" fill="rgba(251,191,36,0.65)" />
        <rect x="18" y="108" width="134" height="14" fill="rgba(251,191,36,0.65)" />
        {/* Lid */}
        <motion.g animate={opened ? { y: -70, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 13 }}>
          <rect x="10" y="57" width="150" height="24" rx="5" fill="url(#lidG)" />
          <rect x="77" y="57" width="16" height="24" fill="rgba(251,191,36,0.65)" />
          <path d="M85 57 C74 43 52 43 57 53 C60 60 74 58 85 57Z" fill="rgba(251,191,36,0.92)" />
          <path d="M85 57 C96 43 118 43 113 53 C110 60 96 58 85 57Z" fill="rgba(251,191,36,0.92)" />
          <circle cx="85" cy="57" r="6" fill="#fbbf24" />
        </motion.g>
      </svg>
      <motion.p animate={{ opacity: opened ? 0 : 0.45 }}
        style={{ fontSize: "0.7rem", color: `${S.purple}0.7)`, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        tap to open
      </motion.p>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BirthdayVault() {
  const [phase, setPhase] = useState<Phase>("letter");
  const [giftOpened, setGiftOpened] = useState(false);
  const particles = useParticles(50);
  const phase3Ref = useRef<HTMLDivElement>(null);

  const handleCandleBlown = () => {
    setTimeout(() => setPhase("gift"), 1500);
  };

  useEffect(() => {
    if (phase === "gift") {
      setTimeout(() => phase3Ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 700);
    }
  }, [phase]);

  const cardStyle: React.CSSProperties = { padding: "clamp(2rem,6vw,4rem)", textAlign: "center" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float-up { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.15)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(167,139,250,.55)} 70%{box-shadow:0 0 0 18px rgba(167,139,250,0)} 100%{box-shadow:0 0 0 0 rgba(167,139,250,0)} }
        @keyframes glow-breathe { 0%,100%{box-shadow:0 0 28px 6px rgba(139,92,246,.45),0 0 60px 14px rgba(99,102,241,.18)} 50%{box-shadow:0 0 50px 14px rgba(139,92,246,.75),0 0 90px 24px rgba(99,102,241,.35)} }
        @keyframes star-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .particle { position:absolute; border-radius:9999px; background:radial-gradient(circle,rgba(167,139,250,1) 0%,rgba(99,102,241,.5) 60%,transparent 100%); animation:float-up var(--dur) ease-in-out var(--del) infinite; pointer-events:none; }
        .glass { background:linear-gradient(135deg,rgba(255,255,255,.065),rgba(255,255,255,.018)); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,.09); border-radius:2rem; }
        .btn-unlock { background:linear-gradient(135deg,#7c3aed,#4f46e5); border:1px solid rgba(167,139,250,.4); color:#fff; font-family:'Inter',sans-serif; font-size:.875rem; font-weight:500; letter-spacing:.14em; text-transform:uppercase; padding:.9rem 2.6rem; border-radius:9999px; cursor:pointer; animation:pulse-ring 2.4s cubic-bezier(.455,.03,.515,.955) infinite; }
        .payload-link { display:inline-flex; align-items:center; gap:.6rem; background:linear-gradient(135deg,#6d28d9,#3730a3); border:1px solid rgba(167,139,250,.5); color:#ede9fe; font-family:'Inter',sans-serif; font-size:1rem; font-weight:500; letter-spacing:.06em; padding:1rem 2.8rem; border-radius:9999px; text-decoration:none; cursor:pointer; animation:glow-breathe 3s ease-in-out infinite; transition:transform .2s ease; }
        .payload-link:hover { transform:translateY(-3px) scale(1.05); color:#fff; }
        .divider { width:60px; height:1px; background:linear-gradient(90deg,transparent,rgba(167,139,250,.5),transparent); margin:0 auto; }
        .ornament { display:inline-block; width:6px; height:6px; border-radius:9999px; background:rgba(167,139,250,.6); box-shadow:0 0 8px 2px rgba(167,139,250,.4); }
      `}</style>

      <main style={{ position: "relative", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(170deg,#020617 0%,#0f0a2a 45%,#1e1b4b 100%)", fontFamily: S.sans, padding: "2rem 1.5rem" }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }} aria-hidden>
          <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "55vw", height: "55vw", borderRadius: "9999px", background: "radial-gradient(circle,rgba(109,40,217,.2) 0%,transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-8%", width: "50vw", height: "50vw", borderRadius: "9999px", background: "radial-gradient(circle,rgba(79,70,229,.16) 0%,transparent 70%)", filter: "blur(60px)" }} />
        </div>

        {/* Particles */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }} aria-hidden>
          {particles.map(p => (
            <div key={p.id} className="particle" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.sz, height: p.sz, opacity: p.op, ["--dur" as string]: `${p.dur}s`, ["--del" as string]: `${p.del}s` }} />
          ))}
        </div>

        {/* Corner stars */}
        {[{ t: "1rem", l: "1rem" }, { t: "1rem", r: "1rem" }, { b: "1rem", l: "1rem" }, { b: "1rem", r: "1rem" }].map((pos, i) => (
          <div key={i} aria-hidden style={{ position: "fixed", ...pos, fontSize: ".7rem", color: "rgba(167,139,250,.18)", animation: `star-spin ${12 + i * 3}s linear infinite`, pointerEvents: "none" }}>✦</div>
        ))}

        {/* ── PHASE 1: Letter ── */}
        <AnimatePresence mode="wait">
          {phase === "letter" && (
            <motion.section key="letter"
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              style={{ position: "relative", zIndex: 10, maxWidth: 640, width: "100%" }}>
              <div className="glass" style={cardStyle}>
                {/* Ornament */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", marginBottom: "2rem" }}>
                  <div className="divider" style={{ width: 40 }} /><span className="ornament" />
                  <span style={{ fontSize: ".65rem", letterSpacing: ".25em", textTransform: "uppercase", color: `${S.purple}.6)`, fontWeight: 500 }}>For You</span>
                  <span className="ornament" /><div className="divider" style={{ width: 40 }} />
                </div>

                <p style={{ fontSize: ".75rem", letterSpacing: ".2em", textTransform: "uppercase", color: `${S.purple}.45)`, marginBottom: "1.25rem" }}>May 8th, 2026</p>

                <h1 style={{ fontFamily: S.serif, fontSize: "clamp(2.6rem,7vw,4.5rem)", fontWeight: 300, lineHeight: 1.12, color: "#f5f3ff", marginBottom: ".5rem", letterSpacing: "-.01em" }}>Happy Birthday,</h1>
                <h2 style={{ fontFamily: S.serif, fontSize: "clamp(2.8rem,8vw,5.2rem)", fontWeight: 500, fontStyle: "italic", lineHeight: 1.1, background: "linear-gradient(135deg,#c4b5fd 0%,#818cf8 50%,#a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "2.25rem", letterSpacing: "-.01em" }}>
                  My Moon {"<3"} ✦
                </h2>

                <div className="divider" style={{ marginBottom: "2.25rem" }} />

                <p style={{ fontFamily: S.serif, fontSize: "clamp(1.1rem,3vw,1.35rem)", fontWeight: 300, fontStyle: "italic", color: "rgba(221,214,254,.85)", lineHeight: 1.85, marginBottom: ".85rem" }}>
                  Every year you exist makes the world a little softer, a little brighter — and infinitely more worth living in.
                </p>
                <p style={{ fontFamily: S.serif, fontSize: "clamp(1rem,2.5vw,1.2rem)", fontWeight: 300, color: "rgba(196,181,253,.65)", lineHeight: 1.8, marginBottom: "2.75rem" }}>
                  This one&apos;s been made with every quiet moment I thought of you. It&apos;s yours — all of it.{" "}
                  <em>To, The owner of a new App and My Heart {"<3"}</em>
                </p>

                <motion.button className="btn-unlock" onClick={() => setPhase("cake")}
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  aria-label="Unlock your gift">
                  ✦&nbsp;&nbsp;Unlock Your Gift&nbsp;&nbsp;✦
                </motion.button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".75rem", marginTop: "3rem" }}>
                  <div className="divider" style={{ width: 30 }} />
                  <span style={{ fontSize: ".6rem", color: `${S.purple}.22)`, letterSpacing: ".2em", textTransform: "uppercase" }}>Made with love</span>
                  <div className="divider" style={{ width: 30 }} />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── PHASE 2: Cake ── */}
        <AnimatePresence mode="wait">
          {phase === "cake" && (
            <motion.section key="cake"
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              style={{ position: "relative", zIndex: 10, maxWidth: 520, width: "100%" }}>
              <div className="glass" style={cardStyle}>
                <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ fontFamily: S.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2rem,6vw,3rem)", color: "#ede9fe", marginBottom: ".6rem" }}>
                  Make a wish my &apos;Jaan&apos;!!!
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  style={{ fontSize: ".8rem", color: `${S.purple}.4)`, letterSpacing: ".05em", marginBottom: "2.5rem" }}>
                  (blow the candles by pressing on them)
                </motion.p>
                <Cake onBlow={handleCandleBlown} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── PHASE 3: Gift ── */}
        <AnimatePresence mode="wait">
          {phase === "gift" && (
            <motion.section key="gift" ref={phase3Ref}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ position: "relative", zIndex: 10, maxWidth: 520, width: "100%" }}>
              <div className="glass" style={cardStyle}>
                <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  style={{ fontFamily: S.serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2rem,6vw,3rem)", color: "#ede9fe", marginBottom: "2rem" }}>
                  This is for you Baby!!
                </motion.h2>

                <GiftBox onOpen={() => setGiftOpened(true)} />

                <AnimatePresence>
                  {giftOpened && (
                    <motion.div key="payload"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.45, type: "spring", stiffness: 90, damping: 14 }}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
                      {/* PAYLOAD LINK — hosted on Google Drive */}
                      <a href="https://drive.google.com/file/d/1aCNgSi9sPFFcXNxNfOIRuS0YfDOPU6rq/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="payload-link" aria-label="Download and install Moonshine">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Install Moonshine
                      </a>
                      <p style={{ fontSize: ".7rem", color: `${S.purple}.32)`, letterSpacing: ".1em", textTransform: "uppercase" }}>
                        Android · Enable unknown sources if prompted
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
