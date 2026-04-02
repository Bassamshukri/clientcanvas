type SidebarTab = "content" | "templates" | "elements" | "text" | "brand" | "uploads" | "draw" | "layers" | "review" | "export";

interface EditorSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function EditorSidebar({ activeTab, onTabChange }: EditorSidebarProps) {
  const tabs: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "content",
      label: "Content",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    },
    {
      id: "templates",
      label: "Templates",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h18v18H3z" stroke="currentColor" fill="none" />
          <path d="M3 9h18M9 21V9" stroke="currentColor" />
        </svg>
      )
    },
    {
      id: "elements",
      label: "Elements",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3" />
          <rect x="14" y="3" width="6" height="6" rx="1" />
          <path d="M3 14h6v6H3z" />
          <path d="M17 14l3 6H14l3-6z" />
        </svg>
      )
    },
    {
      id: "text",
      label: "Text",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
      )
    },
    {
      id: "brand",
      label: "Brand",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    },
    {
      id: "uploads",
      label: "Uploads",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      )
    },
    {
      id: "draw",
      label: "Draw",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l5 5" />
        </svg>
      )
    },
    {
      id: "layers",
      label: "Layers",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z" />
        </svg>
      )
    },
    {
      id: "review",
      label: "Review",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      )
    },
    {
      id: "export",
      label: "Code",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      )
    }
  ];

  return (
    <aside className="sidebarIcons">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`sidebarItem ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </div>
      ))}
    </aside>
  );
}
