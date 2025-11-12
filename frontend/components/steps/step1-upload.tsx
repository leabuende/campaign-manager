"use client";

import type React from "react";
import { useState } from "react";
import { Upload, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressStep } from "../progress-step";

interface Step1UploadProps {
  onNext: (data: any) => void;
}

export function Step1Upload({ onNext }: Step1UploadProps) {
  const [briefFile, setBriefFile] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleBriefDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setBriefFile(file);
    }
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setProductImages([...productImages, ...files]);
  };

  const handleBriefClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "application/pdf") {
      setBriefFile(file);
    }
  };

  const handleImageClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    setProductImages([...productImages, ...files]);
  };

  const triggerFileInput = (inputId: string) => {
    document.getElementById(inputId)?.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressStep
        stepNumber={1}
        title="Campaign Brief"
        description="Upload your assets and brief"
      />

      {/* --- New Campaign Info Fields --- */}
      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Campaign Name</label>
          <input
            type="text"
            placeholder="e.g. Ordinary Skincare Launch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2 bg-background border-border focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Campaign Description
          </label>
          <textarea
            placeholder="Describe your campaign here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded-lg p-2 bg-background border-border focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* --- File Upload Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Campaign Brief */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleBriefDrop}
          onClick={() => triggerFileInput("brief-input")}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-all hover:border-accent hover:bg-accent/5 cursor-pointer"
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-medium mb-2">Campaign Brief</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your PDF brief here or click to browse
          </p>
          {briefFile && (
            <div className="bg-accent/10 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-accent">{briefFile.name}</p>
            </div>
          )}
          <input
            type="file"
            accept=".pdf"
            onChange={handleBriefClick}
            className="hidden"
            id="brief-input"
          />
          <div className="inline-flex items-center gap-2 text-accent text-sm pointer-events-none">
            <Upload className="w-4 h-4" />
            Choose PDF
          </div>
        </div>

        {/* Product Photos */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleImageDrop}
          onClick={() => triggerFileInput("image-input")}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-all hover:border-accent hover:bg-accent/5 cursor-pointer"
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-medium mb-2">Product Photos</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop images here or click to browse
          </p>
          {productImages.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                {productImages.map((img, idx) => (
                  <div key={idx} className="bg-accent/10 rounded-lg p-2 text-left">
                    <p className="text-xs font-medium text-accent truncate">{img.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageClick}
            multiple
            className="hidden"
            id="image-input"
          />
          <div className="inline-flex items-center gap-2 text-accent text-sm pointer-events-none">
            <Upload className="w-4 h-4" />
            Choose Images
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => onNext({ briefFile, productImages, name, description })}
          disabled={!briefFile || productImages.length === 0 || !name || !description}
          className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
