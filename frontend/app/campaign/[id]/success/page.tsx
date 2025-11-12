"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Step4Success } from "@/components/steps/step4-success";
import { StepLoader } from "@/components/step-loader";

export default function Step4Page() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const handleBack = () => {
    router.push(`/`);
  };

  return <Step4Success onBack={handleBack} />;
}
