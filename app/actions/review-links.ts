"use server";

import { requireUser } from "../../lib/auth";
import { generateReviewToken, getDefaultReviewExpiry } from "../../lib/review-links";
import { createClient } from "../../lib/supabase/server";

type ReviewLinkActionState = {
  ok: boolean;
  error: string;
  message: string;
};

export async function createReviewLinkAction(
  _prevState: ReviewLinkActionState,
  formData: FormData
): Promise<ReviewLinkActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const designId = String(formData.get("designId") || "").trim();
  const expiresInDays = Number(formData.get("expiresInDays") || 7);

  if (!designId) {
    return {
      ok: false,
      error: "Design ID is required.",
      message: ""
    };
  }

  const { data: design, error: designError } = await supabase
    .from("designs")
    .select("id,workspace_id")
    .eq("id", designId)
    .single();

  if (designError || !design) {
    return {
      ok: false,
      error: designError?.message || "Design not found.",
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
      error: "You do not have access to this design.",
      message: ""
    };
  }

  const token = generateReviewToken();

  const { error } = await supabase.from("review_links").insert({
    design_id: designId,
    token,
    status: "active",
    expires_at: getDefaultReviewExpiry(Number.isFinite(expiresInDays) ? expiresInDays : 7),
    created_by: user.id
  });

  if (error) {
    return {
      ok: false,
      error: error.message,
      message: ""
    };
  }

  await supabase
    .from("designs")
    .update({ status: "in_review" })
    .eq("id", designId);

  return {
    ok: true,
    error: "",
    message: "Review link created."
  };
}