"use client";

import Link from "next/link";
import { AssetLibrary } from "./asset-library";
import { BrandKitPanel } from "./brand-kit-panel";
import { CreateDesignForm } from "./create-design-form";
import { motion } from "framer-motion";
import { 
  Plus, 
  ArrowRight, 
  Layers, 
  Clock, 
  Maximize2, 
  Activity, 
  Monitor,
  PenTool
} from "lucide-react";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function WorkspaceDashboard({
  workspace,
  designs,
  assets
}: WorkspaceDashboardProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="cardGrid"
    >
      <motion.div variants={itemAnim} style={{ gridColumn: "1 / -1" }}>
         <CreateDesignForm workspaceId={workspace.id} />
      </motion.div>

      <motion.section variants={itemAnim} className="glass-card panelCard" style={{ gridColumn: "1 / -1" }}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="badge">Active Fleet</div>
            <h3 style={{ marginTop: "12px", fontSize: "20px", fontWeight: "700" }}>Workspace Designs</h3>
            <p className="muted-text">Managed strategic design perimeters and their current lifecycle status.</p>
          </div>
          <div className="muted-text" style={{ fontSize: "12px", fontWeight: "700" }}>{designs.length} TOTAL DESIGNS</div>
        </div>

        <div className="designs-grid">
           {designs.length === 0 ? (
             <div style={{ textAlign: "center", padding: "60px 0", border: "1px dashed var(--border)", borderRadius: "12px" }}>
                <Monitor size={40} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.3 }} />
                <p className="muted-text">No active designs detected. Initialize a design to begin operations.</p>
             </div>
           ) : (
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
               {designs.map((design) => (
                 <article key={design.id} className="glass-card design-pro-card">
                    <div className="design-card-preview">
                       <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.05)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <PenTool size={20} color="var(--primary)" />
                       </div>
                    </div>
                    <div style={{ padding: "20px" }}>
                       <h4 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: "700" }}>{design.title}</h4>
                       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", opacity: 0.6, display: "flex", alignItems: "center", gap: 4 }}>
                             <Maximize2 size={12} /> {design.width} × {design.height}
                          </span>
                          <span className={`badge-status ${design.status}`} style={{ fontSize: "10px" }}>{design.status}</span>
                       </div>
                       
                       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }} className="muted-text">
                          <Clock size={12} />
                          <span style={{ fontSize: 12 }}>Updated {design.updated_at ? new Date(design.updated_at).toLocaleDateString() : "recent"}</span>
                       </div>

                       <Link className="btn-pro btn-secondary" href={`/editor/${design.id}`} style={{ width: "100%", justifyContent: "space-between" }}>
                         Open Design <ArrowRight size={16} />
                       </Link>
                    </div>
                 </article>
               ))}
             </div>
           )}
        </div>
      </motion.section>

      <motion.div variants={itemAnim} style={{ gridColumn: "1 / -1" }}>
         <BrandKitPanel workspaceId={workspace.id} />
      </motion.div>

      <motion.div variants={itemAnim} style={{ gridColumn: "1 / -1" }}>
         <AssetLibrary workspaceId={workspace.id} assets={assets} />
      </motion.div>

      <style jsx>{`
        .design-pro-card {
           border-color: var(--border);
           overflow: hidden;
           display: flex;
           flex-direction: column;
        }
        .design-pro-card:hover {
           border-color: var(--primary-glow);
        }
        .design-card-preview {
           height: 120px;
           background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%);
           display: flex;
           align-items: center;
           justify-content: center;
           border-bottom: 1px solid var(--border);
        }
        .badge-status {
           padding: 2px 8px;
           border-radius: 4px;
           text-transform: uppercase;
           letter-spacing: 0.05em;
           font-weight: 800;
           background: rgba(255,255,255,0.05);
        }
        .badge-status.approved { color: var(--success); background: rgba(0, 200, 150, 0.1); }
        .badge-status.in_review { color: var(--warning); background: rgba(245, 158, 11, 0.1); }
      `}</style>
    </motion.div>
  );
}