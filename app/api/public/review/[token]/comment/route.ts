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

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        design_id: reviewLink.design_id,
        author_name: String(body?.authorName || "").trim() || "Reviewer",
        body: String(body?.body || "").trim()
      })
      .select("id,author_name,body,created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      comment
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to add comment."
      },
      { status: 500 }
    );
  }
}