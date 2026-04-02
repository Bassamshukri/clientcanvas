"use client";

import React from "react";
import { Textbox } from "fabric";

interface ContextualToolbarProps {
  selectedType: string | null;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onAlign: (position: "left" | "center" | "right" | "top" | "middle" | "bottom") => void;
  onGroup: () => void;
  onUngroup: () => void;
  onBold?: (isBold: boolean) => void;
  onItalic?: (isItalic: boolean) => void;
  onColorChange?: (color: string) => void;
  isBold?: boolean;
  isItalic?: boolean;
  currentColor?: string;
  isLocked?: boolean;
  onToggleLock?: (locked: boolean) => void;
  brandColors?: { primary: string; secondary: string; accent: string; fontFamily: string } | null;
}

export function ContextualToolbar({
  selectedType,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onAlign,
  onGroup,
  onUngroup,
  onBold,
  onItalic,
  onColorChange,
  isBold,
  isItalic,
  currentColor,
  isLocked,
  onToggleLock,
  brandColors
}: ContextualToolbarProps) {
  if (!selectedType) return null;

  const colors = brandColors 
    ? [brandColors.primary, brandColors.secondary, brandColors.accent, "#000000", "#ffffff"]
    : ["#0e1217", "#8b3dff", "#ff4d4d", "#00c896", "#ffb800", "#ffffff"];

  return (
    <div className="floatingToolbar">
      {selectedType === "activeSelection" && (
        <>
          <button 
            onClick={onGroup} 
            title="Group Objects (Ctrl+G)" 
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--primary)", color: "white", border: "none", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", marginRight: "8px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10v10H7z"/></svg>
            Group
          </button>
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 8px" }} />
        </>
      )}

      {selectedType === "group" && (
        <>
          <button 
            onClick={onUngroup} 
            title="Ungroup Objects (Ctrl+Shift+G)" 
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", color: "var(--primary)", border: "1px solid var(--primary)", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", marginRight: "8px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2v6h-6M3 22v-6h6M21 13v9h-9M3 11V2h9"/></svg>
            Ungroup
          </button>
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 8px" }} />
        </>
      )}
      {selectedType === "textbox" && (
        <>
          <button
            onClick={() => onBold?.(!isBold)}
            style={{
              width: "32px",
              height: "32px",
              fontWeight: "bold",
              background: isBold ? "var(--border)" : "transparent",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            B
          </button>
          <button
            onClick={() => onItalic?.(!isItalic)}
            style={{
              width: "32px",
              height: "32px",
              fontStyle: "italic",
              background: isItalic ? "var(--border)" : "transparent",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            I
          </button>
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />
        </>
      )}

      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {colors.map((c) => (
          <div
            key={c}
            onClick={() => onColorChange?.(c)}
            style={{
              width: "20px",
              height: "20px",
              background: c,
              borderRadius: "50%",
              border: c === "#ffffff" ? "1px solid var(--border)" : "2px solid transparent",
              cursor: "pointer",
              boxShadow: currentColor === c ? "0 0 0 2px var(--primary)" : "none"
            }}
          />
        ))}
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />

      <div style={{ display: "flex", gap: "2px" }}>
        <button onClick={() => onAlign("left")} title="Align Left" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h12M4 12h18M4 18h12"/></svg>
        </button>
        <button onClick={() => onAlign("center")} title="Align Center" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6h12M4 12h16M6 18h12"/></svg>
        </button>
        <button onClick={() => onAlign("top")} title="Align Top" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: "rotate(90deg)" }}><path d="M4 6h12M4 12h18M4 18h12"/></svg>
        </button>
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />

      <button onClick={onBringForward} title="Bring Forward" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V3M5 10l7-7 7 7"/></svg>
      </button>
      <button onClick={onSendBackward} title="Send Backward" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M5 14l7 7 7-7"/></svg>
      </button>

      <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />

      <button onClick={() => onToggleLock?.(!isLocked)} title={isLocked ? "Unlock Object" : "Lock Object"} style={{ border: "none", background: isLocked ? "var(--border)" : "transparent", cursor: "pointer", padding: "4px", borderRadius: "4px" }}>
        {isLocked ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
        )}
      </button>

      <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />

      <button onClick={onDuplicate} title="Duplicate" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
      <button onClick={onDelete} title="Delete" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px", color: "var(--danger)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  );
}
