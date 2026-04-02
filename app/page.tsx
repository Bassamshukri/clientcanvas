export const dynamic = "force-dynamic";

import Link from "next/link";
import { DashboardHome } from "../components/dashboard-home";
import { getCurrentUser } from "../lib/auth";
import { ensureProfile } from "../lib/profile-service";
import { createClient } from "../lib/supabase/server";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "var(--bg)", 
        backgroundImage: "var(--bg-dots)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <main style={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
          <section className="glass-card" style={{ padding: "80px 40px", position: "relative", overflow: "hidden" }}>
            {/* Ambient Strategic Glow */}
            <div style={{ 
              position: "absolute", top: "-50%", left: "-50%", 
              width: "200%", height: "200%", 
              background: "radial-gradient(circle, rgba(139,61,255,0.08) 0%, transparent 50%)",
              pointerEvents: "none"
            }} />

            <div className="badge" style={{ marginBottom: "24px" }}>Strategic Operating System</div>
            <h1 style={{ marginBottom: "24px", letterSpacing: "-0.04em" }}>
              Design, review, and <span style={{ color: "var(--primary)" }}>publish</span> in one high-fidelity workflow.
            </h1>
            <p className="muted-text" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto 40px", lineHeight: "1.6" }}>
              ClientCanvas is the professional strategist's workspace for rapid design iteration, 
              live stake-holder review, and automated publishing.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <Link className="btn-pro btn-primary" href="/login" style={{ padding: "16px 40px", fontSize: "16px" }}>
                Enter Workspace
              </Link>
              <a className="btn-pro btn-secondary" href="https://github.com" target="_blank" rel="noreferrer" style={{ padding: "16px 40px", fontSize: "16px" }}>
                Documentation
              </a>
            </div>
          </section>
          
          <p style={{ marginTop: "32px", fontSize: "12px", color: "var(--text-muted)", opacity: 0.5 }}>
            v0.2.0 • Secured by Supabase Strategic Auth
          </p>
        </main>
      </div>
    );
  }

  await ensureProfile({
    id: user.id,
    email: user.email,
    user_metadata: user.user_metadata
  });

  const supabase = await createClient();
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id);

  const workspaceIds = (memberships || []).map((item) => item.workspace_id);

  let workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
  }> = [];

  if (workspaceIds.length > 0) {
    const { data } = await supabase
      .from("workspaces")
      .select("id,name,slug,description")
      .in("id", workspaceIds)
      .order("created_at", { ascending: false });

    workspaces = (data || []) as Array<{
      id: string;
      name: string;
      slug: string;
      description: string;
    }>;
  }

  return (
    <DashboardHome
      userEmail={user.email || "unknown user"}
      workspaces={workspaces}
    />
  );
}