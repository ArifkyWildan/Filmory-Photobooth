// prisma/seed.ts
import { PrismaClient, TemplateCategory, TemplateTier } from '@prisma/client'

const prisma = new PrismaClient()

const templates = [
  // ── FREE ──────────────────────────────────────────────────────────────
  {
    slug: 'polaroid-classic',
    name: 'Polaroid Classic',
    description: 'Tampilan Polaroid putih vintage dengan border bawah dan tanggal',
    category: TemplateCategory.RETRO,
    tier: TemplateTier.FREE,
    price: 0,
    sortOrder: 1,
    configJson: {
      layout: 'polaroid',
      bgColor: '#f5f0e8',
      borderColor: '#e8e0d0',
      textColor: '#888',
      font: 'Space Mono',
      photoGrid: [[0,0,1,1],[0,1,1,2],[1,0,2,1],[1,1,2,2]],
      canvasWidth: 380,
      canvasHeight: 520,
    },
  },
  {
    slug: 'film-strip',
    name: 'Film Strip',
    description: 'Strip film analog hitam dengan sprocket holes klasik',
    category: TemplateCategory.RETRO,
    tier: TemplateTier.FREE,
    price: 0,
    sortOrder: 2,
    configJson: {
      layout: 'filmstrip',
      bgColor: '#111111',
      sprocketColor: 'rgba(255,255,255,0.08)',
      canvasWidth: 280,
      canvasHeight: 620,
    },
  },
  {
    slug: 'simple-memory',
    name: 'Simple Memory',
    description: 'Layout minimalis dengan border tipis warm dan signature Filmory',
    category: TemplateCategory.MODERN,
    tier: TemplateTier.FREE,
    price: 0,
    sortOrder: 3,
    configJson: {
      layout: 'grid2x2',
      bgColor: '#1a1714',
      borderColor: 'rgba(177,120,82,0.3)',
      textColor: 'rgba(177,120,82,0.6)',
      canvasWidth: 400,
      canvasHeight: 500,
    },
  },

  // ── PREMIUM ───────────────────────────────────────────────────────────
  {
    slug: 'spotify-card',
    name: 'Spotify Card',
    description: 'Kartu bergaya Spotify dengan waveform animatif dan album art',
    category: TemplateCategory.MUSIC,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 4,
    configJson: {
      layout: 'spotify',
      bgColor: '#121212',
      accentColor: '#1DB954',
      canvasWidth: 400,
      canvasHeight: 560,
    },
  },
  {
    slug: 'korean-booth',
    name: 'Korean Booth',
    description: 'Gaya photobooth Korea dengan warna pastel pink dan grid 2x2',
    category: TemplateCategory.KOREAN,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 5,
    configJson: {
      layout: 'korean',
      bgColor: '#FFB7C5',
      accentColor: '#FF85A1',
      textColor: 'rgba(0,0,0,0.4)',
      canvasWidth: 360,
      canvasHeight: 500,
    },
  },
  {
    slug: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Efek kaca frosted dengan gradien warm Filmory yang elegan',
    category: TemplateCategory.MODERN,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 6,
    configJson: {
      layout: 'glass',
      bgGradient: ['#3d2f22', '#1a1410'],
      glassColor: 'rgba(255,255,255,0.08)',
      borderColor: 'rgba(255,255,255,0.12)',
      canvasWidth: 400,
      canvasHeight: 550,
    },
  },
  {
    slug: 'apple-music',
    name: 'Apple Music Card',
    description: 'Kartu bergaya Apple Music dengan progress bar dan album cover',
    category: TemplateCategory.MUSIC,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 7,
    configJson: {
      layout: 'apple-music',
      bgColor: '#000000',
      accentColor: '#fc3c44',
      canvasWidth: 400,
      canvasHeight: 560,
    },
  },
  {
    slug: 'netflix-card',
    name: 'Netflix Card',
    description: 'Frame sinematik Netflix dengan logo N merah dan judul episode',
    category: TemplateCategory.CINEMA,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 8,
    configJson: {
      layout: 'netflix',
      bgColor: '#141414',
      accentColor: '#E50914',
      canvasWidth: 420,
      canvasHeight: 560,
    },
  },
  {
    slug: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Frame eksklusif emas dengan ornamen vintage dan tipografi elegan',
    category: TemplateCategory.EDITORIAL,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 9,
    configJson: {
      layout: 'gold',
      bgColor: '#1a1208',
      goldColor: '#D4AF37',
      canvasWidth: 400,
      canvasHeight: 550,
    },
  },
  {
    slug: 'magazine-cover',
    name: 'Magazine Cover',
    description: 'Cover majalah editorial dengan tipografi bold dan layout dramatis',
    category: TemplateCategory.EDITORIAL,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 10,
    configJson: {
      layout: 'magazine',
      bgColor: '#ffffff',
      textColor: '#1a1208',
      accentColor: '#B17852',
      canvasWidth: 380,
      canvasHeight: 520,
    },
  },
  {
    slug: 'vintage-scrapbook',
    name: 'Vintage Scrapbook',
    description: 'Tekstur kertas vintage dengan tape, stempel, dan ornamen retro',
    category: TemplateCategory.RETRO,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 11,
    configJson: {
      layout: 'scrapbook',
      bgColor: '#f0e6d3',
      textColor: '#8B6B54',
      canvasWidth: 400,
      canvasHeight: 530,
    },
  },
  {
    slug: 'social-frame',
    name: 'Social Media Frame',
    description: 'Frame siap posting untuk Instagram dan TikTok dengan rasio sempurna',
    category: TemplateCategory.SOCIAL,
    tier: TemplateTier.PREMIUM,
    price: 5000,
    sortOrder: 12,
    configJson: {
      layout: 'social',
      bgGradient: ['#833ab4', '#fd1d1d', '#fcb045'],
      canvasWidth: 400,
      canvasHeight: 400,
    },
  },
]

async function main() {
  console.log('🌱 Seeding Filmory database...')

  for (const tpl of templates) {
    await prisma.template.upsert({
      where: { slug: tpl.slug },
      update: tpl,
      create: tpl,
    })
    console.log(`  ✓ Template: ${tpl.name}`)
  }

  console.log('\n✦ Seed selesai!')
  console.log(`  Templates: ${templates.length}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())