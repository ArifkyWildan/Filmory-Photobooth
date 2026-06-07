// src/lib/midtrans.ts
import midtransClient from 'midtrans-client'
import crypto from 'crypto'

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey:    process.env.MIDTRANS_SERVER_KEY!,
  clientKey:    process.env.MIDTRANS_CLIENT_KEY!,
})

const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey:    process.env.MIDTRANS_SERVER_KEY!,
  clientKey:    process.env.MIDTRANS_CLIENT_KEY!,
})

export interface CreateSnapTokenParams {
  orderId:     string
  amount:      number
  customerName:  string
  customerEmail: string
  itemName:    string
}

/**
 * Buat Snap Token untuk pembayaran
 */
export async function createSnapToken(params: CreateSnapTokenParams): Promise<string> {
  const parameter = {
    transaction_details: {
      order_id:     params.orderId,
      gross_amount: params.amount,
    },
    item_details: [
      {
        id:       params.orderId,
        price:    params.amount,
        quantity: 1,
        name:     params.itemName,
      },
    ],
    customer_details: {
      first_name: params.customerName,
      email:      params.customerEmail,
    },
    enabled_payments: [
      'gopay', 'qris', 'shopeepay',
      'other_va', 'bca_va', 'bni_va', 'bri_va',
    ],
    expiry: {
      unit:     'hours',
      duration: 24,
    },
  }

  const transaction = await snap.createTransaction(parameter)
  return transaction.token
}

/**
 * Verifikasi status transaksi dari Midtrans
 */
export async function checkTransactionStatus(orderId: string) {
  return coreApi.transaction.status(orderId)
}

/**
 * Verifikasi signature key dari Midtrans webhook
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex')
  return expectedSignature === signatureKey
}

export { snap, coreApi }