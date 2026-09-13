// lib/image-compose.ts
// Server-side only. Takes a plain generated photo + some text, and
// composites a poster-style banner onto it (dark scrim + headline +
// branding), then uploads the result to Supabase Storage so it has a
// permanent public URL. This is what turns a bare AI photo into
// something that looks like the corporate-catering graphic built by
// hand earlier, but automated.

import sharp from 'sharp'
import { getServiceSupabase } from '@/lib/supabase/server'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Keeps overlay text robust against variable-length captions by
// truncating rather than attempting fragile multi-line SVG wrapping.
function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text
}

// SVG text rendering (via sharp/librsvg) can't render color emoji --
// they show up as broken "tofu" boxes. Strip them from the overlay
// text specifically; the database record/actual caption keeps emoji
// fine, this only affects what's baked into the image.
function stripEmoji(text: string): string {
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu, '').replace(/\s+/g, ' ').trim()
}

export async function composePosterImage({
  imageUrl,
  headline,
  subtext,
}: {
  imageUrl: string
  headline: string
  subtext?: string
}): Promise<{ url: string; error?: string }> {
  try {
    const WIDTH = 1200
    const HEIGHT = 630

    // Download the base (plain) generated photo. Some providers
    // (notably Pollinations) can be slow/flaky on a given request --
    // retry once after a short delay rather than failing outright.
    const downloadImage = async (): Promise<Buffer> => {
      const imgResponse = await fetch(imageUrl)
      if (!imgResponse.ok) {
        throw new Error(`Failed to download base image: HTTP ${imgResponse.status}`)
      }
      const buffer = Buffer.from(await imgResponse.arrayBuffer())
      if (buffer.length === 0) {
        throw new Error(
          `Downloaded image was empty (0 bytes). Status: ${imgResponse.status}, ` +
          `Content-Type: ${imgResponse.headers.get('content-type')}, ` +
          `Content-Length header: ${imgResponse.headers.get('content-length')}`
        )
      }
      return buffer
    }

    let imgBuffer: Buffer
    try {
      imgBuffer = await downloadImage()
    } catch (firstError) {
      // One retry after a short delay -- covers transient slowness on
      // the image-generation provider's side
      await new Promise((resolve) => setTimeout(resolve, 3000))
      try {
        imgBuffer = await downloadImage()
      } catch (secondError) {
        const msg = secondError instanceof Error ? secondError.message : String(secondError)
        return { url: '', error: `Failed after retry: ${msg}` }
      }
    }

    // Resize/crop to a standard poster size
    const baseImage = await sharp(imgBuffer)
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
      .toBuffer()

    const safeHeadline = escapeXml(truncate(stripEmoji(headline), 48))
    const safeSubtext = subtext ? escapeXml(truncate(stripEmoji(subtext), 90)) : ''

    // Bottom banner: dark gradient scrim + gold accent bar + headline +
    // subtext + brand mark -- deliberately simple/robust rather than
    // trying to fit arbitrarily long captions with real text-wrapping.
    const svgOverlay = `
      <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000000" stop-opacity="0" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0.88" />
          </linearGradient>
        </defs>
        <rect x="0" y="${HEIGHT - 220}" width="${WIDTH}" height="220" fill="url(#scrim)" />
        <rect x="55" y="${HEIGHT - 168}" width="60" height="6" rx="3" fill="#F5A623" />
        <text x="55" y="${HEIGHT - 120}" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#FFFFFF">${safeHeadline}</text>
        ${safeSubtext ? `<text x="55" y="${HEIGHT - 78}" font-family="Arial, sans-serif" font-size="22" fill="#E5E5E5">${safeSubtext}</text>` : ''}
        <text x="55" y="${HEIGHT - 38}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#F5A623">ZARA KITCHEN</text>
      </svg>
    `

    const composited = await sharp(baseImage)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .jpeg({ quality: 90 })
      .toBuffer()

    // Upload to Supabase Storage
    const supabase = getServiceSupabase()
    const filename = `poster-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('generated-posts')
      .upload(filename, composited, { contentType: 'image/jpeg' })

    if (uploadError) {
      return { url: '', error: `Storage upload failed: ${uploadError.message}` }
    }

    const { data: publicUrlData } = supabase.storage
      .from('generated-posts')
      .getPublicUrl(filename)

    return { url: publicUrlData.publicUrl }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Poster compositing failed:', error)
    return { url: '', error: message }
  }
}
