"use client"

import { useState } from "react"
import { Step1Upload } from "./steps/step1-upload"
import { Step2Content } from "./steps/step2-content"
import { Step3ImageLab } from "./steps/step3-image-lab"
import { Step4Success } from "./steps/step4-success"

export function CreateCampaign() {
  const [step, setStep] = useState(1)
  const [campaignData, setCampaignData] = useState({
    briefFile: null,
    productImages: [] as File[],
    campaignId: null,
  })

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {step === 1 && (
            <Step1Upload
              onNext={(data) => {
                setCampaignData(data)
                setStep(2)
              }}
            />
          )}
          {step === 2 && (
            <Step2Content
              campaignData={campaignData}
              onBack={() => setStep(1)}
              onNext={(data) => {
                setCampaignData(data)
                setStep(3)
              }}
            />
          )}
          {step === 3 && (
            <Step3ImageLab
              campaignData={campaignData}
              onBack={() => setStep(2)}
              onNext={(data) => {
                setCampaignData(data)
                setStep(4)
              }}
            />
          )}
          {step === 4 && <Step4Success campaignData={campaignData} onBack={() => setStep(3)} />}
        </div>
      </div>
    </div>
  )
}
