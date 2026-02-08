/**
 * Sol-Ark Email Sender
 * Uses Nodemailer + Gmail SMTP -- can send to ANY email address
 */
import nodemailer from "nodemailer"

function getTransporter() {
  const user = (process.env.GMAIL_USER || "").trim()
  const pass = (process.env.GMAIL_APP_PASSWORD || "").trim()

  if (!user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const user = (process.env.GMAIL_USER || "").trim()
  const pass = (process.env.GMAIL_APP_PASSWORD || "").trim()

  if (!user) {
    return { success: false, error: "GMAIL_USER is not set. Add your Gmail address in the Vars section of the sidebar." }
  }
  if (!pass) {
    return { success: false, error: "GMAIL_APP_PASSWORD is not set. Add your Gmail App Password in the Vars section." }
  }

  try {
    const transporter = getTransporter()
    if (!transporter) {
      return { success: false, error: "Failed to create email transporter. Check GMAIL_USER and GMAIL_APP_PASSWORD." }
    }

    const info = await transporter.sendMail({
      from: `Sol-Ark Alerts <${user}>`,
      to,
      subject,
      html,
    })

    console.log("[v0] Email sent:", info.messageId, "to:", to)
    return { success: true, messageId: info.messageId }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[v0] Email send error:", message)
    return { success: false, error: message }
  }
}

// ── Risk colors ──
const RISK_COLORS: Record<string, string> = {
  minor: "#10b981",
  moderate: "#eab308",
  strong: "#f97316",
  severe: "#ef4444",
  extreme: "#dc2626",
}

// ── Alert email ──
interface AlertEmailParams {
  to: string
  recipientName: string
  kpIndex: number
  riskLevel: string
  title: string
  description: string
  impacts: string[]
}

export async function sendAlertEmail(
  params: AlertEmailParams,
): Promise<{ success: boolean; error?: string }> {
  const color = RISK_COLORS[params.riskLevel] || "#f97316"
  const impactList = params.impacts
    .map((i) => `<li style="padding:4px 0;color:#94a3b8;font-size:14px;">${i}</li>`)
    .join("")

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a1f;border:2px solid ${color};border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,${color}22,${color}11);padding:30px 40px;border-bottom:1px solid #1e293b;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:24px;font-weight:700;color:#e2e8f0;letter-spacing:0.05em;">SOL-ARK</span>
                  <span style="font-size:12px;color:#94a3b8;display:block;margin-top:2px;letter-spacing:0.1em;text-transform:uppercase;">GEOMAGNETIC ALERT SYSTEM</span>
                </td>
                <td align="right">
                  <span style="display:inline-block;background:${color};color:white;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">${params.riskLevel} STORM</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="color:#94a3b8;font-size:14px;margin:0 0 20px;">Hello ${params.recipientName},</p>
            <h1 style="color:${color};font-size:22px;font-weight:700;margin:0 0 8px;letter-spacing:0.03em;text-transform:uppercase;">${params.title}</h1>
            <p style="color:#f97316;font-size:32px;font-weight:700;margin:0 0 16px;font-family:'Courier New',monospace;">Kp ${params.kpIndex.toFixed(1)}</p>
            <p style="color:#cbd5e1;font-size:15px;line-height:1.6;margin:0 0 30px;">${params.description}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e293b;border-radius:8px;margin-bottom:30px;">
              <tr><td style="padding:20px;">
                <p style="color:#e2e8f0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Expected Impacts</p>
                <ul style="margin:0;padding:0 0 0 20px;">${impactList}</ul>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://www.swpc.noaa.gov/products/planetary-k-index" target="_blank"
                   style="display:inline-block;background:${color};color:white;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.05em;text-transform:uppercase;">
                  VIEW LIVE Kp DATA
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #1e293b;background:#0a0a0f;">
            <p style="color:#64748b;font-size:12px;margin:0;text-align:center;">
              Sol-Ark Geomagnetic Alert System &bull; Data sourced from NOAA SWPC<br/>
              <span style="color:#475569;">You received this because you registered for storm alerts.</span>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const subject = `[Sol-Ark] ${params.riskLevel.toUpperCase()} STORM ALERT - Kp ${params.kpIndex.toFixed(1)}`
  return sendEmail(params.to, subject, html)
}

// ── Welcome email ──
export async function sendWelcomeEmail(
  to: string,
  name: string,
  threshold: number,
): Promise<{ success: boolean; error?: string }> {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a1f;border:2px solid #f97316;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,rgba(249,115,22,0.13),rgba(249,115,22,0.06));padding:30px 40px;border-bottom:1px solid #1e293b;">
            <span style="font-size:24px;font-weight:700;color:#e2e8f0;letter-spacing:0.05em;">SOL-ARK</span>
            <span style="font-size:12px;color:#94a3b8;display:block;margin-top:2px;letter-spacing:0.1em;text-transform:uppercase;">GEOMAGNETIC ALERT SYSTEM</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="color:#10b981;font-size:22px;font-weight:700;margin:0 0 16px;">Registration Confirmed</h1>
            <p style="color:#cbd5e1;font-size:15px;line-height:1.6;margin:0 0 20px;">
              Hello ${name},<br/><br/>
              You have been successfully registered for Sol-Ark geomagnetic storm alerts. You will receive email notifications when the planetary Kp index reaches or exceeds <strong style="color:#f97316;">Kp ${threshold.toFixed(1)}</strong>.
            </p>
            <div style="background:#0a0a0f;border:1px solid #1e293b;border-radius:8px;padding:20px;margin-bottom:20px;">
              <p style="color:#e2e8f0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Your Settings</p>
              <p style="color:#94a3b8;font-size:14px;margin:0;">Alert Threshold: <strong style="color:#f97316;">Kp >= ${threshold.toFixed(1)}</strong></p>
              <p style="color:#94a3b8;font-size:14px;margin:8px 0 0;">Status: <strong style="color:#10b981;">Active</strong></p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #1e293b;background:#0a0a0f;">
            <p style="color:#64748b;font-size:12px;margin:0;text-align:center;">Sol-Ark Geomagnetic Alert System &bull; Data sourced from NOAA SWPC</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  return sendEmail(to, "[Sol-Ark] Alert Registration Confirmed", html)
}

// ── Test email (used by /api/alerts/test-email) ──
export async function sendTestEmail(
  to: string,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const html = `<div style="background:#0a0a0f;padding:40px 20px;font-family:Arial,sans-serif;">
    <div style="max-width:500px;margin:0 auto;background:#1a1a1f;border:2px solid #f97316;border-radius:12px;padding:40px;">
      <h1 style="color:#f97316;font-size:24px;margin:0 0 16px;">Sol-Ark Alert System</h1>
      <p style="color:#e2e8f0;font-size:16px;margin:0 0 12px;">This is a test email to verify your alert system is working correctly.</p>
      <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">If you received this, your Gmail SMTP integration is properly configured.</p>
      <div style="background:#0a0a0f;border:1px solid #1e293b;border-radius:8px;padding:16px;">
        <p style="color:#10b981;font-size:14px;font-weight:600;margin:0;">Status: Email delivery working</p>
        <p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">Sent at: ${new Date().toISOString()}</p>
      </div>
    </div>
  </div>`

  return sendEmail(to, "[Sol-Ark] Test Email - Alert System Verification", html)
}
