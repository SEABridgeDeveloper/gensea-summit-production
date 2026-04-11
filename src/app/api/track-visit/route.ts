import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let country = 'ERROR'
let city = 'ERROR'
  try {
    const cookieStore = await cookies()
    const headerStore = await headers()
    let visitorId = cookieStore.get('visitor_id')?.value
    const isNewCookie = !visitorId

    if (!visitorId) {
      visitorId = crypto.randomUUID()
    }

    const body = await req.json()

    // Vercel injects geo headers automatically on every real request
    const rawCountry = headerStore.get('x-vercel-ip-country')
    const rawCity    = headerStore.get('x-vercel-ip-city')

    // Distinguish: real missing vs local dev vs bot
    const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || ''
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === ''

    const country = rawCountry ?? (isLocal ? 'LOCAL' : 'ERROR: no-geo-header')
    const city    = rawCity    ?? (isLocal ? 'LOCAL' : 'ERROR: no-geo-header')

    // Send to Google Apps Script
    const gsResponse = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:    'visit',
        visitorId,
        page:      body.page      || '/',
        referrer:  body.referrer  || '-',
        userAgent: body.userAgent || '-',
        country,
        city,
      }),
      redirect: 'follow',
    })

    const gsResult = await gsResponse.text()
    console.log('[visit-track] GAS response:', gsResponse.status, gsResult)

    const response = NextResponse.json({ status: 'ok' })

    if (isNewCookie) {
      response.cookies.set('visitor_id', visitorId, {
        path:     '/',
        maxAge:   31536000,
        sameSite: 'lax',
      })
    }

    return response
  } catch (err) {
    console.error('[visit-track] Error:', err)
    return NextResponse.json({ status: 'ok' })
  }
}