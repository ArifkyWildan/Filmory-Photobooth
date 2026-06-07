// src/lib/renderer.ts
// Canvas renderer untuk semua template Filmory
// Berjalan di browser (client-side)

import type { Template } from '@/types'

type PhotoDataUrl = string  // "data:image/jpeg;base64,..."

/** Load image dari data URL → HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Gambar rounded rectangle */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/** Draw foto ke slot dengan clipping */
async function drawPhotoSlot(
  ctx: CanvasRenderingContext2D,
  photo: string,
  x: number, y: number, w: number, h: number,
  radius: number = 0
) {
  const img = await loadImage(photo)
  ctx.save()
  if (radius > 0) {
    roundedRect(ctx, x, y, w, h, radius)
    ctx.clip()
  } else {
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.clip()
  }
  // cover fit
  const imgRatio = img.width / img.height
  const slotRatio = w / h
  let sx = 0, sy = 0, sw = img.width, sh = img.height
  if (imgRatio > slotRatio) {
    sw = img.height * slotRatio
    sx = (img.width - sw) / 2
  } else {
    sh = img.width / slotRatio
    sy = (img.height - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
  ctx.restore()
}

// ──────────────────────────────────────────────────────────────────────────────
// POLAROID CLASSIC
// ──────────────────────────────────────────────────────────────────────────────
async function renderPolaroid(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 380; canvas.height = 520
  const ctx = canvas.getContext('2d')!
  // Background
  ctx.fillStyle = '#f5f0e8'
  roundedRect(ctx, 0, 0, 380, 520, 8)
  ctx.fill()
  // Shadow inner
  ctx.shadowColor = 'rgba(0,0,0,0.06)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 4
  // 4 foto grid 2x2
  const slots = [
    [20, 20, 162, 120], [198, 20, 162, 120],
    [20, 156, 162, 120], [198, 156, 162, 120],
  ]
  ctx.shadowColor = 'transparent'
  for (let i = 0; i < 4; i++) {
    const [x, y, w, h] = slots[i]
    if (photos[i]) {
      await drawPhotoSlot(ctx, photos[i], x, y, w, h, 2)
    } else {
      ctx.fillStyle = '#e0d8cc'
      ctx.fillRect(x, y, w, h)
    }
  }
  // Bottom text
  ctx.fillStyle = '#999'
  ctx.font = '13px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('filmory', 190, 310)
  ctx.font = '11px "Space Mono", monospace'
  ctx.fillStyle = '#bbb'
  ctx.fillText(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }), 190, 330)
  // Filmory logo kecil di bawah
  ctx.fillStyle = '#c8b89a'
  ctx.font = 'italic 14px "Playfair Display", serif'
  ctx.fillText('✦ filmory studio ✦', 190, 500)
}

// ──────────────────────────────────────────────────────────────────────────────
// FILM STRIP
// ──────────────────────────────────────────────────────────────────────────────
async function renderFilmStrip(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 280; canvas.height = 640
  const ctx = canvas.getContext('2d')!
  // Background hitam
  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, 280, 640)
  // Top sprocket strip
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, 280, 28)
  ctx.fillRect(0, 612, 280, 28)
  // Sprocket holes kiri & kanan
  const holePositions = [20, 70, 120, 170, 220, 270, 320, 370, 420, 470, 520, 570, 620]
  holePositions.forEach(hy => {
    if (hy > 640) return
    ;[12, 256].forEach(hx => {
      ctx.fillStyle = '#1a1a1a'
      roundedRect(ctx, hx, hy, 14, 10, 2)
      ctx.fill()
    })
  })
  // 4 foto vertikal
  const frameH = 130
  const gap = 16
  const startY = 30
  for (let i = 0; i < 4; i++) {
    const fy = startY + i * (frameH + gap)
    if (photos[i]) {
      await drawPhotoSlot(ctx, photos[i], 34, fy, 212, frameH, 0)
    } else {
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(34, fy, 212, frameH)
    }
    // frame number
    ctx.fillStyle = 'rgba(177,120,82,0.5)'
    ctx.font = '10px "Space Mono", monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${i + 1}▲`, 240, fy + 12)
  }
  // Filmory label di bottom strip
  ctx.fillStyle = 'rgba(177,120,82,0.4)'
  ctx.font = '9px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('FILMORY — ANALOG STUDIO', 140, 625)
}

// ──────────────────────────────────────────────────────────────────────────────
// SIMPLE MEMORY
// ──────────────────────────────────────────────────────────────────────────────
async function renderSimple(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 400; canvas.height = 500
  const ctx = canvas.getContext('2d')!
  // Dark bg gradient
  const bg = ctx.createLinearGradient(0, 0, 400, 500)
  bg.addColorStop(0, '#1e1a16'); bg.addColorStop(1, '#191714')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 400, 500)
  // Outer border
  ctx.strokeStyle = 'rgba(177,120,82,0.2)'
  ctx.lineWidth = 1
  roundedRect(ctx, 10, 10, 380, 480, 12)
  ctx.stroke()
  // Header
  ctx.fillStyle = 'rgba(177,120,82,0.5)'
  ctx.font = '10px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('✦  M E M O R Y  ✦', 200, 36)
  // 4 foto 2x2
  const slots = [[24, 46, 170, 130], [206, 46, 170, 130], [24, 184, 170, 130], [206, 184, 170, 130]]
  for (let i = 0; i < 4; i++) {
    const [x, y, w, h] = slots[i]
    if (photos[i]) {
      await drawPhotoSlot(ctx, photos[i], x, y, w, h, 4)
    } else {
      ctx.fillStyle = 'rgba(177,120,82,0.08)'
      roundedRect(ctx, x, y, w, h, 4); ctx.fill()
    }
  }
  // Divider
  ctx.strokeStyle = 'rgba(177,120,82,0.25)'
  ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.moveTo(40, 328); ctx.lineTo(360, 328); ctx.stroke()
  // Date & watermark
  ctx.fillStyle = 'rgba(215,184,153,0.6)'
  ctx.font = 'italic 13px "Playfair Display", serif'
  ctx.textAlign = 'center'
  ctx.fillText(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 200, 360)
  ctx.fillStyle = 'rgba(177,120,82,0.3)'
  ctx.font = '11px "Space Mono", monospace'
  ctx.fillText('filmory', 200, 480)
}

// ──────────────────────────────────────────────────────────────────────────────
// SPOTIFY CARD
// ──────────────────────────────────────────────────────────────────────────────
async function renderSpotify(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 400; canvas.height = 560
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#121212'; ctx.fillRect(0, 0, 400, 560)
  // Album art (foto pertama, square)
  if (photos[0]) await drawPhotoSlot(ctx, photos[0], 24, 24, 352, 264, 8)
  // Green overlay subtle di bagian bawah album
  const ovGrad = ctx.createLinearGradient(0, 200, 0, 288)
  ovGrad.addColorStop(0, 'transparent')
  ovGrad.addColorStop(1, 'rgba(18,18,18,0.8)')
  ctx.fillStyle = ovGrad; ctx.fillRect(24, 200, 352, 88)
  // Track info
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 18px "DM Sans", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Filmory Session', 24, 316)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '13px "DM Sans", sans-serif'
  ctx.fillText('Coffee & Film Studio', 24, 338)
  // Progress bar
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  roundedRect(ctx, 24, 356, 352, 3, 2); ctx.fill()
  ctx.fillStyle = '#1DB954'
  roundedRect(ctx, 24, 356, 220, 3, 2); ctx.fill()
  // Time
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '11px "Space Mono", monospace'
  ctx.textAlign = 'left'; ctx.fillText('2:34', 24, 376)
  ctx.textAlign = 'right'; ctx.fillText('4:20', 376, 376)
  // Waveform 4 foto mini
  const miniSlots = [[24, 392, 82, 62], [110, 392, 82, 62], [196, 392, 82, 62], [282, 392, 82, 62]]
  for (let i = 0; i < 4; i++) {
    if (photos[i]) await drawPhotoSlot(ctx, photos[i], ...miniSlots[i] as [number,number,number,number], 4)
  }
  // Controls
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = '20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('⏮', 80, 492); ctx.fillStyle = '#fff'; ctx.fillText('▶', 200, 492)
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillText('⏭', 320, 492)
  // Footer
  ctx.fillStyle = 'rgba(29,185,84,0.5)'
  ctx.font = '10px "Space Mono", monospace'
  ctx.fillText('FILMORY × SPOTIFY', 200, 540)
}

// ──────────────────────────────────────────────────────────────────────────────
// KOREAN BOOTH
// ──────────────────────────────────────────────────────────────────────────────
async function renderKorean(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 360; canvas.height = 520
  const ctx = canvas.getContext('2d')!
  // Pink gradient bg
  const bg = ctx.createLinearGradient(0, 0, 360, 520)
  bg.addColorStop(0, '#FFB7C5'); bg.addColorStop(1, '#FFDCE8')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 360, 520)
  // Decorative dots
  for (let i = 0; i < 20; i++) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.arc(Math.random() * 360, Math.random() * 520, 2, 0, Math.PI * 2)
    ctx.fill()
  }
  // Header text
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.font = '11px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('♡  filmory  ♡', 180, 30)
  // 4 foto 2x2
  const slots = [[20, 42, 150, 115], [190, 42, 150, 115], [20, 165, 150, 115], [190, 165, 150, 115]]
  for (let i = 0; i < 4; i++) {
    const [x, y, w, h] = slots[i]
    // White border polaroid style
    ctx.fillStyle = '#fff'
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8)
    if (photos[i]) await drawPhotoSlot(ctx, photos[i], x, y, w, h, 0)
  }
  // Heart decorations
  ctx.fillStyle = 'rgba(255,100,130,0.4)'
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('♡', 18, 312); ctx.fillText('♡', 330, 312)
  // Date
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.font = '12px "Playfair Display", serif'
  ctx.textAlign = 'center'
  ctx.fillText(new Date().toLocaleDateString('ko-KR'), 180, 340)
  // Strip 2 foto di bawah (horizontal)
  const strip = [[20, 360, 148, 100], [192, 360, 148, 100]]
  for (let i = 0; i < 2; i++) {
    const [x, y, w, h] = strip[i]
    ctx.fillStyle = '#fff'
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8)
    if (photos[i + 2]) await drawPhotoSlot(ctx, photos[i + 2], x, y, w, h, 0)
  }
  // Footer
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.font = 'italic 13px "Playfair Display", serif'
  ctx.textAlign = 'center'
  ctx.fillText('우리의 추억 · Our Memory', 180, 498)
}

// ──────────────────────────────────────────────────────────────────────────────
// GLASSMORPHISM
// ──────────────────────────────────────────────────────────────────────────────
async function renderGlass(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 400; canvas.height = 550
  const ctx = canvas.getContext('2d')!
  // Bg gradient warm
  const bg = ctx.createLinearGradient(0, 0, 400, 550)
  bg.addColorStop(0, '#3d2f22'); bg.addColorStop(0.5, '#271d14'); bg.addColorStop(1, '#1a1410')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 400, 550)
  // Blurry circle accents
  const radGrad1 = ctx.createRadialGradient(100, 150, 0, 100, 150, 200)
  radGrad1.addColorStop(0, 'rgba(177,120,82,0.15)'); radGrad1.addColorStop(1, 'transparent')
  ctx.fillStyle = radGrad1; ctx.fillRect(0, 0, 400, 550)
  const radGrad2 = ctx.createRadialGradient(300, 350, 0, 300, 350, 180)
  radGrad2.addColorStop(0, 'rgba(215,184,153,0.1)'); radGrad2.addColorStop(1, 'transparent')
  ctx.fillStyle = radGrad2; ctx.fillRect(0, 0, 400, 550)
  // Glass card
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  roundedRect(ctx, 20, 20, 360, 510, 24); ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1; ctx.stroke()
  // 4 foto di dalam glass
  const slots = [[36, 36, 158, 120], [206, 36, 158, 120], [36, 168, 158, 120], [206, 168, 158, 120]]
  for (let i = 0; i < 4; i++) {
    const [x, y, w, h] = slots[i]
    if (photos[i]) await drawPhotoSlot(ctx, photos[i], x, y, w, h, 6)
    // glass border per foto
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1
    roundedRect(ctx, x, y, w, h, 6); ctx.stroke()
  }
  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(48, 305); ctx.lineTo(352, 305); ctx.stroke()
  // Text area
  ctx.fillStyle = 'rgba(244,230,211,0.8)'
  ctx.font = 'italic 16px "Playfair Display", serif'
  ctx.textAlign = 'center'
  ctx.fillText('Captured in Light', 200, 340)
  ctx.fillStyle = 'rgba(177,120,82,0.6)'
  ctx.font = '11px "Space Mono", monospace'
  ctx.fillText(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }), 200, 362)
  // Logo
  ctx.fillStyle = 'rgba(215,184,153,0.3)'
  ctx.font = '12px "Space Mono", monospace'
  ctx.fillText('✦ FILMORY STUDIO ✦', 200, 524)
}

// ──────────────────────────────────────────────────────────────────────────────
// NETFLIX CARD
// ──────────────────────────────────────────────────────────────────────────────
async function renderNetflix(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 420; canvas.height = 560
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#141414'; ctx.fillRect(0, 0, 420, 560)
  // Foto utama (besar)
  if (photos[0]) await drawPhotoSlot(ctx, photos[0], 0, 0, 420, 320, 0)
  // Gradient overlay bawah
  const ov = ctx.createLinearGradient(0, 200, 0, 320)
  ov.addColorStop(0, 'transparent'); ov.addColorStop(1, '#141414')
  ctx.fillStyle = ov; ctx.fillRect(0, 200, 420, 120)
  // N logo
  ctx.fillStyle = '#E50914'
  ctx.font = 'bold 44px "Playfair Display", serif'
  ctx.textAlign = 'left'
  ctx.fillText('N', 20, 50)
  // Title
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 22px "DM Sans", sans-serif'
  ctx.fillText('Filmory Session', 24, 360)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '13px "DM Sans", sans-serif'
  ctx.fillText('Season 1 · Episode 1 · 2024', 24, 382)
  // 3 mini foto
  const miniSlots = [[24, 402, 115, 80], [143, 402, 115, 80], [262, 402, 115, 80]]
  for (let i = 0; i < 3; i++) {
    const [x, y, w, h] = miniSlots[i]
    if (photos[i + 1]) await drawPhotoSlot(ctx, photos[i + 1], x, y, w, h, 4)
    else { ctx.fillStyle = '#2a2a2a'; roundedRect(ctx, x, y, w, h, 4); ctx.fill() }
    // Episode label
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '10px "Space Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`EP ${i + 2}`, x + w / 2, y + h + 16)
  }
  // Footer
  ctx.fillStyle = '#E50914'
  ctx.font = '11px "Space Mono", monospace'
  ctx.textAlign = 'right'
  ctx.fillText('FILMORY × NETFLIX', 396, 540)
}

// ──────────────────────────────────────────────────────────────────────────────
// LUXURY GOLD
// ──────────────────────────────────────────────────────────────────────────────
async function renderGold(canvas: HTMLCanvasElement, photos: PhotoDataUrl[]): Promise<void> {
  canvas.width = 400; canvas.height = 550
  const ctx = canvas.getContext('2d')!
  // Deep dark bg
  ctx.fillStyle = '#0e0b04'; ctx.fillRect(0, 0, 400, 550)
  // Gold border ornament
  const gold = '#D4AF37'
  ctx.strokeStyle = gold; ctx.lineWidth = 1.5
  roundedRect(ctx, 12, 12, 376, 526, 8); ctx.stroke()
  ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 0.5
  roundedRect(ctx, 20, 20, 360, 510, 6); ctx.stroke()
  // Corner ornaments
  ;([[20, 20], [380, 20], [20, 530], [380, 530]] as [number,number][]).forEach(([cx, cy]) => {
    ctx.fillStyle = gold
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill()
  })
  // Header ornament
  ctx.fillStyle = gold
  ctx.font = '12px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('✦ FILMORY LUXURY ✦', 200, 46)
  // 4 foto 2x2 dengan gold border
  const slots = [[32, 58, 158, 118], [210, 58, 158, 118], [32, 188, 158, 118], [210, 188, 118, 118]]
  for (let i = 0; i < 4; i++) {
    const [x, y, w, h] = slots[i]
    // gold frame
    ctx.strokeStyle = gold; ctx.lineWidth = 1
    ctx.strokeRect(x - 2, y - 2, w + 4, h + 4)
    if (photos[i]) await drawPhotoSlot(ctx, photos[i], x, y, w, h, 0)
    else { ctx.fillStyle = '#1a1408'; ctx.fillRect(x, y, w, h) }
  }
  // Ornament tengah
  ctx.fillStyle = gold
  ctx.font = '18px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('✦', 200, 328)
  ctx.fillStyle = 'rgba(212,175,55,0.4)'
  ctx.font = 'italic 15px "Playfair Display", serif'
  ctx.fillText('Luxury Moment', 200, 360)
  ctx.font = '11px "Space Mono", monospace'
  ctx.fillStyle = 'rgba(212,175,55,0.25)'
  ctx.fillText(new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 200, 382)
  // Bottom line
  ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.moveTo(40, 400); ctx.lineTo(360, 400); ctx.stroke()
  ctx.fillStyle = gold
  ctx.font = '10px "Space Mono", monospace'
  ctx.fillText('FILMORY EXCLUSIVE COLLECTION', 200, 528)
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN RENDERER — dispatch ke fungsi yang sesuai
// ──────────────────────────────────────────────────────────────────────────────
export async function renderTemplate(
  canvas: HTMLCanvasElement,
  template: Template,
  photos: PhotoDataUrl[]
): Promise<void> {
  switch (template.slug) {
    case 'polaroid-classic':   return renderPolaroid(canvas, photos)
    case 'film-strip':         return renderFilmStrip(canvas, photos)
    case 'simple-memory':      return renderSimple(canvas, photos)
    case 'spotify-card':       return renderSpotify(canvas, photos)
    case 'korean-booth':       return renderKorean(canvas, photos)
    case 'glassmorphism':      return renderGlass(canvas, photos)
    case 'netflix-card':       return renderNetflix(canvas, photos)
    case 'luxury-gold':        return renderGold(canvas, photos)
    default:                   return renderSimple(canvas, photos)
  }
}

/** Canvas → data URL → Blob → download */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string = 'filmory.jpg') {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/jpeg', 0.95)
}