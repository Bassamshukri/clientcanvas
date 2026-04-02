"use client";

import React, { useState } from "react";
import { Canvas } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Brain, 
  Mic, 
  Zap, 
  CheckCircle2, 
  Layout, 
  MessageSquare,
  Wand2,
  Cpu,
  ChevronRight
} from "lucide-react";
import { STRATEGIC_FRAMEWORKS } from "../lib/strategic-frameworks";
import { generateSmartLayout } from "../lib/fabric-layout";

export function AIOrchestratorPanel({ 
  canvas, 
  brandColors 
}: { 
  canvas: Canvas | null, 
  brandColors?: any 
}) {
  const [activeFramework, setActiveFramework] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [prompt, setPrompt] = useState("");

  const synthesizeProtocol = () => {
    if (!canvas || !activeFramework) return;
    
    setIsSynthesizing(true);
    // Simulate Neural Synthesis
    setTimeout(() => {
      const fw = STRATEGIC_FRAMEWORKS[activeFramework];
      if (fw) {
        const blocksWithIds = fw.blocks.map((b, i) => ({ ...b, id: `ai-${activeFramework}-${i}-${Date.now()}` }));
        generateSmartLayout(canvas, blocksWithIds, brandColors);
      }
      setIsSynthesizing(false);
    }, 1500);
  };

  const startVoiceProtocol = () => {
    setIsListening(true);
    // Simulated Voice capture for 3 seconds
    setTimeout(() => {
      setIsListening(false);
      setPrompt("Generate a SWOT analysis for a luxury SaaS platform...");
    }, 3000);
  };

  return (
    <div className="stack" style={{ gap: "28px" }}>
      {/* Intelligence Header */}
      <div style={{ padding: "20px", background: "rgba(139, 61, 255, 0.05)", border: "1px solid var(--primary-glow)", borderRadius: "16px", position: "relative", overflow: "hidden" }}>
         <div className="ai-pulse-bg" />
         <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 2 }}>
            <div style={{ width: 32, height: 32, background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px var(--primary-glow)" }}>
               <Sparkles size={18} color="white" />
            </div>
            <div>
               <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", letterSpacing: "1px" }}>STRATOSPHERE_AI</h4>
               <div style={{ fontSize: "10px", color: "var(--primary)", fontWeight: "700" }}>SYNTHESIS_ENGINE_READY</div>
            </div>
         </div>
      </div>

      {/* Strategic Intent Input */}
      <div className="stack" style={{ gap: "12px" }}>
         <div className="badge">Strategic Intent</div>
         <div style={{ position: "relative" }}>
            <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="Describe your design objective or use Voice Protocol..."
               style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", fontSize: "13px", height: "100px", color: "white", resize: "none" }}
            />
            <button 
              onClick={startVoiceProtocol}
              className={`voice-btn ${isListening ? 'active' : ''}`}
              style={{ position: "absolute", bottom: "12px", right: "12px" }}
            >
               <Mic size={16} color={isListening ? "var(--danger)" : "var(--primary)"} />
            </button>
         </div>
      </div>

      {/* Protocol Frameworks */}
      <div className="stack" style={{ gap: "16px" }}>
         <div className="badge">Strategic Frameworks</div>
         <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
            {Object.entries(STRATEGIC_FRAMEWORKS).map(([key, fw]) => (
               <button 
                 key={key}
                 className={`framework-card ${activeFramework === key ? 'active' : ''}`}
                 onClick={() => setActiveFramework(key)}
               >
                  <div className="framework-icon">
                     {key.includes('swot') ? <Layout size={16} /> : <Cpu size={16} />}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                     <div style={{ fontSize: "13px", fontWeight: "700" }}>{fw.name.toUpperCase()}</div>
                     <div className="muted-text" style={{ fontSize: "11px" }}>{fw.blocks.length} Neural Nodes Detected</div>
                  </div>
                  {activeFramework === key && <CheckCircle2 size={16} color="var(--primary)" />}
                  <ChevronRight size={14} className="muted-text" />
               </button>
            ))}
         </div>
      </div>

      {/* Action Controller */}
      <div style={{ marginTop: "8px" }}>
         <button 
           className={`btn-pro ${isSynthesizing ? 'btn-secondary' : 'btn-primary'}`}
           style={{ width: "100%", height: "48px", gap: "10px" }}
           onClick={synthesizeProtocol}
           disabled={!activeFramework || isSynthesizing}
         >
           {isSynthesizing ? (
             <><Wand2 size={18} className="animate-spin" /> SYNTHESIZING_PROTOCOL...</>
           ) : (
             <><Brain size={18} /> INITIALIZE_SYNTHESIS</>
           )}
         </button>
         <p style={{ textAlign: "center", fontSize: "10px", color: "var(--muted)", marginTop: "12px", letterSpacing: "1px" }}>
            AI WILL AUTOMATICALLY REFLOW VISUAL LAYERS.
         </p>
      </div>

      <style jsx>{`
        .ai-pulse-bg {
           position: absolute;
           inset: 0;
           background: radial-gradient(circle at 50% 50%, rgba(139, 61, 255, 0.1) 0%, transparent 100%);
           animation: h-pulse 4s infinite ease-in-out;
        }
        .framework-card {
           background: rgba(255,255,255,0.02);
           border: 1px solid var(--border);
           border-radius: 12px;
           padding: 12px 16px;
           display: flex;
           align-items: center;
           gap: 12px;
           transition: 0.2s;
           cursor: pointer;
           color: white;
        }
        .framework-card:hover {
           background: rgba(255,255,255,0.05);
           border-color: var(--border-active);
        }
        .framework-card.active {
           background: rgba(139, 61, 255, 0.1);
           border-color: var(--primary);
        }
        .framework-icon {
           width: 32px;
           height: 32px;
           background: rgba(255,255,255,0.03);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--text-muted);
        }
        .framework-card.active .framework-icon {
           color: var(--primary);
           background: rgba(139, 61, 255, 0.1);
        }
        .voice-btn {
           background: rgba(255,255,255,0.05);
           border: 1px solid var(--border);
           width: 32px;
           height: 32px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: 0.2s;
        }
        .voice-btn.active {
           animation: v-pulse 1.5s infinite;
           background: rgba(239, 68, 68, 0.1);
           border-color: var(--danger);
        }
        @keyframes v-pulse {
           0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
           70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
           100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes h-pulse {
           0%, 100% { opacity: 0.6; }
           50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
