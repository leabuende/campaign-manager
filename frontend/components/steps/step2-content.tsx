"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProgressStep } from "../progress-step"

interface ContentField {
  label: string
  value: string
  warning?: string
  confidence_score?: number
}

interface AudienceProfile {
  id: string
  name: string
  content: Record<string, ContentField>
}

interface Step2ContentProps {
  campaignData: any
  onBack: () => void
  onNext: (data: any) => void
}

export function Step2Content({ campaignData, onBack, onNext }: Step2ContentProps) {
  const [audiences, setAudiences] = useState<AudienceProfile[]>([])
  const [activeTab, setActiveTab] = useState<string>("")

  useEffect(() => {
    const timer = setTimeout(() => {
      const initialAudiences: AudienceProfile[] = [
        {
          id: "aud-1",
          name: "Women 25-35",
          content: {
            instagramCaption: {
              label: "Instagram Caption",
              value: "Discover the art of beauty. Transform your skin with our revolutionary formula.",
              warning: "May contain language that could be perceived as exclusionary",
              confidence_score: 0.78,
            },
            tikTokCaption: {
              label: "TikTok Caption",
              value: "Beauty that works for you. 30-second transformation challenge 💄✨",
              confidence_score: 0.95,
            },
          },
        },
        {
          id: "aud-2",
          name: "Women 35-45",
          content: {
            instagramCaption: {
              label: "Instagram Caption",
              value: "Luxury meets science. Elevate your skincare routine.",
              confidence_score: 0.88,
            },
            tikTokCaption: {
              label: "TikTok Caption",
              value: "Age is just a number. Join the beauty revolution.",
              warning: "Consider alternative phrasing",
              confidence_score: 0.82,
            },
          },
        },
        {
          id: "aud-3",
          name: "Beauty Enthusiasts",
          content: {
            instagramCaption: {
              label: "Instagram Caption",
              value: "Professional-grade formulation. Expert results.",
              confidence_score: 0.92,
            },
            tikTokCaption: {
              label: "TikTok Caption",
              value: "The ultimate beauty hack you never knew you needed.",
              confidence_score: 0.89,
            },
          },
        },
      ]
      setAudiences(initialAudiences)
      setActiveTab(initialAudiences[0].id)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  const handleContentChange = (audienceId: string, fieldKey: string, value: string) => {
    setAudiences(
      audiences.map((aud) =>
        aud.id === audienceId
          ? {
              ...aud,
              content: {
                ...aud.content,
                [fieldKey]: { ...aud.content[fieldKey], value },
              },
            }
          : aud,
      ),
    )
  }

  const handleAddProfile = () => {
    const newProfile: AudienceProfile = {
      id: `aud-${Date.now()}`,
      name: `Audience ${audiences.length + 1}`,
      content: {
        instagramCaption: {
          label: "Instagram Caption",
          value: "",
          confidence_score: 0.5,
        },
        tikTokCaption: {
          label: "TikTok Caption",
          value: "",
          confidence_score: 0.5,
        },
      },
    }
    setAudiences([...audiences, newProfile])
    setActiveTab(newProfile.id)
  }

  const activeAudience = audiences.find((a) => a.id === activeTab)

  return (
    <div className="max-w-4xl">
      <ProgressStep
        stepNumber={2}
        title="Content Details"
        description="Edit and review campaign content per audience"
      />

      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">Content Details</h1>
        <p className="text-muted-foreground">Customize content for each audience segment</p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto items-center">
        {audiences.map((audience) => (
          <button
            key={audience.id}
            onClick={() => setActiveTab(audience.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeTab === audience.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {audience.name}
          </button>
        ))}
        <button
          onClick={handleAddProfile}
          className="ml-auto px-3 py-3 text-sm text-accent hover:bg-accent/10 rounded transition-all flex items-center gap-1"
          title="Create new audience profile"
        >
          <Plus className="w-4 h-4" />
          New Profile
        </button>
      </div>

      {activeAudience && (
        <div className="space-y-6">
          {Object.entries(activeAudience.content).map(([key, field]) => (
            <div key={key} className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-foreground mb-1">{field.label}</label>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">AI Confidence:</span>
                    <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{
                          width: `${(field.confidence_score || 0) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground">{Math.round((field.confidence_score || 0) * 100)}%</span>
                  </div>
                </div>
              </div>

              <Textarea
                value={field.value}
                onChange={(e) => handleContentChange(activeAudience.id, key, e.target.value)}
                placeholder="Enter caption text"
                rows={3}
                className="bg-input text-foreground border-border"
              />

              {field.warning && (
                <div className="mt-3 flex gap-3 p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{field.warning}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-border text-foreground hover:bg-muted bg-transparent"
        >
          Back
        </Button>
        <Button
          onClick={() =>
            onNext({
              ...campaignData,
              content: activeAudience,
              audiences,
            })
          }
          className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}
