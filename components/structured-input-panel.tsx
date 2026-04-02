"use client";

import React, { useState } from "react";
import { Canvas } from "fabric";
import { generateSmartLayout } from "../lib/fabric-layout";
import { STRATEGIC_FRAMEWORKS } from "../lib/strategic-frameworks";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface StructureBlock {
  id: string;
  type: "title" | "subtitle" | "paragraph" | "bullet";
  content: string;
}

export function StructuredInputPanel({ canvas, brandColors }: { canvas: Canvas | null, brandColors: any }) {
  const [blocks, setBlocks] = useState<StructureBlock[]>([
    { id: "1", type: "title", content: "Executive Strategy" },
    { id: "2", type: "paragraph", content: "Our core advantages over generic drag-and-drop tooling:" },
    { id: "3", type: "bullet", content: "Semantic Layout Tracking" },
    { id: "4", type: "bullet", content: "Cascading Coordinate Physics" },
    { id: "5", type: "bullet", content: "Ghosted Visual Anchoring" }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const updateBlock = (id: string, content: string) => {
    setBlocks(b => b.map(x => x.id === id ? { ...x, content } : x));
  };
  
  const addBlock = (type: StructureBlock["type"]) => {
    setBlocks([...blocks, { id: Math.random().toString(), type, content: "New " + type }]);
  };

  const applyFramework = (key: string) => {
    const fw = STRATEGIC_FRAMEWORKS[key];
    if (!fw) return;
    
    setIsGenerating(true);
    // Simulate AI "Thinking"
    setTimeout(() => {
      const newBlocks = fw.blocks.map((b, i) => ({ ...b, id: `ai-${key}-${i}` }));
      setBlocks(newBlocks);
      setIsGenerating(false);
      // Auto-sync if canvas exists
      if (canvas) generateSmartLayout(canvas, newBlocks, brandColors);
    }, 600);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Try Chrome!");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      // Smart Framework Detection
      if (transcript.includes("swot")) applyFramework("swot");
      else if (transcript.includes("okr")) applyFramework("okr");
      else if (transcript.includes("pitch")) applyFramework("product_hunt");
      else if (transcript.includes("problem")) applyFramework("problem_solution");
      else {
        // Fallback: Add as a new paragraph
        setBlocks(b => [...b, { id: Math.random().toString(), type: "paragraph", content: transcript }]);
      }
    };
    
    recognition.start();
  };

  const syncToCanvas = () => {
    if (!canvas) return;
    generateSmartLayout(canvas, blocks, brandColors);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "12px", background: "rgba(139, 61, 255, 0.05)", border: "1px solid rgba(139, 61, 255, 0.1)", borderRadius: "8px", marginBottom: "8px" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "16px" }}>✨</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#8b3dff", letterSpacing: "0.5px", textTransform: "uppercase" }}>Strategic AI Assistant</span>
         </div>
         <select 
           defaultValue=""
           onChange={(e) => applyFramework(e.target.value)}
           style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--border)", padding: "8px", borderRadius: "4px", fontSize: "12px", color: "var(--text)" }}
         >
           <option value="" disabled>Select Strategic Framework...</option>
           {Object.entries(STRATEGIC_FRAMEWORKS).map(([key, fw]) => (
             <option key={key} value={key}>{fw.name}</option>
           ))}
         </select>
         <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px", fontStyle: "italic" }}>
           AI logic will automatically populate and reflow the canvas.
         </p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <button 
           className={isListening ? "primaryButton" : "secondaryButton"} 
           style={{ flex: 1, gap: "8px", background: isListening ? "#ff4d4d" : undefined, borderColor: isListening ? "#ff4d4d" : undefined }}
           onClick={handleVoiceInput}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          {isListening ? "Listening..." : "Dictate Strategy"}
        </button>
      </div>

      <p style={{ fontSize: "12px", color: "var(--muted)" }}>
        Type your arguments below. The Logic Engine will automatically orchestrate the layouts, pages, and reflow logic.
      </p>

      {isGenerating && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--primary)", fontSize: "13px" }}>
           Synthesizing Intelligence...
        </div>
      )}

      {!isGenerating && blocks.map((block, i) => (
        <div key={block.id} style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "var(--panel-hover)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "var(--muted)" }}>
            {block.type === "bullet" ? "•" : "T"}
          </div>
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            style={{ 
              flex: 1, 
              background: "var(--input-bg)", 
              border: "1px solid var(--border)", 
              borderRadius: "4px",
              padding: "8px",
              color: "var(--text)",
              minHeight: block.type === "paragraph" ? "60px" : "36px",
              fontSize: "13px",
              resize: "vertical"
            }}
          />
        </div>
      ))}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button className="secondaryButton" style={{ flex: 1 }} onClick={() => addBlock("paragraph")}>+ Paragraph</button>
        <button className="secondaryButton" style={{ flex: 1 }} onClick={() => addBlock("bullet")}>+ Bullet</button>
      </div>

      <button className="primaryButton" style={{ marginTop: "12px", width: "100%" }} onClick={syncToCanvas}>
        Generate Smart Layout
      </button>
    </div>
  );
}
