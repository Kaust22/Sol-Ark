"use client"

import { useState, useEffect, useCallback } from "react"

interface AlertData {
  has_alert: boolean
  kp_index?: number
  risk_level?: string
  title?: string
  description?: string
  impacts?: string[]
  timestamp?: string
  message?: string
}

export function AlertBanner() {
  const [alert, setAlert] = useState<AlertData | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/alerts/active")
      if (!res.ok) return
      const data: AlertData = await res.json()
      setAlert(data)
      if (data.has_alert && !dismissed) {
        setVisible(true)
      }
    } catch {
      // Silently fail - alert polling shouldn't break the site
    }
  }, [dismissed])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
  }

  if (!alert?.has_alert || dismissed) return null

  const riskClass = alert.risk_level ? `risk-${alert.risk_level}` : ""

  return (
    <div
      className={`alert-banner ${visible ? "visible" : ""} ${riskClass}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="alert-content">
        <span className="alert-icon" aria-hidden="true">
          {"!!!"}
        </span>
        <div className="alert-info">
          <div className="alert-title">{alert.title}</div>
          <div className="alert-description">{alert.description}</div>
          <div className="alert-kp">
            Kp Index: {alert.kp_index?.toFixed(1)} | Risk Level:{" "}
            {alert.risk_level?.toUpperCase()}
          </div>
        </div>
        <button
          className="alert-close"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          x
        </button>
      </div>
    </div>
  )
}
