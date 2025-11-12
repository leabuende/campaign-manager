"use client";

import { Loader2 } from "lucide-react";

interface StepLoaderProps {
  stepNumber: number;
  message: string;
}

export function StepLoader({ stepNumber, message }: StepLoaderProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <Loader2 className="w-16 h-16 text-accent animate-spin" />
            </div>
            <div>
              <p className="text-lg text-foreground font-medium">Processing...</p>
              <p className="text-muted-foreground text-sm mt-2">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
