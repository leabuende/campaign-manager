import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_PATH = path.join(process.cwd(), "public/uploads");
const PUBLIC_URL_PREFIX = "/uploads";

export async function GET(req: NextRequest) {
  try {
    const folders = fs
      .readdirSync(UPLOADS_PATH, { withFileTypes: true })
      .filter((f) => f.isDirectory())
      .map((dir) => {
        const folderPath = path.join(UPLOADS_PATH, dir.name);

        let files: { name: string; url: string }[] = [];

        const items = fs.readdirSync(folderPath, { withFileTypes: true });
        for (const item of items) {
          const itemPath = path.join(folderPath, item.name);

          if (item.isFile() && item.name.endsWith(".png")) {
            files.push({ name: item.name, url: `${PUBLIC_URL_PREFIX}/${dir.name}/${item.name}` });
          }

          if (item.isDirectory()) {
            const subFiles = fs
              .readdirSync(itemPath, { withFileTypes: true })
              .filter((f) => f.isFile() && f.name.endsWith(".png"))
              .map((f) => ({
                name: f.name,
                url: `${PUBLIC_URL_PREFIX}/${dir.name}/${item.name}/${f.name}`,
              }));

            files.push(...subFiles);
          }
        }

        return {
          id: dir.name,
          name: dir.name,
          files,
          metrics: { reach: 0, roi: 0, audienceMatch: 0 },
        };
      });

    return NextResponse.json({ success: true, data: folders });
  } catch (error) {
    console.error("Error reading uploads folder:", error);
    return NextResponse.json({ success: false, error: "Failed to read uploads" }, { status: 500 });
  }
}
