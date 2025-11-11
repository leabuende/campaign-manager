"use client"

import { CheckCircle, Rocket, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressStep } from "../progress-step"

interface Step4SuccessProps {
  campaignData: any
  onBack: () => void
}

export function Step4Success({ campaignData, onBack }: Step4SuccessProps) {
  const handleLaunch = () => {
    console.log("Campaign launched:", campaignData)
  }

  return (
    <div className="flex flex-col h-full">
      <ProgressStep stepNumber={4} title="Campaign Launched" description="Your campaign is live!" />

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          {/* Success Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-accent/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-light tracking-wide mb-3">Campaign Launched!</h1>
          <p className="text-lg text-muted-foreground mb-8">Your campaign is now live and optimized for success</p>

          {/* Summary Card */}
          <div className="bg-card rounded-lg p-8 border border-border mb-8 text-left">
            <h2 className="text-lg font-semibold mb-6 text-foreground">Campaign Summary</h2>

            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Campaign ID</span>
                <span className="font-medium text-accent">{campaignData.campaignId}</span>
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Audience Groups</span>
                <span className="font-medium text-foreground">{campaignData.audiences?.length || 4} segments</span>
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

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              "AI-optimized captions",
              "Multi-platform ready",
              "Content safety verified",
              "Image variations ready",
              "Audience targeting active",
              "Real-time analytics",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-8">
            <p className="text-sm text-foreground mb-3">
              <span className="font-semibold">Next Steps:</span> Monitor your campaign performance in real-time. Check
              back soon to view analytics and engagement metrics.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Back to Images
            </Button>
            <Button onClick={handleLaunch} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Rocket className="w-4 h-4" />
              View Campaign Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
