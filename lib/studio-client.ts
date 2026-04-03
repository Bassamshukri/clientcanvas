import { createBrowserSupabaseClient } from "./supabase/browser";

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getDesignById(designId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .eq("id", designId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateDesignById(
  designId: string,
  payload: {
    title?: string;
    status?: string;
    canvas_json?: unknown;
    width?: number;
    height?: number;
  }
) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("designs")
    .update(payload)
    .eq("id", designId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listCommentsByDesignId(designId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("design_id", designId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function addCommentToDesign(
  designId: string,
  payload: {
    author_name: string;
    body: string;
  }
) {
  const supabase = createBrowserSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      design_id: designId,
      user_id: user?.id || null,
      author_name: payload.author_name,
      body: payload.body
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function resolveComment(commentId: string, resolved: boolean) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("comments")
    .update({ is_resolved: resolved })
    .eq("id", commentId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAsset(workspaceId: string, file: File) {
  const supabase = createBrowserSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const fileExt = file.name.split(".").pop();
  const filePath = `${workspaceId}/${Math.random()}.${fileExt}`;

  // 1. Upload to storage
  try {
    const { error: uploadError } = await supabase.storage
      .from("workspace-assets")
      .upload(filePath, file);

    if (uploadError) {
       console.error("Supabase Storage Error:", uploadError);
       if (uploadError.message.includes("bucket not found")) {
          throw new Error("STRATEGIC_STORAGE_MISSING: The 'workspace-assets' bucket has not been provisioned in Supabase.");
       }
       throw uploadError;
    }
  } catch (err: any) {
     if (err.message.includes("STRATEGIC_STORAGE_MISSING")) throw err;
     throw new Error(`UPLOAD_PROTOCOL_FAILURE: ${err.message || "Unknown Network Error"}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("workspace-assets")
    .getPublicUrl(filePath);

  // 2. Insert into assets table
  const { data, error } = await supabase
    .from("assets")
    .insert({
      workspace_id: workspaceId,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "other",
      file_url: publicUrl,
      created_by: user?.id
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listAssets(workspaceId: string) {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}