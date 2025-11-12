import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      campaignId,
      audiences: ["Women 25-35", "Women 35-45", "Beauty Enthusiasts", "Luxury Seekers"],
      imageVariations: [
        { name: "1:1", ratio: 1, desc: "Square" },
        { name: "3:4", ratio: 0.75, desc: "Vertical" },
        { name: "9:16", ratio: 0.5625, desc: "Mobile" },
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; audienceId: string }> },
) {
  try {
    const { id: campaignId, audienceId } = await params;

    console.log("[v0] Forwarding image generation request:", { campaignId, audienceId });
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
