"use server";

import { redirect } from "next/navigation";
import { requireUser } from "../../lib/auth";
import { createClient } from "../../lib/supabase/server";

export async function createDesignAction(state: any, formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const workspaceId = String(formData.get("workspaceId") || "").trim();
  const title = String(formData.get("title") || "").trim() || "Untitled design";
  const width = Number(formData.get("width") || 1080);
  const height = Number(formData.get("height") || 1080);

  if (!workspaceId) {
    return {
      ok: false,
      error: "Workspace ID is required."
    };
  }

  const { data: design, error } = await supabase
    .from("designs")
    .insert({
      workspace_id: workspaceId,
      title,
      width,
      height,
      status: "draft",
      created_by: user.id
    })
    .select("id")
    .single();

  if (error || !design) {
    return {
      ok: false,
      error: error?.message || "Failed to create design."
    };
  }

  redirect(`/editor/${design.id}`);
}