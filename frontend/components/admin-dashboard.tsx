"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { CreateCampaign } from "./create-campaign"
import { PreviousCampaigns } from "./previous-campaigns"
import { BrandAssets } from "./brand-assets"

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("create")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 overflow-hidden transition-all ${!sidebarOpen ? "ml-0" : ""}`}>
        {activeSection === "create" && <CreateCampaign />}
        {activeSection === "previous" && <PreviousCampaigns />}
        {activeSection === "assets" && <BrandAssets />}
      </main>
    </div>
  )
}
