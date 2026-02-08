import { NextResponse } from "next/server"
import { assessRisk } from "@/lib/alert-store"

// Simulated live Kp index (in production, fetch from NOAA API)
function getCurrentKpIndex(): number {
  // Base Kp with slight random variation to simulate live data
  const baseKp = 3.0
  const variation = (Math.random() - 0.5) * 2
  return Math.max(0, Math.min(9, baseKp + variation))
}

export async function GET() {
  try {
    const kp = getCurrentKpIndex()

    if (kp >= 7.0) {
      const assessment = assessRisk(kp)
      return NextResponse.json({
        has_alert: true,
        kp_index: kp,
        risk_level: assessment.risk_level,
        title: assessment.title,
        description: assessment.description,
        impacts: assessment.impacts.slice(0, 3),
        timestamp: assessment.timestamp,
      })
    }

    return NextResponse.json({
      has_alert: false,
      kp_index: kp,
      message: "No active alerts - space weather is calm",
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { detail: `Failed to get alerts: ${message}` },
      { status: 500 }
    )
  }
}
