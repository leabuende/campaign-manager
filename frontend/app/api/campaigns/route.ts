import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Simulated API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const campaigns = [
      {
        id: "camp-001",
        name: "Summer Collection 2025",
        date: "Nov 15, 2025",
        files: [
          {
            id: "f1",
            name: "hero_image_1x1.png",
            type: "image",
            url: "/luxury-beauty-product.jpg",
          },
          {
            id: "f2",
            name: "hero_image_3x4.png",
            type: "image",
            url: "/luxury-beauty-product.jpg",
          },
          {
            id: "f3",
            name: "campaign_brief.txt",
            type: "text",
            content:
              "Target audiences: Women 25-45\nTheme: Summer luxury collection\nKey message: Natural beauty enhancement",
          },
        ],
        metrics: { reach: 125000, roi: 340, audienceMatch: 92 },
      },
      {
        id: "camp-002",
        name: "Luxury Line Launch",
        date: "Nov 8, 2025",
        files: [
          {
            id: "f4",
            name: "luxury_pack_1x1.png",
            type: "image",
            url: "/luxury-packaging.jpg",
          },
          {
            id: "f5",
            name: "campaign_brief.txt",
            type: "text",
            content: "Premium product launch\nTarget: Luxury seekers aged 35+\nBudget: High-end positioning",
          },
        ],
        metrics: { reach: 89000, roi: 285, audienceMatch: 88 },
      },
    ]

    return NextResponse.json({ success: true, data: campaigns })
  } catch (error) {
    console.error("[v0] Error fetching campaigns:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
