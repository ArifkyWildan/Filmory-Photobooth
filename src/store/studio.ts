// src/store/studio.ts
import { create } from 'zustand'
import type { StudioState, Template } from '@/types'

export const useStudioStore = create<StudioState>((set) => ({
  // Camera
  cameraReady: false,
  facingMode: 'user',

  // Timer
  timerSeconds: 5,

  // Photos
  photos: [],
  currentSlot: 0,
  isShooting: false,

  // Template
  selectedTemplate: null,

  // Result
  resultDataUrl: null,
  sessionId: null,

  // Actions
  setCameraReady: (v) => set({ cameraReady: v }),
  setFacingMode: (v) => set({ facingMode: v }),
  setTimer: (v) => set({ timerSeconds: v }),

  addPhoto: (dataUrl) =>
    set((state) => ({
      photos: [...state.photos, dataUrl],
      currentSlot: state.currentSlot + 1,
    })),

  resetPhotos: () =>
    set({ photos: [], currentSlot: 0, resultDataUrl: null, sessionId: null }),

  setIsShooting: (v) => set({ isShooting: v }),
  setSelectedTemplate: (t: Template | null) => set({ selectedTemplate: t }),
  setResultDataUrl: (url) => set({ resultDataUrl: url }),
  setSessionId: (id) => set({ sessionId: id }),
}))