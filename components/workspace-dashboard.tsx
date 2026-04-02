"use client";

import Link from "next/link";
import { AssetLibrary } from "./asset-library";
import { BrandKitPanel } from "./brand-kit-panel";
import { CreateDesignForm } from "./create-design-form";

interface WorkspaceDashboardProps {
  workspace: {
    id: string;
    name: string;
    description: string;
  };
  designs: Array<{
    id: string;
    title: string;
    width: number;
    height: number;
    status: string;
    updated_at?: string;
  }>;
  assets: Array<{
    id: string;
    name: string;
    type: string;
    file_url: string;
    created_at?: string;
  }>;
}

export function WorkspaceDashboard({
  workspace,
  designs,
  assets
}: WorkspaceDashboardProps) {
  return (
    <div className="cardGrid">
      <CreateDesignForm workspaceId={workspace.id} />

      <section className="panelCard">
        <div className="badge">Designs</div>
        <h3>Workspace designs</h3>

        <div className="stack">
          {designs.length === 0 ? (
            <p className="mutedText">No designs yet. Create one to open the editor.</p>
          ) : (
            designs.map((design) => (
              <article key={design.id} className="miniCard">
                <strong>{design.title}</strong>
                <p className="mutedText">
                  {design.width} × {design.height} · {design.status}
                </p>
                <p className="mutedText">
                  Updated {design.updated_at ? new Date(design.updated_at).toLocaleString() : "unknown"}
                </p>
                <div className="heroActions">
                  <Link className="textLink" href={`/editor/${design.id}`}>
                    Open design
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <BrandKitPanel workspaceId={workspace.id} />

      <AssetLibrary workspaceId={workspace.id} assets={assets} />
    </div>
  );
}