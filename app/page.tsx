import { AlertSystem } from "@/components/alert-system"

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e2e8f0",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Sol-Ark Alert System Overlay */}
      <AlertSystem />

      {/* Placeholder representing the original Sol-Ark site content */}
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "6rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#f97316",
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "'Courier New', monospace",
              color: "#fb923c",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}
          >
            ALERT SYSTEM ACTIVE
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            background: "linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Sol-Ark Email Alert System
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "#a1a1aa",
            maxWidth: "42rem",
            margin: "0 auto 3rem",
            lineHeight: 1.7,
          }}
        >
          Real-time geomagnetic storm monitoring and email alerts. Register to
          receive notifications when the Kp index reaches your threshold.
        </p>

        {/* Status Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            maxWidth: "60rem",
            margin: "0 auto 3rem",
          }}
        >
          <StatusCard
            label="API Endpoints"
            value="6 Active"
            color="#22c55e"
            description="/api/alerts/register, /active, /status, /users, /history, /demo/trigger"
          />
          <StatusCard
            label="Alert Polling"
            value="30s Interval"
            color="#f97316"
            description="Frontend polls /api/alerts/active every 30 seconds"
          />
          <StatusCard
            label="Demo Mode"
            value="Enabled"
            color="#eab308"
            description="Trigger test alerts from Admin panel (bottom-left)"
          />
        </div>

        {/* Instructions */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "0.5rem",
            padding: "2rem",
            maxWidth: "48rem",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#e2e8f0",
              marginBottom: "1rem",
              textTransform: "uppercase" as const,
              letterSpacing: "0.05em",
            }}
          >
            How to Use
          </h2>
          <ol
            style={{
              color: "#94a3b8",
              fontSize: "0.9375rem",
              lineHeight: 1.8,
              paddingLeft: "1.5rem",
            }}
          >
            <li>
              Click the <strong style={{ color: "#f97316" }}>Get Storm Alerts</strong> button (bottom-right) to register your email
            </li>
            <li>
              Click the <strong style={{ color: "#94a3b8" }}>ADMIN</strong> button (bottom-left) to open demo controls
            </li>
            <li>
              Trigger a demo alert at Kp 7, 8, or 9 to test the alert banner
            </li>
            <li>
              When a storm is active (Kp {'>='}7), the alert banner slides down from the top
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}

function StatusCard({
  label,
  value,
  color,
  description,
}: {
  label: string
  value: string
  color: string
  description: string
}) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderLeft: `2px solid ${color}`,
        borderRadius: "0.5rem",
        padding: "1.5rem",
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontFamily: "'Courier New', monospace",
          color: "#71717a",
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.5rem",
          fontFamily: "'Courier New', monospace",
          fontWeight: 500,
          color,
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#71717a" }}>{description}</div>
    </div>
  )
}
