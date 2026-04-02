import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      provider: "meta",
      message: "Meta login is temporarily disabled during setup."
    },
    { status: 503 }
  );
}