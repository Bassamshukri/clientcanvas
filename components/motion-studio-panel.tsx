"use client";

import React, { useEffect, useRef, useState } from "react";
import { App } from "../wallpaper-motion-studio/src/core/app";
import { STYLE_REGISTRY } from "../wallpaper-motion-studio/src/styles/index";
import { Zap, Play, Pause, Save, Download, RefreshCw, Layers, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MotionStudioPanelProps {
  workspaceId?: string;
}

export function MotionStudioPanel({ workspaceId }: MotionStudioPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any>(null);
  const [state, setState] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"composition" | "atmosphere">("composition");

  useEffect(() => {
    if (!canvasRef.current || engineRef.current) return;

    // Initialize the Vanilla engine within React
    const engine = new App();
    // Overwrite the canvas reference
    engine.canvas = canvasRef.current;
    engine.ctx = canvasRef.current.getContext("2d")!;
    engine.init();
    
    engineRef.current = engine;
    setState(engine.state);

    // Sync state back from engine
    const syncInterval = setInterval(() => {
      if (engine.state !== state) {
        setState({ ...engine.state });
      }
    }, 500);

    const handleAIConfig = (e: any) => {
        const config = e.detail;
        if (engineRef.current) {
            Object.entries(config).forEach(([key, val]) => {
                engineRef.current.updateState(key, val);
            });
            setState({ ...engineRef.current.state });
        }
    };

    window.addEventListener("centurion-ai-config", handleAIConfig);

    return () => {
        clearInterval(syncInterval);
        window.removeEventListener("centurion-ai-config", handleAIConfig);
    };
  }, []);

  const updateEngine = (key: string, value: any) => {
    if (engineRef.current) {
        engineRef.current.updateState(key, value);
        setState({ ...engineRef.current.state });
    }
  };

  if (!state) return <div className="p-8 text-center muted-text underline-pro">INITIALIZING_MOTION_ENGINE...</div>;

  return (
    <div className="stack" style={{ gap: "24px" }}>
      <div className="glass-panel p-0 overflow-hidden" style={{ aspectRatio: "9/16", position: "relative" }}>
        <canvas 
            ref={canvasRef} 
            style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }} 
        />
        <div className="absolute top-4 right-4 flex gap-2">
            <button className="icon-btn-pro" onClick={() => updateEngine("animate", !state.animate)}>
                {state.animate ? <Pause size={14} /> : <Play size={14} />}
            </button>
        </div>
      </div>

      <div className="tabs-pro">
        <button 
            className={`tab-item ${activeTab === "composition" ? "active" : ""}`}
            onClick={() => setActiveTab("composition")}
        >
            <Layers size={14} /> COMPOSITION
        </button>
        <button 
            className={`tab-item ${activeTab === "atmosphere" ? "active" : ""}`}
            onClick={() => setActiveTab("atmosphere")}
        >
            <Zap size={14} /> ATMOSPHERE
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="stack"
            style={{ gap: "16px" }}
        >
            {activeTab === "composition" ? (
                <>
                    <div className="control-item">
                        <div className="label-row">
                            <span>STYLE MODULE</span>
                        </div>
                        <select 
                            className="input-pro"
                            value={state.style}
                            onChange={(e) => updateEngine("style", e.target.value)}
                        >
                            {Object.entries(STYLE_REGISTRY).map(([id, cfg]: [any, any]) => (
                                <option key={id} value={id}>{cfg.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="control-item">
                        <div className="label-row">
                            <span>VARIATION CHOICE</span>
                            <span className="badge">#{state.choice}</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" max="1000" 
                            value={state.choice}
                            onChange={(e) => updateEngine("choice", parseInt(e.target.value))}
                        />
                    </div>

                    <button className="btn-pro btn-primary w-full" onClick={() => updateEngine("choice", Math.floor(Math.random() * 1000))}>
                        <RefreshCw size={14} className="mr-2" /> REGENERATE_RANDOM
                    </button>
                </>
            ) : (
                <>
                    <div className="control-item">
                        <div className="label-row"><span>BLOOM_INTENSITY</span></div>
                        <input type="range" min="0" max="1" step="0.01" value={state.bloom} onChange={(e) => updateEngine("bloom", parseFloat(e.target.value))} />
                    </div>
                    <div className="control-item">
                        <div className="label-row"><span>PARTICLE_DENSITY</span></div>
                        <input type="range" min="0" max="1" step="0.01" value={state.particles} onChange={(e) => updateEngine("particles", parseFloat(e.target.value))} />
                    </div>
                </>
            )}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <button className="btn-pro btn-secondary" onClick={() => engineRef.current?.export("jpg")}>
            <Download size={14} className="mr-2" /> EXPORT_LOCAL
        </button>
        <button className="btn-pro btn-primary" onClick={() => console.log("Save to asset library logic here")}>
            <Save size={14} className="mr-2" /> SYNC_TO_ASSETS
        </button>
      </div>

      <style jsx>{`
        .tabs-pro {
            display: flex;
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
            padding: 4px;
            gap: 4px;
        }
        .tab-item {
            flex: 1;
            padding: 8px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border-radius: 6px;
            transition: 0.2s;
            opacity: 0.5;
        }
        .tab-item.active {
            background: rgba(139, 61, 255, 0.1);
            color: var(--primary);
            opacity: 1;
        }
        .icon-btn-pro {
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
      `}</style>
    </div>
  );
}
