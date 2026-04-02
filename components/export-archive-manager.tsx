"use client";

import { useActionState } from "react";
import { createExportArchiveAction } from "../app/actions/archives";

interface ExportArchiveManagerProps {
  workspaceId: string;
  archives: Array<{
    id: string;
    status: string;
    created_at?: string;
  }>;
}

const initialState = {
  ok: false,
  error: "",
  message: ""
};

export function ExportArchiveManager({
  workspaceId,
  archives
}: ExportArchiveManagerProps) {
  const [state, action, pending] = useActionState(createExportArchiveAction, initialState);

  return (
    <section className="panelCard">
      <div className="badge">Export archives</div>
      <h3>Export workspace history</h3>
      <p className="mutedText">
        Generate a simple archive manifest for this workspace.
      </p>

      <form action={action}>
        <input type="hidden" name="workspaceId" value={workspaceId} />

        <div className="heroActions">
          <button className="primaryButton" type="submit" disabled={pending}>
            {pending ? "Preparing..." : "Create archive"}
          </button>
        </div>

        {state?.error ? <p style={{ color: "#fda4af" }}>{state.error}</p> : null}
        {state?.message ? <p style={{ color: "#86efac" }}>{state.message}</p> : null}
      </form>

      <div className="stack" style={{ marginTop: 20 }}>
        {archives.length === 0 ? (
          <p className="mutedText">No archives yet.</p>
        ) : (
          archives.map((archive) => (
            <article className="miniCard" key={archive.id}>
              <strong>{archive.status}</strong>
              <p className="mutedText">
                {archive.created_at
                  ? new Date(archive.created_at).toLocaleString()
                  : ""}
              </p>
              <div className="heroActions">
                <a
                  className="secondaryButton"
                  href={`/api/export-archives/${archive.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download manifest
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}