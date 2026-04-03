"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Canvas } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Activity, 
  Monitor, 
  Settings, 
  Zap,
  Layout,
  Command
} from "lucide-react";

import { AppHeader } from "./app-header";
import { calculateStrategicDNA } from "../lib/strategic-intelligence";
import { getStrategicSequence } from "../lib/fabric-layout";

interface PresentationModeProps {
  canvas: Canvas | null;
  onClose: () => void;
}

export function PresentationMode({ canvas, onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const sequence = getStrategicSequence(canvas);
  const totalSlides = sequence.length || 1;

  const focusNode = useCallback((index: number) => {
     if (!canvas || !sequence[index]) return;
     const node = sequence[index];
     
     // Cinematic Pan & Zoom
     const zoom = 1.2;
     const vpt = canvas.viewportTransform;
     if (vpt) {
       vpt[0] = zoom;
       vpt[1] = 0;
       vpt[2] = 0;
       vpt[3] = zoom;
       vpt[4] = (canvas.width! / 2) - (node.left! * zoom) - (node.width! * zoom / 2);
       vpt[5] = (canvas.height! / 2) - (node.top! * zoom) - (node.height! * zoom / 2);
       canvas.requestRenderAll();
     }
  }, [canvas, sequence]);

  useEffect(() => {
    if (!canvas) return;
    if (sequence.length > 0) {
       focusNode(currentSlide);
    } else {
       canvas.setZoom(0.85);
       canvas.requestRenderAll();
    }
  }, [canvas, currentSlide, focusNode, sequence.length]);

  useEffect(() => {
     if (!isAutoPlaying || !canvas) return;
     const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
     }, 5000);
     return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, canvas]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!canvas) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#080809",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Background Pulse Effect */}
      <div className="presentation-pulse" />

      {/* Strategic HUD Header */}
      <div className="hud-header glass-panel">
         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="hud-badge">
               <Activity size={14} className={isAutoPlaying ? "animate-pulse" : ""} /> {isAutoPlaying ? "AUTONOMIC_SEQUENCE_ACTIVE" : "MANUAL_DELIBERATION"}
            </div>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
            <h2 style={{ fontSize: 13, fontWeight: "800", letterSpacing: "1px", margin: 0, opacity: 0.8 }}>
               STRATEGIC_OPERATIONS_MODE // CL-NAV_V0.9
            </h2>
         </div>

         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="hud-stat">
               <span style={{ fontSize: 10, opacity: 0.5 }}>LATENCY</span>
               <span style={{ fontSize: 11, fontWeight: "700" }}>32MS_NOMINAL</span>
            </div>
            <button onClick={onClose} className="hud-exit-btn">
               <X size={18} /> ESC
            </button>
         </div>
      </div>

      {/* Main Command Room (Viewport) */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* The canvas is rendered here by the parent's absolute positioning 
              We are just providing the HUD and cinematic overlay. */}
          <div className="hud-corners" />
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ position: "absolute", bottom: "40px", textAlign: "center", width: "100%" }}
          >
             <p className="muted-text" style={{ fontSize: 12, fontWeight: "700", letterSpacing: "1px" }}>
                COMMAND CENTER // USE MOUSE TO NAVIGATE PROTOCOL
             </p>
          </motion.div>
      </div>

      {/* Strategic Controls HUD */}
      <div className="hud-footer">
          <div className="hud-controls glass-panel">
             <button onClick={() => setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides)} className="hud-nav-btn"><ChevronLeft size={20} /></button>
             <div style={{ padding: "0 24px", borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 10, fontWeight: "800", opacity: 0.5 }}>LOGIC_NODE</div>
                <span style={{ fontSize: 14, fontWeight: "900", color: "var(--primary)" }}>{String(currentSlide + 1).padStart(2, '0')}</span>
                <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: 13, fontWeight: "800" }}>{sequence[currentSlide]?.id?.toUpperCase() || "STRATEGIC_PROTOCOL"}</span>
             </div>
             <button onClick={() => setCurrentSlide(prev => (prev + 1) % totalSlides)} className="hud-nav-btn"><ChevronRight size={20} /></button>
          </div>

          <div style={{ position: "absolute", bottom: 40, left: 40, display: "flex", gap: 12 }}>
             <button 
               onClick={() => setIsAutoPlaying(!isAutoPlaying)}
               className={`hud-mini-stat btn-telemetry ${isAutoPlaying ? 'active' : ''}`}
             >
                <Zap size={14} /> {isAutoPlaying ? "STOP_AUTO" : "AUTO_PLAY"}
             </button>
             <div className="hud-mini-stat"><Monitor size={14} /> 4K_UHD</div>
             <div className="hud-mini-stat"><Command size={14} /> SYNCED</div>
          </div>

          {/* Node Metadata Card */}
          <AnimatePresence mode="wait">
             <motion.div 
               key={currentSlide}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="node-telemetry-card glass-panel"
             >
                <div className="badge">Tactical Metadata</div>
                <h4 style={{ margin: "8px 0", fontSize: "14px", fontWeight: "900" }}>{sequence[currentSlide]?.id?.split('-')[0].toUpperCase()}</h4>
                <div style={{ fontSize: "11px", opacity: 0.6, lineHeight: "1.6" }}>
                   This logical node represents a core protocol element. Current impact alignment is nominal.
                </div>
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "var(--primary)", fontWeight: "800" }}>
                   <Activity size={12} /> TELEMETRY_STABLE
                </div>
             </motion.div>
          </AnimatePresence>
      </div>

      <style jsx>{`
        .hud-header {
           position: absolute;
           top: 24px;
           left: 24px;
           right: 24px;
           height: 64px;
           display: flex;
           align-items: center;
           justify-content: space-between;
           padding: 0 24px;
           border-radius: 12px;
           z-index: 100;
           border: 1px solid rgba(255,255,255,0.05);
           background: rgba(8, 8, 9, 0.6) !important;
        }
        .hud-badge {
           background: rgba(139, 61, 255, 0.15);
           color: var(--primary);
           padding: 6px 12px;
           border-radius: 6px;
           font-size: 11px;
           font-weight: "900";
           display: flex;
           align-items: center;
           gap: 8px;
           letter-spacing: 1px;
           border: 1px solid rgba(139, 61, 255, 0.2);
        }
        .hud-stat {
           display: flex;
           flex-direction: column;
           align-items: flex-end;
           margin-right: 20px;
        }
        .hud-exit-btn {
           background: rgba(255, 255, 255, 0.05);
           border: 1px solid rgba(255, 255, 255, 0.1);
           color: white;
           height: 40px;
           padding: 0 16px;
           border-radius: 8px;
           display: flex;
           align-items: center;
           gap: 10px;
           font-size: 11px;
           font-weight: "800";
           cursor: pointer;
           transition: 0.2s;
        }
        .hud-exit-btn:hover {
           background: rgba(239, 68, 68, 0.1);
           border-color: rgba(239, 68, 68, 0.3);
           color: var(--danger);
        }
        .hud-footer {
           position: absolute;
           bottom: 0;
           left: 0;
           right: 0;
           height: 120px;
           display: flex;
           justify-content: center;
           align-items: center;
           pointer-events: none;
        }
        .hud-controls {
           height: 56px;
           display: flex;
           background: rgba(8, 8, 9, 0.8) !important;
           border: 1px solid rgba(255, 255, 255, 0.1);
           border-radius: 28px;
           pointer-events: auto;
           overflow: hidden;
        }
        .hud-nav-btn {
           width: 56px;
           background: transparent;
           border: none;
           color: white;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: 0.2s;
        }
        .hud-nav-btn:hover {
           background: rgba(255,255,255,0.05);
        }
        .hud-mini-stat {
           font-size: 10px;
           font-weight: "800";
           color: rgba(255,255,255,0.4);
           display: flex;
           align-items: center;
           gap: 6px;
           letter-spacing: 1px;
        }
        .hud-corners {
           position: absolute;
           inset: 40px;
           border: 1px solid rgba(255,255,255,0.03);
           pointer-events: none;
        }
        .hud-corners::before, .hud-corners::after {
           content: '';
           position: absolute;
           width: 20px;
           height: 20px;
           border-color: rgba(255,255,255,0.1);
           border-style: solid;
        }
        .hud-corners::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
        .hud-corners::after { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }
        
        .presentation-pulse {
           position: absolute;
           inset: 0;
           background: radial-gradient(circle at 50% 50%, rgba(139, 61, 255, 0.03) 0%, transparent 70%);
           animation: h-pulse 8s infinite ease-in-out;
           pointer-events: none;
        }
        @keyframes h-pulse {
           0%, 100% { opacity: 0.5; transform: scale(1); }
           50% { opacity: 1; transform: scale(1.1); }
        }
         .btn-telemetry {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
         }
         .btn-telemetry:hover { background: rgba(255,255,255,0.1); }
         .btn-telemetry.active { background: var(--primary); border-color: var(--primary); color: white; }
         
         .node-telemetry-card {
            position: absolute;
            bottom: 40px;
            right: 40px;
            width: 280px;
            padding: 20px;
            background: rgba(13, 16, 23, 0.8) !important;
            border: 1px solid rgba(139, 61, 255, 0.2);
            border-radius: 16px;
            text-align: left;
         }
      `}</style>
    </motion.div>
  );
}
