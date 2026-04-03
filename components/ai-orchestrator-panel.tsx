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
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Users
} from "lucide-react";
import { STRATEGIC_FRAMEWORKS } from "../lib/strategic-frameworks";
import { createLogicConnector } from "../lib/fabric";
import { generateSmartLayout, recalibrateStrategicLayout, calculateLogicMoatDensity } from "../lib/fabric-layout";
import { calculateStrategicDNA, StrategicInsight } from "../lib/strategic-intelligence";
import { useToast } from "./strategic-toast";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function AIOrchestratorPanel({ 
  canvas, 
  brandColors,
  onPushHistory
}: { 
  canvas: Canvas | null, 
  brandColors?: any,
  onPushHistory: () => void
}) {
  const [activeFramework, setActiveFramework] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<"orchestrate" | "insights">("orchestrate");
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [input, setInput] = useState("");

  const { score, insights } = calculateStrategicDNA(canvas);
  const { showToast } = useToast();
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/stratosphere" }),
    onFinish: ({ message }) => {
       if (message.parts && canvas) {
          message.parts.forEach((part: any) => {
             if (part.type === 'tool-invocation' && part.toolInvocation.toolName === 'generateStrategicLayout') {
                const { framework: fwKey, nodes } = part.toolInvocation.args;
                const fw = STRATEGIC_FRAMEWORKS[fwKey];
                setSaveMessage(`DESIGN_SYNTHESIZED: ${fw?.name.toUpperCase() || fwKey.toUpperCase()}`);
                generateSmartLayout(canvas, nodes || [], brandColors, fw);
                onPushHistory();
             }

             if (part.type === 'tool-invocation' && part.toolInvocation.toolName === 'generateMotionDesign') {
                const config = part.toolInvocation.args;
                setSaveMessage(`MOTION_SYNTHESIZED: ${config.style.toUpperCase()}`);
                
                // Dispatch event for MotionStudioPanel
                window.dispatchEvent(new CustomEvent("centurion-ai-config", { detail: config }));
                
                // Switch Sidebar tab via parent (this requires a callback, but for now we'll assume a global state or simple event)
                showToast(`AI generated a new ${config.style} motion design.`, "success");
             }
          });
       }
    }
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const synthesizeProtocol = async () => {
     if (!activeFramework) return;
     const fw = STRATEGIC_FRAMEWORKS[activeFramework];
     await sendMessage({
        text: `Synthesize a ${fw.name} protocol for: ${input || "Standard strategic optimization"}. Use the generateStrategicLayout tool.`
     });
  };

  const startVoiceProtocol = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setPrompt("Generate a SWOT analysis for a luxury SaaS platform...");
    }, 3000);
  };

  const triggerRecalibration = () => {
     if (!canvas) return;
     setIsRecalibrating(true);
     setTimeout(() => {
        recalibrateStrategicLayout(canvas);
        setIsRecalibrating(false);
     }, 1500);
  };

  const logicMoatScore = calculateLogicMoatDensity(canvas);

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

      {/* Tab Controller */}
      <div className="tab-controller glass-panel">
         <button onClick={() => setActiveTab("orchestrate")} className={`tab-btn ${activeTab === "orchestrate" ? 'active' : ''}`}>ORCHESTRATE</button>
         <button onClick={() => setActiveTab("insights")} className={`tab-btn ${activeTab === "insights" ? 'active' : ''}`}>
            INSIGHTS 
            {insights.length > 0 && <span className="tab-badge">{insights.length}</span>}
         </button>
      </div>

      {activeTab === "orchestrate" ? (
        <div className="stack" style={{ gap: "28px" }}>
          {/* Strategic Intent Input */}
          <div className="stack" style={{ gap: "12px" }}>
             <div className="badge">Strategic Intent</div>
             <div style={{ position: "relative" }}>
                <textarea 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
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

          {/* Neural Logs - REAL-TIME STREAMING */}
                 <div className="neural-log stack" style={{ gap: "4px", padding: "12px" }}>
                    {messages.map((m, i) => (
                        <div key={i} className={`log-entry ${m.role}`}>
                           <span className="log-role">[{m.role.toUpperCase()}]</span>
                           <span className="log-text">
                              {m.parts 
                                ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(' ') 
                                : (m as any).content}
                           </span>
                        </div>
                    ))}
                 </div>
        </div>
      ) : (
        <div className="stack" style={{ gap: "24px" }}>
           <div className="dna-score-container">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
                 <div className="badge">Strategic DNA</div>
                 <div style={{ fontSize: "32px", fontWeight: "900", color: score > 70 ? "var(--success)" : "var(--primary)" }}>{score}%</div>
              </div>
              <div className="dna-bar-bg">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} className="dna-bar-fill" />
              </div>
              <p className="muted-text" style={{ fontSize: "11px", marginTop: "12px", fontWeight: "600" }}>
                 Score based on node density, logical connectivity (Logic Moat), and protocol completion.
              </p>
           </div>

           <div className="stack" style={{ gap: "12px" }}>
              <div className="badge">Tactical Telemetry</div>
              {insights.length > 0 ? insights.map((insight) => (
                 <div key={insight.id} className={`insight-card ${insight.type}`}>
                    {insight.type === "warning" ? <AlertCircle size={14} /> : <TrendingUp size={14} />}
                    <span>{insight.message}</span>
                 </div>
              )) : (
                 <div className="insight-card success">
                    <CheckCircle2 size={14} />
                    <span>Framework Optimized. Strategy fully operational.</span>
                 </div>
              )}
           </div>

           <div className="logic-moat-card glass-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                 <span style={{ fontSize: "10px", fontWeight: "900", letterSpacing: "1px" }}>LOGIC_MOAT_DENSITY</span>
                 <span style={{ fontSize: "12px", fontWeight: "900", color: logicMoatScore > 70 ? "var(--success)" : "var(--primary)" }}>{logicMoatScore}%</span>
              </div>
              <div className="dna-bar-bg" style={{ height: "4px" }}>
                 <motion.div initial={{ width: 0 }} animate={{ width: `${logicMoatScore}%` }} className="dna-bar-fill" />
              </div>
              <button 
                 onClick={triggerRecalibration}
                 className={`btn-recalibrate ${isRecalibrating ? 'active' : ''}`}
                 disabled={isRecalibrating}
                 style={{ width: "100%", marginTop: "16px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "8px", height: "36px", fontSize: "10px", fontWeight: "800", color: "white", cursor: "pointer" }}
              >
                 {isRecalibrating ? "NEURAL_SWEEP_IN_PROGRESS..." : "RECALIBRATE_PROTOCOL"}
              </button>
           </div>
        </div>
      )}

      {/* Action Controller */}
      <div style={{ marginTop: "8px" }}>
         <button 
           className={`btn-pro ${isLoading ? 'btn-secondary' : 'btn-primary'}`}
           style={{ width: "100%", height: "56px", gap: "10px", position: "relative", overflow: "hidden" }}
           onClick={synthesizeProtocol}
           disabled={!activeFramework || isLoading}
         >
           {isLoading ? (
             <div className="recalibration-container">
               <Wand2 size={18} className="animate-spin" />
               <span>SYNTHESIZING_STRATEGIC_PULSE...</span>
               <div className="recalibration-progress" style={{ width: `80%` }} />
             </div>
           ) : (
             <><Brain size={20} /> INITIALIZE_SINGULARITY</>
           )}
         </button>
      </div>

      <div className="collaboration-telemetry glass-panel" style={{ marginTop: "24px" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               <Users size={14} color="var(--primary)" />
               <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px" }}>LIVE_ARCHITECTS</span>
            </div>
            <div className="badge-mini">3_ACTIVE</div>
         </div>
         <div className="stack" style={{ gap: "12px" }}>
            <div className="architect-row">
               <div className="avatar">BS</div>
               <div className="stack" style={{ gap: "2px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800" }}>Bassam S.</span>
                  <span className="muted-text" style={{ fontSize: "9px" }}>FOCUS: REFINING_STRENGTHS</span>
               </div>
               <div className="ping-dot" />
            </div>
            <div className="architect-row">
               <div className="avatar">JD</div>
               <div className="stack" style={{ gap: "2px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800" }}>John Doe</span>
                  <span className="muted-text" style={{ fontSize: "9px" }}>FOCUS: ANALYZING_THREATS</span>
               </div>
            </div>
         </div>
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
         .tab-controller {
            display: flex;
            background: rgba(0,0,0,0.2) !important;
            padding: 4px;
            border-radius: 10px;
         }
         .tab-btn {
            flex: 1;
            height: 32px;
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            cursor: pointer;
            border-radius: 8px;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
         }
         .tab-btn.active {
            background: rgba(255,255,255,0.05);
            color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
         }
         .tab-badge {
            width: 14px;
            height: 14px;
            background: var(--primary);
            border-radius: 50%;
            font-size: 8px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
         }
         .dna-score-container {
            background: rgba(139, 61, 255, 0.05);
            border: 1px solid rgba(139, 61, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
         }
         .dna-bar-bg {
            height: 8px;
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
            overflow: hidden;
         }
         .dna-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--success));
         }
         .insight-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 12px;
            font-weight: 600;
         }
         .insight-card.warning { color: var(--danger); border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.03); }
         .insight-card.success { color: var(--success); border-color: rgba(0, 200, 150, 0.2); background: rgba(0, 200, 150, 0.03); }
         .insight-card.info { color: var(--primary); border-color: rgba(139, 61, 255, 0.2); background: rgba(139, 61, 255, 0.03); }
         
         .recalibration-container {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            justify-content: center;
         }
         .recalibration-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 4px;
            background: var(--primary);
            transition: 0.5s;
            box-shadow: 0 0 10px var(--primary-glow);
         }
         .collaboration-telemetry {
            padding: 16px;
            background: rgba(13, 16, 23, 0.4) !important;
            border-radius: 12px;
         }
         .badge-mini {
            font-size: 8px;
            font-weight: 900;
            padding: 2px 6px;
            background: rgba(139, 61, 255, 0.1);
            color: var(--primary);
            border-radius: 4px;
         }
         .architect-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            background: rgba(255,255,255,0.02);
            border-radius: 8px;
            position: relative;
         }
         .architect-row .avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--primary-glow);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 800;
         }
         .ping-dot {
            position: absolute;
            right: 12px;
            width: 6px;
            height: 6px;
            background: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--success);
            animation: ping 2s infinite;
         }
         @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(3); opacity: 0; }
         }
         .logic-moat-card {
            padding: 16px;
            background: rgba(139, 61, 255, 0.03) !important;
            border-radius: 12px;
            border: 1px solid rgba(139, 61, 255, 0.1);
         }
         .btn-recalibrate:hover { background: rgba(255,255,255,0.1) !important; border-color: var(--primary) !important; }
         .btn-recalibrate.active { border-color: var(--primary) !important; box-shadow: 0 0 15px var(--primary-glow); }

         .neural-log-line {
            display: flex;
            gap: 10px;
            font-size: 11px;
            color: var(--text-muted);
            font-family: monospace;
            line-height: 1.4;
            margin-bottom: 8px;
         }
         .neural-log-line span { color: white; opacity: 0.9; }
      `}</style>
    </div>
  );
}
