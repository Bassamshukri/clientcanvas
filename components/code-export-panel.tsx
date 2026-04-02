"use client";

import React, { useEffect, useState } from "react";
import { Canvas, Textbox } from "fabric";

export function CodeExportPanel({ canvas }: { canvas: Canvas | null }) {
  const [cssCode, setCssCode] = useState<string>("");
  const [tailwindCode, setTailwindCode] = useState<string>("");

  useEffect(() => {
    if (!canvas) return;

    const updateCode = () => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) {
         setCssCode("/* Select an object on the canvas to see its CSS */");
         setTailwindCode("<!-- Select an object to generate classes -->");
         return;
      }
      
      const isText = activeObject.type === "textbox" || activeObject.type === "text" || activeObject.type === "i-text";
      const width = Math.round((activeObject.width || 0) * (activeObject.scaleX || 1));
      const height = Math.round((activeObject.height || 0) * (activeObject.scaleY || 1));
      const left = Math.round(activeObject.left || 0);
      const top = Math.round(activeObject.top || 0);
      const fill = activeObject.fill as string || "transparent";
      
      let css = `.component {\n`;
      css += `  position: absolute;\n`;
      css += `  left: ${left}px;\n`;
      css += `  top: ${top}px;\n`;
      css += `  width: ${width}px;\n`;
      css += `  height: ${height}px;\n`;
      
      if (!isText) {
        css += `  background-color: ${fill};\n`;
      }
      
      let twClasses = `absolute left-[${left}px] top-[${top}px] w-[${width}px] h-[${height}px]`;

      if (isText) {
        const tb = activeObject as Textbox;
        css += `  color: ${fill};\n`;
        css += `  font-family: '${tb.fontFamily || "Inter"}';\n`;
        css += `  font-size: ${tb.fontSize || 16}px;\n`;
        css += `  font-weight: ${tb.fontWeight || 'normal'};\n`;
        
        twClasses += ` text-[${fill}] font-${tb.fontWeight === 'bold' ? 'bold' : 'normal'} text-[${tb.fontSize || 16}px]`;
        if (tb.textAlign === "center") twClasses += " text-center";
        else if (tb.textAlign === "right") twClasses += " text-right";
        else twClasses += " text-left";
      } else {
        twClasses += ` bg-[${fill}]`;
      }
      
      css += `}`;
      
      setCssCode(css);
      setTailwindCode(`<div className="${twClasses.trim()}">\n  {/* Content */}\n</div>`);
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
          Tailwind / React
        </label>
        <pre style={{ background: "#0e1217", color: "#00c896", padding: "12px", borderRadius: "8px", fontSize: "12px", overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {tailwindCode}
        </pre>
      </div>

      <div>
        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>
          Vanilla CSS
        </label>
        <pre style={{ background: "#0e1217", color: "#8b3dff", padding: "12px", borderRadius: "8px", fontSize: "12px", overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {cssCode}
        </pre>
      </div>
      <p style={{ fontSize: "12px", color: "var(--muted)" }}>
        Select any text block, shape, or group to bridge your design directly to development.
      </p>
    </div>
  );
}
