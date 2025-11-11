"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Step2Content } from "@/components/steps/step2-content"
import { StepLoader } from "@/components/step-loader"

export default function Step2Page() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [campaignData, setCampaignData] = useState(null)
  const campaignId = params.id as string

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/step2`)
        if (!response.ok) throw new Error("Failed to fetch campaign data")
        const data = await response.json()
        setCampaignData(data)
      } catch (error) {
        console.error("[v0] Step 2 fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignData()
  }, [campaignId])

  const handleNext = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/step2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Save failed")

      router.push(`/campaign/${campaignId}/step3`)
    } catch (error) {
      console.error("[v0] Step 2 save error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/campaign/${campaignId}/step1`)
  }

  if (loading) {
    return <StepLoader stepNumber={2} message="Loading campaign content and audience data..." />
  }

  return <Step2Content campaignData={campaignData || {}} onBack={handleBack} onNext={handleNext} />
}
