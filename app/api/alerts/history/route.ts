import { NextResponse } from "next/server"
import { alertStore } from "@/lib/alert-store"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit") || "20")

    const history = alertStore.getAlertHistory(limit)

    return NextResponse.json({
      total: history.length,
      alerts: history.map((h) => ({
        alert_id: h.alert_id,
        kp_index: h.kp_index,
        risk_level: h.risk_level,
        recipients: h.recipients.length,
        sent_at: h.timestamp,
      })),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { detail: `Failed to get history: ${message}` },
      { status: 500 }
    )
  }
}
