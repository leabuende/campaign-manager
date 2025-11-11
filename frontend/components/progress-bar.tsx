"use client"

interface Step {
  number: number
  title: string
  description: string
}

interface ProgressBarProps {
  currentStep: number
  steps: Step[]
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep >= step.number ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? "✓" : step.number}
                </div>
                <div className="mt-2 text-center">
                  <p className="font-medium text-xs text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`h-1 mx-4 flex-1 transition-all ${currentStep > step.number ? "bg-accent" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
