// src/types/index.ts

export type TemplateTier = 'FREE' | 'PREMIUM'
export type TemplateCategory =
  | 'RETRO'
  | 'MUSIC'
  | 'CINEMA'
  | 'KOREAN'
  | 'MODERN'
  | 'EDITORIAL'
  | 'SOCIAL'

export interface Template {
  id: string
  slug: string
  name: string
  description: string | null
  category: TemplateCategory
  tier: TemplateTier
  price: number
  previewUrl: string | null
  configJson: TemplateConfig
  isActive: boolean
  sortOrder: number
}

export interface TemplateConfig {
  layout: string
  bgColor?: string
  bgGradient?: string[]
  accentColor?: string
  textColor?: string
  borderColor?: string
  glassColor?: string
  goldColor?: string
  canvasWidth: number
  canvasHeight: number
  [key: string]: unknown
}

export type SessionStatus = 'PENDING' | 'COMPLETED' | 'DOWNLOADED'
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
export type TransactionType = 'SINGLE_TEMPLATE' | 'ALL_TEMPLATES'

export interface PhotoSession {
  id: string
  userId: string | null
  templateId: string
  resultUrl: string | null
  photoUrls: string[]
  downloadCount: number
  status: SessionStatus
  createdAt: Date
  template: Template
}

export interface Transaction {
  id: string
  userId: string
  orderId: string
  amount: number
  paymentMethod: string | null
  status: TransactionStatus
  type: TransactionType
  templateIds: string[]
  paidAt: Date | null
  createdAt: Date
}

// Zustand Store Types
export interface StudioState {
  // Camera
  cameraReady: boolean
  facingMode: 'user' | 'environment'
  // Timer
  timerSeconds: 3 | 5 | 10
  // Photos
  photos: string[]          // base64 data URLs
  currentSlot: number
  isShooting: boolean
  // Template
  selectedTemplate: Template | null
  // Result
  resultDataUrl: string | null
  sessionId: string | null
  // Actions
  setCameraReady: (v: boolean) => void
  setFacingMode: (v: 'user' | 'environment') => void
  setTimer: (v: 3 | 5 | 10) => void
  addPhoto: (dataUrl: string) => void
  resetPhotos: () => void
  setIsShooting: (v: boolean) => void
  setSelectedTemplate: (t: Template | null) => void
  setResultDataUrl: (url: string | null) => void
  setSessionId: (id: string | null) => void
}