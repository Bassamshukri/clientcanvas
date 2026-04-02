"use client";

import Link from "next/link";
import { AppHeader } from "./app-header";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { motion } from "framer-motion";
import { Layout, Plus, ArrowRight, Briefcase } from "lucide-react";

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
    <div style={{ height: "100vh", overflowY: "auto", background: "var(--bg)", backgroundImage: "var(--bg-dots)", backgroundSize: "32px 32px" }}>
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

          <motion.div variants={itemAttr} className="glass-card panelCard">
            <div className="badge">Quick Access</div>
            <h3 style={{ marginTop: 12 }}>Strategic Launch</h3>
            <div className="stack" style={{ marginTop: 16 }}>
              <Link className="btn-pro btn-secondary" href="/workspaces/demo-workspace">
                <Layout size={16} /> Open Demo Workspace
              </Link>
              <Link className="btn-pro btn-secondary" href="/editor/demo-design">
                <Plus size={16} /> New Demo Design
              </Link>
            </div>
          </motion.div>

          {workspaces.length === 0 ? (
            <motion.div variants={itemAttr} className="glass-card panelCard" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px" }}>
              <div style={{ width: 64, height: 64, background: "rgba(139, 61, 255, 0.1)", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                 <Briefcase size={32} color="var(--primary)" />
              </div>
              <h3 style={{ margin: 0 }}>No workspaces detected</h3>
              <p className="muted-text" style={{ maxWidth: 400, margin: "12px auto" }}>
                Create your first workspace to begin your professional design journey.
              </p>
            </motion.div>
          ) : (
            workspaces.map((workspace) => (
              <motion.section 
                key={workspace.id}
                variants={itemAttr}
                className="glass-card panelCard"
              >
                <div className="badge">Pro Workspace</div>
                <h3 style={{ marginTop: 12 }}>{workspace.name}</h3>
                <p className="muted-text" style={{ height: 48, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                   {workspace.description || "No strategic mission yet."}
                </p>
                <Link 
                  className="btn-pro btn-primary" 
                  href={`/workspaces/${workspace.id}`}
                  style={{ width: "100%", marginTop: 20 }}
                >
                  Enter Workspace <ArrowRight size={16} style={{ marginLeft: 8 }} />
                </Link>
              </motion.section>
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
}