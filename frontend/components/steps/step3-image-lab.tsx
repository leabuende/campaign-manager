"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProgressStep } from "../progress-step";
import { Check, X } from "lucide-react";

interface Step3ImageLabProps {
  campaignData: any;
  selectedAudience: string; // audience id
  onBack: () => void;
  onNext: (data: any) => void;
}

export function Step3ImageLab({
  campaignData,
  selectedAudience,
  onBack,
  onNext,
}: Step3ImageLabProps) {
  const [audience, setAudience] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const ASPECT_RATIOS = [
    { name: "1:1", ratio: 1, desc: "Square" },
    { name: "3:4", ratio: 0.75, desc: "Vertical" },
    { name: "9:16", ratio: 0.5625, desc: "Mobile" },
  ];

  useEffect(() => {
    if (campaignData?.audiences) {
      const found = campaignData.audiences.find((a: any) => a.id === selectedAudience);
      setAudience(found || null);
    }
  }, [campaignData, selectedAudience]);

  const handlePromptChange = (ratio: string, value: string) => {
    if (!selectedImage) return;
    setPrompts({
      ...prompts,
      [selectedImage]: {
        ...(prompts[selectedImage] || {}),
        [ratio]: value,
      },
    });
  };

  const handleGenerateImage = (ratio: string) => {
    if (!selectedImage) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleImageDoubleClick = () => {
    if (selectedImage) setPreviewImage(selectedImage);
  };

  const getImageUrl = (imgPath: string) => {
    if (imgPath.startsWith("/app/uploads/")) {
      return imgPath.replace("/app/uploads", "/uploads");
    }
    return imgPath;
  };

  if (!audience) {
    return <p className="text-muted-foreground">No audience data found for this ID.</p>;
  }

  return (
    <div className="max-w-7xl h-full flex flex-col p-6">
      <ProgressStep
        stepNumber={3}
        title="Image Lab"
        description={`Optimize visuals for audience: ${audience.name}`}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-wide mb-2">Image Lab</h1>
        <p className="text-muted-foreground">Optimize visuals for this audience segment</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left: Images */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {audience.images.map((imgPath: string, idx: number) => {
              const ratioName = ASPECT_RATIOS[idx]?.name || `Image ${idx + 1}`;
              const ratioValue = ASPECT_RATIOS[idx]?.ratio || 1;
              const platformLabel =
                ratioName === "1:1"
                  ? "(Website)"
                  : ratioName === "3:4"
                    ? "(Instagram)"
                    : ratioName === "9:16"
                      ? "(TikTok/Story)"
                      : "";

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(ratioName)}
                  onDoubleClick={handleImageDoubleClick}
                  className={`bg-card rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === ratioName
                      ? "border-accent"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div
                    className="relative w-full bg-muted flex items-center justify-center overflow-hidden group"
                    style={{ aspectRatio: ratioValue }}
                  >
                    <img
                      src={getImageUrl(imgPath)}
                      alt={ratioName}
                      className="object-cover w-full h-full"
                    />
                    {selectedImage === ratioName && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center py-2">
                    {ratioName} {platformLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Prompt Panel */}
        <div className="w-96 border-l border-border pl-6 overflow-y-auto">
          <div className="sticky top-0 bg-background pb-4">
            {selectedImage ? (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  AI Prompt: {selectedImage} ({audience.name})
                </label>
                <p className="text-xs text-muted-foreground mb-4">
                  Customize how images should be optimized for this audience and aspect ratio
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select an image to customize its prompt
              </p>
            )}
          </div>

          {selectedImage && (
            <div className="space-y-4 pb-6">
              {/* Textarea for AI prompt modifications */}
              <Textarea
                value={prompts[selectedImage]?.default || ""}
                onChange={(e) => handlePromptChange("default", e.target.value)}
                placeholder={
                  selectedImage === "1:1"
                    ? "Add details or adjustments for the Website image..."
                    : selectedImage === "3:4"
                      ? "Add details or adjustments for the Instagram image..."
                      : selectedImage === "9:16"
                        ? "Add details or adjustments for the TikTok/Story image..."
                        : "Add details or adjustments for this image..."
                }
                rows={5}
                className="bg-input text-foreground border-border"
              />

              <Button
                onClick={() => handleGenerateImage("default")}
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {loading ? "Generating..." : "Generate image"}
              </Button>

              {/* Caption display */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Caption</h3>
                <p className="text-xs text-muted-foreground italic">
                  {selectedImage === "1:1"
                    ? audience.content.websiteCaption?.value
                    : selectedImage === "3:4"
                      ? audience.content.instagramCaption?.value
                      : selectedImage === "9:16"
                        ? audience.content.tikTokCaption?.value
                        : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-between border-t border-border pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-border text-foreground hover:bg-muted bg-transparent"
        >
          Back
        </Button>
        <Button
          onClick={() => onNext({ ...campaignData, imageLab: { prompts } })}
          className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
        >
          Review & Launch
        </Button>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{previewImage} Preview</h2>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
              <div
                className="bg-muted rounded-lg w-full flex items-center justify-center"
                style={{
                  aspectRatio: ASPECT_RATIOS.find((r) => r.name === previewImage)?.ratio || 1,
                }}
              >
                <img
                  src={getImageUrl(
                    audience.images[ASPECT_RATIOS.findIndex((r) => r.name === previewImage)],
                  )}
                  alt={previewImage}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
