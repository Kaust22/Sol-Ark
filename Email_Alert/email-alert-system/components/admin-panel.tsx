"use client"

import { useState, useEffect, useCallback } from "react"
import type { RegisteredUser } from "./alert-system"

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  registeredUsers: RegisteredUser[]
}

interface ServiceStatus {
  service_running: boolean
  total_users: number
  active_users: number
  total_alerts_sent: number
  last_check: string | null
  demo_mode: boolean
}

export function AdminPanel({ isOpen, onClose, registeredUsers }: AdminPanelProps) {
  const [status, setStatus] = useState<ServiceStatus | null>(null)
  const [triggerResult, setTriggerResult] = useState<string>("")
  const [testResult, setTestResult] = useState<string>("")
  const [testEmail, setTestEmail] = useState<string>("")
  const [isSending, setIsSending] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/alerts/status")
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchStatus()
      // Pre-fill test email from first registered user
      if (registeredUsers.length > 0 && !testEmail) {
        setTestEmail(registeredUsers[0].email)
      }
    }
  }, [isOpen, fetchStatus, registeredUsers, testEmail])

  // ── Direct Test Email (bypasses everything, raw Resend call) ──
  const sendTestEmail = async () => {
    if (!testEmail.includes("@")) {
      setTestResult("Enter a valid email address")
      return
    }
    setIsTesting(true)
    setTestResult("Sending test email...")
    try {
      const res = await fetch("/api/alerts/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      })
      const data = await res.json()
      console.log("[v0] Test email response:", JSON.stringify(data))

      if (data.success) {
        setTestResult(`Sent! Resend ID: ${data.resend_id}. Check ${testEmail} inbox (and spam).`)
      } else {
        setTestResult(`FAILED: ${data.error}`)
      }
    } catch (err) {
      setTestResult(`Network error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsTesting(false)
    }
  }

  // ── Trigger Demo Alert ──
  const triggerDemo = async (kpValue: number) => {
    if (registeredUsers.length === 0) {
      setTriggerResult("No users registered. Register an email first via the orange button.")
      return
    }
    setIsSending(true)
    setTriggerResult(`Sending Kp ${kpValue} alert to ${registeredUsers.length} user(s)...`)
    try {
      const res = await fetch("/api/alerts/demo/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kp_value: kpValue, recipients: registeredUsers }),
      })
      const data = await res.json()
      console.log("[v0] Trigger response:", JSON.stringify(data))

      if (res.ok && data.success) {
        const failed = data.alerts_failed > 0 ? ` | ${data.alerts_failed} failed` : ""
        setTriggerResult(
          `Kp ${kpValue}: ${data.alerts_sent}/${data.total_eligible} emails sent${failed}`
        )
      } else {
        setTriggerResult(`FAILED: ${data.message || data.detail || JSON.stringify(data)}`)
      }
      fetchStatus()
    } catch (err) {
      setTriggerResult(`Network error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={`admin-panel ${isOpen ? "visible" : ""}`} role="complementary" aria-label="Admin panel">
      <div className="admin-header">
        <h3>Admin Controls</h3>
        <button onClick={onClose} aria-label="Close admin panel">x</button>
      </div>

      <div className="admin-body">
        {/* Test Email Section */}
        <div className="admin-section">
          <h4>1. Test Email Delivery</h4>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "0 0 0.5rem" }}>
            Send a test email directly via Resend to verify your API key works.
          </p>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: "100%",
              background: "#0a0a0f",
              border: "1px solid #1e293b",
              color: "#e2e8f0",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              boxSizing: "border-box" as const,
            }}
          />
          <button
            className="demo-btn"
            onClick={sendTestEmail}
            disabled={isTesting}
            style={{
              background: isTesting ? "#1e293b" : "#10b981",
              borderColor: "#10b981",
              color: "white",
              fontWeight: 600,
            }}
          >
            {isTesting ? "Sending..." : "Send Test Email"}
          </button>
          {testResult && (
            <p style={{
              fontSize: "0.75rem",
              color: testResult.startsWith("FAILED") || testResult.startsWith("Network") ? "#ef4444" : "#10b981",
              marginTop: "0.5rem",
              wordBreak: "break-all",
            }}>
              {testResult}
            </p>
          )}
        </div>

        {/* Registered Users */}
        <div className="admin-section">
          <h4>Registered Users ({registeredUsers.length})</h4>
          {registeredUsers.length === 0 ? (
            <p style={{ color: "#ef4444", fontSize: "0.8125rem" }}>
              No users registered yet. Use the &quot;Get Storm Alerts&quot; button (bottom-right).
            </p>
          ) : (
            registeredUsers.map((u) => (
              <div key={u.email} className="status-item">
                <span className="status-label" style={{ fontSize: "0.8125rem" }}>{u.email}</span>
                <span className="status-value active" style={{ fontSize: "0.8125rem" }}>Kp {u.kp_threshold}</span>
              </div>
            ))
          )}
        </div>

        {/* Demo Alerts */}
        <div className="admin-section">
          <h4>2. Trigger Storm Alert</h4>
          <button className="demo-btn" onClick={() => triggerDemo(7.0)} disabled={isSending}>
            Trigger Kp 7 (Strong)
          </button>
          <button className="demo-btn" onClick={() => triggerDemo(8.0)} disabled={isSending}>
            Trigger Kp 8 (Severe)
          </button>
          <button className="demo-btn" onClick={() => triggerDemo(9.0)} disabled={isSending}>
            Trigger Kp 9 (Extreme)
          </button>
          {triggerResult && (
            <p style={{
              fontSize: "0.75rem",
              color: triggerResult.startsWith("FAILED") || triggerResult.startsWith("No users") ? "#ef4444" : "#94a3b8",
              marginTop: "0.5rem",
              wordBreak: "break-all",
            }}>
              {triggerResult}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="admin-section">
          <h4>System Status</h4>
          {status ? (
            <>
              <div className="status-item">
                <span className="status-label">Service</span>
                <span className={`status-value ${status.demo_mode ? "active" : "inactive"}`}>
                  {status.demo_mode ? "Demo Mode" : "Production"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Alerts Sent</span>
                <span className="status-value">{status.total_alerts_sent}</span>
              </div>
            </>
          ) : (
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Loading...</p>
          )}
        </div>
      </div>
    </div>
  )
}
