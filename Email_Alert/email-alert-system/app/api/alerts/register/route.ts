import { NextResponse } from "next/server"
import { alertStore } from "@/lib/alert-store"
import { sendWelcomeEmail } from "@/lib/send-alert-email"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name = "Anonymous", kp_threshold = 7.0 } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, detail: "Valid email is required" },
        { status: 400 },
      )
    }

    const userId = generateId()
    const threshold = Number(kp_threshold)

    alertStore.upsertUser({
      user_id: userId,
      email,
      name,
      preferences: {
        enabled: true,
        kp_threshold: threshold,
        demo_mode: false,
      },
      created_at: new Date().toISOString(),
    })

    // Send welcome / confirmation email
    const emailResult = await sendWelcomeEmail(email, name, threshold)

    return NextResponse.json({
      success: true,
      user_id: userId,
      message: `Successfully registered ${email} for alerts when Kp >= ${threshold}`,
      email,
      threshold,
      welcome_email_sent: emailResult.success,
      welcome_email_error: emailResult.error || null,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, detail: `Registration failed: ${message}` },
      { status: 500 },
    )
  }
}
