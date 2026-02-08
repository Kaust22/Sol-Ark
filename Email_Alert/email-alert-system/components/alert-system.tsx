"use client"

import { useState } from "react"
import { AlertBanner } from "./alert-banner"
import { RegistrationModal } from "./registration-modal"
import { AlertCTAButton } from "./alert-cta-button"
import { AdminPanel } from "./admin-panel"

export interface RegisteredUser {
  email: string
  name: string
  kp_threshold: number
}

export function AlertSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])

  const handleRegistered = (user: RegisteredUser) => {
    setRegisteredUsers((prev) => {
      // Avoid duplicates by email
      const filtered = prev.filter((u) => u.email !== user.email)
      return [...filtered, user]
    })
  }

  return (
    <>
      {/* Alert Banner - slides down from top when active */}
      <AlertBanner />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegistered={handleRegistered}
      />

      {/* Floating CTA Button - bottom right */}
      <AlertCTAButton
        isRegistered={registeredUsers.length > 0}
        onClick={() => setIsModalOpen(true)}
      />

      {/* Admin Panel - passes registered users so trigger can send them to API */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        registeredUsers={registeredUsers}
      />

      {/* Admin toggle button */}
      <AdminToggle onToggle={() => setIsAdminOpen((v) => !v)} />
    </>
  )
}

function AdminToggle({ onToggle }: { onToggle: () => void }) {
  if (typeof window !== "undefined") {
    // Using a ref-less approach: attach once via effect-like pattern
  }

  return (
    <button
      onClick={onToggle}
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "2rem",
        zIndex: 9998,
        background: "rgba(26, 26, 31, 0.8)",
        border: "1px solid #1e293b",
        color: "#94a3b8",
        padding: "0.5rem 0.75rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.75rem",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "0.05em",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Toggle admin panel"
    >
      ADMIN
    </button>
  )
}
