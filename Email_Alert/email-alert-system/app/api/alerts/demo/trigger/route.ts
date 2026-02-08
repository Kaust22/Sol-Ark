import { NextResponse } from "next/server"
import { assessRisk } from "@/lib/alert-store"
import { sendAlertEmail } from "@/lib/send-alert-email"

interface Recipient {
  email: string
  name: string
  kp_threshold: number
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { kp_value = 9.0, recipients = [] } = body as {
      kp_value?: number
      recipients?: Recipient[]
    }
    const kp = Number(kp_value)

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No users registered for alerts. Register an email first.",
      })
    }

    const assessment = assessRisk(kp)

    // Filter users whose threshold is at or below this Kp value
    const eligibleUsers = recipients.filter((u) => kp >= u.kp_threshold)

    if (eligibleUsers.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No users have thresholds at or below Kp ${kp}. Registered thresholds: ${recipients.map((u) => u.kp_threshold).join(", ")}`,
      })
    }

    // Send real emails to all eligible users in parallel
    const emailResults = await Promise.allSettled(
      eligibleUsers.map((user) =>
        sendAlertEmail({
          to: user.email,
          recipientName: user.name,
          kpIndex: kp,
          riskLevel: assessment.risk_level,
          title: assessment.title,
          description: assessment.description,
          impacts: assessment.impacts,
        }),
      ),
    )

    const succeeded = emailResults.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length
    const failed = eligibleUsers.length - succeeded

    // Log detailed results for debugging
    emailResults.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`[v0] Email to ${eligibleUsers[i].email} rejected:`, r.reason)
      } else if (!r.value.success) {
        console.error(`[v0] Email to ${eligibleUsers[i].email} failed:`, r.value.error)
      } else {
        console.log(`[v0] Email to ${eligibleUsers[i].email} sent successfully`)
      }
    })

    return NextResponse.json({
      success: succeeded > 0,
      message: `Demo alert triggered (Kp=${kp}). Emails sent: ${succeeded}, failed: ${failed}`,
      alerts_sent: succeeded,
      alerts_failed: failed,
      total_eligible: eligibleUsers.length,
      total_recipients: recipients.length,
      assessment: {
        risk_level: assessment.risk_level,
        title: assessment.title,
        description: assessment.description,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Demo trigger error:", message)
    return NextResponse.json(
      { detail: `Demo trigger failed: ${message}` },
      { status: 500 },
    )
  }
}
