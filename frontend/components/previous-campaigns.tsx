"use client";

import { useState, useEffect } from "react";
import { Folder, ChevronRight, ImageIcon, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CampaignFile {
  id: string;
  name: string;
  type: "image" | "text";
  content?: string;
  url?: string;
}

interface Campaign {
  id: string;
  name: string;
  date: string;
  description?: string;
  metrics: {
    reach: number;
    roi: number;
    audienceMatch: number;
  };
}

interface UploadFolder {
  id: string;
  name: string;
  files: CampaignFile[];
}

export function PreviousCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [folders, setFolders] = useState<UploadFolder[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<CampaignFile | null>(null);
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  const toggleFolder = (campaignId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId],
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch campaigns
        const resCampaigns = await fetch("/api/campaigns");
        const jsonCampaigns = await resCampaigns.json();
        if (!jsonCampaigns.success) return;
        const campaignsData: Campaign[] = jsonCampaigns.data;

        // Fetch upload folders
        const resFolders = await fetch("/api/campaigns/images");
        const jsonFolders = await resFolders.json();
        if (!jsonFolders.success) return;
        const foldersData: UploadFolder[] = jsonFolders.data.map((f: any) => {
          // flatten subfolders inside campaign folder
          const files: CampaignFile[] = [];
          f.files.forEach((file: any) => {
            // if file is a folder, add its content
            if (file.url.endsWith("/")) return; // skip folders for now
            files.push({ id: file.name, name: file.name, type: "image", url: file.url });
          });
          return { ...f, files };
        });

        // Only keep campaigns with folders
        const filteredCampaigns = campaignsData.filter((c) =>
          foldersData.some((f) => f.id === c.id),
        );

        setCampaigns(filteredCampaigns);
        setFolders(foldersData);

        if (filteredCampaigns.length > 0) {
          const firstCampaign = filteredCampaigns[0];
          setSelectedCampaign(firstCampaign);
          const folder = foldersData.find((f) => f.id === firstCampaign.id);
          if (folder && folder.files.length > 0) {
            setSelectedFile(folder.files[0]);
          }
          setMetrics({
            reach: firstCampaign.metrics?.reach || 0,
            roi: firstCampaign.metrics?.roi || 0,
            audienceMatch: firstCampaign.metrics?.audienceMatch || 0,
          });
          setExpandedFolders([firstCampaign.id]);
        }
      } catch (err) {
        console.error("Error fetching campaigns or uploads:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Panel */}
      <div className="w-80 border-r border-border bg-card overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-light tracking-wide">Previous Campaigns</h1>
          <p className="text-xs text-muted-foreground mt-2">
            Only campaigns with uploaded content are shown
          </p>
        </div>

        <div className="p-4 space-y-2">
          {campaigns.map((campaign) => {
            const folder = folders.find((f) => f.id === campaign.id);
            if (!folder) return null;

            return (
              <div key={campaign.id}>
                {/* Campaign Folder */}
                <button
                  onClick={() => {
                    toggleFolder(campaign.id);
                    setSelectedCampaign(campaign);
                    if (folder.files.length > 0) setSelectedFile(folder.files[0]);
                    setMetrics({
                      reach: campaign.metrics?.reach || 0,
                      roi: campaign.metrics?.roi || 0,
                      audienceMatch: campaign.metrics?.audienceMatch || 0,
                    });
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    selectedCampaign?.id === campaign.id
                      ? "bg-accent/10 border border-accent"
                      : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      expandedFolders.includes(campaign.id) ? "rotate-90" : ""
                    }`}
                  />
                  <Folder className="w-4 h-4 text-accent" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(campaign.date).toLocaleDateString()}
                    </p>
                  </div>
                </button>

                {/* Campaign Images */}
                {expandedFolders.includes(campaign.id) && (
                  <div className="ml-4 mt-1 grid grid-cols-1 gap-2 border-l border-border p-2">
                    {folder.files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded transition-all text-left ${
                          selectedFile?.id === file.id
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <ImageIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
                      src={selectedFile.url}
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
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                  Reach
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 125000"
                  value={metrics.reach || 0}
                  onChange={(e) => setMetrics({ ...metrics, reach: parseInt(e.target.value) || 0 })}
                  className="bg-input text-foreground border-border text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                  ROI (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 340"
                  value={metrics.roi || 0}
                  onChange={(e) => setMetrics({ ...metrics, roi: parseInt(e.target.value) || 0 })}
                  className="bg-input text-foreground border-border text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">
                  Audience Match (%)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 92"
                  value={metrics.audienceMatch || 0}
                  onChange={(e) =>
                    setMetrics({ ...metrics, audienceMatch: parseInt(e.target.value) || 0 })
                  }
                  className="bg-input text-foreground border-border text-sm"
                />
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Save Metrics
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
