"use server";

import { requireUser } from "../../lib/auth";
import { createClient } from "../../lib/supabase/server";

type ArchiveActionState = {
  ok: boolean;
  error: string;
  message: string;
};

export async function createExportArchiveAction(
  _prevState: ArchiveActionState,
  formData: FormData
): Promise<ArchiveActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const workspaceId = String(formData.get("workspaceId") || "").trim();

  if (!workspaceId) {
    return {
      ok: false,
      error: "Workspace ID is required.",
      message: ""
    };
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return {
      ok: false,
      error: "You do not have access to this workspace.",
      message: ""
    };
  }

  const { error } = await supabase.from("export_archives").insert({
    workspace_id: workspaceId,
    requested_by: user.id,
    status: "ready",
    file_url: null
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
    message: "Archive prepared."
  };
}