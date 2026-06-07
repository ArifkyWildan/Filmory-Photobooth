'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@/components/clerk-auth'
import { Film, Star, CheckCircle, ArrowLeft, Lock } from 'lucide-react'

type Template = {
  id: string
  slug: string
  name: string
  description: string
  category: string
  tier: string
  price: number
  configJson: Record<string, unknown>
}

const CATEGORY_LABELS: Record<string, string> = {
  ALL: 'Semua',
  RETRO: 'Retro',
  MODERN: 'Modern',
  KOREAN: 'Korean',
  MUSIC: 'Music',
  CINEMA: 'Cinema',
  EDITORIAL: 'Editorial',
  SOCIAL: 'Social',
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 },
  }),
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => { setTemplates(d.templates || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'ALL'
    ? templates
    : templates.filter(t => t.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#0e0b09] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#6b5c4e] uppercase tracking-widest hover:text-[#a89880] transition-colors mb-6">
            <ArrowLeft size={12} />
            Kembali
          </Link>
          <h1 className="font-display text-5xl font-bold mb-3">
            Semua <em className="text-gradient">Template</em>
          </h1>
          <p className="text-[#a89880]">
            {templates.length} template tersedia · 3 gratis selamanya
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                activeCategory === key
                  ? 'border-[#b17852] bg-[rgba(177,120,82,0.1)] text-[#b17852]'
                  : 'border-[rgba(177,120,82,0.15)] text-[#6b5c4e] hover:text-[#a89880]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-filmory p-4 animate-pulse">
                <div className="w-full aspect-[3/4] rounded-lg bg-[#2a211a] mb-3" />
                <div className="h-4 bg-[#2a211a] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#2a211a] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((tpl, i) => {
              const cfg = tpl.configJson as Record<string, string>
              return (
                <motion.div
                  key={tpl.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={i * 0.03}
                  className="card-filmory p-4 group"
                >
                  <div
                    className="w-full aspect-[3/4] rounded-lg mb-3 relative overflow-hidden"
                    style={{ background: (cfg.bgColor as string) || '#1a1410' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Film size={40} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {tpl.tier === 'PREMIUM' && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-[rgba(0,0,0,0.7)] px-2 py-0.5 rounded-full text-[10px] text-[#b17852]">
                        <Star size={8} fill="currentColor" />
                        <span>Premium</span>
                      </div>
                    )}
                    {tpl.tier === 'FREE' && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-[rgba(0,0,0,0.7)] px-2 py-0.5 rounded-full text-[10px] text-emerald-400">
                        <CheckCircle size={8} />
                        <span>Free</span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[rgba(177,120,82,0.1)] opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <SignedIn>
                        <Link
                          href={`/studio?template=${tpl.slug}`}
                          className="w-full btn-primary text-[10px] py-1.5 justify-center"
                        >
                          {tpl.tier === 'PREMIUM' ? (
                            <><Lock size={10} /> Unlock & Pakai</>
                          ) : 'Pakai Template'}
                        </Link>
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <button className="w-full btn-primary text-[10px] py-1.5 justify-center">
                            Masuk untuk Pakai
                          </button>
                        </SignInButton>
                      </SignedOut>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-[#e8ddd0] truncate">{tpl.name}</p>
                  <p className="text-xs text-[#6b5c4e] uppercase tracking-wider mt-0.5">{tpl.category}</p>
                  {tpl.tier === 'PREMIUM' && (
                    <p className="text-xs text-[#b17852] mt-1">
                      Rp{tpl.price.toLocaleString('id-ID')}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}