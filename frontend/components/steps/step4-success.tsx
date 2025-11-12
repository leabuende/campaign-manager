"use client";

import { CheckCircle, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressStep } from "../progress-step";

interface Step4SuccessProps {
  onBack: () => void;
}

export function Step4Success({ onBack }: Step4SuccessProps) {
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
          <p className="text-lg text-muted-foreground mb-8">
            Your campaign is now live and optimized for success
          </p>
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
              <span className="font-semibold">Next Steps:</span> Monitor your campaign performance
              in real-time. Check back soon to view analytics and engagement metrics.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
