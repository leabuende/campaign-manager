import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Return mock campaign data with audience profiles
    return NextResponse.json({
      campaignId,
      audiences: [
        {
          id: "aud-1",
          name: "Women 25-35",
          content: {
            instagramCaption: {
              label: "Instagram Caption",
              value: "Discover the art of beauty. Transform your skin with our revolutionary formula.",
              warning: "May contain language that could be perceived as exclusionary",
              confidence_score: 0.78,
            },
            tikTokCaption: {
              label: "TikTok Caption",
              value: "Beauty that works for you. 30-second transformation challenge 💄✨",
              confidence_score: 0.95,
            },
          },
        },
        {
          id: "aud-2",
          name: "Women 35-45",
          content: {
            instagramCaption: {
              label: "Instagram Caption",
              value: "Luxury meets science. Elevate your skincare routine.",
              confidence_score: 0.88,
            },
            tikTokCaption: {
              label: "TikTok Caption",
              value: "Age is just a number. Join the beauty revolution.",
              warning: "Consider alternative phrasing",
              confidence_score: 0.82,
            },
          },
        },
        {
          id: "aud-3",
          name: "Beauty Enthusiasts",
          content: {
            instagramCaption: {
              label: "Instagram Caption",
              value: "Professional-grade formulation. Expert results.",
              confidence_score: 0.92,
            },
            tikTokCaption: {
              label: "TikTok Caption",
              value: "The ultimate beauty hack you never knew you needed.",
              confidence_score: 0.89,
            },
          },
        },
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

    console.log("[v0] Saving content for campaign:", campaignId)
    console.log("[v0] Audiences count:", data.audiences?.length)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({
      success: true,
      campaignId,
      audiencesUpdated: data.audiences?.length,
    })
  } catch (error) {
    console.error("[v0] Step 2 API error:", error)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
