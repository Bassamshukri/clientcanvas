"use server";

import { requireUser } from "../../lib/auth";
import { createClient } from "../../lib/supabase/server";

type ReviewAdminState = {
  ok: boolean;
  error: string;
  message: string;
};

export async function revokeReviewLinkAction(
  _prevState: ReviewAdminState,
  formData: FormData
): Promise<ReviewAdminState> {
  const user = await requireUser();
  const supabase = await createClient();

  const reviewLinkId = String(formData.get("reviewLinkId") || "").trim();

  if (!reviewLinkId) {
    return {
      ok: false,
      error: "Review link ID is required.",
      message: ""
    };
  }

  const { data: reviewLink } = await supabase
    .from("review_links")
    .select("id,design_id")
    .eq("id", reviewLinkId)
    .single();

  if (!reviewLink) {
    return {
      ok: false,
      error: "Review link not found.",
      message: ""
    };
  }

  const { data: design } = await supabase
    .from("designs")
    .select("id,workspace_id")
    .eq("id", reviewLink.design_id)
    .single();

  if (!design) {
    return {
      ok: false,
      error: "Design not found.",
      message: ""
    };
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", design.workspace_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return {
      ok: false,
      error: "You do not have access to this review link.",
      message: ""
    };
  }

  const { error } = await supabase
    .from("review_links")
    .update({ status: "revoked" })
    .eq("id", reviewLinkId);

  if (error) {
    return {
      ok: false,
      error: error.message,
      message: ""
    };
  }

  return {
    ok: true,
    error: "",
    message: "Review link revoked."
  };
}