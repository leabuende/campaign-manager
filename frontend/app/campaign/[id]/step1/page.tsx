"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Step1Upload } from "@/components/steps/step1-upload"
import { StepLoader } from "@/components/step-loader"

export default function Step1Page() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const campaignId = params.id as string

  const handleNext = async (data: any) => {
    setLoading(true)
    try {
      const formData = new FormData()
      if (data.briefFile) {
        formData.append("brief", data.briefFile)
      }
      data.productImages.forEach((img: File) => {
        formData.append("productImages", img)
      })

      const response = await fetch(`/api/campaigns/${campaignId}/step1`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const result = await response.json()
      router.push(`/campaign/${campaignId}/step2`)
    } catch (error) {
      console.error("[v0] Step 1 error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <StepLoader stepNumber={1} message="Uploading files and processing campaign brief..." />
  }

  return <Step1Upload onNext={handleNext} campaignId={campaignId} />
}
