import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      provider: "linkedin",
      message: "LinkedIn login is temporarily disabled during setup."
    },
    { status: 503 }
  );
}