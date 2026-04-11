export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Basic server-side validation
    if (!body.name || !body.organization || !body.email || !body.phone || !body.interest) {
      return Response.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      )
    }

    await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // ✅ can use headers server-side
      body: JSON.stringify(body),
      redirect: 'follow', // ✅ Apps Script redirects — must follow
    })

    return Response.json({ status: 'ok' })

  } catch (err) {
    console.error('Submit error:', err) // ✅ check your terminal for the real error
    return Response.json(
      { status: 'error', message: 'Submission failed' },
      { status: 500 }
    )
  }
}