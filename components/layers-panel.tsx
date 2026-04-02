"use client";

import { useEffect, useState } from "react";
import { Canvas, FabricObject } from "fabric";

interface LayersPanelProps {
  canvas: Canvas | null;
}

export function LayersPanel({ canvas }: LayersPanelProps) {
  const [layers, setLayers] = useState<FabricObject[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      setLayers([...canvas.getObjects()].reverse()); // Show newest/top first
    };

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);
    
    updateLayers();

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
    };
  }, [canvas]);

  const toggleVisibility = (obj: FabricObject) => {
    obj.set("visible", !obj.visible);
    canvas?.requestRenderAll();
    setRefresh(refresh + 1);
  };

  const toggleLock = (obj: FabricObject) => {
    const isLocked = obj.lockMovementX;
    obj.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      editable: isLocked, // Textbox editable
      selectable: isLocked // Allow selection even if locked? Usually yes but can't move
    });
    canvas?.requestRenderAll();
    setRefresh(refresh + 1);
  };

  const selectObject = (obj: FabricObject) => {
    canvas?.setActiveObject(obj);
    canvas?.requestRenderAll();
  };

  if (!canvas) return <p className="mutedText">No canvas active.</p>;

  return (
    <div className="layersList" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {layers.length === 0 ? (
        <p className="mutedText" style={{ textAlign: "center", padding: "20px" }}>No layers yet.</p>
      ) : (
        layers.map((obj, i) => (
          <div 
            key={i} 
            className="miniCard"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              padding: "10px",
              border: canvas.getActiveObject() === obj ? "1px solid var(--primary)" : "1px solid var(--border)",
              opacity: obj.visible ? 1 : 0.5
            }}
          >
            <div 
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flex: 1 }}
              onClick={() => selectObject(obj)}
            >
              <div style={{ width: "24px", height: "24px", background: "var(--bg)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>
                 {obj.get("type").substring(0, 1).toUpperCase()}
              </div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>
                {obj.get("type")} {layers.length - i}
              </span>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={() => toggleLock(obj)}
                title={obj.lockMovementX ? "Unlock" : "Lock"}
                style={{ background: "none", border: "none", cursor: "pointer", color: obj.lockMovementX ? "var(--primary)" : "var(--muted)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {obj.lockMovementX ? (
                    <path d="M7 11V7a5 5 0 0 1 10 0v4M8 11h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"/>
                  ) : (
                    <path d="M7 11V7a5 5 0 0 1 9.9-1M8 11h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"/>
                  )}
                </svg>
              </button>
              <button 
                onClick={() => toggleVisibility(obj)}
                title={obj.visible ? "Hide" : "Show"}
                style={{ background: "none", border: "none", cursor: "pointer", color: obj.visible ? "var(--text)" : "var(--muted)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {obj.visible ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  ) : (
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24L1 1l22 22"/>
                  )}
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
