"use client";

import React from "react";
import Link from "next/link";

interface CanvasHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onPresent: () => void;
  saveMessage?: string;
}

export function CanvasHeader({
  title,
  onTitleChange,
  onSave,
  onExportPng,
  onExportPdf,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onPresent,
  saveMessage
}: CanvasHeaderProps) {
  return (
    <header className="editorHeader">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/workspaces" className="badge" style={{ cursor: "pointer", textDecoration: "none" }}>
          ← Home
        </Link>
        <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
        
        {/* Undo / Redo */}
        <div style={{ display: "flex", gap: "2px" }}>
           <button 
             onClick={onUndo} 
             disabled={!canUndo} 
             title="Undo (Ctrl+Z)"
             style={{ border: "none", background: "transparent", cursor: canUndo ? "pointer" : "default", color: canUndo ? "var(--text)" : "var(--muted)", padding: "6px" }}
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
           </button>
           <button 
             onClick={onRedo} 
             disabled={!canRedo} 
             title="Redo (Ctrl+Shift+Z)"
             style={{ border: "none", background: "transparent", cursor: canRedo ? "pointer" : "default", color: canRedo ? "var(--text)" : "var(--muted)", padding: "6px" }}
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: "scaleX(-1)" }}><path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
           </button>
        </div>

        <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />

        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            width: "auto",
            minWidth: "120px",
            padding: "4px 8px",
            borderRadius: "4px"
          }}
          className="titleInput"
        />
        {saveMessage && <span style={{ fontSize: "12px", color: "var(--muted)" }}>{saveMessage}</span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={onPresent} className="secondaryButton" style={{ minHeight: "36px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Present
        </button>
        <button onClick={onSave} className="secondaryButton" style={{ minHeight: "36px", fontSize: "14px" }}>
          Save
        </button>
        <div style={{ display: "flex", gap: "4px" }}>
          <button 
            onClick={onExportPng} 
            className="primaryButton" 
            style={{ 
              minHeight: "36px", 
              fontSize: "14px",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0"
            }}
          >
            Download PNG
          </button>
          <button 
            onClick={onExportPdf} 
            className="primaryButton" 
            style={{ 
              minHeight: "36px", 
              fontSize: "14px",
              padding: "0 10px",
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
              borderLeft: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            PDF
          </button>
        </div>
        <div 
          style={{ 
            width: "32px", 
            height: "32px", 
            borderRadius: "50%", 
            background: "var(--primary)", 
            color: "white", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            marginLeft: "8px"
          }}
        >
          JD
        </div>
      </div>
    </header>
  );
}
