import { notFound } from "next/navigation";
import { ActivityFeed } from "../../../components/activity-feed";
import { AppHeader } from "../../../components/app-header";
import { ExportArchiveManager } from "../../../components/export-archive-manager";
import { WorkspaceDashboard } from "../../../components/workspace-dashboard";
import { requireUser } from "../../../lib/auth";
import { createClient } from "../../../lib/supabase/server";

interface WorkspacePageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const user = await requireUser();
  const { workspaceId } = await params;
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    notFound();
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id,name,description")
    .eq("id", workspaceId)
    .single();

  if (!workspace) {
    notFound();
  }

  const { data: designs } = await supabase
    .from("designs")
    .select("id,title,width,height,status,updated_at,created_at")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });

  const { data: assets } = await supabase
    .from("assets")
    .select("id,name,type,file_url,created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  const { data: archives } = await supabase
    .from("export_archives")
    .select("id,status,created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  const { data: reviewLinks } = await supabase
    .from("review_links")
    .select("id,status,created_at,design_id")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: publishJobs } = await supabase
    .from("publish_jobs")
    .select("id,channel,status,created_at,design_id,workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(10);

  const activityItems = [
    ...(designs || []).slice(0, 10).map((item) => ({
      id: `design-${item.id}`,
      kind: "design" as const,
      title: `Design: ${item.title || item.id}`,
      subtitle: `Status: ${item.status}`,
      createdAt: item.created_at || item.updated_at || new Date().toISOString()
    })),
    ...(reviewLinks || []).map((item) => ({
      id: `review-${item.id}`,
      kind: "review_link" as const,
      title: "Review link created",
      subtitle: `Status: ${item.status}`,
      createdAt: item.created_at || new Date().toISOString()
    })),
    ...(publishJobs || []).map((item) => ({
      id: `publish-${item.id}`,
      kind: "publish_job" as const,
      title: `Publish job: ${item.channel}`,
      subtitle: `Status: ${item.status}`,
      createdAt: item.created_at || new Date().toISOString()
    })),
    ...(archives || []).map((item) => ({
      id: `archive-${item.id}`,
      kind: "archive" as const,
      title: "Archive created",
      subtitle: `Status: ${item.status}`,
      createdAt: item.created_at || new Date().toISOString()
    }))
  ]
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 12);

  return (
    <main className="shell">
      <AppHeader
        title={workspace.name}
        subtitle={workspace.description || "Workspace dashboard"}
        email={user.email || ""}
      />

      <div style={{ marginTop: 20 }}>
        <WorkspaceDashboard
          workspace={workspace}
          designs={(designs || []) as Array<{
            id: string;
            title: string;
            width: number;
            height: number;
            status: string;
            updated_at?: string;
          }>}
          assets={(assets || []) as Array<{
            id: string;
            name: string;
            type: string;
            file_url: string;
            created_at?: string;
          }>}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <ActivityFeed items={activityItems} />
      </div>

      <div style={{ marginTop: 20 }}>
        <ExportArchiveManager
          workspaceId={workspace.id}
          archives={(archives || []) as Array<{
            id: string;
            status: string;
            created_at?: string;
          }>}
        />
      </div>
    </main>
  );
}