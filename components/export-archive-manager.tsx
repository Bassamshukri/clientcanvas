"use client";

import { useActionState } from "react";
import { createExportArchiveAction } from "../app/actions/archives";
import { Archive, Download, Database, ChevronRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <section className="glass-card panelCard animate-reflow" style={{ animationDelay: "0.3s" }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="badge">Data Integrity</div>
          <h3 style={{ marginTop: "12px", fontSize: "20px", fontWeight: "700" }}>Fleet Archives</h3>
          <p className="muted-text">Snapshot and extract workspace manifests for offline retrieval.</p>
        </div>
        <form action={action}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <button className="btn-pro btn-primary" type="submit" disabled={pending}>
            {pending ? "Snapshotting..." : (
               <><Database size={16} style={{ marginRight: 8 }} /> Create Archive</>
            )}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {state?.error && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: 8, marginBottom: 20, border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: 10 }}>
            <AlertCircle size={16} color="var(--danger)" />
            <p style={{ color: "#fca5a5", fontSize: "13px", margin: 0 }}>{state.error}</p>
          </motion.div>
        )}
        {state?.message && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ padding: "12px", background: "rgba(34, 197, 94, 0.1)", borderRadius: 8, marginBottom: 20, border: "1px solid rgba(34, 197, 94, 0.2)", display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <p style={{ color: "#86efac", fontSize: "13px", margin: 0 }}>{state.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stack" style={{ gap: "10px" }}>
        {archives.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", background: "rgba(255,255,255,0.01)", borderRadius: "12px", border: "1px dashed var(--border)" }}>
             <Archive size={32} style={{ marginBottom: 12, opacity: 0.2 }} />
             <p className="muted-text">Zero archives registered in the current sector.</p>
          </div>
        ) : (
          archives.map((archive) => (
            <article className="archive-entry" key={archive.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                 <div className="archive-icon-box">
                    <Archive size={16} />
                 </div>
                 <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                       <span style={{ fontSize: "14px", fontWeight: "700" }}>Manifest: {archive.id.slice(0,8).toUpperCase()}</span>
                       <span className={`badge-status ${archive.status.toLowerCase()}`}>{archive.status}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px" }} className="muted-text">
                       <Clock size={10} />
                       {archive.created_at ? new Date(archive.created_at).toLocaleString() : "Recently synchronized"}
                    </div>
                 </div>
              </div>
              <a
                className="btn-pro btn-secondary"
                href={`/api/export-archives/${archive.id}/download`}
                target="_blank"
                rel="noreferrer"
                style={{ height: "36px", padding: "0 16px" }}
              >
                <Download size={14} style={{ marginRight: 8 }} /> Download
              </a>
            </article>
          ))
        )}
      </div>

      <style jsx>{`
        .archive-entry {
           background: rgba(255,255,255,0.02);
           border: 1px solid var(--border);
           border-radius: 12px;
           padding: 12px 16px;
           display: flex;
           align-items: center;
           justify-content: space-between;
           transition: 0.2s;
        }
        .archive-entry:hover {
           border-color: var(--primary-glow);
           background: rgba(255,255,255,0.04);
        }
        .archive-icon-box {
           width: 36px;
           height: 36px;
           background: rgba(255,255,255,0.05);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--text-muted);
        }
        .badge-status {
           font-size: 10px;
           font-weight: 800;
           padding: 2px 8px;
           border-radius: 4px;
           text-transform: uppercase;
           background: rgba(255,255,255,0.05);
        }
        .badge-status.completed { color: var(--success); background: rgba(0,200,150,0.1); }
        .badge-status.pending { color: var(--warning); background: rgba(245,158,11,0.1); }
      `}</style>
    </section>
  );
}