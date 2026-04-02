"use client";

import { useEffect, useState } from "react";
import { Canvas, Line } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Link2, 
  Trash2, 
  Zap, 
  ChevronRight, 
  Search,
  CheckCircle2,
  AlertCircle,
  MousePointer2
} from "lucide-react";

interface LogicPanelProps {
  canvas: Canvas | null;
  isLinking: boolean;
  setIsLinking: (linking: boolean) => void;
}

export function LogicPanel({ canvas, isLinking, setIsLinking }: LogicPanelProps) {
  const [connectors, setConnectors] = useState<any[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const findConnectors = () => {
      const objects = canvas.getObjects();
      const links = objects.filter((o: any) => o.isLogicConnector);
      setConnectors([...links]);
    };

    canvas.on("object:added", findConnectors);
    canvas.on("object:removed", findConnectors);
    
    findConnectors();

    return () => {
      canvas.off("object:added", findConnectors);
      canvas.off("object:removed", findConnectors);
    };
  }, [canvas]);

  const removeConnector = (line: any) => {
    canvas?.remove(line);
    canvas?.requestRenderAll();
  };

  const clearAll = () => {
    connectors.forEach(c => canvas?.remove(c));
    canvas?.requestRenderAll();
  };

  return (
    <div className="stack" style={{ gap: "24px" }}>
      <div className="glass-card panelCard" style={{ padding: "20px", border: isLinking ? "2px solid var(--primary)" : "1px solid var(--border)" }}>
         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "16px" }}>
            <div style={{ width: 40, height: 40, background: isLinking ? "var(--primary)" : "rgba(255,255,255,0.05)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.3s" }}>
               <Zap size={20} color={isLinking ? "white" : "var(--primary)"} />
            </div>
            <div>
               <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Protocol Link Mode</h4>
               <p className="muted-text" style={{ fontSize: "12px", margin: 0 }}>Establish strategic logical anchors.</p>
            </div>
         </div>

         <button 
           className={`btn-pro ${isLinking ? 'btn-primary' : 'btn-secondary'}`}
           onClick={() => setIsLinking(!isLinking)}
           style={{ width: "100%", padding: "14px" }}
         >
           {isLinking ? (
             <><Activity size={18} className="animate-pulse" style={{ marginRight: 10 }} /> Capture Source Object...</>
           ) : (
             <><Link2 size={18} style={{ marginRight: 10 }} /> Initialize Protocol Link</>
           )}
         </button>

         {isLinking && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              style={{ marginTop: 16, padding: 12, background: "rgba(139, 61, 255, 0.1)", borderRadius: 8, border: "1px solid var(--primary-glow)", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
            >
               <MousePointer2 size={14} color="var(--primary)" />
               <span>Select two objects on the canvas to link.</span>
            </motion.div>
         )}
      </div>

      <div className="stack" style={{ gap: "12px" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="badge">Active Protocols</div>
            {connectors.length > 0 && <button className="textLink" onClick={clearAll} style={{ fontSize: 11 }}>Clear All</button>}
         </div>

         <AnimatePresence initial={false}>
            {connectors.length === 0 ? (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="glass-card" 
                 style={{ padding: "30px 20px", textAlign: "center", opacity: 0.5, borderStyle: "dashed" }}
               >
                  <Activity size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
                  <p className="muted-text">Zero logic protocols established.</p>
               </motion.div>
            ) : (
               connectors.map((conn, idx) => (
                  <motion.div 
                    key={conn.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card layer-item"
                    style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                     <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ color: "var(--primary)" }}><Activity size={16} /></div>
                        <div>
                           <div style={{ fontSize: "13px", fontWeight: "700" }}>Protocol_{conn.anchorFromId?.slice(-4)}_{conn.anchorToId?.slice(-4)}</div>
                           <div className="muted-text" style={{ fontSize: "11px" }}>Dynamic Spatial Sync : Active</div>
                        </div>
                     </div>
                     <button className="layer-action-btn hover-danger" onClick={() => removeConnector(conn)}>
                        <Trash2 size={14} />
                     </button>
                  </motion.div>
               ))
            )}
         </AnimatePresence>
      </div>

      <style jsx>{`
        .layer-action-btn {
           width: 28px;
           height: 28px;
           border-radius: 6px;
           background: transparent;
           border: none;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: 0.2s;
           opacity: 0.6;
        }
        .layer-action-btn:hover {
           background: rgba(255,255,255,0.1);
           opacity: 1;
        }
        .layer-action-btn.hover-danger:hover {
           color: var(--danger) !important;
           background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
}
