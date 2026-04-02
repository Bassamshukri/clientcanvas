import Link from "next/link";
import { DashboardHome } from "../components/dashboard-home";
import { getCurrentUser } from "../lib/auth";
import { ensureProfile } from "../lib/profile-service";
import { createClient } from "../lib/supabase/server";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="shell">
        <section className="heroCard">
          <div className="badge">ClientCanvas</div>
          <h1>Design, review, approve, and publish in one workflow.</h1>
          <p className="heroText">
            ClientCanvas is now wired for working email login. Sign in to create workspaces
            and designs.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="/login">
              Open login
            </Link>
          </div>
        </section>
      </main>
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