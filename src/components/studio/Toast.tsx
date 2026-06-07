'use client'
// src/components/studio/Toast.tsx

interface ToastProps {
  title: string
  sub:   string
}

export default function Toast({ title, sub }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className="flex items-center gap-3 bg-surface border border-primary/30
                      rounded-2xl px-4 py-3 shadow-2xl shadow-black/40
                      max-w-[280px]">
        <div className="w-8 h-8 rounded-full flex-shrink-0
                        bg-gradient-to-br from-primary to-secondary
                        flex items-center justify-center text-bg text-sm font-bold">
          ✦
        </div>
        <div>
          <p className="text-sm font-semibold text-text leading-tight">{title}</p>
          <p className="text-xs text-muted mt-0.5 leading-tight">{sub}</p>
        </div>
      </div>
    </div>
  )
}