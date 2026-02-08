"use client"

import React from "react"

import { useState } from "react"
import type { RegisteredUser } from "./alert-system"

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onRegistered: (user: RegisteredUser) => void
}

export function RegistrationModal({
  isOpen,
  onClose,
  onRegistered,
}: RegistrationModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [kpThreshold, setKpThreshold] = useState("7")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [emailStatus, setEmailStatus] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/alerts/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || "Anonymous",
          kp_threshold: Number.parseFloat(kpThreshold),
        }),
      })

      const data = await res.json()

      console.log("[v0] Register response:", JSON.stringify(data))

      if (res.ok && data.success) {
        setSuccess(true)
        if (data.welcome_email_sent) {
          setEmailStatus("Welcome email sent successfully!")
        } else {
          setEmailStatus(`Welcome email failed: ${data.welcome_email_error || "unknown error"}`)
        }
        onRegistered({
          email,
          name: name || "Anonymous",
          kp_threshold: Number.parseFloat(kpThreshold),
        })
      } else {
        setError(data.detail || "Registration failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setEmail("")
    setName("")
    setKpThreshold("7")
    setError("")
    setEmailStatus("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={`modal ${isOpen ? "visible" : ""}`}>
      <div className="modal-overlay" onClick={handleClose} />
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button
          className="modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          x
        </button>

        {!success ? (
          <>
            <h2 id="modal-title">Register for Alerts</h2>
            <p>
              Get notified when geomagnetic storms reach your threshold. Protect
              your systems with early warnings.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="alert-email">Email Address</label>
                <input
                  id="alert-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="alert-name">Name (Optional)</label>
                <input
                  id="alert-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="alert-threshold">Kp Threshold</label>
                <select
                  id="alert-threshold"
                  value={kpThreshold}
                  onChange={(e) => setKpThreshold(e.target.value)}
                >
                  <option value="5">Kp 5 - Moderate Storm</option>
                  <option value="6">Kp 6 - Moderate-Strong</option>
                  <option value="7">Kp 7 - Strong Storm</option>
                  <option value="8">Kp 8 - Severe Storm</option>
                  <option value="9">Kp 9 - Extreme Storm</option>
                </select>
              </div>

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.875rem", marginBottom: "1rem" }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Registering..." : "Activate Alerts"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">OK</div>
            <h3>Registration Complete!</h3>
            <p>
              You will receive alerts at <strong>{email}</strong> when the Kp
              index reaches {kpThreshold} or higher.
            </p>
            {emailStatus && (
              <p style={{
                fontSize: "0.8125rem",
                color: emailStatus.includes("failed") ? "#ef4444" : "#10b981",
                marginTop: "0.75rem",
                wordBreak: "break-all",
              }}>
                {emailStatus}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
