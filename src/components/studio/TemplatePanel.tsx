'use client'
// src/components/studio/TemplatePanel.tsx
import type { Template } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  RETRO:     '🎞 Retro',
  MUSIC:     '🎵 Music',
  CINEMA:    '🎬 Cinema',
  KOREAN:    '🌸 Korean',
  MODERN:    '✦ Modern',
  EDITORIAL: '📰 Editorial',
  SOCIAL:    '📱 Social',
}

// Thumbnail background per template slug
function TemplateThumbnail({ slug }: { slug: string }) {
  const thumbs: Record<string, React.ReactNode> = {
    'polaroid-classic': (
      <div className="w-full h-full bg-[#f5f0e8] flex flex-col p-1.5 gap-1">
        <div className="flex-1 bg-gradient-to-br from-[#8B6B54] to-[#4a3828] rounded-sm" />
        <div className="h-3 flex items-center justify-center text-[7px] text-[#888] font-mono">
          filmory
        </div>
      </div>
    ),
    'film-strip': (
      <div className="w-full h-full bg-[#111] flex flex-col gap-0.5 py-1">
        <div className="h-1.5 bg-white/5 mx-1 rounded-sm" />
        <div className="flex-1 bg-gradient-to-br from-[#3a3028] to-[#2a2020] mx-1.5 rounded-sm" />
        <div className="flex-1 bg-gradient-to-br from-[#3a3028] to-[#2a2020] mx-1.5 rounded-sm" />
        <div className="h-1.5 bg-white/5 mx-1 rounded-sm" />
      </div>
    ),
    'simple-memory': (
      <div className="w-full h-full bg-gradient-to-br from-[#2a2420] to-[#191714]
                      flex flex-col items-center justify-center gap-1.5 p-2">
        <div className="w-full flex-1 bg-[rgba(177,120,82,0.12)] rounded border border-[rgba(177,120,82,0.15)]" />
        <div className="text-[6px] text-muted font-mono">filmory</div>
      </div>
    ),
    'spotify-card': (
      <div className="w-full h-full bg-[#121212] flex flex-col p-1.5 gap-1">
        <div className="flex-1 bg-gradient-to-br from-[#1a3a1a] to-[#0d8f3e] rounded-sm
                        flex items-center justify-center text-[#1DB954] text-xs">♪</div>
        <div className="flex gap-0.5 items-end h-3">
          {[60, 100, 40, 80, 55, 70, 45].map((h, i) => (
            <div key={i} className="flex-1 bg-[#1DB954] rounded-sm"
                 style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    ),
    'korean-booth': (
      <div className="w-full h-full bg-gradient-to-br from-[#FFB7C5] to-[#FFDCE6]
                      flex flex-col items-center justify-center gap-1 p-2">
        <div className="text-[6px] text-black/30 font-mono">♡ filmory ♡</div>
        <div className="grid grid-cols-2 gap-0.5 w-full flex-1">
          {[0,1,2,3].map(i => (
            <div key={i} className="bg-white/50 rounded-sm" />
          ))}
        </div>
      </div>
    ),
    'glassmorphism': (
      <div className="w-full h-full bg-gradient-to-br from-[#3d2f22] to-[#1a1410]
                      flex items-center justify-center">
        <div className="w-[80%] h-[80%] rounded-lg bg-white/[0.06]
                        border border-white/[0.12] backdrop-blur-sm" />
      </div>
    ),
    'apple-music': (
      <div className="w-full h-full bg-black flex flex-col p-1.5 gap-1">
        <div className="flex-1 bg-gradient-to-br from-[#fc3c44] to-[#ff3b30] rounded-sm" />
        <div className="text-[6px] text-white/30 font-mono text-center">♪ NOW PLAYING</div>
        <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-[60%] bg-white/60 rounded-full" />
        </div>
      </div>
    ),
    'netflix-card': (
      <div className="w-full h-full bg-[#141414] flex flex-col p-1.5 gap-1">
        <div className="flex-1 bg-gradient-to-br from-[#2a1a1a] to-[#1a0f0f] rounded-sm
                        flex items-start justify-start p-1">
          <span className="text-[#E50914] font-bold text-xs">N</span>
        </div>
        <div className="grid grid-cols-3 gap-0.5 h-5">
          {[0,1,2].map(i => (
            <div key={i} className="bg-[#2a2a2a] rounded-sm" />
          ))}
        </div>
      </div>
    ),
    'luxury-gold': (
      <div className="w-full h-full bg-[#0e0b04] flex flex-col items-center justify-center gap-1
                      border border-[#D4AF37]/30 rounded-sm m-0.5">
        <div className="text-[#D4AF37] text-xs">✦</div>
        <div className="text-[#D4AF37]/50 font-mono text-[6px] tracking-widest">LUXURY</div>
      </div>
    ),
    'magazine-cover': (
      <div className="w-full h-full bg-white flex flex-col p-1.5 gap-1">
        <div className="text-[6px] text-gray-800 font-bold tracking-widest">FILMORY</div>
        <div className="flex-1 bg-gradient-to-br from-[#d4a888] to-[#8B6B54] rounded-sm" />
        <div className="text-[5px] text-gray-500 font-mono">VOL.01 · 2024</div>
      </div>
    ),
    'vintage-scrapbook': (
      <div className="w-full h-full bg-[#f0e6d3] flex flex-col p-2 gap-1">
        <div className="flex-1 bg-[rgba(139,107,84,0.25)] rounded-sm
                        border border-[rgba(139,107,84,0.3)]" />
        <div className="text-[6px] text-[#8B6B54] font-mono text-center">vintage</div>
      </div>
    ),
    'social-frame': (
      <div className="w-full h-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]
                      flex items-center justify-center">
        <div className="w-[65%] aspect-square border-2 border-white/70 rounded-lg bg-white/10" />
      </div>
    ),
  }
  return (
    <div className="w-full h-full">
      {thumbs[slug] ?? (
        <div className="w-full h-full bg-surface flex items-center justify-center
                        text-[8px] text-muted font-mono">
          {slug}
        </div>
      )}
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface TemplatePanelProps {
  templates:       Template[]
  selectedTemplate: Template | null
  onSelect:        (t: Template) => void
  isPremium:       boolean
  unlockedIds:     Set<string>
}

export default function TemplatePanel({
  templates, selectedTemplate, onSelect, isPremium, unlockedIds,
}: TemplatePanelProps) {

  const isUnlocked = (t: Template) =>
    t.tier === 'FREE' || isPremium || unlockedIds.has(t.id)

  // Group by category
  const grouped = templates.reduce<Record<string, Template[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  return (
    <aside className="w-[220px] lg:w-[248px] flex-shrink-0 border-l border-white/[0.06]
                      bg-surface/40 flex flex-col h-[calc(100vh-48px)] sticky top-12">

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <p className="font-mono text-[9px] text-dim uppercase tracking-widest mb-0.5">
          Template
        </p>
        <p className="text-xs text-muted">
          {isPremium ? '✦ Semua Aktif' : `${templates.filter(t => t.tier === 'FREE').length} gratis`}
        </p>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {Object.entries(grouped).map(([cat, tpls]) => (
          <div key={cat}>
            <p className="font-mono text-[9px] text-dim uppercase tracking-wider mb-2 px-1">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {tpls.map((tpl) => {
                const unlocked = isUnlocked(tpl)
                const isSelected = selectedTemplate?.id === tpl.id
                return (
                  <button
                    key={tpl.id}
                    onClick={() => onSelect(tpl)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden
                                border-2 transition-all duration-200
                                ${isSelected
                                  ? 'border-primary shadow-[0_0_0_3px_rgba(177,120,82,0.2)]'
                                  : 'border-white/[0.06] hover:border-white/20'
                                }
                                ${!unlocked ? 'opacity-60' : ''}`}
                  >
                    <TemplateThumbnail slug={tpl.slug} />

                    {/* Lock overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center
                                      bg-black/50">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-base">🔒</span>
                          <span className="font-mono text-[7px] text-secondary/70">
                            Rp{(tpl.price / 1000).toFixed(0)}rb
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tier badge */}
                    <div className="absolute top-1 right-1">
                      {tpl.tier === 'PREMIUM' && unlocked
                        ? <span className="badge-premium text-[7px] px-1.5 py-0.5">PRO</span>
                        : tpl.tier === 'FREE'
                          ? <span className="badge-free text-[7px] px-1.5 py-0.5">FREE</span>
                          : null
                      }
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2
                                      w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: upgrade prompt */}
      {!isPremium && (
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="bg-gradient-to-br from-primary/15 to-secondary/5
                          border border-primary/20 rounded-xl p-3 text-center">
            <p className="font-serif italic text-sm text-secondary mb-1">Unlock Semua</p>
            <p className="font-mono text-[9px] text-muted mb-2.5">
              12 template · Rp10.000 selamanya
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                // Trigger payment untuk 'all' — emit custom event
                window.dispatchEvent(new CustomEvent('filmory:unlock-all'))
              }}
              className="btn-primary text-[11px] px-4 py-2 rounded-full w-full
                         flex items-center justify-center gap-1"
            >
              ✦ Unlock Premium
            </a>
          </div>
        </div>
      )}
    </aside>
  )
}