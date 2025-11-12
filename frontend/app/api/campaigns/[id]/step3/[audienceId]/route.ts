import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; audienceId: string }> },
) {
  try {
    const { id: campaignId, audienceId } = await params;

    console.log("Forwarding image generation request:", { campaignId, audienceId });
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${API_BASE_URL}/campaigns/generate_images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: campaignId,
        audience_id: audienceId,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`FastAPI responded with ${response.status}: ${text}`);
    }

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[v0] Step 3 API error:", error);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
