"use client";

import React, { useState } from "react";
import { Canvas } from "fabric";
import { setSelectionColor } from "../lib/fabric";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Dna, 
  Zap, 
  Upload, 
  Check, 
  RefreshCcw, 
  Type, 
  Terminal,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface BrandKitProps {
  canvas: Canvas | null;
  onPushHistory: () => void;
}

export function BrandKit({ canvas, onPushHistory }: BrandKitProps) {
  const [brandColors, setBrandColors] = useState<string[]>([
    "#0f172a", "#8b3dff", "#10b981", "#ef4444", "#f59e0b", "#3b82f6"
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  const applyColor = (color: string) => {
     if (!canvas) return;
     onPushHistory();
     setSelectionColor(canvas, color);
     
     // Animation feedback
     setIsSyncing(true);
     setTimeout(() => setIsSyncing(false), 1000);
  };

  const syncAll = () => {
    if (!canvas) return;
    onPushHistory();
    const active = canvas.getActiveObject();
    if (active) {
       active.set("fill", brandColors[1]); // Apply Primary Focus
       canvas.requestRenderAll();
    }
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  return (
    <div className="stack" style={{ gap: "28px" }}>
      {/* Brand Identity Header */}
      <div style={{ padding: "20px", background: "rgba(139, 61, 255, 0.05)", border: "1px solid var(--primary-glow)", borderRadius: "16px" }}>
         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "12px" }}>
            <div style={{ width: 32, height: 32, background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Dna size={18} color="white" />
            </div>
            <div>
               <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", letterSpacing: "0.5px" }}>IDENTITY_ENGINE_V1</h4>
               <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "10px", color: "var(--primary)", fontWeight: "700" }}>
                  <ShieldCheck size={10} /> BRAND_GUARDRAILS_ACTIVE
               </div>
            </div>
         </div>
         <p className="muted-text" style={{ fontSize: "12px", margin: 0, lineHeight: "1.5" }}>
            Synchronize your strategic DNA across all protocol boards one-click at a time.
         </p>
      </div>

      {/* Strategic DNA Chips */}
      <div>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div className="badge">Strategic DNA (Colors)</div>
            <button className="textLink" style={{ fontSize: "11px" }}>Manage DNA</button>
         </div>
         <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
            {brandColors.map((color, i) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={i}
                onClick={() => applyColor(color)}
                style={{
                  aspectRatio: "1/1",
                  background: color,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                 <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)" }} />
              </motion.button>
            ))}
            <button style={{ aspectRatio: "1/1", background: "rgba(255,255,255,0.03)", border: "1px dashed var(--border)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
               <Palette size={18} />
            </button>
         </div>
      </div>

      {/* Typography Guardrails */}
      <div>
         <div className="badge" style={{ marginBottom: "16px" }}>Identity Typography</div>
         <div className="stack" style={{ gap: "10px" }}>
            <button className="glass-card-pro identity-card">
               <div className="dna-icon"><Type size={16} /></div>
               <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: "12px", fontWeight: "800" }}>STRATOSPHERE_BOLD</div>
                  <div className="muted-text" style={{ fontSize: "10px" }}>Inter // 800 // H1_PROTOCOL</div>
               </div>
               <ChevronRight size={14} className="muted-text" />
            </button>
            <button className="glass-card-pro identity-card">
               <div className="dna-icon"><Type size={16} /></div>
               <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: "12px", fontWeight: "800" }}>OBSIDIAN_REGULAR</div>
                  <div className="muted-text" style={{ fontSize: "10px" }}>Open Sans // 400 // BODY_TEXT</div>
               </div>
               <ChevronRight size={14} className="muted-text" />
            </button>
         </div>
      </div>

      {/* Global Sync Action */}
      <div style={{ marginTop: "12px" }}>
         <button 
           className={`btn-pro ${isSyncing ? 'btn-secondary' : 'btn-primary'}`} 
           style={{ width: "100%", height: "48px", gap: "12px" }}
           onClick={syncAll}
         >
           {isSyncing ? (
             <><RefreshCcw size={18} className="animate-spin" /> SYNCHRONIZING_DNA...</>
           ) : (
             <><Zap size={18} /> SYNC_BRAND_DNA</>
           )}
         </button>
         <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "12px", color: "var(--success)", fontSize: "10px", fontWeight: "700", justifyContent: "center" }}>
            <Check size={12} /> PROTOCOL_READY_FOR_SYNC
         </div>
      </div>

      <style jsx>{`
        .glass-card-pro {
           background: rgba(255,255,255,0.02);
           border: 1px solid var(--border);
           border-radius: 12px;
           padding: 12px;
           display: flex;
           align-items: center;
           gap: 12px;
           transition: 0.2s;
           cursor: pointer;
        }
        .glass-card-pro:hover {
           background: rgba(255,255,255,0.05);
           border-color: var(--primary);
        }
        .dna-icon {
           width: 32px;
           height: 32px;
           background: rgba(255,255,255,0.05);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--text-muted);
        }
        .identity-card:hover .dna-icon {
           background: rgba(139, 61, 255, 0.1);
           color: var(--primary);
        }
      `}</style>
    </div>
  );
}
