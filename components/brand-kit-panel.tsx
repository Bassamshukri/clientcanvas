"use client";

import { useMemo, useState } from "react";
import { Palette, Share2, Type, Hash, Link as LinkIcon, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BrandKitPanelProps {
  workspaceId: string;
}

interface BrandKitState {
  primary: string;
  secondary: string;
  accent: string;
  fontFamily: string;
  logoUrl: string;
}

function storageKey(workspaceId: string) {
  return `clientcanvas-brandkit-${workspaceId}`;
}

export function BrandKitPanel({ workspaceId }: BrandKitPanelProps) {
  const initialState = useMemo<BrandKitState>(() => {
    if (typeof window === "undefined") {
      return { primary: "#8b3dff", secondary: "#0a0a0b", accent: "#00c896", fontFamily: "Inter", logoUrl: "" };
    }
    try {
      const raw = window.localStorage.getItem(storageKey(workspaceId));
      if (!raw) throw new Error("missing");
      return JSON.parse(raw) as BrandKitState;
    } catch {
      return { primary: "#8b3dff", secondary: "#0a0a0b", accent: "#00c896", fontFamily: "Inter", logoUrl: "" };
    }
  }, [workspaceId]);

  const [state, setState] = useState<BrandKitState>(initialState);
  const [savedAt, setSavedAt] = useState<string>("");

  function update<K extends keyof BrandKitState>(key: K, value: BrandKitState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function save() {
    window.localStorage.setItem(storageKey(workspaceId), JSON.stringify(state));
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setTimeout(() => setSavedAt(""), 3000);
  }

  return (
    <section className="glass-card panelCard animate-reflow" style={{ animationDelay: "0.1s" }}>
      <div style={{ marginBottom: "24px" }}>
        <div className="badge">Identity System</div>
        <h3 style={{ marginTop: "12px", fontSize: "20px", fontWeight: "700" }}>Workspace Brand DNA</h3>
        <p className="muted-text">Protocol for consistent high-fidelity thematic across all designs.</p>
      </div>

      <div className="stack" style={{ gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
           <div className="brand-input-box">
              <label>Primary</label>
              <div style={{ position: "relative" }}>
                 <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: 3, background: state.primary }} />
                 <input type="color" value={state.primary} onChange={(e) => update("primary", e.target.value)} />
              </div>
           </div>
           <div className="brand-input-box">
              <label>Secondary</label>
              <div style={{ position: "relative" }}>
                 <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: 3, background: state.secondary }} />
                 <input type="color" value={state.secondary} onChange={(e) => update("secondary", e.target.value)} />
              </div>
           </div>
           <div className="brand-input-box">
              <label>Accent</label>
              <div style={{ position: "relative" }}>
                 <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: 3, background: state.accent }} />
                 <input type="color" value={state.accent} onChange={(e) => update("accent", e.target.value)} />
              </div>
           </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
          <div className="brand-input-box">
             <label><Type size={12} style={{ marginRight: 4 }} /> Typography</label>
             <input value={state.fontFamily} onChange={(e) => update("fontFamily", e.target.value)} placeholder="Inter" />
          </div>
          <div className="brand-input-box">
             <label><LinkIcon size={12} style={{ marginRight: 4 }} /> Logo Manifest URL</label>
             <input value={state.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
           <button className="btn-pro btn-secondary" type="button" onClick={save} style={{ flex: 1, padding: "14px" }}>
              <Palette size={18} style={{ marginRight: 10 }} /> Sync Brand DNA
           </button>
           <AnimatePresence>
             {savedAt && (
               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--success)", fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> DNA Synced at {savedAt}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .brand-input-box label {
           fontSize: 10px;
           fontWeight: 800;
           color: var(--text-muted);
           display: flex;
           alignItems: center;
           marginBottom: 6px;
           textTransform: uppercase;
           letterSpacing: 0.1em;
        }
        .brand-input-box input {
           width: 100%;
           background: rgba(255,255,255,0.03);
           border: 1px solid var(--border);
           borderRadius: 10px;
           padding: 10px 12px 10px 32px;
           color: white;
           outline: none;
           fontSize: 13px;
        }
        .brand-input-box input[type="color"] {
           padding: 0;
           height: 38px;
           cursor: pointer;
           border: none;
           background: transparent;
        }
        .brand-input-box input:focus {
           border-color: var(--primary);
           box-shadow: 0 0 0 2px var(--primary-glow);
        }
      `}</style>
    </section>
  );
}