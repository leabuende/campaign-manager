"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { PreviousCampaigns } from "./previous-campaigns";
import { BrandAssets } from "./brand-assets";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleCreateCampaign = () => {
    router.push("/campaign/new");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 overflow-hidden transition-all ${!sidebarOpen ? "ml-0" : ""}`}>
        {activeSection === "create" && (
          <div className="flex flex-col h-screen items-center justify-center gap-6">
            <div className="text-center">
              <h2 className="text-4xl font-light tracking-wider mb-2">Create New Campaign</h2>
              <p className="text-foreground/60">
                Start a new Lea Beauty campaign by uploading your brief and product photos
              </p>
            </div>
            <Button
              onClick={handleCreateCampaign}
              size="lg"
              className="bg-accent hover:bg-accent/90"
            >
              Start Campaign Creation
            </Button>
          </div>
        )}
        {activeSection === "previous" && <PreviousCampaigns />}
        {activeSection === "assets" && <BrandAssets />}
      </main>
    </div>
  );
}
