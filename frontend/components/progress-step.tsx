"use client"

interface ProgressStepProps {
  stepNumber: number
  title: string
  description: string
}

export function ProgressStep({ stepNumber, title, description }: ProgressStepProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
          {stepNumber}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="h-0.5 flex-1 bg-accent/30" />
    </div>
  )
}
