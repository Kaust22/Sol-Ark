"use client"

interface AlertCTAButtonProps {
  isRegistered: boolean
  onClick: () => void
}

export function AlertCTAButton({ isRegistered, onClick }: AlertCTAButtonProps) {
  return (
    <button
      className={`alert-cta-button ${isRegistered ? "registered" : ""}`}
      onClick={onClick}
      aria-label={isRegistered ? "Alert registration active" : "Register for storm alerts"}
    >
      {isRegistered ? (
        <>
          <span className="check-icon" aria-hidden="true">OK</span>
          <span className="button-text">Alerts Active</span>
        </>
      ) : (
        <>
          <span className="pulse-dot" />
          <span className="button-text">Get Storm Alerts</span>
        </>
      )}
    </button>
  )
}
