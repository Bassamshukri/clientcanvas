"use client";

import Link from "next/link";
import { signOut } from "../app/login/actions";
import { 
  LogOut, 
  Layout as LayoutIcon, 
  User, 
  ChevronLeft, 
  Search, 
  Command,
  Activity,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Brain,
  Wifi,
  Users
} from "lucide-react";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  email?: string;
  showBackHome?: boolean;
  dnaScore?: number;
}

export function AppHeader({
  title = "ClientCanvas",
  subtitle = "",
  email = "",
  showBackHome = true,
  dnaScore
}: AppHeaderProps) {
  return (
    <header className="glass-panel header-hud" style={{ marginBottom: "32px", padding: "12px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {showBackHome ? (
          <Link href="/" className="hud-back-btn" title="Exit Interface">
             <ChevronLeft size={18} />
          </Link>
        ) : (
          <div className="hud-logo">
             <LayoutIcon size={18} color="white" />
          </div>
        )}
        
        <div>
           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "800", letterSpacing: "1px", margin: 0, textTransform: "uppercase" }}>{title}</h2>
              <div className="status-dot-active" />
           </div>
           {subtitle && <p className="muted-text" style={{ margin: 0, fontSize: "11px", fontWeight: "600" }}>{subtitle}</p>}
        </div>
      </div>

      {/* Center Intelligence HUD */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1, justifyContent: "center" }}>
        <div className="hud-search-trigger" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', metaKey: true}))}>
           <Search size={14} className="muted-text" />
           <span style={{ fontSize: "12px", fontWeight: "600", opacity: 0.5 }}>Search Strategic Commands...</span>
           <div className="hud-shortcut">
              <Command size={10} /> K
           </div>
        </div>

        {dnaScore !== undefined && (
          <div className={`hud-dna-badge ${dnaScore >= 90 ? 'god-mode' : ''}`}>
             {dnaScore >= 90 ? <Brain size={12} color="#8b3dff" /> : <TrendingUp size={12} color="var(--primary)" />}
             <div className="stack" style={{ gap: "2px" }}>
                <span style={{ fontSize: "7px", fontWeight: "900", opacity: 0.5, letterSpacing: "1px" }}>
                   {dnaScore >= 90 ? "ARCHITECT_LEVEL: GOD_MODE" : "STRATEGIC_DNA"}
                </span>
                <span style={{ fontSize: "14px", fontWeight: "900" }}>{dnaScore}%</span>
             </div>
          </div>
        )}

        <div className="hud-ai-core">
           <div className="neural-pulse" />
           <Cpu size={12} color="var(--primary)" />
           <div className="stack" style={{ gap: "2px" }}>
              <span style={{ fontSize: "9px", fontWeight: "800", letterSpacing: "1px" }}>AI_CORE: NEURAL_SYNC_NOMINAL</span>
              <div className="voice-dispatch">STRATEGIC_SCAN_COMPLETE</div>
           </div>
        </div>

        <div className="hud-architects" style={{ marginLeft: "12px" }}>
           <div className="architect-avatars">
              <div className="avatar ring-active"><Users size={10} /></div>
              <div className="avatar ring-idle">BS</div>
              <div className="avatar ring-idle">JD</div>
           </div>
           <div className="stack" style={{ gap: "2px" }}>
              <span style={{ fontSize: "7px", fontWeight: "900", opacity: 0.5 }}>ARCHITECTS_ONLINE</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                 <Wifi size={8} color="var(--success)" className="animate-pulse" />
                 <span style={{ fontSize: "10px", fontWeight: "800" }}>SYNC_MODE: NOMINAL</span>
              </div>
           </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {email && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
             <div className="hud-identity">
                <User size={14} />
             </div>
             <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", fontWeight: "700" }}>{email.split('@')[0]}</div>
                <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                   <ShieldCheck size={10} /> LEAD_ARCHITECT
                </div>
             </div>
          </div>
        )}
        
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.05)" }} />

        <form action={signOut}>
          <button className="hud-exit-btn" type="submit">
            <LogOut size={16} />
          </button>
        </form>
      </div>

      <style jsx>{`
        .header-hud {
           display: flex;
           align-items: center;
           justify-content: space-between;
           border-radius: 12px;
           background: rgba(13, 16, 23, 0.4) !important;
           border: 1px solid rgba(255,255,255,0.05);
        }
        .hud-logo {
           width: 32px;
           height: 32px;
           background: var(--primary);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           box-shadow: 0 0 20px var(--primary-glow);
        }
        .hud-back-btn {
           width: 32px;
           height: 32px;
           background: rgba(255,255,255,0.03);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--text-muted);
           border: 1px solid var(--border);
           transition: 0.2s;
        }
        .hud-back-btn:hover {
           background: rgba(255,255,255,0.08);
           color: white;
           border-color: var(--primary);
        }
        .hud-search-trigger {
           flex: 1;
           max-width: 400px;
           height: 36px;
           background: rgba(0,0,0,0.2);
           border: 1px solid var(--border);
           border-radius: 18px;
           display: flex;
           align-items: center;
           padding: 0 16px;
           gap: 12px;
           cursor: pointer;
           transition: 0.2s;
        }
        .hud-search-trigger:hover {
           background: rgba(255,255,255,0.02);
           border-color: var(--primary-glow);
        }
        .hud-shortcut {
           margin-left: auto;
           display: flex;
           align-items: center;
           gap: 4px;
           padding: 2px 6px;
           background: rgba(255,255,255,0.05);
           border-radius: 4px;
           font-size: 10px;
           font-weight: 800;
           color: var(--text-muted);
        }
        .hud-identity {
           width: 32px;
           height: 32px;
           border-radius: 50%;
           background: rgba(255,255,255,0.03);
           display: flex;
           align-items: center;
           justify-content: center;
           border: 1px solid var(--border);
        }
        .status-dot-active {
           width: 6px;
           height: 6px;
           border-radius: 50%;
           background: var(--success);
           box-shadow: 0 0 10px var(--success);
           animation: pulse 2s infinite;
        }
        @keyframes pulse {
           0% { opacity: 0.6; }
           50% { opacity: 1; }
           100% { opacity: 0.6; }
        }
        .hud-exit-btn {
           background: transparent;
           border: none;
           color: var(--text-muted);
           cursor: pointer;
           transition: 0.2s;
           padding: 8px;
           border-radius: 6px;
        }
        .hud-exit-btn:hover {
           background: rgba(239, 68, 68, 0.1);
           color: var(--danger);
        }
        .hud-dna-badge {
           display: flex;
           align-items: center;
           gap: 12px;
           padding: 6px 16px;
           background: rgba(139, 61, 255, 0.05);
           border: 1px solid rgba(139, 61, 255, 0.1);
           border-radius: 10px;
           transition: 0.3s;
        }
        .hud-dna-badge.god-mode {
           background: rgba(139, 61, 255, 0.15);
           border-color: var(--primary);
           box-shadow: 0 0 20px rgba(139, 61, 255, 0.2);
           transform: scale(1.05);
        }
        .hud-ai-core {
           display: flex;
           align-items: center;
           gap: 8px;
           padding: 6px 12px;
           background: rgba(255,255,255,0.02);
           border: 1px solid var(--border);
           border-radius: 8px;
           position: relative;
        }
        .neural-pulse {
           position: absolute;
           left: 12px;
           width: 12px;
           height: 12px;
           border-radius: 50%;
           background: var(--primary);
           opacity: 0.3;
           animation: neural-ping 2s infinite ease-out;
        }
        @keyframes neural-ping {
           0% { transform: scale(1); opacity: 0.3; }
           100% { transform: scale(2.5); opacity: 0; }
        }
        .hud-architects {
           display: flex;
           align-items: center;
           gap: 12px;
           padding: 6px 16px;
           background: rgba(255,255,255,0.02);
           border: 1px solid var(--border);
           border-radius: 10px;
        }
        .architect-avatars {
           display: flex;
           align-items: center;
        }
        .avatar {
           width: 24px;
           height: 24px;
           border-radius: 50%;
           background: rgba(139, 61, 255, 0.1);
           border: 1px solid rgba(255,255,255,0.1);
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 8px;
           font-weight: 800;
           margin-left: -8px;
           transition: 0.3s;
        }
        .avatar:first-child { margin-left: 0; }
        .avatar.ring-active { border-color: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
        .avatar.ring-idle { opacity: 0.5; }
        .avatar:hover { transform: translateY(-4px); margin-right: 8px; }
        
        .voice-dispatch {
           font-size: 8px;
           font-family: monospace;
           color: var(--primary);
           opacity: 0.8;
           white-space: nowrap;
           overflow: hidden;
           border-right: 1px solid var(--primary);
           width: fit-content;
           animation: h-type 4s steps(30) infinite alternate;
        }
        @keyframes h-type {
           0% { width: 0; }
           50% { width: 100%; }
           100% { width: 100%; }
        }
      `}</style>
    </header>
  );
}