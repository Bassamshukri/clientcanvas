import { notFound } from "next/navigation";
import { ActivityFeed } from "../../../components/activity-feed";
import { AppHeader } from "../../../components/app-header";
import { ExportArchiveManager } from "../../../components/export-archive-manager";
import { WorkspaceDashboard } from "../../../components/workspace-dashboard";
import { requireUser } from "../../../lib/auth";
import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";
import { ChevronLeft, Layout } from "lucide-react";

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
      title: `Project: ${item.title || "Untitled Intelligence"}`,
      subtitle: `Status: ${item.status.toUpperCase()}`,
      createdAt: item.created_at || item.updated_at || new Date().toISOString()
    })),
    ...(reviewLinks || []).map((item) => ({
      id: `review-${item.id}`,
      kind: "review_link" as const,
      title: "Review Protocol Initialized",
      subtitle: `Current Status: ${item.status}`,
      createdAt: item.created_at || new Date().toISOString()
    })),
    ...(publishJobs || []).map((item) => ({
      id: `publish-${item.id}`,
      kind: "publish_job" as const,
      title: `Deployment: ${item.channel.toUpperCase()}`,
      subtitle: `Status Code: ${item.status}`,
      createdAt: item.created_at || new Date().toISOString()
    })),
    ...(archives || []).map((item) => ({
      id: `archive-${item.id}`,
      kind: "archive" as const,
      title: "Snapshot Synchronized",
      subtitle: `Archive Status: ${item.status}`,
      createdAt: item.created_at || new Date().toISOString()
    }))
  ]
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, 12);

  return (
    <main className="shell animate-reveal">
      <div style={{ marginBottom: "20px" }}>
        <Link 
          href="/dashboard" 
          className="btn-pro btn-secondary" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            opacity: 0.8
          }}
        >
          <ChevronLeft size={16} /> Command Center
        </Link>
      </div>

      <AppHeader
        title={workspace.name}
        subtitle={workspace.description || "Workspace Central Command"}
        email={user.email || ""}
      />

      <div className="workspace-main-content" style={{ marginTop: 32 }}>
        <WorkspaceDashboard
          workspace={workspace}
          designs={(designs || []) as any}
          assets={(assets || []) as any}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
        <ActivityFeed items={activityItems} />
        
        <ExportArchiveManager
          workspaceId={workspace.id}
          archives={(archives || []) as any}
        />
      </div>
    </main>
  );
}