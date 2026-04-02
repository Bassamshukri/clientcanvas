"use client";

import { useActionState } from "react";
import { createDesignAction } from "../app/actions/designs";
import { Plus, Maximize, Layout, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateDesignFormProps {
  workspaceId: string;
}

const initialState = {
  ok: false,
  error: ""
};

export function CreateDesignForm({ workspaceId }: CreateDesignFormProps) {
  const [state, action, pending] = useActionState(createDesignAction, initialState);

  return (
    <div className="glass-card panelCard animate-reflow">
      <div style={{ marginBottom: "24px" }}>
        <div className="badge">New Fleet</div>
        <h3 style={{ marginTop: "12px", fontSize: "20px", fontWeight: "700" }}>Initialize Design</h3>
        <p className="muted-text">Deploy a new high-fidelity strategic design perimeter.</p>
      </div>

      <form action={action} className="stack" style={{ gap: "20px" }}>
        <input type="hidden" name="workspaceId" value={workspaceId} />

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
          <div className="form-field">
            <label>Strategic Title</label>
            <input name="title" placeholder="Spring Launch Campaign" required />
          </div>

          <div className="form-field">
            <label>Width (PX)</label>
            <input name="width" type="number" defaultValue="1080" min="100" />
          </div>

          <div className="form-field">
            <label>Height (PX)</label>
            <input name="height" type="number" defaultValue="1080" min="100" />
          </div>
        </div>

        <div style={{ marginTop: "8px" }}>
          <button className="btn-pro btn-primary" type="submit" disabled={pending} style={{ width: "100%", padding: "14px" }}>
            {pending ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", marginRight: 10 }} />
                Calibrating...
              </>
            ) : (
              <>
                <Plus size={18} style={{ marginRight: "10px" }} /> Create Strategic Design <ChevronRight size={16} style={{ marginLeft: "8px", opacity: 0.5 }} />
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {state?.error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: 8, marginTop: 4, border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: 10 }}>
              <AlertCircle size={16} color="var(--danger)" />
              <p style={{ color: "#fca5a5", fontSize: "13px", margin: 0 }}>{state.error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      
      <style jsx>{`
        .form-field label {
           fontSize: 11px;
           fontWeight: 700;
           color: var(--text-muted);
           display: block;
           marginBottom: 8px;
           textTransform: uppercase;
           letterSpacing: 0.05em;
        }
        .form-field input {
           width: 100%;
           background: rgba(255,255,255,0.03);
           border: 1px solid var(--border);
           borderRadius: 10px;
           padding: 12px;
           color: white;
           outline: none;
           transition: 0.2s;
        }
        .form-field input:focus {
           border-color: var(--primary);
           box-shadow: 0 0 0 3px var(--primary-glow);
        }
      `}</style>
    </div>
  );
}