"use server";

import { requireUser } from "../../lib/auth";
import { createClient } from "../../lib/supabase/server";

type PublishActionState = {
  ok: boolean;
  error: string;
  message: string;
};

export async function schedulePublishAction(
  _prevState: PublishActionState,
  formData: FormData
): Promise<PublishActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const designId = String(formData.get("designId") || "").trim();
  const channel = String(formData.get("channel") || "").trim();
  const caption = String(formData.get("caption") || "").trim();
  const scheduledFor = String(formData.get("scheduledFor") || "").trim();

  if (!designId || !channel || !scheduledFor) {
    return {
      ok: false,
      error: "Design, channel, and scheduled time are required.",
      message: ""
    };
  }

  if (!["linkedin", "facebook", "instagram"].includes(channel)) {
    return {
      ok: false,
      error: "Invalid channel.",
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

  const { error } = await supabase.from("publish_jobs").insert({
    design_id: designId,
    workspace_id: design.workspace_id,
    channel,
    caption,
    scheduled_for: new Date(scheduledFor).toISOString(),
    requested_by: user.id,
    status: "scheduled"
  });

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
    message: "Publish job scheduled."
  };
}