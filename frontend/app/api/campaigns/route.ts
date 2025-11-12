import { type NextRequest, NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/campaigns`);
    if (!res.ok) {
      throw new Error(`Backend responded with status ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[v0] Error fetching campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const brief = formData.get("brief") as File;
    const productImages = formData.getAll("productImages") as File[];
    const name = formData.get("name")?.toString() || `Campaign`;
    const description = formData.get("description")?.toString() || "";

    if (!brief || productImages.length === 0) {
      return NextResponse.json({ error: "Missing files" }, { status: 400 });
    }

    const apiFormData = new FormData();
    apiFormData.append("pdf", brief);
    apiFormData.append("image", productImages[0]);
    apiFormData.append("name", name);
    apiFormData.append("description", description);

    console.log("Sending to FastAPI:", `${API_BASE_URL}/campaigns/process_brief`);

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
      apiResponse: result,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[v0] Step 1 API error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
