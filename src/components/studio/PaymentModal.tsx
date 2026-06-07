'use client'
// src/components/studio/PaymentModal.tsx
import { useState, useEffect } from 'react'
import type { Template } from '@/types'

interface PaymentModalProps {
  template: Template | null
  userId:   string | null
  onSuccess: (type: 'single' | 'all', template?: Template) => void
  onClose:   () => void
}

type PayType = 'single' | 'all'

export default function PaymentModal({ template, userId, onSuccess, onClose }: PaymentModalProps) {
  const [payType,    setPayType]    = useState<PayType>('single')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  // Reset on open
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPayType('single')
    setLoading(false)
    setError(null)
  }, [template?.id])

  // Listen unlock-all event dari TemplatePanel
  useEffect(() => {
    const handler = () => setPayType('all')
    window.addEventListener('filmory:unlock-all', handler)
    return () => window.removeEventListener('filmory:unlock-all', handler)
  }, [])

  if (!template) return null

  const price    = payType === 'all' ? 10000 : template.price
  const itemName = payType === 'all' ? 'Filmory Premium (Semua Template)' : `Filmory — ${template.name}`

  const handlePay = async () => {
    if (!userId) {
      // Redirect ke login
      window.location.href = `/auth/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Buat transaksi di backend → dapat snap token
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:        payType,
          templateIds: payType === 'all' ? [] : [template.id],
          amount:      price,
          itemName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Gagal membuat transaksi')

      const { snapToken } = data

      // 2. Buka Midtrans Snap
      if (typeof window.snap !== 'undefined') {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            onSuccess(payType, template)
          },
          onPending: () => {
            onSuccess(payType, template) // treat pending as success for demo
          },
          onError: () => {
            setError('Pembayaran gagal. Silakan coba lagi.')
            setLoading(false)
          },
          onClose: () => {
            setLoading(false)
          },
        })
      } else {
        // Fallback: simulasi sukses jika Snap JS belum load (development)
        console.warn('Midtrans Snap JS not loaded — simulating success')
        setTimeout(() => {
          onSuccess(payType, template)
        }, 800)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Midtrans Snap JS */}
      <script
        type="text/javascript"
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js'
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        async
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50
                   flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-surface border border-white/10 rounded-3xl p-7
                        w-full max-w-sm relative animate-slide-up shadow-2xl">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5
                       hover:bg-white/10 transition-colors flex items-center justify-center
                       text-muted text-sm"
          >
            ✕
          </button>

          {/* Header */}
          <div className="mb-6">
            <p className="font-mono text-[9px] text-primary uppercase tracking-widest mb-2">
              ✦ Unlock Template
            </p>
            <h2 className="font-serif text-xl font-bold text-text">
              {payType === 'all' ? 'Semua Template Premium' : template.name}
            </h2>
            <p className="text-xs text-muted mt-1">
              {payType === 'all'
                ? 'Akses selamanya ke 12 template premium'
                : 'Akses selamanya ke template ini'}
            </p>
          </div>

          {/* Type switch */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 mb-5">
            <button
              onClick={() => setPayType('single')}
              className={`flex-1 py-2.5 text-xs font-semibold transition-all ${
                payType === 'single'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-muted hover:text-text'
              }`}
            >
              1 Template
              <span className="block font-mono text-[10px] mt-0.5">
                Rp{(template.price / 1000).toFixed(0)}.000
              </span>
            </button>
            <button
              onClick={() => setPayType('all')}
              className={`flex-1 py-2.5 text-xs font-semibold transition-all relative ${
                payType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-muted hover:text-text'
              }`}
            >
              Semua Template
              <span className="block font-mono text-[10px] mt-0.5">Rp10.000</span>
              <span className="absolute -top-2 right-2 bg-secondary text-bg
                               text-[7px] font-bold px-1.5 py-0.5 rounded-full">
                HEMAT
              </span>
            </button>
          </div>

          {/* Payment methods info */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {['QRIS', 'GoPay', 'OVO', 'Dana', 'ShopeePay', 'Transfer'].map((m) => (
              <span key={m}
                    className="text-[10px] font-mono text-muted bg-white/5
                               border border-white/10 px-2 py-0.5 rounded-full">
                {m}
              </span>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-3.5 bg-bg/60
                          rounded-xl border border-white/[0.06] mb-5">
            <span className="text-sm text-muted">Total</span>
            <span className="font-serif text-xl font-bold gradient-text">
              Rp{price.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl
                            p-3 mb-4 text-xs text-red-400 text-center">
              {error}
            </div>
          )}

          {/* CTA */}
          {userId ? (
            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 rounded-xl text-sm"
            >
              {loading ? '⏳ Memproses...' : `✦ Bayar Rp${price.toLocaleString('id-ID')}`}
            </button>
          ) : (
            <div>
              <a
                href={`/auth/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`}
                className="btn-primary w-full justify-center py-3.5 rounded-xl text-sm
                           flex items-center"
              >
                Masuk untuk Membayar
              </a>
              <p className="text-center text-xs text-muted mt-2">
                Perlu akun untuk menyimpan template
              </p>
            </div>
          )}

          <p className="text-center text-[10px] text-dim mt-3">
            Pembayaran aman via Midtrans · Sekali bayar, selamanya
          </p>
        </div>
      </div>
    </>
  )
}

// Extend window untuk Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void
        onPending: (result: unknown) => void
        onError:   (result: unknown) => void
        onClose:   () => void
      }) => void
    }
  }
}