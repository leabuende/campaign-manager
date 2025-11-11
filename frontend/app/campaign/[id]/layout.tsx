"use client"

import type React from "react"

export default function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return <>{children}</>
}
