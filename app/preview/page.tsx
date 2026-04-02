"use client";

import { DynamicEditorShell } from "../../components/dynamic-editor-shell";

export default function PreviewPage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Demo Banner */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          height: "40px", 
          background: "var(--primary)", 
          color: "white", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          zIndex: 9999,
          fontSize: "13px",
          fontWeight: "600",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        🚀 ClientCanvas 1.0 Preview — Try Snap-Snapping, Grouping (Ctrl+G), and the Brand Kit.
      </div>
      
      <div style={{ paddingTop: "40px", height: "100vh" }}>
        <DynamicEditorShell designId="preview-saas-1-0" />
      </div>
    </div>
  );
}
