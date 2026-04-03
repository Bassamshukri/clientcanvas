"use client";

import Link from "next/link";
import { AppHeader } from "./app-header";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { motion } from "framer-motion";
import { Layout, Plus, ArrowRight, Briefcase, Zap, Rocket, User, Layers, Activity, TrendingUp, Cpu, BarChart3, Sparkles, Brain } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { useToast } from "./strategic-toast";
import { ActivityFeed } from "./activity-feed";

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
  const { completion, complete, isLoading: isBriefing } = useCompletion({
    api: "/api/intelligence",
    initialCompletion: "Initializing strategic overview... Analysis indicates 98.4% nominal logic moats across current fleets. Recommendation: Deepen APAC market analysis in Protocol Alpha-3.",
  });
  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", background: "var(--bg)", backgroundImage: "var(--bg-dots)", backgroundSize: "32px 32px", paddingBottom: "100px" }}>
      <style jsx global>{`
        .welcome-hud { margin-bottom: 24px; }
        .drift-telemetry {
           padding: 24px;
           background: rgba(13,16,23,0.6) !important;
           border-radius: 20px;
           margin-bottom: 32px;
           overflow: hidden;
           position: relative;
        }
        .telemetry-icon {
           width: 40px;
           height: 40px;
           background: rgba(139,61,255,0.1);
           border-radius: 12px;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        .telemetry-stat {
           text-align: right;
           display: flex;
           flex-direction: column;
        }
        .drift-chart-container {
           position: relative;
           height: 120px;
           background: rgba(0,0,0,0.2);
           border-radius: 12px;
           overflow: hidden;
           display: flex;
           align-items: center;
        }
        .drift-chart-pulse {
           position: absolute;
           inset: 0;
           background: linear-gradient(90deg, transparent, rgba(139,61,255,0.05), transparent);
           animation: chart-scan 4s infinite linear;
        }
        @keyframes chart-scan {
           0% { transform: translateX(-100%); }
           100% { transform: translateX(100%); }
        }
      `}</style>
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

        {/* Welcome HUD */}
        <section className="welcome-hud stack" style={{ gap: "8px", marginTop: "24px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-1px", margin: 0 }}>MISSION_CONTROL // READY</h1>
          <p className="muted-text" style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "1px" }}>WELCOME_BACK, ARCHITECT. NEURAL_SYNC: 99.8%_NOMINAL.</p>
        </section>

        {/* Global Strategic Drift Telemetry */}
        <section className="drift-telemetry glass-panel">
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                 <div className="telemetry-icon"><TrendingUp size={18} color="var(--primary)" /></div>
                 <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800" }}>GLOBAL_STRATEGIC_DRIFT</h3>
                    <span className="muted-text" style={{ fontSize: "11px", fontWeight: "700" }}>REAL-TIME_FLEET_ANALYSIS</span>
                 </div>
              </div>
              <div className="telemetry-stat">
                 <span style={{ fontSize: "10px", opacity: 0.5 }}>ACTIVE_PROTOCOLS</span>
                 <span style={{ fontSize: "18px", fontWeight: "900" }}>14</span>
              </div>
           </div>
           
           <div className="drift-chart-container">
              <div className="drift-chart-pulse" />
              <svg viewBox="0 0 800 120" style={{ width: "100%", height: "120px" }}>
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 2 }}
                   d="M0 60 Q 100 20, 200 80 T 400 40 T 600 90 T 800 50" 
                   fill="none" 
                   stroke="var(--primary)" 
                   strokeWidth="2"
                   style={{ opacity: 0.5 }}
                 />
                 <motion.path 
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                   d="M0 70 Q 150 40, 300 90 T 450 30 T 600 80 T 800 60" 
                   fill="none" 
                   stroke="var(--success)" 
                   strokeWidth="1"
                   style={{ opacity: 0.3 }}
                 />
              </svg>
           </div>
        </section>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "300px 1fr 340px", 
          gap: "32px", 
          marginTop: "40px",
          alignItems: "start"
        }}>
          {/* Column 1: Identity & Strategy Stats */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="stack" 
            style={{ gap: "24px" }}
          >
            <div className="glass-card panelCard" style={{ padding: "24px" }}>
               <div className="badge">Identity System</div>
               <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "12px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px var(--primary-glow)" }}>
                     <User size={24} color="white" />
                  </div>
                  <div>
                     <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "800" }}>{userEmail.split('@')[0].toUpperCase()}</h4>
                     <p className="muted-text" style={{ margin: 0, fontSize: "12px" }}>Strategic Lead</p>
                  </div>
               </div>
               
               <div style={{ marginTop: "24px", padding: "16px", background: "rgba(139, 61, 255, 0.05)", borderRadius: "12px", border: "1px solid var(--primary-glow)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                     <span style={{ fontSize: "11px", fontWeight: "700", opacity: 0.6 }}>IDENTITY_SCORE</span>
                     <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--primary)" }}>98.4%</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                     <div style={{ width: "98.4%", height: "100%", background: "var(--primary)" }} />
                  </div>
               </div>
            </div>

            <div className="glass-card panelCard" style={{ padding: "24px" }}>
               <div className="badge">Command Protocol</div>
               <div className="stack" style={{ gap: "12px", marginTop: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                     <Zap size={16} color="var(--primary)" />
                     <span style={{ fontSize: "13px", fontWeight: "600" }}>Active Protocols: {workspaces.length * 3}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                     <Briefcase size={16} color="var(--primary)" />
                     <span style={{ fontSize: "13px", fontWeight: "600" }}>Fleet Capacity: 84%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                     <Rocket size={16} color="var(--primary)" />
                     <span style={{ fontSize: "13px", fontWeight: "600" }}>Deployments: 12</span>
                  </div>
               </div>
            </div>
          </motion.aside>

          {/* Column 2: Active Fleet (Workspaces) */}
          <div className="stack" style={{ gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>ACTIVE_FLEET</h3>
               <button className="btn-pro btn-primary" style={{ padding: "8px 16px" }}>
                  <Plus size={16} style={{ marginRight: "8px" }} /> New Fleet
               </button>
            </div>

            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="stack" 
              style={{ gap: "16px" }}
            >
              {workspaces.length === 0 ? (
                <motion.div variants={itemAttr} className="glass-card panelCard" style={{ textAlign: "center", padding: "60px 20px" }}>
                  <h3 style={{ marginBottom: "12px" }}>Strategic Perimeter Empty</h3>
                  <CreateWorkspaceForm />
                </motion.div>
              ) : (
                workspaces.map((workspace) => (
                  <motion.section 
                    key={workspace.id}
                    variants={itemAttr}
                    className="glass-card panelCard"
                    style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                       <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Layout size={20} color="var(--primary)" />
                       </div>
                       <div>
                          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{workspace.name}</h3>
                          <p className="muted-text" style={{ margin: 0, fontSize: "13px" }}>{workspace.description || "Active Fleet Perimeter"}</p>
                       </div>
                    </div>
                    <Link 
                      className="btn-pro btn-secondary" 
                      href={`/workspaces/${workspace.id}`}
                      style={{ padding: "10px 20px" }}
                    >
                      Initialize <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                    </Link>
                  </motion.section>
                ))
              )}
            </motion.div>
          </div>

          {/* Column 3: Telemetry Stream */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="stack" 
            style={{ gap: "24px" }}
          >
             {/* Intelligence Briefing - v3.3.0 */}
             <div className="glass-card panelCard" style={{ padding: "24px", position: "relative", overflow: "hidden", border: "1px solid var(--primary-glow)", background: "rgba(139, 61, 255, 0.03)" }}>
                <div style={{ position: "absolute", top: 0, right: 0, padding: "12px" }}><Sparkles size={14} color="var(--primary)" /></div>
                <div className="badge">Intelligence Briefing</div>
                <div style={{ marginTop: "20px" }}>
                   <p style={{ fontSize: "13px", lineHeight: "1.6", color: "white", opacity: 0.9, fontStyle: "italic" }}>
                      {completion || "Awaiting strategic signal..."}
                   </p>
                </div>
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                   <button 
                     onClick={() => complete("Analyze fleet status and suggest 3 strategic priorities.")}
                     className={`btn-pro ${isBriefing ? 'btn-secondary' : 'btn-primary'}`} 
                     style={{ fontSize: "10px", width: "100%", height: "40px" }}
                     disabled={isBriefing}
                   >
                      <Brain size={14} /> {isBriefing ? "SYNTHESIZING..." : "REFRESH_INTELLIGENCE"}
                   </button>
                </div>
             </div>

             <ActivityFeed items={[
                { id: "1", kind: "publish_job", title: "Global Protocol Sync", subtitle: "Fleet Delta initialized", createdAt: new Date().toISOString() },
                { id: "2", kind: "design", title: "New Strategic Asset", subtitle: "High-fidelity node added", createdAt: new Date(Date.now() - 3600000).toISOString() },
                { id: "3", kind: "review_link", title: "Stakeholder Review", subtitle: "Protocol Alpha-3 shared", createdAt: new Date(Date.now() - 7200000).toISOString() }
             ]} />
          </motion.aside>
        </div>
      </main>
    </div>
  );
}