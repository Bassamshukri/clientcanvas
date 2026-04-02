"use client";

import { useEffect, useState } from "react";
import { Canvas, FabricObject } from "fabric";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Layers, 
  Square, 
  Circle, 
  Type, 
  Image as ImageIcon,
  MousePointer2,
  ChevronRight,
  Activity
} from "lucide-react";

interface LayersPanelProps {
  canvas: Canvas | null;
}

const getIcon = (type: string) => {
  switch (type) {
    case "rect": return Square;
    case "circle": return Circle;
    case "textbox": return Type;
    case "image": return ImageIcon;
    default: return Layers;
  }
};

const getDisplayName = (obj: any, index: number) => {
  if (obj.id) return obj.id;
  const type = obj.get("type");
  return `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`;
};

export function LayersPanel({ canvas }: LayersPanelProps) {
  const [layers, setLayers] = useState<FabricObject[]>([]);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      setLayers([...canvas.getObjects()].reverse());
      const active = canvas.getActiveObject();
      setActiveObjectId(active ? (active as any).id || "active" : null);
    };

    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);
    canvas.on("selection:created", updateLayers);
    canvas.on("selection:cleared", updateLayers);
    canvas.on("selection:updated", updateLayers);
    
    updateLayers();

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
      canvas.off("selection:created", updateLayers);
      canvas.off("selection:cleared", updateLayers);
      canvas.off("selection:updated", updateLayers);
    };
  }, [canvas]);

  const toggleVisibility = (obj: FabricObject) => {
    obj.set("visible", !obj.visible);
    canvas?.requestRenderAll();
  };

  const toggleLock = (obj: FabricObject) => {
    const isLocked = obj.lockMovementX;
    obj.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      editable: isLocked,
      selectable: true // Keep selectable so user can unlock via panel
    });
    canvas?.requestRenderAll();
  };

  const deleteObject = (obj: FabricObject) => {
    canvas?.remove(obj);
    canvas?.discardActiveObject();
    canvas?.requestRenderAll();
  };

  const selectObject = (obj: FabricObject) => {
    if (!obj.visible) return;
    canvas?.setActiveObject(obj);
    canvas?.requestRenderAll();
  };

  if (!canvas) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }} className="muted-text">
       <Activity size={32} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
       <p>Initializing Stratosphere...</p>
    </div>
  );

  return (
    <div className="stack" style={{ gap: "6px" }}>
      <AnimatePresence initial={false}>
        {layers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ textAlign: "center", padding: "40px 20px", border: "1px dashed var(--border)", borderRadius: "12px" }}
          >
            <p className="muted-text" style={{ fontSize: "13px" }}>No strategic layers detected.</p>
          </motion.div>
        ) : (
          layers.map((obj, i) => {
            const Icon = getIcon(obj.get("type"));
            const isActive = canvas.getActiveObject() === obj;
            const isLocked = obj.lockMovementX;
            const isVisible = obj.visible;

            return (
              <motion.div 
                key={(obj as any).id || i}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`layer-item ${isActive ? 'active' : ''}`}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 12px", 
                  background: isActive ? "rgba(139, 61, 255, 0.1)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "0.2s",
                  opacity: isVisible ? 1 : 0.4
                }}
                onClick={() => selectObject(obj)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                   <div style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }}>
                      <Icon size={16} />
                   </div>
                   <span style={{ fontSize: "13px", fontWeight: i === 0 ? "700" : "600", color: isActive ? "white" : "var(--text)" }}>
                      {getDisplayName(obj, layers.length - 1 - i)}
                   </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <button 
                     className="layer-action-btn"
                     onClick={(e) => { e.stopPropagation(); toggleLock(obj); }}
                     style={{ color: isLocked ? "var(--primary)" : "var(--text-muted)" }}
                   >
                     {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                   </button>
                   <button 
                     className="layer-action-btn"
                     onClick={(e) => { e.stopPropagation(); toggleVisibility(obj); }}
                     style={{ color: isVisible ? "var(--text)" : "var(--text-muted)" }}
                   >
                     {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                   </button>
                   <button 
                     className="layer-action-btn hover-danger"
                     onClick={(e) => { e.stopPropagation(); deleteObject(obj); }}
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              </motion.div>
            );
          })
        )}
      </AnimatePresence>

      <style jsx>{`
        .layer-item:hover {
           background: rgba(255,255,255,0.05);
           border-color: var(--border-active);
        }
        .layer-item.active {
           box-shadow: 0 0 15px var(--primary-glow);
        }
        .layer-action-btn {
           width: 28px;
           height: 28px;
           border-radius: 6px;
           background: transparent;
           border: none;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: 0.2s;
           opacity: 0.6;
        }
        .layer-action-btn:hover {
           background: rgba(255,255,255,0.1);
           opacity: 1;
        }
        .layer-action-btn.hover-danger:hover {
           color: var(--danger) !important;
           background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
}
