"use client";

import { 
  Plus, 
  Layout, 
  Square, 
  Type, 
  Image as ImageIcon, 
  Layers, 
  Settings, 
  CloudUpload,
  Hand,
  PenTool,
  MessageSquare,
  Code
} from "lucide-react";

type SidebarTab = "content" | "templates" | "elements" | "text" | "brand" | "uploads" | "draw" | "layers" | "review" | "export";

interface EditorSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function EditorSidebar({ activeTab, onTabChange }: EditorSidebarProps) {
  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: "templates", label: "Templates", icon: <Layout size={20} /> },
    { id: "elements", label: "Elements", icon: <Square size={20} /> },
    { id: "text", label: "Text", icon: <Type size={20} /> },
    { id: "uploads", label: "Uploads", icon: <CloudUpload size={20} /> },
    { id: "draw", label: "Draw", icon: <PenTool size={20} /> },
    { id: "brand", label: "Brand", icon: <Settings size={20} /> },
    { id: "layers", label: "Layers", icon: <Layers size={20} /> },
    { id: "review", label: "Review", icon: <MessageSquare size={20} /> },
    { id: "export", label: "Code", icon: <Code size={20} /> }
  ];

  return (
    <aside className="sidebar-minimal">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`sidebar-icon ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
          style={{ position: "relative" }}
        >
          {tab.icon}
          {activeTab === tab.id && (
            <div style={{ position: "absolute", right: 0, top: "25%", bottom: "25%", width: 3, background: "var(--primary)", borderRadius: "2px 0 0 2px" }} />
          )}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div className="sidebar-icon" title="Help">
         <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: "900" }}>?</div>
      </div>
    </aside>
  );
}
