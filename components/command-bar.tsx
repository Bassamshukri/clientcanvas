"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Zap, Layout, Settings, Rocket, X, ArrowRight, Brain, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function CommandBar({ canvas, brandColors }: { canvas?: any, brandColors?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/intelligence" }),
    onFinish: ({ message }) => {
       if (message.parts && canvas) {
          message.parts.forEach((part: any) => {
             if (part.type === 'tool-invocation' && part.toolInvocation.toolName === 'executeStrategicAction') {
                const { action, data } = part.toolInvocation.args;
                console.log(`DEPLOYING_ACTION: ${action}`, data);
             }
          });
       }
    }
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="command-overlay" onClick={() => setIsOpen(false)}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="command-box glass-panel"
          onClick={e => e.stopPropagation()}
        >
          <div className="command-input-container">
            <Search size={20} className="muted-text" />
            <input 
              autoFocus
              placeholder="Search fleets, or AI command (e.g. 'Add a SWOT')..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                 if (e.key === 'Enter' && query.toLowerCase().startsWith('ai')) {
                    sendMessage({ text: query });
                    setQuery("");
                 }
              }}
              className="command-input"
            />
            <div className="command-k-badge">ESC</div>
          </div>

          <div className="command-results stack" style={{ gap: "4px" }}>
              <div className="command-section" style={{ marginTop: "12px" }}>Neural Command (AI)</div>
              {isLoading && (
                 <div className="command-item active animate-pulse">
                    <Sparkles size={16} color="var(--primary)" />
                    <span>SYNTHESIZING_COMMAND_DNA...</span>
                 </div>
              )}
              {messages.filter(m => m.role === 'assistant').map((m, i) => {
                 const text = m.parts?.filter(p => p.type === 'text').map((p: any) => p.text).join(' ');
                 if (!text) return null;
                 return (
                    <div key={i} className="command-item active">
                       <Brain size={16} color="var(--primary)" />
                       <span>{text}</span>
                    </div>
                 );
              })}

              <div className="command-section" style={{ marginTop: "12px" }}>Strategic Protocols</div>
              <button className="command-item active">
                 <Zap size={16} color="var(--primary)" />
                 <span>Initialize Global Protocol Sync</span>
                 <span className="command-shortcut">↵</span>
              </button>
              <button className="command-item">
                 <Layout size={16} />
                 <span>Browse Fleet Templates</span>
              </button>
              <button className="command-item">
                 <Rocket size={16} />
                 <span>Deploy to Staging Intelligence</span>
              </button>

              <div className="command-section" style={{ marginTop: "12px" }}>Navigation</div>
              <button className="command-item" onClick={() => { router.push("/"); setIsOpen(false); }}>
                 <Command size={16} />
                 <span>Go to Command Center</span>
              </button>
              <button className="command-item" onClick={() => { router.push("/workspaces"); setIsOpen(false); }}>
                 <Settings size={16} />
                 <span>Configure Identity DNA</span>
              </button>
          </div>

          <div className="command-footer">
             <div style={{ display: "flex", gap: "16px" }}>
                <span><kbd>↑↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Initialize</span>
             </div>
             <span>PROTOCOL_V3.1_ACTIVE</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .command-overlay {
           position: fixed;
           inset: 0;
           background: rgba(0,0,0,0.4);
           backdrop-filter: blur(4px);
           z-index: 10000;
           display: flex;
           align-items: flex-start;
           justify-content: center;
           padding-top: 15vh;
        }
        .command-box {
           width: 100%;
           maxWidth: 640px;
           background: rgba(13, 16, 23, 0.95) !important;
           border: 1px solid var(--border-active);
           border-radius: 16px;
           box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
           overflow: hidden;
        }
        .command-input-container {
           padding: 20px;
           display: flex;
           align-items: center;
           gap: 16px;
           border-bottom: 1px solid var(--border);
        }
        .command-input {
           flex: 1;
           background: transparent;
           border: none;
           color: white;
           font-size: 18px;
           outline: none;
           font-weight: 500;
        }
        .command-k-badge {
           padding: 4px 8px;
           background: rgba(255,255,255,0.05);
           border-radius: 6px;
           font-size: 10px;
           font-weight: 800;
           color: var(--text-muted);
           border: 1px solid var(--border);
        }
        .command-results {
           padding: 12px;
           max-height: 400px;
           overflow-y: auto;
        }
        .command-section {
           font-size: 11px;
           font-weight: 800;
           color: var(--text-muted);
           text-transform: uppercase;
           letter-spacing: 1px;
           padding: 8px 12px;
        }
        .command-item {
           display: flex;
           align-items: center;
           gap: 16px;
           padding: 12px;
           border-radius: 10px;
           width: 100%;
           border: none;
           background: transparent;
           color: var(--text-muted);
           cursor: pointer;
           transition: 0.2s;
           font-size: 14px;
           font-weight: 600;
        }
        .command-item.active, .command-item:hover {
           background: rgba(139, 61, 255, 0.1);
           color: white;
           border-color: var(--primary-glow);
        }
        .command-shortcut {
           margin-left: auto;
           opacity: 0.5;
        }
        .command-footer {
           padding: 12px 20px;
           border-top: 1px solid var(--border);
           display: flex;
           justify-content: space-between;
           font-size: 11px;
           color: var(--text-muted);
           font-weight: 700;
           background: rgba(0,0,0,0.2);
        }
        kbd {
           background: rgba(255,255,255,0.1);
           padding: 2px 4px;
           border-radius: 4px;
           font-family: inherit;
        }
      `}</style>
    </AnimatePresence>
  );
}
