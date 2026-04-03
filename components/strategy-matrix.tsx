"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas } from "fabric";
import { getStrategicSequence } from "../lib/fabric-layout";

export function StrategyMatrix({ canvas, active }: { canvas: Canvas | null, active: boolean }) {
  const nodes = useMemo(() => getStrategicSequence(canvas), [canvas, active]);

  if (!active || nodes.length === 0) return null;

  return (
    <div className="matrix-overlay">
       <div className="matrix-grid" />
       
       <svg className="matrix-svg">
          {nodes.map((node, i) => {
             if (i === 0) return null;
             const prev = nodes[i-1];
             return (
                <motion.line 
                   key={`line-${i}`}
                   x1={prev.left! + 50} 
                   y1={prev.top! + 50} 
                   x2={node.left! + 50} 
                   y2={node.top! + 50}
                   stroke="var(--primary)"
                   strokeWidth="1"
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 0.3 }}
                   transition={{ duration: 1.5, delay: i * 0.1 }}
                   strokeDasharray="5,5"
                />
             );
          })}
       </svg>

       {nodes.map((node, i) => (
          <motion.div 
            key={node.id || i}
            className="matrix-node"
            style={{ left: node.left! + 40, top: node.top! + 40 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: i * 0.05 }}
          >
             <div className="node-ring" />
             <div className="node-content">
                <div className="node-id">0x{i.toString(16).toUpperCase()}</div>
                <div className="node-label">{(node as any).text?.substring(0, 10)}...</div>
             </div>
          </motion.div>
       ))}

       <div className="matrix-telemetry">
          <div className="badge">MATRIX_LINK_ACTIVE</div>
          <div className="telemetry-row">
             <span className="label">NEURAL_DENSITY:</span>
             <span className="value">{(nodes.length * 8.4).toFixed(1)}%</span>
          </div>
          <div className="telemetry-row">
             <span className="label">LOGIC_MOAT:</span>
             <span className="value">STABLE</span>
          </div>
       </div>

       <style jsx>{`
          .matrix-overlay {
             position: absolute;
             inset: 0;
             background: rgba(13, 16, 23, 0.82);
             backdrop-filter: blur(8px);
             z-index: 1000;
             overflow: hidden;
             pointer-events: none;
          }
          .matrix-grid {
             position: absolute;
             inset: 0;
             background-image: 
                linear-gradient(rgba(139, 61, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 61, 255, 0.03) 1px, transparent 1px);
             background-size: 40px 40px;
          }
          .matrix-svg {
             position: absolute;
             inset: 0;
             width: 100%;
             height: 100%;
          }
          .matrix-node {
             position: absolute;
             width: 80px;
             height: 80px;
             display: flex;
             align-items: center;
             justify-content: center;
          }
          .node-ring {
             position: absolute;
             inset: 0;
             border: 1px solid var(--primary);
             border-radius: 50%;
             box-shadow: 0 0 15px var(--primary-glow);
             opacity: 0.3;
             animation: node-pulse 3s infinite;
          }
          @keyframes node-pulse {
             0%, 100% { transform: scale(1); opacity: 0.2; }
             50% { transform: scale(1.1); opacity: 0.5; }
          }
          .node-content {
             text-align: center;
             z-index: 2;
          }
          .node-id { font-size: 8px; fontWeight: 900; opacity: 0.5; color: var(--primary); }
          .node-label { font-size: 9px; fontWeight: 800; color: white; margin-top: 4px; }
          
          .matrix-telemetry {
             position: absolute;
             bottom: 40px;
             left: 40px;
             background: rgba(0,0,0,0.4);
             border: 1px solid var(--border);
             border-radius: 12px;
             padding: 20px;
             display: flex;
             flex-direction: column;
             gap: 8px;
             width: 220px;
          }
          .telemetry-row {
             display: flex;
             justify-content: space-between;
             font-size: 10px;
             font-weight: 800;
             letter-spacing: 1px;
          }
          .label { opacity: 0.5; }
          .value { color: var(--primary); }
       `}</style>
    </div>
  );
}
