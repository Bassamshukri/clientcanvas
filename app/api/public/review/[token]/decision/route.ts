import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../../../lib/supabase/admin";

interface RouteContext {
  params: Promise<{
    token: string;
  }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const body = await request.json();
    const supabase = createAdminClient();

    const { data: reviewLink, error: reviewError } = await supabase
      .from("review_links")
      .select("id,design_id,status")
      .eq("token", token)
      .maybeSingle();

    if (reviewError || !reviewLink || reviewLink.status !== "active") {
      return NextResponse.json(
        { ok: false, error: "Review link not found." },
        { status: 404 }
      );
    }

    const decision = String(body?.decision || "").trim();

    if (decision !== "approved" && decision !== "needs_changes") {
      return NextResponse.json(
        { ok: false, error: "Invalid decision." },
        { status: 400 }
      );
    }

    const { data: decisionRecord, error } = await supabase
      .from("review_decisions")
      .insert({
        review_link_id: reviewLink.id,
        decision,
        reviewer_name: String(body?.reviewerName || "").trim() || "Reviewer",
        notes: String(body?.notes || "").trim()
      })
      .select("id,decision,reviewer_name,notes,created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    await supabase
      .from("designs")
      .update({
        status: decision === "approved" ? "approved" : "needs_changes"
      })
      .eq("id", reviewLink.design_id);

    return NextResponse.json({
      ok: true,
      decisionRecord
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to submit decision."
      },
      { status: 500 }
    );
  }
}