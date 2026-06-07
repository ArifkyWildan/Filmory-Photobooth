'use client'

import React from 'react'
import { Show } from '@clerk/nextjs'

interface ClerkAuthProps {
  children: React.ReactNode
}

export function SignedIn({ children }: ClerkAuthProps) {
  return <Show when="signed-in">{children}</Show>
}

export function SignedOut({ children }: ClerkAuthProps) {
  return <Show when="signed-out">{children}</Show>
}
