// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

/**
 * Upload base64 image ke Cloudinary
 * @param dataUrl  - base64 data URL ("data:image/jpeg;base64,...")
 * @param folder   - folder di Cloudinary, e.g. "filmory/results"
 * @param publicId - opsional, custom public_id
 */
export async function uploadToCloudinary(
  dataUrl: string,
  folder: string = 'filmory/results',
  publicId?: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    public_id: publicId,
    overwrite: true,
    quality: 'auto:best',
    fetch_format: 'auto',
  })
  return result.secure_url
}

/**
 * Upload template preview dari URL
 */
export async function uploadTemplatePreview(
  filePath: string,
  slug: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'filmory/templates',
    public_id: slug,
    overwrite: true,
  })
  return result.secure_url
}

/**
 * Hapus file dari Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}