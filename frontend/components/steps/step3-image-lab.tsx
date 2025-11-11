"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProgressStep } from "../progress-step"
import { Check, X } from "lucide-react"

interface Step3ImageLabProps {
  campaignData: any
  onBack: () => void
  onNext: (data: any) => void
}

const AUDIENCE_TYPES = ["Women 25-35", "Women 35-45", "Beauty Enthusiasts", "Luxury Seekers"]
const ASPECT_RATIOS = [
  { name: "1:1", ratio: 1, desc: "Square" },
  { name: "3:4", ratio: 0.75, desc: "Vertical" },
  { name: "9:16", ratio: 0.5625, desc: "Mobile" },
]

export function Step3ImageLab({ campaignData, onBack, onNext }: Step3ImageLabProps) {
  const [activeAudience, setActiveAudience] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handlePromptChange = (ratio: string, value: string) => {
    if (!selectedImage) return
    setPrompts({
      ...prompts,
      [selectedImage]: {
        ...(prompts[selectedImage] || {}),
        [ratio]: value,
      },
    })
  }

  const handleGenerateImage = (ratio: string) => {
    if (!selectedImage) return
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  const handleImageDoubleClick = () => {
    if (selectedImage) {
      setPreviewImage(selectedImage)
    }
  }

  return (
    <div className="max-w-7xl h-full flex flex-col">
      <ProgressStep stepNumber={3} title="Image Lab" description="Optimize visuals for each audience" />

      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-wide mb-2">Image Lab</h1>
        <p className="text-muted-foreground">Optimize visuals for each audience segment</p>
      </div>

      {/* Audience Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto">
        {AUDIENCE_TYPES.map((audience, idx) => (
          <button
            key={idx}
            onClick={() => setActiveAudience(idx)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeAudience === idx
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {audience}
          </button>
        ))}
      </div>

      {/* Main Content - Scrollable Images + Fixed Right Panel */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {ASPECT_RATIOS.map((ratio) => (
              <div
                key={ratio.name}
                onClick={() => setSelectedImage(ratio.name)}
                onDoubleClick={handleImageDoubleClick}
                className={`bg-card rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === ratio.name ? "border-accent" : "border-border hover:border-accent/50"
                }`}
              >
                <div
                  className="bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden group"
                  style={{
                    aspectRatio: ratio.ratio,
                  }}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium">{ratio.name}</p>
                    <p className="text-xs text-muted-foreground">{ratio.desc}</p>
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, rgba(183, 109, 45, 0.1) 25%, transparent 25%, transparent 50%, rgba(183, 109, 45, 0.1) 50%, rgba(183, 109, 45, 0.1) 75%, transparent 75%, transparent)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {selectedImage === ratio.name && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center py-2">Sample image {ratio.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-96 border-l border-border pl-6 overflow-y-auto">
          <div className="sticky top-0 bg-background pb-4">
            {selectedImage ? (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  AI Prompt: {selectedImage} ({AUDIENCE_TYPES[activeAudience]})
                </label>
                <p className="text-xs text-muted-foreground mb-4">
                  Customize how images should be optimized for this audience and aspect ratio
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select an image to customize its prompt</p>
            )}
          </div>

          {selectedImage && (
            <div className="space-y-4 pb-6">
              <Textarea
                value={prompts[selectedImage]?.default || ""}
                onChange={(e) => handlePromptChange("default", e.target.value)}
                placeholder="E.g., Focus on natural beauty, warm lighting, minimalist styling..."
                rows={5}
                className="bg-input text-foreground border-border"
              />
              <p className="text-xs text-muted-foreground italic">
                Default: Optimize for {AUDIENCE_TYPES[activeAudience]} - modern, luxury aesthetic
              </p>
              <Button
                onClick={() => handleGenerateImage("default")}
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {loading ? "Generating..." : "Generate Image"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between border-t border-border pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-border text-foreground hover:bg-muted bg-transparent"
        >
          Back
        </Button>
        <Button
          onClick={() => onNext({ ...campaignData, imageLab: { prompts } })}
          className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
        >
          Review & Launch
        </Button>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{previewImage} Preview</h2>
              <button onClick={() => setPreviewImage(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
              <div
                className="bg-muted rounded-lg w-full flex items-center justify-center"
                style={{ aspectRatio: ASPECT_RATIOS.find((r) => r.name === previewImage)?.ratio || 1 }}
              >
                <div className="text-center">
                  <p className="text-lg font-medium text-muted-foreground">{previewImage}</p>
                  <p className="text-sm text-muted-foreground mt-2">{AUDIENCE_TYPES[activeAudience]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
