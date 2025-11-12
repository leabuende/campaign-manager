"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Step1Upload } from "@/components/steps/step1-upload";
import { StepLoader } from "@/components/step-loader";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNext = async (data: any) => {
    setLoading(true);
    try {
      // Create a new campaign and get the ID from the API
      const formData = new FormData();
      if (data.briefFile) {
        formData.append("brief", data.briefFile);
      }
      data.productImages.forEach((img: File) => {
        formData.append("productImages", img);
      });
      formData.append("name", data.name);
      formData.append("description", data.description);

      const response = await fetch("/api/campaigns", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Campaign creation failed");

      const result = await response.json();
      const campaignId = result?.apiResponse?.id;

      router.push(`/campaign/${campaignId}/step2`);
    } catch (error) {
      console.error("[v0] Campaign creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <StepLoader stepNumber={1} message="Creating new campaign and uploading files..." />;
  }

  return <Step1Upload onNext={handleNext} />;
}
