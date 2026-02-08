import { NextResponse } from "next/server"
import { alertStore } from "@/lib/alert-store"

export async function GET() {
  try {
    const status = alertStore.getServiceStatus()
    return NextResponse.json(status)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { detail: `Failed to get status: ${message}` },
      { status: 500 }
    )
  }
}
