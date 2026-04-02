"use server";

import { redirect } from "next/navigation";
import { requireUser } from "../../lib/auth";
import { createClient } from "../../lib/supabase/server";
import { slugify } from "../../lib/studio-helpers";

export async function createWorkspaceAction(state: any, formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name) {
    return {
      ok: false,
      error: "Workspace name is required."
    };
  }

  const slugBase = slugify(name) || "workspace";
  const slug = `${slugBase}-${Date.now()}`;

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      owner_id: user.id,
      name,
      slug,
      description
    })
    .select("id")
    .single();

  if (error || !workspace) {
    return {
      ok: false,
      error: error?.message || "Failed to create workspace."
    };
  }

  const { error: memberError } = await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner"
  });

  if (memberError) {
    return {
      ok: false,
      error: memberError.message
    };
  }

  redirect(`/workspaces/${workspace.id}`);
}