import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id

    // Simulate final processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      campaignId,
      status: "launched",
      audiences: 4,
      productImages: 3,
      imageVariations: "3 aspect ratios per audience",
      launchedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}
