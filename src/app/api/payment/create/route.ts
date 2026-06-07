// src/app/api/payment/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createSnapToken } from '@/lib/midtrans'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { type, templateIds, amount, itemName } = await req.json()

    // Validasi amount
    const validAmounts: Record<string, number> = { SINGLE_TEMPLATE: 5000, ALL_TEMPLATES: 10000 }
    const transactionType = type === 'all' ? 'ALL_TEMPLATES' : 'SINGLE_TEMPLATE'
    if (amount !== validAmounts[transactionType]) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Upsert user ke database
    const dbUser = await prisma.user.upsert({
      where:  { clerkId },
      update: { name: user.fullName, email: user.emailAddresses[0]?.emailAddress },
      create: {
        clerkId,
        name:     user.fullName ?? 'User',
        email:    user.emailAddresses[0]?.emailAddress ?? '',
        imageUrl: user.imageUrl,
      },
    })

    // Buat order ID unik
    const orderId = `FLM-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`

    // Buat transaksi di DB
    await prisma.transaction.create({
      data: {
        userId:      dbUser.id,
        orderId,
        amount,
        status:      'PENDING',
        type:        transactionType,
        templateIds: templateIds ?? [],
        expiredAt:   new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    // Buat Snap Token Midtrans
    const snapToken = await createSnapToken({
      orderId,
      amount,
      customerName:  user.fullName ?? 'Filmory User',
      customerEmail: user.emailAddresses[0]?.emailAddress ?? '',
      itemName,
    })

    // Simpan snap token
    await prisma.transaction.update({
      where: { orderId },
      data:  { midtransToken: snapToken },
    })

    return NextResponse.json({ snapToken, orderId })
  } catch (err) {
    console.error('[payment/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}