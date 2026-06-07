'use client'
// src/components/studio/Studioapp.tsx
// Halaman utama Filmory Studio — kamera + template picker + result

import { useRef, useEffect, useCallback, useState } from 'react'
import { useStudioStore }  from '@/store/studio'
import { renderTemplate, downloadCanvas } from '@/lib/renderer'
import type { Template }  from '@/types'
import TemplatePanel      from './TemplatePanel'
import PaymentModal       from './PaymentModal'
import ResultCard         from './ResultCard'
import Toast              from './Toast'

// ─── Props ────────────────────────────────────────────────────────────────────
interface StudioAppProps {
  templates:            Template[]
  unlockedTemplateIds:  string[]
  isPremium:            boolean
  userId:               string | null
}

// ─── Timer pill ──────────────────────────────────────────────────────────────
function TimerPill({ value, active, onClick }: { value: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all ${
        active
          ? 'bg-primary text-white border border-primary'
          : 'bg-transparent text-muted border border-white/10 hover:border-primary/50 hover:text-secondary'
      }`}
    >
      {value}s
    </button>
  )
}

// ─── Photo Slot ──────────────────────────────────────────────────────────────
function PhotoSlot({ index, photo, active }: { index: number; photo?: string; active: boolean }) {
  return (
    <div
      className={`aspect-[3/4] rounded-lg overflow-hidden relative flex items-center justify-center
        transition-all duration-200 border
        ${active
          ? 'border-primary shadow-[0_0_0_2px_rgba(177,120,82,0.3)]'
          : photo ? 'border-white/10' : 'border-dashed border-white/10'
        }
        ${photo ? '' : 'bg-surface'}`}
    >
      {photo ? (
        <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
      ) : (
        <span className="font-mono text-[10px] text-dim">{index + 1}</span>
      )}
      {photo && (
        <div className="absolute bottom-1 right-1.5 text-[8px] text-secondary/60 font-mono">✓</div>
      )}
    </div>
  )
}

// ─── Corner guides ────────────────────────────────────────────────────────────
function ViewfinderCorners() {
  const cls = 'absolute w-5 h-5 border-secondary/60 border-solid'
  return (
    <>
      <div className={`${cls} top-3 left-3 border-t-2 border-l-2`} />
      <div className={`${cls} top-3 right-3 border-t-2 border-r-2`} />
      <div className={`${cls} bottom-3 left-3 border-b-2 border-l-2`} />
      <div className={`${cls} bottom-3 right-3 border-b-2 border-r-2`} />
    </>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function StudioApp({ templates, unlockedTemplateIds, isPremium, userId }: StudioAppProps) {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const resultRef  = useRef<HTMLCanvasElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)

  const {
    cameraReady, setCameraReady,
    facingMode, setFacingMode,
    timerSeconds, setTimer,
    photos, addPhoto, resetPhotos,
    currentSlot, isShooting, setIsShooting,
    selectedTemplate, setSelectedTemplate,
    resultDataUrl, setResultDataUrl,
  } = useStudioStore()

  const [countdown,       setCountdown]       = useState<number | null>(null)
  const [payTemplate,     setPayTemplate]      = useState<Template | null>(null)
  const [toast,           setToast]            = useState<{ title: string; sub: string } | null>(null)
  const [isRendering,     setIsRendering]      = useState(false)
  const [localUnlocked,   setLocalUnlocked]    = useState<Set<string>>(new Set(unlockedTemplateIds))
  const [localIsPremium,  setLocalIsPremium]   = useState(isPremium)

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = useCallback((title: string, sub: string) => {
    setToast({ title, sub })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // ── Render template ───────────────────────────────────────────────────────
  const renderResult = useCallback(async () => {
    if (!selectedTemplate || !resultRef.current) return
    const currentPhotos = useStudioStore.getState().photos
    if (currentPhotos.length < 4) return

    setIsRendering(true)
    try {
      await renderTemplate(resultRef.current, selectedTemplate, currentPhotos)
      const dataUrl = resultRef.current.toDataURL('image/jpeg', 0.95)
      setResultDataUrl(dataUrl)
      showToast('✨ Foto Siap!', 'Klik download untuk menyimpan')
    } catch (e) {
      console.error('Render error:', e)
      showToast('Error Render', 'Gagal memproses template')
    } finally {
      setIsRendering(false)
    }
  }, [selectedTemplate, setResultDataUrl, showToast])

  // Set template default saat mount
  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0])
    }
  }, [templates, selectedTemplate, setSelectedTemplate])

  // ── Start Camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraReady(true)
      showToast('Kamera Aktif ✦', 'Siap mengambil foto!')
    } catch {
      showToast('Kamera Error', 'Izinkan akses kamera di browser')
      setCameraReady(false)
    }
  }, [facingMode, setCameraReady, showToast])

  // Auto-start camera on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startCamera])

  // Switch kamera depan/belakang
  const flipCamera = useCallback(async () => {
    const next = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(next)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      showToast('Error', 'Gagal switch kamera')
    }
  }, [facingMode, setFacingMode, showToast])

  // ── Capture single frame ──────────────────────────────────────────────────
  const captureFrame = useCallback((): string => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!canvas) return ''

    if (video && video.readyState >= 2) {
      canvas.width  = video.videoWidth  || 640
      canvas.height = video.videoHeight || 480
      const ctx = canvas.getContext('2d')!
      // Mirror untuk selfie
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(video, 0, 0)
      if (facingMode === 'user') ctx.setTransform(1, 0, 0, 1, 0, 0)
    } else {
      // Demo frame jika kamera tidak aktif
      canvas.width = 640; canvas.height = 480
      const ctx = canvas.getContext('2d')!
      const colors = [
        ['#3a2820', '#2a1810'], ['#2a1a0f', '#1a1208'],
        ['#3d2e20', '#2a2018'], ['#281e14', '#1a140e'],
      ]
      const [c1, c2] = colors[photos.length % 4]
      const g = ctx.createLinearGradient(0, 0, 640, 480)
      g.addColorStop(0, c1); g.addColorStop(1, c2)
      ctx.fillStyle = g; ctx.fillRect(0, 0, 640, 480)
      ctx.fillStyle = 'rgba(177,120,82,0.12)'
      ctx.beginPath(); ctx.arc(320, 240, 140, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(177,120,82,0.4)'
      ctx.font = '13px "Space Mono",monospace'; ctx.textAlign = 'center'
      ctx.fillText(`FILMORY — FRAME ${photos.length + 1}`, 320, 450)
    }
    return canvas.toDataURL('image/jpeg', 0.92)
  }, [facingMode, photos.length])

  // ── Countdown + shoot sequence ────────────────────────────────────────────
  const startSequence = useCallback(async () => {
    if (isShooting) return
    setIsShooting(true)
    resetPhotos()

    for (let i = 0; i < 4; i++) {
      // Countdown
      for (let c = timerSeconds; c >= 1; c--) {
        setCountdown(c)
        await sleep(1000)
      }
      setCountdown(0) // flash
      await sleep(150)

      const dataUrl = captureFrame()
      addPhoto(dataUrl)
      setCountdown(null)
      await sleep(600) // jeda antar foto
    }

    setIsShooting(false)
    // Render hasil otomatis
    await renderResult()
  }, [isShooting, timerSeconds, captureFrame, addPhoto, resetPhotos, setIsShooting]) // eslint-disable-line react-hooks/exhaustive-deps


  // Re-render saat template berubah (jika sudah ada 4 foto)
  useEffect(() => {
    const { photos: p } = useStudioStore.getState()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p.length === 4 && selectedTemplate) renderResult()
  }, [selectedTemplate, renderResult])

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    if (!resultRef.current) return
    const filename = `filmory-${selectedTemplate?.slug ?? 'photo'}-${Date.now()}.jpg`
    downloadCanvas(resultRef.current, filename)
    showToast('Download Berhasil!', 'Foto tersimpan di perangkatmu')
  }, [selectedTemplate, showToast])

  // ── Template select (check unlock) ───────────────────────────────────────
  const handleSelectTemplate = useCallback((tpl: Template) => {
    if (tpl.tier === 'FREE' || localIsPremium || localUnlocked.has(tpl.id)) {
      setSelectedTemplate(tpl)
      showToast('Template dipilih', tpl.name)
    } else {
      setPayTemplate(tpl)
    }
  }, [localIsPremium, localUnlocked, setSelectedTemplate, showToast])

  // ── After payment success ─────────────────────────────────────────────────
  const handlePaymentSuccess = useCallback((type: 'single' | 'all', tpl?: Template) => {
    if (type === 'all') {
      setLocalIsPremium(true)
      showToast('🎉 Semua Template Aktif!', 'Nikmati semua template premium selamanya')
    } else if (tpl) {
      setLocalUnlocked((prev) => new Set([...prev, tpl.id]))
      setSelectedTemplate(tpl)
      showToast(`✦ ${tpl.name} Diaktifkan!`, 'Template siap digunakan')
    }
    setPayTemplate(null)
  }, [setSelectedTemplate, showToast])


  // ─────────────────────────────────────────────────────────────────────────
  const hasPhotos = photos.length === 4
  const cameraStatus = !cameraReady
    ? 'Klik "Aktifkan Kamera"'
    : isShooting
      ? `Sesi foto — frame ${currentSlot + 1}/4`
      : hasPhotos
        ? 'Foto selesai ✓'
        : 'Siap'

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">

      {/* ── NAVBAR (minimal) ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                      px-5 py-3 bg-bg/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="font-serif text-lg font-bold gradient-text tracking-tight">
          Film<em>ory</em>
        </div>
        <div className="flex items-center gap-3">
          {userId ? (
            <a href="/dashboard"
               className="text-xs font-medium text-muted hover:text-secondary transition-colors">
              Dashboard
            </a>
          ) : (
            <a href="/auth/sign-in"
               className="text-xs font-medium text-muted hover:text-secondary transition-colors">
              Masuk
            </a>
          )}
        </div>
      </nav>

      {/* ── MAIN LAYOUT ───────────────────────────────────────────────── */}
      <div className="flex flex-1 pt-12">

        {/* ── LEFT: CAMERA AREA ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 gap-4 min-w-0">

          {/* Viewfinder */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#0f0e0c]
                          border border-white/[0.06] shadow-2xl"
               style={{ aspectRatio: '4/3', maxHeight: 'calc(100vh - 280px)' }}>
            {/* Video */}
            <video
              ref={videoRef}
              autoPlay muted playsInline
              className="w-full h-full object-cover"
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="viewfinder-grid absolute inset-0 opacity-60" />
              <ViewfinderCorners />

              {/* Status bar */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2
                              bg-black/60 backdrop-blur-md px-3 py-1 rounded-full
                              font-mono text-[10px] text-secondary/80 tracking-wider whitespace-nowrap">
                <span className="animate-blink inline-block w-1.5 h-1.5 rounded-full
                                 bg-primary mr-1.5 align-middle" />
                FILMORY · {cameraStatus.toUpperCase()}
              </div>

              {/* Flip button */}
              <button
                onClick={flipCamera}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50
                           backdrop-blur-md border border-white/10 text-sm
                           hover:border-primary/50 transition-all pointer-events-auto
                           flex items-center justify-center"
                title="Flip kamera"
              >
                🔄
              </button>
            </div>

            {/* Countdown overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center
                              bg-black/40 pointer-events-none">
                {countdown === 0 ? (
                  <div className="text-white text-6xl animate-fade-in">📷</div>
                ) : (
                  <div key={countdown}
                       className="font-serif font-bold text-secondary animate-countdown"
                       style={{ fontSize: 'clamp(80px, 20vw, 140px)' }}>
                    {countdown}
                  </div>
                )}
              </div>
            )}

            {/* No camera placeholder */}
            {!cameraReady && countdown === null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3
                              bg-[#0f0e0c]">
                <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10
                                flex items-center justify-center text-3xl">📷</div>
                <p className="font-mono text-xs text-muted text-center leading-relaxed">
                  Izinkan akses kamera<br />untuk memulai
                </p>
                <button onClick={startCamera} className="btn-primary text-xs px-5 py-2.5">
                  Aktifkan Kamera
                </button>
              </div>
            )}
          </div>

          {/* ── CONTROLS ROW ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">

            {/* Timer + Strip */}
            <div className="flex gap-3">
              {/* Timer */}
              <div className="card flex-shrink-0 flex flex-col gap-2 py-3 px-4">
                <p className="font-mono text-[9px] text-dim uppercase tracking-widest">Timer</p>
                <div className="flex gap-1.5">
                  {([3, 5, 10] as const).map((v) => (
                    <TimerPill key={v} value={v} active={timerSeconds === v}
                               onClick={() => setTimer(v)} />
                  ))}
                </div>
              </div>

              {/* Photo strip */}
              <div className="card flex-1 flex flex-col gap-2 py-3 px-4 min-w-0">
                <p className="font-mono text-[9px] text-dim uppercase tracking-widest">Strip Foto</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <PhotoSlot key={i} index={i} photo={photos[i]}
                               active={!isShooting ? false : currentSlot === i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Shutter + Retake */}
            <div className="flex gap-2">
              <button
                onClick={startSequence}
                disabled={isShooting || isRendering}
                className="btn-primary flex-1 py-3.5 rounded-xl text-sm justify-center"
              >
                {isShooting
                  ? `⏳ Foto ${currentSlot + 1}/4...`
                  : isRendering
                    ? '⚙️ Rendering...'
                    : '📷  Ambil 4 Foto'}
              </button>
              {hasPhotos && (
                <button
                  onClick={() => { resetPhotos(); setResultDataUrl(null) }}
                  className="btn-secondary py-3.5 px-5 rounded-xl text-sm"
                >
                  ↺
                </button>
              )}
            </div>
          </div>

          {/* ── RESULT CARD ────────────────────────────────────────────── */}
          {resultDataUrl && (
            <ResultCard
              canvasRef={resultRef}
              resultDataUrl={resultDataUrl}
              templateName={selectedTemplate?.name ?? ''}
              onDownload={handleDownload}
              userId={userId}
            />
          )}
        </div>

        {/* ── RIGHT: TEMPLATE PANEL ─────────────────────────────────── */}
        <TemplatePanel
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelect={handleSelectTemplate}
          isPremium={localIsPremium}
          unlockedIds={localUnlocked}
        />
      </div>

      {/* Hidden canvases */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={resultRef} className="hidden" />

      {/* Payment Modal */}
      {payTemplate && (
        <PaymentModal
          template={payTemplate}
          userId={userId}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPayTemplate(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast title={toast.title} sub={toast.sub} />}
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)) }