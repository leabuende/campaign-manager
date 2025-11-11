import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Simulated API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    console.log("[v0] Updating metrics for campaign:", id, body)

    return NextResponse.json({
      success: true,
      message: "Metrics updated successfully",
      campaignId: id,
      metrics: body,
    })
  } catch (error) {
    console.error("[v0] Error updating metrics:", error)
    return NextResponse.json({ success: false, error: "Failed to update metrics" }, { status: 500 })
  }
}
