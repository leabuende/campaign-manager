import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    console.log(`Fetching campaign from ${API_BASE_URL}/campaigns/${id}`);

    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch campaign: ${text}`);
    }

    const data = await response.json();
    console.log(data.audiences[0].content);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] GET campaign error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id;
    const { audience_id } = await request.json();

    console.log("Forwarding image generation request:", { campaignId, audience_id });
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${API_BASE_URL}/campaigns/generate_images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign_id: campaignId,
        audience_id,
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
