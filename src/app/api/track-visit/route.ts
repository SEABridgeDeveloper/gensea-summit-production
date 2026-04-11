import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    let visitorId = cookieStore.get('visitor_id')?.value
    const isNewCookie = !visitorId

    // Generate a new visitor ID if none exists
    if (!visitorId) {
      visitorId = crypto.randomUUID()
    }

    const body = await req.json()

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
      }),
      redirect: 'follow',
    })

    const gsResult = await gsResponse.text()
    console.log('Google Script visit response:', gsResponse.status, gsResult)

    // Use NextResponse for proper cookie support
    const response = NextResponse.json({ status: 'ok' })

    if (isNewCookie) {
      response.cookies.set('visitor_id', visitorId, {
        path: '/',
        maxAge: 31536000, // 1 year
        sameSite: 'lax',
      })
    }

    return response
  } catch (err) {
    console.error('Visit tracking error:', err)
    return NextResponse.json({ status: 'ok' })
  }
}
