'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@/components/clerk-auth'
import { useState, useEffect, useCallback } from 'react'
import {
  Film, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight,
  Download, Camera, Sparkles, CheckCircle, Zap, Star
} from 'lucide-react'

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bg:       '#07060A',
  bgSurf:   '#0E0C14',
  bgCard:   '#13111A',
  border:   'rgba(255,255,255,0.06)',
  borderHi: 'rgba(255,255,255,0.12)',
  accent:   '#C9A96E',
  accentDim:'rgba(201,169,110,0.15)',
  accentGlow:'rgba(201,169,110,0.08)',
  text:     '#F0EBE1',
  textMid:  '#7A7080',
  textDim:  '#3D3847',
}

/* ─────────────────────────────────────────────
   TEMPLATE DATA
───────────────────────────────────────────── */
const TEMPLATES = [
  {
    id: 0, name: 'Polaroid Classic', cat: 'Retro', tier: 'Free',
    bg: ['#F7F2E8','#EDE5D4'], accent: '#8B7355', text: '#2A2018',
  },
  {
    id: 1, name: 'Film Strip', cat: 'Retro', tier: 'Free',
    bg: ['#1A1A1A','#0A0A0A'], accent: '#E8E8E8', text: '#FFFFFF',
  },
  {
    id: 2, name: 'Korean Booth', cat: 'Korean', tier: 'Premium',
    bg: ['#FFB7C5','#FF7EA0'], accent: '#FFFFFF', text: '#3D0018',
  },
  {
    id: 3, name: 'Spotify Card', cat: 'Music', tier: 'Premium',
    bg: ['#1A1A1A','#111111'], accent: '#1DB954', text: '#FFFFFF',
  },
  {
    id: 4, name: 'Glassmorphism', cat: 'Modern', tier: 'Premium',
    bg: ['#2A1F14','#180F08'], accent: '#C9A96E', text: '#F0EBE1',
  },
  {
    id: 5, name: 'Netflix Dark', cat: 'Cinema', tier: 'Premium',
    bg: ['#1A0505','#0D0000'], accent: '#E50914', text: '#FFFFFF',
  },
  {
    id: 6, name: 'Vaporwave', cat: 'Retro', tier: 'Premium',
    bg: ['#1A0A3D','#0D0520'], accent: '#FF6EC7', text: '#E0D0FF',
  },
  {
    id: 7, name: 'Minimal Mono', cat: 'Modern', tier: 'Free',
    bg: ['#FAFAFA','#F0F0F0'], accent: '#111111', text: '#111111',
  },
]

/* ─────────────────────────────────────────────
   3D CAROUSEL
───────────────────────────────────────────── */
function TemplateCarousel() {
  const [active, setActive] = useState(2)
  const total = TEMPLATES.length
  const getOff = (i: number) => {
    let d = i - active
    if (d > total / 2) d -= total
    if (d < -total / 2) d += total
    return d
  }
  const go = useCallback((dir: number) => {
    setActive(a => (a + dir + total) % total)
  }, [total])

  useEffect(() => {
    const t = setInterval(() => go(1), 3800)
    return () => clearInterval(t)
  }, [go])

  return (
    <div style={{ position: 'relative', width: '100%', height: 380 }}>
      {/* 3D stage */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: '1100px',
      }}>
        {TEMPLATES.map((tpl, i) => {
          const off = getOff(i)
          const abs = Math.abs(off)
          if (abs > 3) return null
          const isActive = off === 0

          const x = off * 148
          const z = -abs * 70
          const ry = off * 22
          const sc = 1 - abs * 0.09
          const op = 1 - abs * 0.22

          return (
            <motion.div
              key={tpl.id}
              onClick={() => setActive(i)}
              animate={{ x, z, rotateY: ry, scale: sc, opacity: op }}
              transition={{ type: 'spring', stiffness: 240, damping: 30 }}
              style={{
                position: 'absolute',
                zIndex: 10 - abs,
                cursor: isActive ? 'default' : 'pointer',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* card */}
              <div style={{
                width: 180,
                height: 260,
                borderRadius: 16,
                background: `linear-gradient(160deg, ${tpl.bg[0]}, ${tpl.bg[1]})`,
                border: isActive
                  ? `1.5px solid ${tpl.accent}80`
                  : `1px solid rgba(255,255,255,0.06)`,
                boxShadow: isActive
                  ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${tpl.accent}20`
                  : '0 16px 48px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 0 18px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* inner photo mock */}
                <div style={{
                  position: 'absolute', top: 24, left: 20, right: 20, bottom: 60,
                  borderRadius: 10,
                  background: `${tpl.accent}12`,
                  border: `1px solid ${tpl.accent}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Film size={24} style={{ color: tpl.accent, opacity: 0.25 }} />
                </div>

                {/* tier badge */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  padding: '2px 8px', borderRadius: 100,
                  fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: 'monospace',
                  background: tpl.tier === 'Free'
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(201,169,110,0.15)',
                  border: tpl.tier === 'Free'
                    ? '1px solid rgba(16,185,129,0.35)'
                    : '1px solid rgba(201,169,110,0.35)',
                  color: tpl.tier === 'Free' ? '#10b981' : '#C9A96E',
                }}>
                  {tpl.tier}
                </div>

                {/* label */}
                <p style={{
                  fontSize: 11, fontWeight: 700,
                  color: tpl.text, letterSpacing: '0.01em',
                  margin: 0, textAlign: 'center',
                  position: 'relative', zIndex: 1,
                }}>{tpl.name}</p>
                <p style={{
                  fontSize: 9, color: `${tpl.text}60`,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  margin: '3px 0 0',
                  position: 'relative', zIndex: 1,
                }}>{tpl.cat}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* nav arrows */}
      {[
        { dir: -1, side: 'left' as const },
        { dir: 1,  side: 'right' as const },
      ].map(({ dir, side }) => (
        <button
          key={side}
          onClick={() => go(dir)}
          style={{
            position: 'absolute',
            [side]: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'rgba(201,169,110,0.08)',
            border: '1px solid rgba(201,169,110,0.18)',
            color: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {dir === -1 ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      ))}

      {/* dots */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 6,
      }}>
        {TEMPLATES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 22 : 6, height: 6,
              borderRadius: 100,
              background: i === active ? C.accent : 'rgba(201,169,110,0.2)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MOTION VARIANTS
───────────────────────────────────────────── */
const vFade = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', overflowX: 'hidden', fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* ── ambient bg ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-5%', left: '30%',
          width: 800, height: 600,
          background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 65%)`,
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '5%',
          width: 500, height: 500,
          background: `radial-gradient(ellipse, rgba(120,80,200,0.04) 0%, transparent 70%)`,
          borderRadius: '50%',
        }} />
      </div>

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(7,6,10,0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.accent}, #9B7140)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${C.accentDim}`,
            }}>
              <Film size={15} color="#07060A" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>
              Filmory
            </span>
          </Link>

          {/* nav links */}
          <div className="hidden md:flex" style={{ gap: 32, alignItems: 'center' }}>
            {[['#templates','Template'], ['#cara-kerja','Cara Kerja'], ['#harga','Harga']].map(([href, label]) => (
              <Link key={href} href={href} style={{
                fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: C.textMid, textDecoration: 'none', transition: 'color 0.2s',
              }}
              className="hover:text-[#C9A96E]"
              >{label}</Link>
            ))}
          </div>

          {/* auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{
                  fontSize: 12, color: C.textMid, background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 14px', borderRadius: 8,
                }}>
                  Masuk
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button style={{
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.02em',
                  background: C.accent, color: '#07060A',
                  border: 'none', cursor: 'pointer',
                  padding: '9px 18px', borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  Mulai Gratis
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/studio" style={{
                fontSize: 12, fontWeight: 700,
                background: C.accent, color: '#07060A',
                padding: '9px 18px', borderRadius: 10,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                Buka Studio <ArrowRight size={13} />
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, paddingTop: 130, paddingBottom: 80, paddingLeft: 28, paddingRight: 28 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {/* ── Left ── */}
            <div>
              <motion.div
                variants={vFade} initial="hidden" animate="show" custom={0}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '5px 12px 5px 8px', borderRadius: 100,
                  border: `1px solid ${C.accentDim}`,
                  background: 'rgba(201,169,110,0.05)',
                  marginBottom: 28,
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={9} color="#07060A" />
                </div>
                <span style={{ fontSize: 11, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                  Premium Photobooth
                </span>
              </motion.div>

              <motion.h1
                variants={vFade} initial="hidden" animate="show" custom={1}
                style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', color: C.text, marginBottom: 24 }}
              >
                Foto aesthetic.{' '}
                <br />
                <span style={{
                  background: `linear-gradient(135deg, ${C.accent} 0%, #E8C97A 50%, #9B7140 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Langsung di browser.
                </span>
              </motion.h1>

              <motion.p
                variants={vFade} initial="hidden" animate="show" custom={2}
                style={{ fontSize: 15, lineHeight: 1.75, color: C.textMid, marginBottom: 36, maxWidth: 420 }}
              >
                Filmory mengubah kamera biasa jadi photobooth dengan template sinematik.
                Polaroid, Film Strip, Korean Booth, dan 12+ template eksklusif — tanpa install apapun.
              </motion.p>

              <motion.div
                variants={vFade} initial="hidden" animate="show" custom={3}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
              >
                <SignedOut>
                  <SignInButton mode="modal">
                    <button style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: C.accent, color: '#07060A',
                      fontSize: 13, fontWeight: 700, letterSpacing: '0.01em',
                      padding: '13px 24px', borderRadius: 12,
                      border: 'none', cursor: 'pointer',
                      boxShadow: `0 0 40px ${C.accentDim}`,
                    }}>
                      Mulai Sekarang — Gratis
                      <ArrowRight size={15} />
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/studio" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: C.accent, color: '#07060A',
                    fontSize: 13, fontWeight: 700,
                    padding: '13px 24px', borderRadius: 12,
                    textDecoration: 'none',
                  }}>
                    Buka Studio <ArrowRight size={15} />
                  </Link>
                </SignedIn>
                <Link href="#templates" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', color: C.textMid,
                  fontSize: 13, fontWeight: 600,
                  padding: '13px 22px', borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  textDecoration: 'none',
                }}>
                  Lihat Template
                </Link>
              </motion.div>

              {/* stat row */}
              <motion.div
                variants={vFade} initial="hidden" animate="show" custom={4}
                style={{ display: 'flex', gap: 32, marginTop: 44, paddingTop: 32, borderTop: `1px solid ${C.border}` }}
              >
                {[['12+','Template HD'], ['100%','Browser Only'], ['Rp10K','Per Template']].map(([v, l]) => (
                  <div key={l}>
                    <p style={{ fontSize: 24, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: 0 }}>{v}</p>
                    <p style={{ fontSize: 10, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{l}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Carousel ── */}
            <motion.div
              variants={vFade} initial="hidden" animate="show" custom={1}
              className="hidden md:block"
            >
              <TemplateCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════ */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        background: C.bgSurf,
        padding: '14px 0',
        overflow: 'hidden',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', width: 'max-content' }}
        >
          {Array.from({ length: 2 }).flatMap((_, gi) =>
            ['Polaroid Classic','Film Strip','Korean Booth','Spotify Card','Glassmorphism','Netflix Dark','Vaporwave','Minimal Mono'].map((name, i) => (
              <span key={`${gi}-${i}`} style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                color: C.textDim,
              }}>
                {name} <span style={{ color: C.accent, marginLeft: 48 }}>✦</span>
              </span>
            ))
          )}
        </motion.div>
      </div>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section id="cara-kerja" style={{ position: 'relative', zIndex: 1, padding: '100px 28px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <motion.div
            variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ marginBottom: 64 }}
          >
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.accent, display: 'block', marginBottom: 14 }}>Cara Pakai</span>
            <h2 style={{ fontSize: 46, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: 0 }}>
              Tiga langkah,{' '}
              <span style={{ color: C.textMid }}>langsung jadi.</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}
            className="grid-cols-1 md:grid-cols-3"
          >
            {[
              {
                num: '01', icon: Camera,
                title: 'Izinkan Kamera',
                desc: 'Buka Filmory, izinkan akses kamera. Tidak ada data yang dikirim ke server. Privacy-first.',
              },
              {
                num: '02', icon: Film,
                title: 'Pilih Template',
                desc: 'Pilih dari koleksi FREE atau unlock template PREMIUM. Di-render langsung di browser via Canvas API.',
              },
              {
                num: '03', icon: Download,
                title: 'Download & Bagikan',
                desc: 'Export PNG/JPEG kualitas tinggi. Langsung siap dipost ke Instagram, TikTok, atau disimpan.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.1}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : '0',
                  padding: '40px 32px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="rounded-2xl md:rounded-none"
              >
                {/* step number watermark */}
                <div style={{
                  position: 'absolute', top: 20, right: 24,
                  fontSize: 64, fontWeight: 900, color: C.bgSurf,
                  letterSpacing: '-0.05em', lineHeight: 1,
                  userSelect: 'none',
                }}>
                  {step.num}
                </div>

                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: C.accentDim,
                  border: `1px solid rgba(201,169,110,0.2)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  <step.icon size={22} color={C.accent} />
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: '-0.01em', marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, margin: 0 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TEMPLATE GRID
      ══════════════════════════════════ */}
      <section id="templates" style={{ position: 'relative', zIndex: 1, padding: '0 28px 100px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
            <motion.div variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.accent, display: 'block', marginBottom: 14 }}>Koleksi</span>
              <h2 style={{ fontSize: 46, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: 0 }}>
                Pilih frame-mu
              </h2>
            </motion.div>
            <motion.div variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Link href="/templates" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: C.textMid, textDecoration: 'none',
                border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '8px 14px',
              }}>
                Semua template <ArrowUpRight size={13} />
              </Link>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
            className="grid-cols-2 md:grid-cols-4"
          >
            {TEMPLATES.map((tpl, i) => (
              <motion.div
                key={tpl.id}
                variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.05}
                whileHover={{ y: -4, scale: 1.015 }}
                style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'border-color 0.2s' }}
              >
                {/* preview */}
                <div style={{
                  aspectRatio: '3/4',
                  background: `linear-gradient(160deg, ${tpl.bg[0]}, ${tpl.bg[1]})`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                  gap: 8,
                }}>
                  {/* inner frame mock */}
                  <div style={{
                    width: '65%', height: '50%',
                    borderRadius: 8,
                    background: `${tpl.accent}15`,
                    border: `1px solid ${tpl.accent}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Film size={18} style={{ color: tpl.accent, opacity: 0.3 }} />
                  </div>

                  {/* tier */}
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    padding: '2px 7px', borderRadius: 100,
                    fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                    fontFamily: 'monospace',
                    background: tpl.tier === 'Free' ? 'rgba(16,185,129,0.12)' : 'rgba(201,169,110,0.12)',
                    border: tpl.tier === 'Free' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(201,169,110,0.3)',
                    color: tpl.tier === 'Free' ? '#10b981' : C.accent,
                  }}>
                    {tpl.tier}
                  </div>
                </div>

                {/* label */}
                <div style={{ padding: '10px 12px 12px', background: C.bgCard }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: C.text, margin: 0 }}>{tpl.name}</p>
                  <p style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '3px 0 0' }}>{tpl.cat}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRICING
      ══════════════════════════════════ */}
      <section id="harga" style={{
        position: 'relative', zIndex: 1,
        padding: '100px 28px',
        background: C.bgSurf,
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <motion.div
            variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.accent, display: 'block', marginBottom: 14 }}>Harga</span>
            <h2 style={{ fontSize: 46, fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: 0 }}>
              Bayar sekali, milik selamanya
            </h2>
            <p style={{ fontSize: 14, color: C.textMid, marginTop: 14, lineHeight: 1.6 }}>
              Template gratis untuk semua. Premium sekali bayar — tidak ada langganan.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {/* Free */}
            <motion.div
              variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 20, padding: '36px 32px',
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.textMid }}>Gratis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 28 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: C.text, letterSpacing: '-0.04em' }}>Rp0</span>
                <span style={{ fontSize: 13, color: C.textDim }}>/ selamanya</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['3 template gratis selamanya', 'Kualitas download standar', 'Watermark Filmory kecil', 'Support via email'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.textMid }}>
                    <CheckCircle size={14} color={C.textDim} />
                    {f}
                  </li>
                ))}
              </ul>

              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{
                    width: '100%', padding: '12px', borderRadius: 10,
                    background: 'transparent',
                    border: `1px solid ${C.borderHi}`,
                    color: C.textMid, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    Mulai Gratis
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/studio" style={{
                  display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10,
                  border: `1px solid ${C.borderHi}`, color: C.textMid, fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Buka Studio
                </Link>
              </SignedIn>
            </motion.div>

            {/* Premium */}
            <motion.div
              variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1}
              style={{
                background: C.bgCard,
                border: `1px solid rgba(201,169,110,0.3)`,
                borderRadius: 20, padding: '36px 32px',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* glow corner */}
              <div style={{
                position: 'absolute', top: -80, right: -80,
                width: 240, height: 240,
                background: `radial-gradient(circle, ${C.accentDim} 0%, transparent 70%)`,
                borderRadius: '50%', pointerEvents: 'none',
              }} />

              {/* popular badge */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                background: `linear-gradient(135deg, ${C.accent}, #9B7140)`,
                color: '#07060A', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em',
                fontWeight: 800,
                padding: '4px 16px', borderRadius: '0 0 10px 10px',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Zap size={8} fill="currentColor" /> Paling Populer
              </div>

              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.accent }}>Template Bundle</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 28 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: C.text, letterSpacing: '-0.04em' }}>Rp10K</span>
                <span style={{ fontSize: 13, color: C.textMid }}>/ per template</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Unlock template pilihan',
                  'Download kualitas HD',
                  'Tanpa watermark',
                  'Template eksklusif',
                  'Akses seumur hidup',
                  'Template baru gratis',
                ].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#C8B898' }}>
                    <CheckCircle size={14} color={C.accent} />
                    {f}
                  </li>
                ))}
              </ul>

              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{
                    width: '100%', padding: '13px', borderRadius: 10,
                    background: C.accent, color: '#07060A',
                    border: 'none', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: `0 0 30px ${C.accentDim}`,
                  }}>
                    Lihat Semua Template
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/templates" style={{
                  display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10,
                  background: C.accent, color: '#07060A',
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}>
                  Lihat Semua Template
                </Link>
              </SignedIn>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA FINAL
      ══════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 28px' }}>
        {/* large bg text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <span style={{
            fontSize: 200, fontWeight: 900, color: C.bgSurf,
            letterSpacing: '-0.08em', userSelect: 'none',
            lineHeight: 1,
          }}>FILM</span>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div variants={vFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div style={{
              width: 60, height: 60, borderRadius: 18,
              background: `linear-gradient(135deg, ${C.accent}, #9B7140)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: `0 0 40px ${C.accentDim}`,
            }}>
              <Film size={26} color="#07060A" strokeWidth={2} />
            </div>

            <h2 style={{ fontSize: 52, fontWeight: 900, color: C.text, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 18 }}>
              Siap abadikan<br />momenmu?
            </h2>
            <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.7, marginBottom: 36 }}>
              Bergabung dengan ribuan pengguna yang sudah membuat kenangan indah dengan Filmory.
            </p>

            <SignedOut>
              <SignInButton mode="modal">
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: C.accent, color: '#07060A',
                  fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em',
                  padding: '15px 32px', borderRadius: 14,
                  border: 'none', cursor: 'pointer',
                  boxShadow: `0 0 60px ${C.accentDim}`,
                }}>
                  Mulai Sekarang — Gratis
                  <ArrowRight size={17} />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/studio" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: C.accent, color: '#07060A',
                fontSize: 14, fontWeight: 800,
                padding: '15px 32px', borderRadius: 14,
                textDecoration: 'none',
              }}>
                Buka Studio <ArrowRight size={17} />
              </Link>
            </SignedIn>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: '28px 28px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7,
              background: `linear-gradient(135deg, ${C.accent}, #9B7140)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Film size={11} color="#07060A" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.textDim }}>Filmory</span>
          </div>

          <p style={{ fontSize: 11, color: C.textDim }}>
            © 2025 Filmory. Dibuat dengan ✦ di Indonesia.
          </p>

          <div style={{ display: 'flex', gap: 24 }}>
            {[['Privasi','/privacy'],['Ketentuan','/terms']].map(([label, href]) => (
              <Link key={href} href={href} style={{
                fontSize: 11, color: C.textDim, textDecoration: 'none',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}