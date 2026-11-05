import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/** Sanity webhook → site updates within seconds of hitting Publish. */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, process.env.SANITY_REVALIDATE_SECRET, true)
    if (!isValidSignature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    if (body?._type === 'rsvp') return NextResponse.json({ skipped: true })
    revalidateTag('content', 'max')
    return NextResponse.json({ revalidated: true, type: body?._type })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
