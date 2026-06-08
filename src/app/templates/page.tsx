'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@/components/clerk-auth'
import {
  Film, Star, CheckCircle, ArrowLeft, Lock,
  ArrowUpRight, Sparkles, Grid2x2, SlidersHorizontal,
  Music, Clapperboard
} from 'lucide-react'

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bg:         '#07060A',
  bgSurf:     '#0E0C14',
  bgCard:     '#13111A',
  border:     'rgba(255,255,255,0.06)',
  borderHi:   'rgba(255,255,255,0.12)',
  accent:     '#C9A96E',
  accentDim:  'rgba(201,169,110,0.15)',
  accentGlow: 'rgba(201,169,110,0.08)',
  text:       '#F0EBE1',
  textMid:    '#7A7080',
  textDim:    '#3D3847',
}

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Cfg = Record<string, unknown>
type Template = {
  id: string
  slug: string
  name: string
  description: string
  category: string
  tier: string
  price: number
  configJson: Cfg
}

/* ─────────────────────────────────────────────
   CATEGORIES
───────────────────────────────────────────── */
const CATEGORIES = [
  { key: 'ALL',       label: 'Semua' },
  { key: 'RETRO',     label: 'Retro' },
  { key: 'MODERN',    label: 'Modern' },
  { key: 'KOREAN',    label: 'Korean' },
  { key: 'MUSIC',     label: 'Music' },
  { key: 'CINEMA',    label: 'Cinema' },
  { key: 'EDITORIAL', label: 'Editorial' },
  { key: 'SOCIAL',    label: 'Social' },
]

/* ─────────────────────────────────────────────
   FRAME PREVIEW — renders each layout from seed
───────────────────────────────────────────── */
function FramePreview({ cfg, name }: { cfg: Cfg; name: string }) {
  const layout = (cfg.layout as string) || 'single'
  const bg     = (cfg.bgColor as string) || '#1a1410'
  const accent = (cfg.accentColor as string) || (cfg.goldColor as string) || C.accent
  const grad   = cfg.bgGradient as string[] | undefined

  const containerBg = grad
    ? `linear-gradient(145deg, ${grad[0]}, ${grad[1]})`
    : bg

  // shared photo slot helper — renders a placeholder photo box
  const PhotoSlot = ({
    w = '100%', h = '100%', r = 5,
    color = accent,
  }: { w?: string | number; h?: string | number; r?: number; color?: string }) => (
    <div style={{
      width: w, height: h,
      borderRadius: r,
      background: `${color}18`,
      border: `1px solid ${color}28`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Film size={11} style={{ color, opacity: 0.3 }} />
    </div>
  )

  /* ── POLAROID ── white card, heavy bottom ── */
  if (layout === 'polaroid') {
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
        <div style={{
          width: '80%',
          background: '#fff',
          borderRadius: 4,
          padding: '8px 8px 22px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <div style={{ width: '100%', aspectRatio: '1', borderRadius: 3, background: '#e8ddd0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Film size={16} style={{ color: '#8B7355', opacity: 0.4 }} />
          </div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            <div style={{ height: 4, width: '55%', borderRadius: 2, background: '#ddd' }} />
            <div style={{ height: 3, width: '35%', borderRadius: 2, background: '#eee' }} />
          </div>
        </div>
        <p style={{ fontSize: 7, color: '#8B7355', marginTop: 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{name}</p>
      </div>
    )
  }

  /* ── FILM STRIP ── black, sprocket holes, vertical slots ── */
  if (layout === 'filmstrip') {
    const sprocket = (cfg.sprocketColor as string) || 'rgba(255,255,255,0.08)'
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* sprocket holes left */}
        <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', gap: 0 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 5, borderRadius: 1, background: sprocket }} />
          ))}
        </div>
        {/* sprocket holes right */}
        <div style={{ position: 'absolute', right: 6, top: 0, bottom: 0, width: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 5, borderRadius: 1, background: sprocket }} />
          ))}
        </div>
        {/* 4 photo slots vertical */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '62%' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ height: 44, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={10} style={{ color: '#fff', opacity: 0.2 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── GRID 2x2 ── */
  if (layout === 'grid2x2') {
    const border = (cfg.borderColor as string) || 'rgba(177,120,82,0.3)'
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: '100%' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 5, background: `rgba(177,120,82,0.1)`, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={10} style={{ color: '#B17852', opacity: 0.35 }} />
            </div>
          ))}
        </div>
        <div style={{ height: 3, width: '50%', borderRadius: 2, background: 'rgba(177,120,82,0.15)' }} />
      </div>
    )
  }

  /* ── SPOTIFY ── dark, green accent, waveform ── */
  if (layout === 'spotify') {
    const green = accent
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 10 }}>
        {/* album art */}
        <div style={{ width: '62%', aspectRatio: '1', borderRadius: 8, background: `${green}15`, border: `1px solid ${green}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Music size={18} style={{ color: green, opacity: 0.4 }} />
        </div>
        {/* song info lines */}
        <div style={{ width: '78%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <div style={{ height: 5, width: '75%', borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ height: 3.5, width: '50%', borderRadius: 2, background: 'rgba(255,255,255,0.07)' }} />
        </div>
        {/* waveform bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20, width: '70%', justifyContent: 'center' }}>
          {[6,10,14,8,18,12,7,16,11,9,15,13,7,17,10].map((h, i) => (
            <div key={i} style={{ flex: 1, height: h, borderRadius: 2, background: i < 7 ? green : `${green}30` }} />
          ))}
        </div>
        {/* progress bar */}
        <div style={{ width: '78%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '40%', height: '100%', borderRadius: 2, background: green }} />
        </div>
      </div>
    )
  }

  /* ── KOREAN ── pink bg, 2x2 pastel ── */
  if (layout === 'korean') {
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 8 }}>
        {/* 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: '88%' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 6, background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={9} style={{ color: '#FF85A1', opacity: 0.5 }} />
            </div>
          ))}
        </div>
        {/* cute label */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={{ height: 3, width: 16, borderRadius: 2, background: 'rgba(255,255,255,0.5)' }} />
          <div style={{ height: 4, width: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }} />
          <div style={{ height: 3, width: 16, borderRadius: 2, background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </div>
    )
  }

  /* ── GLASSMORPHISM ── gradient bg, frosted card ── */
  if (layout === 'glass') {
    const glassColor = (cfg.glassColor as string) || 'rgba(255,255,255,0.08)'
    const borderColor = (cfg.borderColor as string) || 'rgba(255,255,255,0.12)'
    return (
      <div style={{ width: '100%', height: '100%', background: containerBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 8 }}>
        {/* frosted glass card */}
        <div style={{ width: '85%', borderRadius: 12, background: glassColor, border: `1px solid ${borderColor}`, padding: 10, display: 'flex', flexDirection: 'column', gap: 7, backdropFilter: 'blur(8px)' }}>
          <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Film size={14} style={{ color: C.accent, opacity: 0.35 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', width: '65%' }} />
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', width: '45%' }} />
          </div>
        </div>
      </div>
    )
  }

  /* ── APPLE MUSIC ── black, red accent, progress ── */
  if (layout === 'apple-music') {
    const red = accent
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 9 }}>
        {/* album art with shadow */}
        <div style={{ width: '65%', aspectRatio: '1', borderRadius: 10, background: `${red}18`, border: `1px solid ${red}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 32px rgba(0,0,0,0.6)` }}>
          <Music size={18} style={{ color: red, opacity: 0.45 }} />
        </div>
        {/* info */}
        <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          <div style={{ height: 5, width: '68%', borderRadius: 2, background: 'rgba(255,255,255,0.18)' }} />
          <div style={{ height: 3.5, width: '45%', borderRadius: 2, background: 'rgba(255,255,255,0.08)' }} />
        </div>
        {/* progress */}
        <div style={{ width: '78%' }}>
          <div style={{ height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ width: '35%', height: '100%', borderRadius: 2, background: red }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <div style={{ height: 3, width: 18, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ height: 3, width: 18, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
          </div>
        </div>
      </div>
    )
  }

  /* ── NETFLIX ── dark, red bar top, cinematic letterbox ── */
  if (layout === 'netflix') {
    const red = accent
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* letterbox top */}
        <div style={{ height: 12, background: '#000', flexShrink: 0 }} />
        {/* N bar */}
        <div style={{ padding: '5px 10px', background: '#0a0a0a', borderBottom: `1px solid rgba(229,9,20,0.2)`, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 14, height: 14, background: red, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: '#fff', fontFamily: 'serif' }}>N</span>
          </div>
          <div style={{ height: 3, width: 40, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }} />
        </div>
        {/* main photo area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: `1px solid ${red}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clapperboard size={18} style={{ color: red, opacity: 0.35 }} />
          </div>
        </div>
        {/* episode info */}
        <div style={{ padding: '5px 10px 6px', display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          <div style={{ height: 4, width: '60%', borderRadius: 2, background: 'rgba(255,255,255,0.14)' }} />
          <div style={{ height: 3, width: '40%', borderRadius: 2, background: 'rgba(255,255,255,0.06)' }} />
        </div>
        {/* letterbox bottom */}
        <div style={{ height: 12, background: '#000', flexShrink: 0 }} />
      </div>
    )
  }

  /* ── LUXURY GOLD ── dark bg, gold ornament frame ── */
  if (layout === 'gold') {
    const gold = (cfg.goldColor as string) || '#D4AF37'
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        {/* outer ornament border */}
        <div style={{ width: '88%', height: '88%', border: `1.5px solid ${gold}55`, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
          {/* corner ornaments */}
          {[['0%','0%'],['100%','0%'],['0%','100%'],['100%','100%']].map(([t, l], i) => (
            <div key={i} style={{
              position: 'absolute',
              top: t === '0%' ? -3 : undefined, bottom: t === '100%' ? -3 : undefined,
              left: l === '0%' ? -3 : undefined, right: l === '100%' ? -3 : undefined,
              width: 8, height: 8,
              borderTop: (t === '0%') ? `2px solid ${gold}` : undefined,
              borderBottom: (t === '100%') ? `2px solid ${gold}` : undefined,
              borderLeft: (l === '0%') ? `2px solid ${gold}` : undefined,
              borderRight: (l === '100%') ? `2px solid ${gold}` : undefined,
            }} />
          ))}
          {/* inner photo */}
          <div style={{ width: '72%', aspectRatio: '4/5', borderRadius: 3, background: `${gold}0f`, border: `1px solid ${gold}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Film size={14} style={{ color: gold, opacity: 0.35 }} />
          </div>
          {/* divider ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, width: '60%' }}>
            <div style={{ flex: 1, height: 0.5, background: `${gold}40` }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: `${gold}60` }} />
            <div style={{ flex: 1, height: 0.5, background: `${gold}40` }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            <div style={{ height: 3.5, width: 44, borderRadius: 2, background: `${gold}30` }} />
            <div style={{ height: 2.5, width: 28, borderRadius: 2, background: `${gold}18` }} />
          </div>
        </div>
      </div>
    )
  }

  /* ── MAGAZINE COVER ── white bg, bold editorial layout ── */
  if (layout === 'magazine') {
    const ac = (cfg.accentColor as string) || '#B17852'
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* header bar */}
        <div style={{ padding: '7px 10px', background: ac, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ height: 5, width: 38, borderRadius: 2, background: 'rgba(255,255,255,0.6)' }} />
          <div style={{ height: 3, width: 20, borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
        </div>
        {/* photo full bleed */}
        <div style={{ flex: 1, background: '#e8e0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Film size={22} style={{ color: '#8B7355', opacity: 0.3 }} />
        </div>
        {/* headline area */}
        <div style={{ padding: '7px 10px 9px', background: bg, display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          <div style={{ height: 6, width: '85%', borderRadius: 2, background: (cfg.textColor as string) || '#1a1208', opacity: 0.7 }} />
          <div style={{ height: 4, width: '60%', borderRadius: 2, background: (cfg.textColor as string) || '#1a1208', opacity: 0.3 }} />
          <div style={{ marginTop: 3, height: 2.5, width: '35%', borderRadius: 2, background: ac, opacity: 0.7 }} />
        </div>
      </div>
    )
  }

  /* ── VINTAGE SCRAPBOOK ── cream, tape corners, stamp ── */
  if (layout === 'scrapbook') {
    const textColor = (cfg.textColor as string) || '#8B6B54'
    return (
      <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 7 }}>
        {/* main photo with tape corners */}
        <div style={{ width: '80%', aspectRatio: '1', background: '#e8ddd0', borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 3px 10px rgba(0,0,0,0.15)' }}>
          <Film size={16} style={{ color: textColor, opacity: 0.3 }} />
          {/* tape strips */}
          {[
            { top: -5, left: '20%', w: 24, h: 8, r: -12 },
            { top: -5, right: '20%', w: 24, h: 8, r: 12 },
            { bottom: -5, left: '20%', w: 24, h: 8, r: 10 },
            { bottom: -5, right: '20%', w: 24, h: 8, r: -10 },
          ].map((t, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: t.top, bottom: t.bottom,
              left: t.left as string | undefined, right: t.right as string | undefined,
              width: t.w, height: t.h,
              background: 'rgba(255,230,150,0.55)',
              borderRadius: 2,
              transform: `rotate(${t.r}deg)`,
            }} />
          ))}
        </div>
        {/* handwritten-style lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '70%', alignItems: 'center' }}>
          <div style={{ height: 3, borderRadius: 2, width: '100%', background: `${textColor}25` }} />
          <div style={{ height: 3, borderRadius: 2, width: '70%', background: `${textColor}18` }} />
        </div>
        {/* stamp */}
        <div style={{ width: 28, height: 28, border: `1.5px solid ${textColor}40`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-12deg)' }}>
          <div style={{ fontSize: 7, color: `${textColor}50`, fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.1 }}>✦</div>
        </div>
      </div>
    )
  }

  /* ── SOCIAL MEDIA ── gradient square ── */
  if (layout === 'social') {
    const socialGrad = grad || ['#833ab4', '#fd1d1d', '#fcb045']
    return (
      <div style={{ width: '100%', height: '100%', background: `linear-gradient(145deg, ${socialGrad[0]}, ${socialGrad[1]}, ${socialGrad[2] || socialGrad[1]})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 10 }}>
        {/* square photo */}
        <div style={{ width: '75%', aspectRatio: '1', borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <Film size={18} style={{ color: '#fff', opacity: 0.4 }} />
        </div>
        {/* IG-style dots */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: i === 0 ? 12 : 5, height: 5, borderRadius: 100, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.35)' }} />
          ))}
        </div>
        {/* caption lines */}
        <div style={{ width: '78%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <div style={{ height: 4, width: '70%', borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
          <div style={{ height: 3, width: '50%', borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>
      </div>
    )
  }

  /* ── FALLBACK ── */
  return (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Film size={22} style={{ color: accent, opacity: 0.25 }} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.bgCard }}>
      <div style={{ aspectRatio: '3/4', background: C.bgSurf, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
          animation: 'shimmer 1.6s infinite',
        }} />
      </div>
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ height: 11, borderRadius: 5, background: C.bgSurf, width: '70%' }} />
        <div style={{ height: 8, borderRadius: 5, background: C.bgSurf, width: '40%' }} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MOTION VARIANTS
───────────────────────────────────────────── */
const vFade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 },
  }),
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function TemplatesPage() {
  const [templates, setTemplates]           = useState<Template[]>([])
  const [loading, setLoading]               = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [hoveredId, setHoveredId]           = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => { setTemplates(d.templates || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'ALL'
    ? templates
    : templates.filter(t => t.category === activeCategory)

  const freeCount    = templates.filter(t => t.tier === 'FREE').length
  const premiumCount = templates.filter(t => t.tier === 'PREMIUM').length

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'DM Sans','Inter',sans-serif" }}>
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>

      {/* ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '35%', width: 700, height: 500, background: `radial-gradient(ellipse, ${C.accentGlow} 0%, transparent 70%)`, borderRadius: '50%' }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(7,6,10,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.textMid, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <ArrowLeft size={13} /> Kembali
            </Link>
            <div style={{ width: 1, height: 16, background: C.border }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${C.accent}, #9B7140)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={12} color="#07060A" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>Filmory</span>
            </div>
          </div>
          <SignedIn>
            <Link href="/studio" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, background: C.accent, color: '#07060A', padding: '8px 16px', borderRadius: 9, textDecoration: 'none' }}>
              Buka Studio <ArrowUpRight size={13} />
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{ fontSize: 12, fontWeight: 700, background: C.accent, color: '#07060A', padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer' }}>
                Mulai Gratis
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '56px 28px 100px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div variants={vFade} initial="hidden" animate="show" style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px 4px 8px', borderRadius: 100, border: `1px solid ${C.accentDim}`, background: 'rgba(201,169,110,0.05)', marginBottom: 20 }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={8} color="#07060A" />
            </div>
            <span style={{ fontSize: 10, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Template Collection</span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: C.text, lineHeight: 1.0, marginBottom: 18 }}>
            Semua{' '}
            <span style={{ background: `linear-gradient(135deg, ${C.accent} 0%, #E8C97A 50%, #9B7140 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Template
            </span>
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {[
              { icon: Grid2x2, label: `${templates.length} template`, bg: C.bgCard, border: C.border, color: C.textMid },
              { icon: CheckCircle, label: `${freeCount} gratis`, bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', color: '#10b981' },
              { icon: Star, label: `${premiumCount} premium`, bg: C.accentDim, border: 'rgba(201,169,110,0.2)', color: C.accent },
            ].map(({ icon: Icon, label, bg, border, color }) => (
              <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: bg, border: `1px solid ${border}` }}>
                <Icon size={11} color={color} />
                <span style={{ fontSize: 11, color }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Category Filter ── */}
        <motion.div variants={vFade} initial="hidden" animate="show" custom={1} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
          <SlidersHorizontal size={13} color={C.textDim} style={{ marginRight: 4 }} />
          {CATEGORIES.map(({ key, label }) => {
            const isActive = activeCategory === key
            const count    = key === 'ALL' ? templates.length : templates.filter(t => t.category === key).length
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '7px 14px', borderRadius: 100,
                  fontSize: 11, fontWeight: isActive ? 700 : 500,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  cursor: 'pointer',
                  border: isActive ? `1px solid rgba(201,169,110,0.5)` : `1px solid ${C.border}`,
                  background: isActive ? C.accentDim : 'transparent',
                  color: isActive ? C.accent : C.textMid,
                  transition: 'all 0.2s ease',
                }}
              >
                {label}
                {count > 0 && (
                  <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 100, background: isActive ? 'rgba(201,169,110,0.2)' : C.bgSurf, color: isActive ? C.accent : C.textDim, fontWeight: 600 }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </motion.div>

        {/* ── Grid ── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }} className="grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.textMid }}>
            <Film size={32} style={{ color: C.textDim, margin: '0 auto 16px', display: 'block' }} />
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Belum ada template di kategori ini.</p>
            <button onClick={() => setActiveCategory('ALL')} style={{ marginTop: 14, padding: '8px 18px', borderRadius: 9, background: C.accentDim, border: `1px solid rgba(201,169,110,0.25)`, color: C.accent, fontSize: 12, cursor: 'pointer' }}>
              Lihat semua
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}
              className="grid-cols-2 md:grid-cols-4"
            >
              {filtered.map((tpl, i) => {
                const cfg       = tpl.configJson as Cfg
                const isHovered = hoveredId === tpl.id
                const isPremium = tpl.tier === 'PREMIUM'

                return (
                  <motion.div
                    key={tpl.id}
                    variants={vFade}
                    initial="hidden"
                    animate="show"
                    custom={i * 0.03}
                    onMouseEnter={() => setHoveredId(tpl.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      borderRadius: 14,
                      overflow: 'hidden',
                      border: `1px solid ${isHovered ? 'rgba(201,169,110,0.25)' : C.border}`,
                      background: C.bgCard,
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, transform 0.2s',
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    {/* ── Frame visual ── */}
                    <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
                      <FramePreview cfg={cfg} name={tpl.name} />

                      {/* tier badge */}
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 100,
                        background: 'rgba(7,6,10,0.75)',
                        backdropFilter: 'blur(8px)',
                        fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: isPremium ? C.accent : '#10b981',
                        border: isPremium ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(16,185,129,0.3)',
                      }}>
                        {isPremium ? <><Star size={7} fill="currentColor" /> Premium</> : <><CheckCircle size={7} /> Free</>}
                      </div>

                      {/* hover CTA */}
                      <motion.div
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(7,6,10,0.75)',
                          backdropFilter: 'blur(6px)',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          gap: 10, padding: 20,
                          pointerEvents: isHovered ? 'auto' : 'none',
                        }}
                      >
                        <p style={{ fontSize: 13, fontWeight: 800, color: C.text, textAlign: 'center', letterSpacing: '-0.01em', margin: 0 }}>
                          {tpl.name}
                        </p>
                        {tpl.description && (
                          <p style={{
                            fontSize: 11, color: C.textMid, textAlign: 'center', lineHeight: 1.5, margin: 0,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {tpl.description}
                          </p>
                        )}
                        <SignedIn>
                          <Link
                            href={`/studio?template=${tpl.slug}`}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '9px 20px', borderRadius: 9, marginTop: 4,
                              background: isPremium ? C.accentDim : C.accent,
                              border: isPremium ? `1px solid rgba(201,169,110,0.35)` : 'none',
                              color: isPremium ? C.accent : '#07060A',
                              fontSize: 11, fontWeight: 700,
                              textDecoration: 'none',
                              textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}
                          >
                            {isPremium ? <><Lock size={10} /> Unlock & Pakai</> : 'Pakai Sekarang'}
                          </Link>
                        </SignedIn>
                        <SignedOut>
                          <SignInButton mode="modal">
                            <button style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '9px 20px', borderRadius: 9, marginTop: 4,
                              background: C.accent, color: '#07060A',
                              fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
                              textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                              Masuk & Pakai
                            </button>
                          </SignInButton>
                        </SignedOut>
                      </motion.div>
                    </div>

                    {/* ── Footer ── */}
                    <div style={{ padding: '11px 14px 13px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
                          {tpl.name}
                        </p>
                        <p style={{ fontSize: 9, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '3px 0 0' }}>
                          {tpl.category}
                        </p>
                      </div>
                      {isPremium ? (
                        <span style={{ fontSize: 12, fontWeight: 800, color: C.accent, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                          Rp{tpl.price.toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Free
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}