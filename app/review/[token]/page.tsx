import { notFound } from "next/navigation";
import { PublicReviewClient } from "../../../components/public-review-client";
import { createAdminClient } from "../../../lib/supabase/admin";

interface ReviewPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: reviewLink } = await supabase
    .from("review_links")
    .select("id,token,status,design_id")
    .eq("token", token)
    .maybeSingle();

  if (!reviewLink || reviewLink.status !== "active") {
    notFound();
  }

  const { data: design } = await supabase
    .from("designs")
    .select("id,title,status")
    .eq("id", reviewLink.design_id)
    .single();

  if (!design) {
    notFound();
  }

  const { data: comments } = await supabase
    .from("comments")
    .select("id,author_name,body,created_at")
    .eq("design_id", design.id)
    .order("created_at", { ascending: false });

  const { data: decisions } = await supabase
    .from("review_decisions")
    .select("id,decision,reviewer_name,notes,created_at")
    .eq("review_link_id", reviewLink.id)
    .order("created_at", { ascending: false });

  return (
    <PublicReviewClient
      token={token}
      design={{
        id: design.id,
        title: design.title || "Untitled design",
        status: design.status || "draft"
      }}
      comments={(comments || []) as Array<{
        id: string;
        author_name?: string | null;
        body: string;
        created_at?: string;
      }>}
      decisions={(decisions || []) as Array<{
        id: string;
        decision: string;
        reviewer_name?: string | null;
        notes?: string | null;
        created_at?: string;
      }>}
    />
  );
}