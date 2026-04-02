import { slugify } from "./studio-helpers";
import { createClient } from "./supabase/server";

export async function createWorkspaceForCurrentUser(name: string, ownerId: string) {
  const supabase = await createClient();

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      owner_id: ownerId,
      name,
      slug: `${slugify(name)}-${Date.now()}`,
      description: ""
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: ownerId,
    role: "owner"
  });

  return workspace;
}