"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Step4Success } from "@/components/steps/step4-success"
import { StepLoader } from "@/components/step-loader"

export default function Step4Page() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [campaignData, setCampaignData] = useState(null)
  const campaignId = params.id as string

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/step4`)
        if (!response.ok) throw new Error("Failed to fetch campaign data")
        const data = await response.json()
        setCampaignData(data)
      } catch (error) {
        console.error("[v0] Step 4 fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignData()
  }, [campaignId])

  const handleBack = () => {
    router.push(`/campaign/${campaignId}/step3`)
  }

  if (loading) {
    return <StepLoader stepNumber={4} message="Finalizing campaign launch..." />
  }

  return <Step4Success campaignData={campaignData || {}} onBack={handleBack} />
}
