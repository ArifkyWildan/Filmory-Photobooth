'use client'
// src/components/studio/ResultCard.tsx
import { useState } from 'react'

interface ResultCardProps {
  canvasRef:    React.RefObject<HTMLCanvasElement | null>
  resultDataUrl: string
  templateName: string
  onDownload:   () => void
  userId:       string | null
}

export default function ResultCard({
  resultDataUrl, templateName, onDownload, userId,
}: ResultCardProps) {
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const handleSaveToCloud = async () => {
    if (!userId) {
      window.location.href = '/auth/sign-in'
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/photos/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl: resultDataUrl }),
      })
      if (res.ok) setSaved(true)
    } catch {
      // silent fail
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-mono text-[9px] text-primary uppercase tracking-widest mb-0.5">
            ✨ Hasil Foto
          </p>
          <p className="text-sm font-semibold text-text">{templateName}</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center
                        justify-center text-primary text-xs">✓</div>
      </div>

      {/* Preview */}
      <div className="rounded-xl overflow-hidden border border-white/[0.06] mb-4
                      bg-bg/50 flex items-center justify-center">
        <img
          src={resultDataUrl}
          alt="Hasil foto"
          className="max-w-full max-h-64 object-contain"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onDownload}
                className="btn-primary flex-1 justify-center py-3 rounded-xl text-sm">
          ⬇ Download
        </button>
        {userId && !saved && (
          <button
            onClick={handleSaveToCloud}
            disabled={saving}
            className="btn-secondary py-3 px-4 rounded-xl text-sm"
            title="Simpan ke dashboard"
          >
            {saving ? '⏳' : '☁'}
          </button>
        )}
        {saved && (
          <div className="py-3 px-4 rounded-xl text-sm text-secondary font-mono text-xs
                          flex items-center">
            ✓ Tersimpan
          </div>
        )}
      </div>
    </div>
  )
}