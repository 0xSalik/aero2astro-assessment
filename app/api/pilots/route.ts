import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "app/api/pilots/pilots.json");
  const fileContents = await fs.promises.readFile(filePath, "utf8");
  const pilots = JSON.parse(fileContents);

  return NextResponse.json(pilots);
}
