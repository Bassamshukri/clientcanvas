"use client";

import React, { useEffect, useState } from "react";
import { Canvas, Textbox } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Code, Terminal, Hash, Cpu, Share2 } from "lucide-react";

export function CodeExportPanel({ canvas }: { canvas: Canvas | null }) {
  const [cssCode, setCssCode] = useState<string>("");
  const [tailwindCode, setTailwindCode] = useState<string>("");
  const [jsonManifest, setJsonManifest] = useState<string>("");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  useEffect(() => {
    if (!canvas) return;

    const updateCode = () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) {
         setCssCode("/* Select a strategic element to generate CSS protocol */");
         setTailwindCode("<!-- Select an element for Tailwind manifest -->");
         setJsonManifest("// Protocol Metadata Pending...");
         return;
      }
      
      const isText = activeObject.type === "textbox" || activeObject.type === "text" || activeObject.type === "i-text";
      const width = Math.round((activeObject.width || 0) * (activeObject.scaleX || 1));
      const height = Math.round((activeObject.height || 0) * (activeObject.scaleY || 1));
      const left = Math.round(activeObject.left || 0);
      const top = Math.round(activeObject.top || 0);
      const fill = activeObject.fill as string || "transparent";
      const logicId = (activeObject as any).id || "unregistered";
      
      let css = `.strategy_node {\n`;
      css += `  position: absolute;\n`;
      css += `  left: ${left}px;\n`;
      css += `  top: ${top}px;\n`;
      css += `  width: ${width}px;\n`;
      css += `  height: ${height}px;\n`;
      
      let twClasses = `absolute left-[${left}px] top-[${top}px] w-[${width}px] h-[${height}px]`;

      if (isText) {
        const tb = activeObject as Textbox;
        css += `  color: ${fill};\n`;
        css += `  font-family: '${tb.fontFamily || "Inter"}';\n`;
        css += `  font-size: ${tb.fontSize || 16}px;\n`;
        css += `  font-weight: ${tb.fontWeight || 'normal'};\n`;
        
        twClasses += ` text-[${fill}] font-${tb.fontWeight === 'bold' ? 'bold' : 'normal'} text-[${tb.fontSize || 16}px]`;
      } else {
        css += `  background-color: ${fill};\n`;
        twClasses += ` bg-[${fill}]`;
      }
      css += `}`;
      
      setCssCode(css);
      setTailwindCode(`<div className="${twClasses.trim()}">\n  {/* Strategic Content */}\n</div>`);
      
      const manifest = {
         id: logicId,
         type: activeObject.type,
         dimensions: { width, height },
         coordinates: { left, top },
         thematic: { fill }
      };
      setJsonManifest(JSON.stringify(manifest, null, 2));
    };

    updateCode();
    canvas.on("selection:created", updateCode);
    canvas.on("selection:updated", updateCode);
    canvas.on("selection:cleared", updateCode);
    canvas.on("object:modified", updateCode);

    return () => {
      canvas.off("selection:created", updateCode);
      canvas.off("selection:updated", updateCode);
      canvas.off("selection:cleared", updateCode);
      canvas.off("object:modified", updateCode);
    };
  }, [canvas]);

  return (
    <div className="stack" style={{ gap: "24px" }}>
      <div style={{ padding: "16px", background: "rgba(139, 61, 255, 0.05)", border: "1px solid var(--primary-glow)", borderRadius: "12px" }}>
         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "8px" }}>
            <Cpu size={16} color="var(--primary)" />
            <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase" }}>Strategic Bridge v1.0</span>
         </div>
         <p className="muted-text" style={{ fontSize: "12px", margin: 0 }}>
            Automated protocol extraction for rapid high-fidelity implementation.
         </p>
      </div>

      <div className="terminal-box">
         <div className="terminal-header">
            <div className="badge">Tailwind / React</div>
            <button className="copy-btn" onClick={() => copyToClipboard(tailwindCode, "tw")}>
               {copiedTab === "tw" ? <Check size={14} /> : <Copy size={14} />}
            </button>
         </div>
         <pre className="protocol-code success">{tailwindCode}</pre>
      </div>

      <div className="terminal-box">
         <div className="terminal-header">
            <div className="badge">Protocol Manifest (JSON)</div>
            <button className="copy-btn" onClick={() => copyToClipboard(jsonManifest, "json")}>
               {copiedTab === "json" ? <Check size={14} /> : <Copy size={14} />}
            </button>
         </div>
         <pre className="protocol-code primary">{jsonManifest}</pre>
      </div>

      <div className="terminal-box">
         <div className="terminal-header">
            <div className="badge">Vanilla CSS Protocol</div>
            <button className="copy-btn" onClick={() => copyToClipboard(cssCode, "css")}>
               {copiedTab === "css" ? <Check size={14} /> : <Copy size={14} />}
            </button>
         </div>
         <pre className="protocol-code">{cssCode}</pre>
      </div>

      <style jsx>{`
        .terminal-box {
           background: rgba(0,0,0,0.3);
           border: 1px solid var(--border);
           border-radius: 12px;
           overflow: hidden;
        }
        .terminal-header {
           background: rgba(255,255,255,0.03);
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 10px 16px;
           border-bottom: 1px solid var(--border);
        }
        .protocol-code {
           padding: 16px;
           margin: 0;
           font-family: 'JetBrains Mono', 'Fira Code', monospace;
           font-size: 12px;
           color: #d1d5db;
           white-space: pre-wrap;
           line-height: 1.6;
           overflow-x: auto;
        }
        .protocol-code.success { color: #86efac; }
        .protocol-code.primary { color: #c084fc; }
        
        .copy-btn {
           background: transparent;
           border: none;
           color: var(--text-muted);
           cursor: pointer;
           transition: 0.2s;
           padding: 4px;
           border-radius: 4px;
        }
        .copy-btn:hover {
           background: rgba(255,255,255,0.05);
           color: white;
        }
      `}</style>
    </div>
  );
}
