"use client";

import Link from "next/link";
import { AppHeader } from "./app-header";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { motion } from "framer-motion";
import { Layout, Plus, ArrowRight, Briefcase, Zap, Rocket } from "lucide-react";

interface DashboardHomeProps {
  userEmail: string;
  workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAttr = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DashboardHome({ userEmail, workspaces }: DashboardHomeProps) {
  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", background: "var(--bg)", backgroundImage: "var(--bg-dots)", backgroundSize: "32px 32px", paddingBottom: "100px" }}>
      <main className="shell">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AppHeader
            title="Command Center"
            subtitle="Architect your professional designs and manage collaborative workspaces."
            email={userEmail}
            showBackHome={false}
          />
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="cardGrid" 
          style={{ marginTop: 40 }}
        >
          <motion.div variants={itemAttr} className="glass-card panelCard">
             <CreateWorkspaceForm />
          </motion.div>

          <motion.div variants={itemAttr} className="glass-card panelCard" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "20px" }}>
              <div className="badge">Quick Access</div>
              <h3 style={{ marginTop: "12px", fontSize: "20px", fontWeight: "700" }}>Strategic Launch</h3>
              <p className="muted-text">Direct shortcuts to high-fidelity design perimeters.</p>
            </div>
            
            <div className="stack" style={{ marginTop: "auto", gap: "12px" }}>
              <Link className="btn-pro btn-secondary" href="/workspaces/demo-workspace" style={{ width: "100%", justifyContent: "flex-start" }}>
                <Layout size={18} style={{ marginRight: "12px" }} /> Open Strategic Demo
              </Link>
              <Link className="btn-pro btn-secondary" href="/editor/demo-design" style={{ width: "100%", justifyContent: "flex-start" }}>
                <Zap size={18} style={{ marginRight: "12px" }} /> Rapid Design Launch
              </Link>
              <Link className="btn-pro btn-secondary" href="#" style={{ width: "100%", justifyContent: "flex-start", opacity: 0.5 }}>
                <Rocket size={18} style={{ marginRight: "12px" }} /> Browse Templates
              </Link>
            </div>
          </motion.div>

          {workspaces.length === 0 ? (
            <motion.div variants={itemAttr} className="glass-card panelCard" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 40px" }}>
              <div style={{ width: 80, height: 80, background: "rgba(139, 61, 255, 0.1)", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: "1px solid var(--primary-glow)" }}>
                 <Briefcase size={40} color="var(--primary)" />
              </div>
              <h3 style={{ marginBottom: "12px", fontSize: "24px" }}>Strategic Perimeter Empty</h3>
              <p className="muted-text" style={{ maxWidth: 460, margin: "0 auto 32px", fontSize: "16px" }}>
                No active workspaces detected. Initialize your first innovation environment to begin.
              </p>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-pro btn-primary" style={{ padding: "12px 32px" }}>
                 <Plus size={18} style={{ marginRight: "10px" }} /> Initialize Now
              </button>
            </motion.div>
          ) : (
            workspaces.map((workspace) => (
              <motion.section 
                key={workspace.id}
                variants={itemAttr}
                className="glass-card panelCard"
                style={{ position: "relative", overflow: "hidden" }}
              >
                {/* Visual Accent */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "var(--primary)" }} />
                
                <div className="badge">Pro Workspace</div>
                <h3 style={{ marginTop: "16px", fontSize: "22px", fontWeight: "700" }}>{workspace.name}</h3>
                <p className="muted-text" style={{ height: "44px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", margin: "12px 0 24px" }}>
                   {workspace.description || "Active strategic perimeter with no current mission brief."}
                </p>
                <Link 
                  className="btn-pro btn-primary" 
                  href={`/workspaces/${workspace.id}`}
                  style={{ width: "100%" }}
                >
                  Enter Workspace <ArrowRight size={18} style={{ marginLeft: "10px" }} />
                </Link>
              </motion.section>
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
}