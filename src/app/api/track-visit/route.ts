import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const headerStore = await headers()
    let visitorId = cookieStore.get('visitor_id')?.value
    const isNewCookie = !visitorId

    if (!visitorId) {
      visitorId = crypto.randomUUID()
    }

    const body = await req.json()

    // Get visitor IP from headers (works behind proxies/Vercel)
    const ip =
      headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerStore.get('x-real-ip') ||
      ''

    // Lookup country/city from IP (ipapi.co, free HTTPS, no key needed)
    let country = ''
    let city = ''
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
          signal: AbortSignal.timeout(3000),
        })
        if (geoRes.ok) {
          const geo = await geoRes.json()
          country = geo.country_name || '-'
          city = geo.city || '-'
        }
      } catch {
        // Geolocation failed — continue without it
      }
    }

    // Send to Google Apps Script
    const gsResponse = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'visit',
        visitorId,
        page: body.page || '/',
        referrer: body.referrer || '',
        userAgent: body.userAgent || '',
        country,
        city,
      }),
      redirect: 'follow',
    })

    const gsResult = await gsResponse.text()
    console.log('Google Script visit response:', gsResponse.status, gsResult)

    const response = NextResponse.json({ status: 'ok' })

    if (isNewCookie) {
      response.cookies.set('visitor_id', visitorId, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      })
    }

    return response
  } catch (err) {
    console.error('Visit tracking error:', err)
    return NextResponse.json({ status: 'ok' })
  }
}
