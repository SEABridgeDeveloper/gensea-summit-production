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

    // ✅ Vercel injects these automatically — no IP lookup needed
    const country = headerStore.get('x-vercel-ip-country') || '-'
    const city    = headerStore.get('x-vercel-ip-city')    || '-'

    // Send to Google Apps Script
    const gsResponse = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'visit',
        visitorId,
        page:      body.page      || '/',
        referrer:  body.referrer  || '-',
        userAgent: body.userAgent || '-',
        country,
        city,
      }),
      redirect: 'follow',
    })

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