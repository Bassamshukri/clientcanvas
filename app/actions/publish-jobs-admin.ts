"use server";

import { requireUser } from "../../lib/auth";
import { createClient } from "../../lib/supabase/server";

type PublishAdminState = {
  ok: boolean;
  error: string;
  message: string;
};

export async function cancelPublishJobAction(
  _prevState: PublishAdminState,
  formData: FormData
): Promise<PublishAdminState> {
  const user = await requireUser();
  const supabase = await createClient();

  const publishJobId = String(formData.get("publishJobId") || "").trim();

  if (!publishJobId) {
    return {
      ok: false,
      error: "Publish job ID is required.",
      message: ""
    };
  }

  const { data: job } = await supabase
    .from("publish_jobs")
    .select("id,workspace_id,status")
    .eq("id", publishJobId)
    .single();

  if (!job) {
    return {
      ok: false,
      error: "Publish job not found.",
      message: ""
    };
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", job.workspace_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return {
      ok: false,
      error: "You do not have access to this publish job.",
      message: ""
    };
  }

  if (job.status === "published") {
    return {
      ok: false,
      error: "Published jobs cannot be cancelled.",
      message: ""
    };
  }

  const { error } = await supabase
    .from("publish_jobs")
    .update({
      status: "cancelled"
    })
    .eq("id", publishJobId);

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
    message: "Publish job cancelled."
  };
}