import { type NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: "No description provided" },
        { status: 400 },
      );
    }

    // Simulated API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    console.log("Description updated:", description);

    return NextResponse.json({
      success: true,
      message: "Description updated successfully",
      description,
    });
  } catch (error) {
    console.error("[v0] Error updating description:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update description" },
      { status: 500 },
    );
  }
}
