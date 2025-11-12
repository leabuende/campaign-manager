import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id;
    const formData = await request.formData();

    const brief = formData.get("brief") as File;
    const productImages = formData.getAll("productImages") as File[];
    const name = formData.get("name")?.toString() || `Campaign ${campaignId}`;
    const description = formData.get("description")?.toString() || "";

    if (!brief || productImages.length === 0) {
      return NextResponse.json({ error: "Missing files" }, { status: 400 });
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    // Prepare data for FastAPI request
    const apiFormData = new FormData();
    apiFormData.append("pdf", brief);
    apiFormData.append("image", productImages[0]); // send only first image (or loop if needed)
    apiFormData.append("name", name);
    apiFormData.append("description", description);

    console.log("[v0] Sending to FastAPI:", `${API_BASE_URL}/campaigns/process_brief`);

    // Call your FastAPI endpoint
    const response = await fetch(`${API_BASE_URL}/campaigns/process_brief`, {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`FastAPI request failed: ${text}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      campaignId,
      apiResponse: result,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[v0] Step 1 API error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id;

    // Retrieve campaign step 1 data
    return NextResponse.json({
      campaignId,
      briefFile: null,
      productImages: [],
    });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
