"use client";

import Link from "next/link";
import { AppHeader } from "./app-header";
import { CreateWorkspaceForm } from "./create-workspace-form";

interface DashboardHomeProps {
  userEmail: string;
  workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
  }>;
}

export function DashboardHome({ userEmail, workspaces }: DashboardHomeProps) {
  return (
    <main className="shell">
      <AppHeader
        title="Dashboard"
        subtitle="Create workspaces and jump into designs."
        email={userEmail}
        showBackHome={false}
      />

      <div className="cardGrid" style={{ marginTop: 20 }}>
        <CreateWorkspaceForm />

        <section className="panelCard">
          <div className="badge">Quick links</div>
          <h3>Start fast</h3>
          <div className="stack">
            <Link className="secondaryButton" href="/workspaces/demo-workspace">
              Open local demo workspace
            </Link>
            <Link className="secondaryButton" href="/editor/demo-design">
              Open local demo editor
            </Link>
          </div>
        </section>

        {workspaces.length === 0 ? (
          <section className="panelCard">
            <h3>No workspaces yet</h3>
            <p className="mutedText">
              Create your first workspace, then create a design inside it.
            </p>
          </section>
        ) : (
          workspaces.map((workspace) => (
            <section className="panelCard" key={workspace.id}>
              <div className="badge">Workspace</div>
              <h3>{workspace.name}</h3>
              <p className="mutedText">{workspace.description || "No description yet."}</p>
              <Link className="primaryButton" href={`/workspaces/${workspace.id}`}>
                Open workspace
              </Link>
            </section>
          ))
        )}
      </div>
    </main>
  );
}