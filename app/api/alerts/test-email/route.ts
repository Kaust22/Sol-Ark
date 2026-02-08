import { NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/send-alert-email"

export async function POST(request: Request) {
  const gmailUser = (process.env.GMAIL_USER || "").trim()
  const hasPassword = !!(process.env.GMAIL_APP_PASSWORD || "").trim()

  if (!gmailUser) {
    return NextResponse.json({
      success: false,
      error: "GMAIL_USER is not set. Go to the Vars section in the left sidebar and add your Gmail address.",
    })
  }

  if (!hasPassword) {
    return NextResponse.json({
      success: false,
      error: "GMAIL_APP_PASSWORD is not set. Go to the Vars section in the left sidebar and add your Gmail App Password (16-char code from Google, NOT your regular password).",
    })
  }

  let body: { email?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const { email } = body

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
  }

  const result = await sendTestEmail(email)

  return NextResponse.json({
    success: result.success,
    message: result.success ? `Test email sent to ${email}` : undefined,
    error: result.error || undefined,
    messageId: result.messageId || undefined,
    from: gmailUser,
    to: email,
  })
}
