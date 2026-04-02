import { createClient } from "./supabase/server";

export async function uploadWorkspaceAsset(params: {
  workspaceId: string;
  file: File;
  createdBy?: string | null;
}) {
  const supabase = await createClient();

  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${params.workspaceId}/${Date.now()}-${safeName}`;

  const arrayBuffer = await params.file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("workspace-assets")
    .upload(path, buffer, {
      contentType: params.file.type || "application/octet-stream",
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("workspace-assets")
    .getPublicUrl(path);

  const fileUrl = publicUrlData.publicUrl;

  const { data: asset, error: insertError } = await supabase
    .from("assets")
    .insert({
      workspace_id: params.workspaceId,
      name: params.file.name,
      type: params.file.type || "image",
      file_url: fileUrl,
      created_by: params.createdBy || null
    })
    .select("*")
    .single();

  if (insertError) {
    throw insertError;
  }

  return asset;
}