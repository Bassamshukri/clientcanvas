import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function POST() {
  if (process.env.ENABLE_TEST_ROUTES !== "true") {
    return NextResponse.json(
      { ok: false, error: "Test routes are disabled." },
      { status: 403 }
    );
  }

  const supabase = createAdminClient();

  return NextResponse.json({
    ok: true,
    message: "Seed route scaffold is enabled.",
    timestamp: new Date().toISOString(),
    hasAdminClient: !!supabase
  });
}