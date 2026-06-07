'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@/components/clerk-auth'
import {
  Camera, Sparkles, Download, ArrowRight,
  Film, Star, Zap, CheckCircle
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

const TEMPLATES_PREVIEW = [
  { name: 'Polaroid Classic', category: 'RETRO', tier: 'FREE', bg: '#f5f0e8', accent: '#8b7355' },
  { name: 'Film Strip', category: 'RETRO', tier: 'FREE', bg: '#111111', accent: '#ffffff' },
  { name: 'Korean Booth', category: 'KOREAN', tier: 'PREMIUM', bg: '#FFB7C5', accent: '#FF85A1' },
  { name: 'Spotify Card', category: 'MUSIC', tier: 'PREMIUM', bg: '#121212', accent: '#1DB954' },
  { name: 'Glassmorphism', category: 'MODERN', tier: 'PREMIUM', bg: '#3d2f22', accent: '#b17852' },
  { name: 'Netflix Card', category: 'CINEMA', tier: 'PREMIUM', bg: '#141414', accent: '#E50914' },
]

const STEPS = [
  {
    num: '01',
    icon: Camera,
    title: 'Izinkan Kamera',
    desc: 'Buka Filmory dan izinkan akses kamera. Atur pencahayaan dan posisi. Tidak ada data yang dikirim ke server tanpa izin kamu.',
  },
  {
    num: '02',
    icon: Film,
    title: 'Pilih Template',
    desc: 'Pilih dari koleksi template FREE atau unlock template PREMIUM. Template di-render langsung di browser menggunakan Canvas API.',
  },
  {
    num: '03',
    icon: Download,
    title: 'Download & Bagikan',
    desc: 'Unduh hasil foto dalam kualitas tinggi (PNG/JPEG). Langsung siap di-post ke Instagram, TikTok, atau disimpan sebagai kenangan.',
  },
]

const PRICING = [
  {
    name: 'Gratis',
    price: 'Rp0',
    period: 'selamanya',
    features: [
      '3 template gratis selamanya',
      'Kualitas download standar',
      'Watermark Filmory kecil',
      'Support via email',
    ],
    cta: 'Mulai Gratis',
    highlight: false,
  },
  {
    name: 'Template Bundle',
    price: 'Rp10.000',
    period: 'per template',
    features: [
      'Unlock template pilihan',
      'Kualitas download HD',
      'Tanpa watermark',
      'Template eksklusif',
      'Akses seumur hidup',
      '+ Template baru gratis',
    ],
    cta: 'Lihat Semua Template',
    highlight: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0e0b09] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(177,120,82,0.1)] bg-[rgba(14,11,9,0.8)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#b17852] flex items-center justify-center">
              <Film size={14} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold text-[#e8ddd0]">Filmory</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs text-[#a89880] uppercase tracking-widest">
            <Link href="#templates" className="hover:text-[#e8ddd0] transition-colors">Template</Link>
            <Link href="#cara-kerja" className="hover:text-[#e8ddd0] transition-colors">Cara Kerja</Link>
            <Link href="#harga" className="hover:text-[#e8ddd0] transition-colors">Harga</Link>
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              {/* ✅ Fix: SignInButton tanpa wrapper <button> di dalam */}
              <SignInButton mode="modal">
                <button className="btn-ghost text-xs">Masuk</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="btn-primary text-xs">Mulai Gratis</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/studio" className="btn-primary text-xs">
                Buka Studio
              </Link>
              {/* ✅ Fix: hapus afterSignOutUrl, tidak ada di Clerk v5+ */}
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#b17852] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(177,120,82,0.3)] text-[#b17852] text-xs uppercase tracking-widest mb-8"
          >
            <Sparkles size={10} />
            <span>Template Foto Aesthetic</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6"
          >
            Abadikan momen{' '}
            <span className="text-gradient">dengan gaya</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-[#a89880] text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Filmory mengubah kamera biasa jadi photobooth aesthetic.
            Polaroid, Film Strip, Korean Booth, dan 12+ template eksklusif — langsung di browser kamu.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary text-sm px-8 py-3">
                  Mulai Sekarang — Gratis
                  <ArrowRight size={16} />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/studio" className="btn-primary text-sm px-8 py-3">
                Buka Studio
                <ArrowRight size={16} />
              </Link>
            </SignedIn>
            <Link href="#templates" className="btn-ghost text-sm px-8 py-3">
              Lihat Template
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Templates Preview */}
      <section id="templates" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-widest text-[#b17852] block mb-3">Koleksi Template</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Mulai dari <em>Filmory</em>
            </h2>
            <p className="text-[#a89880] mt-4 max-w-lg mx-auto">
              Setiap template didesain dengan cermat — dari retro film analog hingga aesthetic K-pop terkini.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATES_PREVIEW.map((tpl, i) => (
              <motion.div
                key={tpl.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.05}
                className="card-filmory p-4 group cursor-pointer"
              >
                <div
                  className="w-full aspect-[3/4] rounded-lg mb-3 relative overflow-hidden"
                  style={{ background: tpl.bg }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ color: tpl.accent }}
                  >
                    <Film size={32} opacity={0.3} />
                  </div>
                  {tpl.tier === 'PREMIUM' && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-[rgba(0,0,0,0.6)] px-2 py-0.5 rounded-full text-[10px] text-[#b17852]">
                      <Star size={8} fill="currentColor" />
                      <span>Premium</span>
                    </div>
                  )}
                  {tpl.tier === 'FREE' && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-[rgba(0,0,0,0.6)] px-2 py-0.5 rounded-full text-[10px] text-emerald-400">
                      <CheckCircle size={8} />
                      <span>Free</span>
                    </div>
                  )}
                </div>

                <p className="text-sm font-bold text-[#e8ddd0]">{tpl.name}</p>
                <p className="text-xs text-[#6b5c4e] uppercase tracking-wider mt-0.5">{tpl.category}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/templates" className="btn-ghost text-xs">
              Lihat Semua Template
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara-kerja" className="py-20 px-6 bg-[#0d0a08]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-widest text-[#b17852] block mb-3">Cara Pakai</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Tiga Langkah <em className="text-gradient">Mudah</em>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="card-filmory p-6 flex gap-6 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(177,120,82,0.1)] border border-[rgba(177,120,82,0.2)] flex items-center justify-center">
                    <step.icon size={20} className="text-[#b17852]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[#b17852] font-mono">{step.num}</span>
                    <h3 className="text-base font-bold text-[#e8ddd0]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[#a89880] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs uppercase tracking-widest text-[#b17852] block mb-3">Harga</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Harga yang <em className="text-gradient">Bersahabat</em>
            </h2>
            <p className="text-[#a89880] mt-4">
              Template gratis selamanya. Premium sekali bayar, milik selamanya.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.1}
                className={`card-filmory p-8 relative ${plan.highlight ? 'border-[rgba(177,120,82,0.4)]' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#b17852] text-white text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">
                    <Zap size={8} />
                    Paling Populer
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest text-[#b17852] mb-2">{plan.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-[#e8ddd0]">{plan.price}</span>
                    <span className="text-[#6b5c4e] text-sm">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#a89880]">
                      <CheckCircle size={14} className="text-[#b17852] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <SignedOut>
                  <SignInButton mode="modal">
                    <button className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-ghost w-full justify-center'}>
                      {plan.cta}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href={plan.highlight ? '/templates' : '/studio'}
                    className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-ghost w-full justify-center'}
                  >
                    {plan.cta}
                  </Link>
                </SignedIn>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0d0a08]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-full bg-[rgba(177,120,82,0.1)] border border-[rgba(177,120,82,0.2)] flex items-center justify-center mx-auto mb-6">
              <Film size={24} className="text-[#b17852]" />
            </div>
            <h2 className="font-display text-4xl font-bold mb-4">
              Siap abadikan momenmu?
            </h2>
            <p className="text-[#a89880] mb-8">
              Bergabung dengan ribuan pengguna yang sudah membuat kenangan dengan Filmory.
            </p>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary text-sm px-10 py-3">
                  Mulai Sekarang — Gratis
                  <ArrowRight size={16} />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/studio" className="btn-primary text-sm px-10 py-3">
                Buka Studio
                <ArrowRight size={16} />
              </Link>
            </SignedIn>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(177,120,82,0.1)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#b17852] flex items-center justify-center">
              <Film size={10} className="text-white" />
            </div>
            <span className="font-display text-sm text-[#6b5c4e]">Filmory</span>
          </div>
          <p className="text-xs text-[#6b5c4e]">
            © 2025 Filmory. Dibuat dengan ✦ di Indonesia.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#6b5c4e] uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-[#a89880] transition-colors">Privasi</Link>
            <Link href="/terms" className="hover:text-[#a89880] transition-colors">Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}