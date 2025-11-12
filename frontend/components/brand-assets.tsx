"use client";

import type React from "react";

import { useState } from "react";
import { Upload, FileText, ImageIcon, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Asset {
  id: string;
  name: string;
  type: "logo" | "description" | "pdf" | "image";
  uploadDate: string;
}

const SAMPLE_ASSETS: Asset[] = [
  {
    id: "1",
    name: "Lea Beauty Logo - Primary",
    type: "logo",
    uploadDate: "Nov 1, 2025",
  },
  {
    id: "2",
    name: "Brand Guidelines 2025",
    type: "pdf",
    uploadDate: "Oct 28, 2025",
  },
];

export function BrandAssets() {
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);
  const [description, setDescription] = useState(
    "Lea Beauty is a global beauty company committed to innovation and sustainable beauty. Our mission is to offer all women and men across the world the best of what beauty can be.",
  );
  const [editingDescription, setEditingDescription] = useState(false);

  const getAssetIcon = (type: Asset["type"]) => {
    switch (type) {
      case "logo":
        return <ImageIcon className="w-5 h-5" />;
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      setAssets([
        ...assets,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: type as any,
          uploadDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
      ]);
    });
  };

  const triggerFileInput = (inputId: string) => {
    document.getElementById(inputId)?.click();
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-wide mb-2">Brand Assets</h1>
          <p className="text-muted-foreground">
            Manage your logos, guidelines, and brand materials
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Logos */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "logo")}
            onClick={() => triggerFileInput("logo-input")}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center transition-all hover:border-accent hover:bg-accent/5 cursor-pointer"
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-medium mb-2">Logo Files</h2>
            <p className="text-sm text-muted-foreground mb-4">Upload PNG, SVG, or PDF versions</p>
            <input type="file" className="hidden" id="logo-input" />
            <div className="inline-flex items-center gap-2 text-accent text-sm pointer-events-none">
              <Upload className="w-4 h-4" />
              Upload Logo
            </div>
          </div>

          {/* Guidelines */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "pdf")}
            onClick={() => triggerFileInput("guidelines-input")}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center transition-all hover:border-accent hover:bg-accent/5 cursor-pointer"
          >
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-medium mb-2">Brand Guidelines</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Upload PDF documents and guidelines
            </p>
            <input type="file" accept=".pdf" className="hidden" id="guidelines-input" />
            <div className="inline-flex items-center gap-2 text-accent text-sm pointer-events-none">
              <Upload className="w-4 h-4" />
              Upload Guidelines
            </div>
          </div>

          {/* Other Files */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "image")}
            onClick={() => triggerFileInput("assets-input")}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center transition-all hover:border-accent hover:bg-accent/5 cursor-pointer"
          >
            <File className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-medium mb-2">Other Assets</h2>
            <p className="text-sm text-muted-foreground mb-4">Upload additional brand materials</p>
            <input type="file" className="hidden" id="assets-input" />
            <div className="inline-flex items-center gap-2 text-accent text-sm pointer-events-none">
              <Upload className="w-4 h-4" />
              Upload Files
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border mb-8">
          <h2 className="font-semibold text-foreground mb-4">Company Description</h2>

          {editingDescription ? (
            <>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="bg-input text-foreground border-border mb-3"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditingDescription(false)}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditingDescription(false)}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground leading-relaxed mb-4">{description}</p>
              <Button
                onClick={() => setEditingDescription(true)}
                variant="outline"
                className="w-full border-border text-foreground hover:bg-muted"
              >
                Edit
              </Button>
            </>
          )}
        </div>

        {/* Assets List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Uploaded Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-card rounded-lg p-4 border border-border flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="text-accent mt-1">{getAssetIcon(asset.type)}</div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{asset.uploadDate}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
