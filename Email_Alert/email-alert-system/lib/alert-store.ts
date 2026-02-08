/**
 * Sol-Ark Alert Store
 * In-memory store for alert users and history
 * Mirrors the Python AlertUser / AlertPreferences models
 */

export interface AlertPreferences {
  enabled: boolean
  kp_threshold: number
  demo_mode: boolean
}

export interface AlertUser {
  user_id: string
  email: string
  name: string
  preferences: AlertPreferences
  created_at: string
}

export interface AlertHistoryEntry {
  alert_id: string
  kp_index: number
  risk_level: string
  recipients: string[]
  timestamp: string
}

export interface RiskAssessment {
  risk_level: string
  title: string
  description: string
  impacts: string[]
  timestamp: string
}

// Persist store on globalThis so it survives Next.js HMR / module re-evaluation
// (same pattern as the Prisma client singleton in Next.js dev)
interface GlobalAlertStore {
  __solArkUsers?: Map<string, AlertUser>
  __solArkHistory?: AlertHistoryEntry[]
  __solArkServiceRunning?: boolean
  __solArkLastCheck?: string | null
  __solArkDemoMode?: boolean
}

const g = globalThis as unknown as GlobalAlertStore

if (!g.__solArkUsers) g.__solArkUsers = new Map()
if (!g.__solArkHistory) g.__solArkHistory = []
if (g.__solArkServiceRunning === undefined) g.__solArkServiceRunning = false
if (g.__solArkLastCheck === undefined) g.__solArkLastCheck = null
if (g.__solArkDemoMode === undefined) g.__solArkDemoMode = true

const users = g.__solArkUsers
const alertHistory = g.__solArkHistory
let serviceRunning = g.__solArkServiceRunning
let lastCheck = g.__solArkLastCheck
let demoMode = g.__solArkDemoMode

// Risk assessment engine (mirrors Python RiskScoringEngine)
export function assessRisk(kpIndex: number): RiskAssessment {
  const now = new Date().toISOString()

  if (kpIndex >= 9) {
    return {
      risk_level: "extreme",
      title: "EXTREME GEOMAGNETIC STORM",
      description:
        "Kp 9 - Extreme geomagnetic storm in progress. Widespread power grid failures, satellite damage, and HF radio blackouts expected globally.",
      impacts: [
        "Widespread power grid failures possible",
        "Satellite systems experiencing severe disruption",
        "HF radio blackout on entire sunlit side of Earth",
        "GPS/GNSS degraded for hours",
        "Aurora visible at unusually low latitudes",
      ],
      timestamp: now,
    }
  }
  if (kpIndex >= 8) {
    return {
      risk_level: "severe",
      title: "SEVERE GEOMAGNETIC STORM",
      description:
        "Kp 8 - Severe geomagnetic storm. Power grid irregularities, satellite orientation problems, and intermittent HF radio propagation.",
      impacts: [
        "Power grid irregularities and voltage alarms",
        "Satellite orientation anomalies likely",
        "HF radio propagation sporadic",
        "GPS accuracy significantly reduced",
        "Aurora visible at mid-latitudes",
      ],
      timestamp: now,
    }
  }
  if (kpIndex >= 7) {
    return {
      risk_level: "strong",
      title: "STRONG GEOMAGNETIC STORM",
      description:
        "Kp 7 - Strong geomagnetic storm. Power systems may experience voltage alarms. Satellite surface charging may occur.",
      impacts: [
        "Voltage corrections may be required",
        "Satellite surface charging possible",
        "HF radio intermittent",
        "GPS accuracy degraded",
        "Aurora visible at higher latitudes",
      ],
      timestamp: now,
    }
  }
  if (kpIndex >= 5) {
    return {
      risk_level: "moderate",
      title: "MODERATE GEOMAGNETIC STORM",
      description:
        "Kp 5-6 - Moderate geomagnetic activity. Minor power grid fluctuations possible. Northern lights may be visible at higher latitudes.",
      impacts: [
        "Weak power grid fluctuations possible",
        "Minor impact on satellite operations",
        "Fading of HF radio at higher latitudes",
        "Aurora visible at high latitudes",
      ],
      timestamp: now,
    }
  }

  return {
    risk_level: "minor",
    title: "QUIET CONDITIONS",
    description: `Kp ${kpIndex.toFixed(1)} - Geomagnetic conditions are quiet. No significant impacts expected.`,
    impacts: [
      "No significant impacts on power systems",
      "Normal satellite operations",
      "Normal HF radio propagation",
    ],
    timestamp: now,
  }
}

// Store operations
export const alertStore = {
  upsertUser(user: AlertUser) {
    users.set(user.user_id, user)
  },

  getUser(userId: string): AlertUser | undefined {
    return users.get(userId)
  },

  getAllUsers(): AlertUser[] {
    return Array.from(users.values())
  },

  getActiveUsers(): AlertUser[] {
    return Array.from(users.values()).filter((u) => u.preferences.enabled)
  },

  addAlertHistory(entry: AlertHistoryEntry) {
    alertHistory.unshift(entry) // newest first
    if (alertHistory.length > 100) alertHistory.pop()
  },

  getAlertHistory(limit = 20): AlertHistoryEntry[] {
    return alertHistory.slice(0, limit)
  },

  getServiceStatus() {
    return {
      service_running: serviceRunning,
      total_users: users.size,
      active_users: Array.from(users.values()).filter((u) => u.preferences.enabled).length,
      total_alerts_sent: alertHistory.length,
      last_check: lastCheck,
      demo_mode: demoMode,
    }
  },

  setServiceRunning(running: boolean) {
    serviceRunning = running
  },

  updateLastCheck() {
    lastCheck = new Date().toISOString()
  },

  isDemoMode() {
    return demoMode
  },

  setDemoMode(mode: boolean) {
    demoMode = mode
  },
}
