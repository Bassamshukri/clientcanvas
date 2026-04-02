import { createAdminClient } from "./supabase/admin";

export async function getPublicAssetUrl(bucket: string, path: string) {
  const supabase = createAdminClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}