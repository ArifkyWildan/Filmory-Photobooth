// src/app/studio/page.tsx
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import StudioApp from '@/components/studio/Studioapp'
import type { Template } from '@/types'

// Fetch semua template aktif
async function getTemplates(): Promise<Template[]> {
  try {
    const templates = await prisma.template.findMany({
      where:   { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    // Cast configJson dari Prisma Json → TemplateConfig
    return (templates as unknown as Template[]).map((t) => ({
      ...t,
      description: t.description ?? null,
      previewUrl:  t.previewUrl  ?? null,
      configJson:  t.configJson  as Template['configJson'],
    }))
  } catch {
    // Jika DB belum di-setup, return template default
    return getDefaultTemplates()
  }
}

// Cek template yang sudah di-unlock user
async function getUnlockedTemplateIds(userId: string): Promise<string[]> {
  try {
    const unlocks = await prisma.userTemplate.findMany({
      where:  { user: { clerkId: userId } },
      select: { templateId: true },
    })
    return (unlocks as unknown as { templateId: string }[]).map((u) => u.templateId)
  } catch {
    return []
  }
}

// Cek apakah user premium (unlock semua)
async function getUserIsPremium(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where:  { clerkId: userId },
      select: { isPremium: true },
    })
    return user?.isPremium ?? false
  } catch {
    return false
  }
}

export default async function StudioPage() {
  const { userId } = await auth()

  const [templates, unlockedIds, isPremium] = await Promise.all([
    getTemplates(),
    userId ? getUnlockedTemplateIds(userId) : Promise.resolve([]),
    userId ? getUserIsPremium(userId)       : Promise.resolve(false),
  ])

  return (
    <StudioApp
      templates={templates}
      unlockedTemplateIds={unlockedIds}
      isPremium={isPremium}
      userId={userId}
    />
  )
}

// ── Fallback templates jika DB belum ready ───────────────────────────────────
function getDefaultTemplates(): Template[] {
  return [
    {
      id: 'tpl_polaroid', slug: 'polaroid-classic', name: 'Polaroid Classic',
      description: 'Tampilan Polaroid vintage klasik', category: 'RETRO',
      tier: 'FREE', price: 0, previewUrl: null, isActive: true, sortOrder: 1,
      configJson: { layout: 'polaroid', canvasWidth: 380, canvasHeight: 520 },
    },
    {
      id: 'tpl_film', slug: 'film-strip', name: 'Film Strip',
      description: 'Strip film analog hitam', category: 'RETRO',
      tier: 'FREE', price: 0, previewUrl: null, isActive: true, sortOrder: 2,
      configJson: { layout: 'filmstrip', canvasWidth: 280, canvasHeight: 640 },
    },
    {
      id: 'tpl_simple', slug: 'simple-memory', name: 'Simple Memory',
      description: 'Layout minimalis warm', category: 'MODERN',
      tier: 'FREE', price: 0, previewUrl: null, isActive: true, sortOrder: 3,
      configJson: { layout: 'grid2x2', canvasWidth: 400, canvasHeight: 500 },
    },
    {
      id: 'tpl_spotify', slug: 'spotify-card', name: 'Spotify Card',
      description: 'Bergaya Spotify dengan waveform', category: 'MUSIC',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 4,
      configJson: { layout: 'spotify', canvasWidth: 400, canvasHeight: 560 },
    },
    {
      id: 'tpl_korean', slug: 'korean-booth', name: 'Korean Booth',
      description: 'Gaya photobooth Korea', category: 'KOREAN',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 5,
      configJson: { layout: 'korean', canvasWidth: 360, canvasHeight: 520 },
    },
    {
      id: 'tpl_glass', slug: 'glassmorphism', name: 'Glassmorphism',
      description: 'Efek kaca frosted warm', category: 'MODERN',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 6,
      configJson: { layout: 'glass', canvasWidth: 400, canvasHeight: 550 },
    },
    {
      id: 'tpl_apple', slug: 'apple-music', name: 'Apple Music Card',
      description: 'Bergaya Apple Music', category: 'MUSIC',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 7,
      configJson: { layout: 'apple-music', canvasWidth: 400, canvasHeight: 560 },
    },
    {
      id: 'tpl_netflix', slug: 'netflix-card', name: 'Netflix Card',
      description: 'Frame sinematik Netflix', category: 'CINEMA',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 8,
      configJson: { layout: 'netflix', canvasWidth: 420, canvasHeight: 560 },
    },
    {
      id: 'tpl_gold', slug: 'luxury-gold', name: 'Luxury Gold',
      description: 'Frame eksklusif emas', category: 'EDITORIAL',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 9,
      configJson: { layout: 'gold', canvasWidth: 400, canvasHeight: 550 },
    },
    {
      id: 'tpl_magazine', slug: 'magazine-cover', name: 'Magazine Cover',
      description: 'Cover majalah editorial', category: 'EDITORIAL',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 10,
      configJson: { layout: 'magazine', canvasWidth: 380, canvasHeight: 520 },
    },
    {
      id: 'tpl_vintage', slug: 'vintage-scrapbook', name: 'Vintage Scrapbook',
      description: 'Tekstur kertas vintage', category: 'RETRO',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 11,
      configJson: { layout: 'scrapbook', canvasWidth: 400, canvasHeight: 530 },
    },
    {
      id: 'tpl_social', slug: 'social-frame', name: 'Social Frame',
      description: 'Frame siap posting sosmed', category: 'SOCIAL',
      tier: 'PREMIUM', price: 5000, previewUrl: null, isActive: true, sortOrder: 12,
      configJson: { layout: 'social', canvasWidth: 400, canvasHeight: 400 },
    },
  ]
}