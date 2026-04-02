import Link from "next/link";
import { signOut } from "../app/login/actions";
import { LogOut, Layout as LayoutIcon, User, ChevronLeft } from "lucide-react";

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
    <header className="glass-panel header-glass" style={{ marginBottom: "32px", borderRadius: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {showBackHome && (
          <Link href="/" className="sidebar-icon" title="Go back">
            <ChevronLeft size={18} />
          </Link>
        )}
        <div className="logo-box" style={{ width: 36, height: 36, background: "var(--primary)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px var(--primary-glow)" }}>
           <LayoutIcon size={20} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>{title}</h2>
          {subtitle ? <p className="muted-text" style={{ margin: 0, fontSize: "13px" }}>{subtitle}</p> : null}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {email && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
             <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                <User size={16} color="var(--text-muted)" />
             </div>
             <span className="muted-text" style={{ fontWeight: 600, fontSize: "14px" }}>{email}</span>
          </div>
        )}
        
        <div style={{ width: 1, height: 24, background: "var(--border)" }} />

        <form action={signOut}>
          <button className="btn-pro btn-secondary" type="submit" style={{ padding: "8px 16px" }}>
            <LogOut size={16} style={{ marginRight: "8px" }} /> Sign out
          </button>
        </form>
      </div>
    </header>
  );
}