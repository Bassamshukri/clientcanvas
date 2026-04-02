"use client";

import React, { useState } from "react";
import { Canvas } from "fabric";
import { setSelectionColor } from "../lib/fabric";

interface BrandKitProps {
  canvas: Canvas | null;
  onPushHistory: () => void;
}

export function BrandKit({ canvas, onPushHistory }: BrandKitProps) {
  // Local state for demo, will connect to Supabase next
  const [brandColors, setBrandColors] = useState<string[]>([
    "#0e1217", "#8b3dff", "#00c896", "#ff4d4d", "#ffb800"
  ]);

  const addColor = () => {
    const newColor = prompt("Enter hex color (e.g. #ff00ff)");
    if (newColor && /^#[0-9A-F]{6}$/i.test(newColor)) {
      setBrandColors([...brandColors, newColor]);
    }
  };

  const applyColor = (color: string) => {
     if (!canvas) return;
     onPushHistory();
     setSelectionColor(canvas, color);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>Brand Colors</h3>
          <button 
            onClick={addColor}
            style={{ fontSize: "11px", border: "none", background: "none", color: "var(--primary)", fontWeight: "700", cursor: "pointer" }}
          >
            + Add
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
          {brandColors.map((color, i) => (
            <button
              key={i}
              onClick={() => applyColor(color)}
              title={color}
              style={{
                aspectRatio: "1/1",
                background: color,
                border: "1px solid var(--border)",
                borderRadius: "6px",
                cursor: "pointer",
                padding: 0
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: "40px 20px", border: "1px dashed var(--border)", borderRadius: "12px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>Brand Logos</p>
        <button className="secondaryButton" style={{ fontSize: "12px", width: "100%" }}>
          Upload Logo
        </button>
      </div>

      <div style={{ background: "rgba(139, 61, 255, 0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(139, 61, 255, 0.1)" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--primary)", margin: "0 0 4px 0" }}>Pro Tip</p>
        <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
          Defining your brand kit here allows your team to stay consistent across all documents.
        </p>
      </div>
    </div>
  );
}
