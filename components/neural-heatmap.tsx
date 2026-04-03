"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas } from "fabric";
import { getStrategicSequence } from "../lib/fabric-layout";

export function NeuralHeatmap({ canvas, active }: { canvas: Canvas | null, active: boolean }) {
  const nodes = useMemo(() => getStrategicSequence(canvas), [canvas, active]);

  if (!active || nodes.length === 0) return null;

  return (
    <div className="heatmap-overlay">
       {nodes.map((node, i) => (
          <motion.div 
            key={`heat-${node.id || i}`}
            className="heat-point"
            style={{ 
               left: node.left! + 50, 
               top: node.top! + 50,
               background: `radial-gradient(circle, rgba(139, 61, 255, 0.4) 0%, transparent 70%)`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
               scale: [1, 1.2, 1], 
               opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ 
               repeat: Infinity, 
               duration: 3 + Math.random() * 2,
               delay: i * 0.2
            }}
          />
       ))}
       
       <div className="heatmap-telemetry">
          <div className="badge">STRATEGIC_TENSION_HEATMAP</div>
          <div className="telemetry-log">
             <div className="log-line">SCANNING_LOGIC_DENSITY...</div>
             <div className="log-line">TENSION_PEAK: {(nodes.length * 12.5).toFixed(1)}Hz</div>
             <div className="log-line">NEURAL_ARRAY: NOMINAL</div>
          </div>
       </div>

       <style jsx>{`
          .heatmap-overlay {
             position: absolute;
             inset: 0;
             pointer-events: none;
             z-index: 900;
             overflow: hidden;
             mix-blend-mode: screen;
          }
          .heat-point {
             position: absolute;
             width: 400px;
             height: 400px;
             border-radius: 50%;
             transform: translate(-50%, -50%);
             filter: blur(40px);
          }
          .heatmap-telemetry {
             position: absolute;
             top: 40px;
             right: 40px;
             background: rgba(0,0,0,0.6);
             border: 1px solid var(--primary);
             border-radius: 8px;
             padding: 12px;
             width: 180px;
          }
          .telemetry-log {
             margin-top: 8px;
             font-family: monospace;
             font-size: 8px;
             color: var(--primary);
             display: flex;
             flex-direction: column;
             gap: 4px;
          }
          .log-line {
             white-space: nowrap;
             overflow: hidden;
             border-right: 1px solid var(--primary);
             animation: type-log 2s steps(20) infinite alternate;
          }
          @keyframes type-log {
             from { width: 0; }
             to { width: 100%; }
          }
       `}</style>
    </div>
  );
}
