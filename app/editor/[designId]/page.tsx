import { notFound } from "next/navigation";
import { AppHeader } from "../../../components/app-header";
import { PublishManager } from "../../../components/publish-manager";
import { ReviewLinkManager } from "../../../components/review-link-manager";
import { DynamicEditorShell } from "../../../components/dynamic-editor-shell";
import { requireUser } from "../../../lib/auth";
import { createClient } from "../../../lib/supabase/server";
import { isUuid } from "../../../lib/studio-client";

interface EditorPageProps {
  params: Promise<{
    designId: string;
  }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await requireUser();
  const { designId } = await params;

  if (!isUuid(designId)) {
    return (
      <main className="shell">
        <AppHeader
          title="Local demo editor"
          subtitle="This is the local-only demo canvas."
          email={user.email || ""}
        />
        <div style={{ marginTop: 20 }}>
          <DynamicEditorShell designId={designId} />
        </div>
      </main>
    );
  }

  const supabase = await createClient();

  const { data: design } = await supabase
    .from("designs")
    .select("id,title,workspace_id")
    .eq("id", designId)
    .single();

  if (!design) {
    notFound();
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", design.workspace_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    notFound();
  }

  const { data: reviewLinks } = await supabase
    .from("review_links")
    .select("id,token,status,expires_at,created_at")
    .eq("design_id", designId)
    .order("created_at", { ascending: false });

  const { data: publishJobs } = await supabase
    .from("publish_jobs")
    .select("id,channel,caption,scheduled_for,status,external_id,error_message,created_at")
    .eq("design_id", designId)
    .order("scheduled_for", { ascending: false });

  return (
    <main className="shell">
      <AppHeader
        title={design.title || "Editor"}
        subtitle="Create, save, review, and schedule this design."
        email={user.email || ""}
      />

      <div style={{ marginTop: 20 }}>
        <DynamicEditorShell designId={designId} />
      </div>

      <div style={{ marginTop: 20 }}>
        <ReviewLinkManager
          designId={designId}
          reviewLinks={(reviewLinks || []) as Array<{
            id: string;
            token: string;
            status: string;
            expires_at?: string | null;
            created_at?: string;
          }>}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <PublishManager
          designId={designId}
          jobs={(publishJobs || []) as Array<{
            id: string;
            channel: string;
            caption: string;
            scheduled_for: string;
            status: string;
            external_id?: string | null;
            error_message?: string | null;
            created_at?: string;
          }>}
        />
      </div>
    </main>
  );
}