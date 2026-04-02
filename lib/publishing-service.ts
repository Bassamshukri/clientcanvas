import { createAdminClient } from "./supabase/admin";

export async function processDuePublishJobs() {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: jobs, error } = await supabase
    .from("publish_jobs")
    .select("id,channel,caption,scheduled_for,status,design_id,workspace_id")
    .eq("status", "scheduled")
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true });

  if (error) {
    throw error;
  }

  let processed = 0;

  for (const job of jobs || []) {
    const { error: updateStartError } = await supabase
      .from("publish_jobs")
      .update({
        status: "processing"
      })
      .eq("id", job.id);

    if (updateStartError) {
      continue;
    }

    const fakeExternalId = `${job.channel}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const { error: finishError } = await supabase
      .from("publish_jobs")
      .update({
        status: "published",
        external_id: fakeExternalId,
        error_message: null
      })
      .eq("id", job.id);

    if (!finishError) {
      processed += 1;
    }
  }

  return {
    processed,
    found: jobs?.length || 0
  };
}