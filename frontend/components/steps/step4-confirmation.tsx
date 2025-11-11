"use client"

import { CheckCircle, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Step4ConfirmationProps {
  campaignData: any
  onBack: () => void
}

export function Step4Confirmation({ campaignData, onBack }: Step4ConfirmationProps) {
  const handleLaunch = () => {
    alert("Campaign launched successfully! Campaign ID: " + campaignData.campaignId)
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <Rocket className="w-10 h-10 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl font-light tracking-wide mb-3">Campaign Ready</h1>
        <p className="text-lg text-muted-foreground">Your campaign is optimized and ready to go live</p>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-lg p-8 border border-border mb-8 text-left">
        <h2 className="text-lg font-semibold mb-6">Campaign Summary</h2>

        <div className="space-y-4">
          <div className="flex items-start justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Campaign ID</span>
            <span className="font-medium text-foreground">{campaignData.campaignId}</span>
          </div>

          <div className="flex items-start justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Target Audiences</span>
            <span className="font-medium text-foreground text-right max-w-xs">
              {campaignData.content?.targetAudiences?.value || "4 segments"}
            </span>
          </div>

          <div className="flex items-start justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Product Images</span>
            <span className="font-medium text-foreground">{campaignData.productImages?.length || 0} images</span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-muted-foreground">Image Variations</span>
            <span className="font-medium text-foreground">3 aspect ratios per audience</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          "AI-optimized captions",
          "Multi-platform ready",
          "Content warnings checked",
          "Image variations generated",
        ].map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-border text-foreground hover:bg-muted flex-1 bg-transparent"
        >
          Back to Images
        </Button>
        <Button onClick={handleLaunch} className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 flex-1">
          Launch Campaign
        </Button>
      </div>
    </div>
  )
}
