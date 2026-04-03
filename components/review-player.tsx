"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, Point } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { createEditorCanvas, loadCanvasJson } from "../lib/fabric";
import { PresentationMode } from "./presentation-mode";
import { Layout, Maximize, ShieldCheck } from "lucide-react";

interface ReviewPlayerProps {
  design: {
    id: string;
    title: string;
    canvas_json: any;
  };
}

export function ReviewPlayer({ design }: ReviewPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = createEditorCanvas(
      canvasRef.current,
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    fabricRef.current = canvas;

    const loadData = async () => {
      if (design.canvas_json) {
        const json = Array.isArray(design.canvas_json) ? design.canvas_json[0].json : design.canvas_json;
        if (json) {
           await loadCanvasJson(canvas, json);
        }
      }
      setLoading(false);
    };

    loadData();

    return () => {
       canvas.dispose();
    };
  }, [design.canvas_json]);

  return (
    <div className="review-hub" style={{ width: "100vw", height: "100vh", background: "#0a0a0b", overflow: "hidden" }}>
       {/* Preview HUD */}
       <div className="review-header glass-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
             <div className="hub-logo"><Layout size={18} color="white" /></div>
             <div>
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "800", textTransform: "uppercase" }}>{design.title}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--success)", fontWeight: "800" }}>
                   <ShieldCheck size={10} /> PROTOCOL_VERIFIED_SECURE
                </div>
             </div>
          </div>

          <button onClick={() => setIsPresenting(true)} className="btn-pro btn-primary">
             <Maximize size={16} /> INITIALIZE_REVIEW
          </button>
       </div>

       <div ref={containerRef} style={{ width: "100%", height: "100%", cursor: "grab" }}>
          <canvas ref={canvasRef} />
       </div>

       <AnimatePresence>
          {loading && (
             <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-hub">
                <div className="loader" />
                <span style={{ fontSize: "12px", fontWeight: "800", letterSpacing: "2px", opacity: 0.5 }}>SYNCING_STRATEGY...</span>
             </motion.div>
          )}
          {isPresenting && fabricRef.current && (
             <PresentationMode canvas={fabricRef.current} onClose={() => setIsPresenting(false)} />
          )}
       </AnimatePresence>

       <style jsx>{`
          .review-hub {
             position: relative;
             color: white;
             font-family: 'Inter', sans-serif;
          }
          .review-header {
             position: absolute;
             top: 24px;
             left: 24px;
             right: 24px;
             height: 72px;
             display: flex;
             align-items: center;
             justify-content: space-between;
             padding: 0 24px;
             border-radius: 16px;
             z-index: 100;
             background: rgba(13,16,23,0.8) !important;
          }
          .hub-logo {
             width: 36px;
             height: 36px;
             background: var(--primary);
             border-radius: 10px;
             display: flex;
             align-items: center;
             justify-content: center;
             box-shadow: 0 0 20px var(--primary-glow);
          }
          .loading-hub {
             position: fixed;
             inset: 0;
             z-index: 1000;
             background: #0a0a0b;
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: center;
             gap: 24px;
          }
          .loader {
             width: 48px;
             height: 48px;
             border: 4px solid var(--primary);
             border-top-color: transparent;
             border-radius: 50%;
             animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
       `}</style>
    </div>
  );
}
