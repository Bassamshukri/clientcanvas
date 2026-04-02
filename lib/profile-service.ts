import { createClient } from "./supabase/server";

export async function ensureProfile(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  const supabase = await createClient();

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : "";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email || "",
      full_name: fullName,
      avatar_url: avatarUrl
    },
    {
      onConflict: "id"
    }
  );

  if (error) {
    throw error;
  }
}