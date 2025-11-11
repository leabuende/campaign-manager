"use client"

import { useState } from "react"
import { Folder, ChevronRight, FileText, ImageIcon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CampaignFile {
  id: string
  name: string
  type: "image" | "text"
  content?: string
  url?: string
}

interface Campaign {
  id: string
  name: string
  date: string
  files: CampaignFile[]
  metrics: {
    reach: number
    roi: number
    audienceMatch: number
  }
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-001",
    name: "Summer Collection 2025",
    date: "Nov 15, 2025",
    files: [
      {
        id: "f1",
        name: "hero_image_1x1.png",
        type: "image",
        url: "/luxury-beauty-product.jpg",
      },
      {
        id: "f2",
        name: "hero_image_3x4.png",
        type: "image",
        url: "/luxury-beauty-product.jpg",
      },
      {
        id: "f3",
        name: "campaign_brief.txt",
        type: "text",
        content:
          "Target audiences: Women 25-45\nTheme: Summer luxury collection\nKey message: Natural beauty enhancement",
      },
    ],
    metrics: { reach: 125000, roi: 340, audienceMatch: 92 },
  },
  {
    id: "camp-002",
    name: "Luxury Line Launch",
    date: "Nov 8, 2025",
    files: [
      {
        id: "f4",
        name: "luxury_pack_1x1.png",
        type: "image",
        url: "/luxury-packaging.jpg",
      },
      {
        id: "f5",
        name: "campaign_brief.txt",
        type: "text",
        content: "Premium product launch\nTarget: Luxury seekers aged 35+\nBudget: High-end positioning",
      },
    ],
    metrics: { reach: 89000, roi: 285, audienceMatch: 88 },
  },
]

export function PreviousCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(SAMPLE_CAMPAIGNS[0])
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["camp-001"])
  const [selectedFile, setSelectedFile] = useState<CampaignFile | null>(SAMPLE_CAMPAIGNS[0].files[0])
  const [metrics, setMetrics] = useState<Record<string, any>>({})

  const toggleFolder = (campaignId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId],
    )
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Panel - Campaign Tree */}
      <div className="w-80 border-r border-border bg-card overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-light tracking-wide">Previous Campaigns</h1>
          <p className="text-xs text-muted-foreground mt-2">View and manage your campaign history</p>
        </div>

        <div className="p-4 space-y-2">
          {SAMPLE_CAMPAIGNS.map((campaign) => (
            <div key={campaign.id}>
              {/* Campaign Folder */}
              <button
                onClick={() => {
                  toggleFolder(campaign.id)
                  setSelectedCampaign(campaign)
                  setSelectedFile(campaign.files[0])
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  selectedCampaign?.id === campaign.id
                    ? "bg-accent/10 border border-accent"
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${expandedFolders.includes(campaign.id) ? "rotate-90" : ""}`}
                />
                <Folder className="w-4 h-4 text-accent" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">{campaign.date}</p>
                </div>
              </button>

              {/* Campaign Files */}
              {expandedFolders.includes(campaign.id) && (
                <div className="ml-4 mt-1 space-y-1 border-l border-border">
                  {campaign.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-all text-left ml-2 ${
                        selectedFile?.id === file.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {file.type === "image" ? (
                        <ImageIcon className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="text-sm truncate">{file.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - File Preview + Metrics */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Preview */}
        <div className="flex-1 border-r border-border overflow-auto">
          <div className="p-8">
            {selectedFile && (
              <div>
                <h2 className="text-2xl font-light tracking-wide mb-6">{selectedFile.name}</h2>

                {selectedFile.type === "image" && selectedFile.url ? (
                  <div className="bg-muted rounded-lg overflow-hidden border border-border">
                    <img
                      src={selectedFile.url || "/placeholder.svg"}
                      alt={selectedFile.name}
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                ) : selectedFile.type === "text" && selectedFile.content ? (
                  <div className="bg-card rounded-lg border border-border p-6">
                    <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
                      {selectedFile.content}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg border border-border p-8 text-center">
                    <p className="text-muted-foreground">Preview not available</p>
                  </div>
                )}

                <Button className="mt-6 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Panel */}
        {selectedCampaign && (
          <div className="w-80 border-r border-border bg-card overflow-y-auto">
            <div className="p-6 border-b border-border sticky top-0 bg-card">
              <h3 className="font-semibold text-foreground mb-2">Campaign Metrics</h3>
              <p className="text-xs text-muted-foreground">Edit and save campaign performance</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Reach */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">Reach</label>
                <Input
                  type="number"
                  placeholder="e.g., 125000"
                  defaultValue={selectedCampaign.metrics.reach}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      reach: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-input text-foreground border-border text-sm"
                />
              </div>

              {/* ROI */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">ROI (%)</label>
                <Input
                  type="number"
                  placeholder="e.g., 340"
                  defaultValue={selectedCampaign.metrics.roi}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      roi: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-input text-foreground border-border text-sm"
                />
              </div>

              {/* Audience Match */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">Audience Match (%)</label>
                <Input
                  type="number"
                  placeholder="e.g., 92"
                  defaultValue={selectedCampaign.metrics.audienceMatch}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      audienceMatch: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-input text-foreground border-border text-sm"
                />
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Save Metrics</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
