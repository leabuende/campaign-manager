"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Step3ImageLab } from "@/components/steps/step3-image-lab";
import { StepLoader } from "@/components/step-loader";

export default function Step3Page() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState(null);
  const campaignId = params.id as string;
  const audienceId = params.audienceId as string;

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/step2`);
        if (!response.ok) throw new Error("Failed to fetch campaign data");
        const data = await response.json();
        setCampaignData(data);
      } catch (error) {
        console.error("[v0] Step 3 fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [campaignId]);

  const handleNext = async (data: any) => {
    setLoading(true);
    try {
      router.push(`/campaign/${campaignId}/success`);
    } catch (error) {
      console.error("[v0] Step 3 save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/campaign/${campaignId}/step2`);
  };

  if (loading) {
    return <StepLoader stepNumber={3} message="Loading image optimization data..." />;
  }

  return (
    <Step3ImageLab
      campaignData={campaignData || {}}
      onBack={handleBack}
      selectedAudience={audienceId}
      onNext={handleNext}
    />
  );
}
