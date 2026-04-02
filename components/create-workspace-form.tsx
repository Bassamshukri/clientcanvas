"use client";

import { useActionState } from "react";
import { createWorkspaceAction } from "../app/actions/workspaces";
import { Plus, Briefcase, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
  ok: false,
  error: ""
};

export function CreateWorkspaceForm() {
  const [state, action, pending] = useActionState(createWorkspaceAction, initialState);

  return (
    <div className="create-workspace-pro">
      <div style={{ marginBottom: "20px" }}>
        <div className="badge">Innovation Engine</div>
        <h3 style={{ marginTop: "12px", fontSize: "20px", fontWeight: "700" }}>Architect New Workspace</h3>
        <p className="muted-text">Define a strategic perimeter for your next high-fidelity design fleet.</p>
      </div>

      <form action={action} className="stack" style={{ gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "16px" }}>
          <div>
             <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Workspace Name</label>
             <input name="name" placeholder="Acme Strategic" required style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px", color: "white", outline: "none" }} />
          </div>

          <div>
             <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Strategic Mission</label>
             <input name="description" placeholder="Building the future of..." style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px", color: "white", outline: "none" }} />
          </div>
        </div>

        <div style={{ marginTop: "8px" }}>
          <button className="btn-pro btn-primary" type="submit" disabled={pending} style={{ width: "100%", padding: "14px" }}>
            {pending ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", marginRight: 10 }} />
                Initializing Perimeter...
              </>
            ) : (
              <>
                <Briefcase size={18} style={{ marginRight: "10px" }} /> Initialize Workspace <ChevronRight size={16} style={{ marginLeft: "8px", opacity: 0.5 }} />
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
        input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px var(--primary-glow) !important;
        }
      `}</style>
    </div>
  );
}