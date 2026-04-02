import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../../lib/supabase/admin";

interface RouteContext {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { token } = await context.params;
  const supabase = createAdminClient();

  const { data: reviewLink, error } = await supabase
    .from("review_links")
    .select("id,token,status,expires_at,design_id")
    .eq("token", token)
    .maybeSingle();

  if (error || !reviewLink || reviewLink.status !== "active") {
    return NextResponse.json(
      { ok: false, error: "Review link not found." },
      { status: 404 }
    );
  }

  const { data: design } = await supabase
    .from("designs")
    .select("id,title,status")
    .eq("id", reviewLink.design_id)
    .single();

  const { data: comments } = await supabase
    .from("comments")
    .select("id,author_name,body,created_at")
    .eq("design_id", reviewLink.design_id)
    .order("created_at", { ascending: false });

  const { data: decisions } = await supabase
    .from("review_decisions")
    .select("id,decision,reviewer_name,notes,created_at")
    .eq("review_link_id", reviewLink.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    ok: true,
    reviewLink,
    design,
    comments: comments || [],
    decisions: decisions || []
  });
}