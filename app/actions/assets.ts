"use server";

import { requireUser } from "../../lib/auth";
import { uploadWorkspaceAsset } from "../../lib/storage-service";
import { createClient } from "../../lib/supabase/server";

type AssetActionState = {
  ok: boolean;
  error: string;
  message: string;
};

export async function uploadAssetAction(
  _prevState: AssetActionState,
  formData: FormData
): Promise<AssetActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const workspaceId = String(formData.get("workspaceId") || "").trim();
  const file = formData.get("file");

  if (!workspaceId) {
    return {
      ok: false,
      error: "Workspace ID is required.",
      message: ""
    };
  }

  if (!(file instanceof File) || !file.name) {
    return {
      ok: false,
      error: "Please choose a file.",
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

  try {
    await uploadWorkspaceAsset({
      workspaceId,
      file,
      createdBy: user.id
    });

    return {
      ok: true,
      error: "",
      message: "Asset uploaded successfully."
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to upload asset.",
      message: ""
    };
  }
}