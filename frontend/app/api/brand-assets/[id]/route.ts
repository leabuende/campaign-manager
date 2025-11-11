import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Simulated API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    console.log("[v0] Asset deleted:", id)

    return NextResponse.json({
      success: true,
      message: "Asset deleted successfully",
      assetId: id,
    })
  } catch (error) {
    console.error("[v0] Error deleting asset:", error)
    return NextResponse.json({ success: false, error: "Failed to delete asset" }, { status: 500 })
  }
}
