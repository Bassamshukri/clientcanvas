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
  ShieldCheck
} from "lucide-react";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  email?: string;
  showBackHome?: boolean;
}

export function AppHeader({
  title = "ClientCanvas",
  subtitle = "",
  email = "",
  showBackHome = true
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
      <div className="hud-search-trigger" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', metaKey: true}))}>
         <Search size={14} className="muted-text" />
         <span style={{ fontSize: "12px", fontWeight: "600", opacity: 0.5 }}>Search Strategic Commands...</span>
         <div className="hud-shortcut">
            <Command size={10} /> K
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
      `}</style>
    </header>
  );
}