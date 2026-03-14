import { NextRequest, NextResponse } from 'next/server'
import { sanityWriteClient } from '@/lib/sanity/client'

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const customerName = formData.get('customerName') as string
  const whatsappNumber = formData.get('whatsappNumber') as string
  const orderDate = formData.get('orderDate') as string | null
  const productOrdered = formData.get('productOrdered') as string
  const issueType = formData.get('issueType') as string
  const issueDescription = formData.get('issueDescription') as string | null
  const videoFile = formData.get('unboxingVideo') as File | null

  // Validate required fields
  if (!customerName || !whatsappNumber || !productOrdered || !issueType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Unboxing video is required for damaged_arrival
  if (issueType === 'damaged_arrival' && !videoFile) {
    return NextResponse.json(
      { error: 'Unboxing video is required for damaged on arrival claims.' },
      { status: 400 },
    )
  }

  // Upload video to Sanity if present
  let unboxingVideoAsset: { _type: 'file'; asset: { _type: 'reference'; _ref: string } } | undefined

  if (videoFile) {
    if (videoFile.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'Video must be under 100MB.' }, { status: 400 })
    }

    const arrayBuffer = await videoFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploaded = await sanityWriteClient.assets.upload('file', buffer, {
      filename: videoFile.name,
      contentType: videoFile.type,
    })

    unboxingVideoAsset = {
      _type: 'file',
      asset: { _type: 'reference', _ref: uploaded._id },
    }
  }

  // Create refund request document
  await sanityWriteClient.create({
    _type: 'refundRequest',
    customerName,
    whatsappNumber,
    orderDate: orderDate || undefined,
    productOrdered,
    issueType,
    issueDescription: issueDescription || undefined,
    unboxingVideo: unboxingVideoAsset,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
