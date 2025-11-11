import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      campaignId,
      audiences: ["Women 25-35", "Women 35-45", "Beauty Enthusiasts", "Luxury Seekers"],
      imageVariations: [
        { name: "1:1", ratio: 1, desc: "Square" },
        { name: "3:4", ratio: 0.75, desc: "Vertical" },
        { name: "9:16", ratio: 0.5625, desc: "Mobile" },
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id
    const data = await request.json()

    console.log("[v0] Saving image lab data for campaign:", campaignId)

    // Simulate image processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      campaignId,
      imagesProcessed: 12,
    })
  } catch (error) {
    console.error("[v0] Step 3 API error:", error)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
