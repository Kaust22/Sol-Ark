import { NextResponse } from "next/server"
import { alertStore } from "@/lib/alert-store"

export async function GET() {
  try {
    const users = alertStore.getAllUsers()

    return NextResponse.json({
      total: users.length,
      users: users.map((u) => ({
        user_id: u.user_id,
        email: u.email,
        name: u.name,
        enabled: u.preferences.enabled,
        threshold: u.preferences.kp_threshold,
        registered: u.created_at,
      })),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { detail: `Failed to list users: ${message}` },
      { status: 500 }
    )
  }
}
