import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const assets = [
      {
        id: "1",
        name: "Lea Beauty Logo - Primary",
        type: "logo",
        uploadDate: "Nov 1, 2025",
        url: "/placeholder.svg?height=200&width=200",
      },
      {
        id: "2",
        name: "Brand Guidelines 2025",
        type: "pdf",
        uploadDate: "Oct 28, 2025",
      },
    ];

    const description =
      "Lea Beauty is a global beauty company committed to innovation and sustainable beauty. Our mission is to offer all women and men across the world the best of what beauty can be.";

    return NextResponse.json({
      success: true,
      data: { assets, description },
    });
  } catch (error) {
    console.error("[v0] Error fetching brand assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch brand assets" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Simulated file upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const asset = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: type,
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    console.log("Asset uploaded:", asset);

    return NextResponse.json({
      success: true,
      message: "Asset uploaded successfully",
      asset,
    });
  } catch (error) {
    console.error("[v0] Error uploading asset:", error);
    return NextResponse.json({ success: false, error: "Failed to upload asset" }, { status: 500 });
  }
}
