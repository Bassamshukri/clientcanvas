"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, Globe, ShieldCheck, X, Link as LinkIcon, Send } from "lucide-react";

interface ShareModalProps {
  designId: string;
  designTitle: string;
  onClose: () => void;
}

export function ShareModal({ designId, designTitle, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/review/${designId}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="share-modal glass-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="share-icon-container"><Share2 size={18} color="white" /></div>
              <div>
                 <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800" }}>Share Strategic Review</h3>
                 <span className="muted-text" style={{ fontSize: "11px", fontWeight: "600" }}>{designTitle.toUpperCase()}</span>
              </div>
           </div>
           <button onClick={onClose} className="close-btn"><X size={18} /></button>
        </div>

        <div className="modal-body stack" style={{ gap: "24px", padding: "24px" }}>
           <div className="info-box">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                 <Globe size={16} color="var(--primary)" />
                 <span style={{ fontSize: "13px", fontWeight: "700" }}>Public Access Protocol</span>
              </div>
              <p className="muted-text" style={{ fontSize: "12px", lineHeight: "1.5", margin: 0 }}>
                 Anyone with this link can view the strategic presentation in read-only mode. No design permissions are granted.
              </p>
           </div>

           <div className="stack" style={{ gap: "12px" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", opacity: 0.5, letterSpacing: "1px" }}>STRATEGIC_REVIEW_URL</label>
              <div className="url-container">
                 <LinkIcon size={14} className="muted-text" />
                 <input readOnly value={shareUrl} className="url-input" />
                 <button onClick={handleCopy} className={`copy-btn ${copied ? 'success' : ''}`}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "COPIED" : "COPY"}
                 </button>
              </div>
           </div>

           <div className="stack" style={{ gap: "12px" }}>
              <label style={{ fontSize: "11px", fontWeight: "800", opacity: 0.5, letterSpacing: "1px" }}>QUICK_DISPATCH</label>
              <div style={{ display: "flex", gap: "12px" }}>
                 <button className="dispatch-btn"><Send size={14} /> Email Stakeholders</button>
              </div>
           </div>
        </div>

        <div className="modal-footer">
           <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--success)", fontWeight: "800" }}>
              <ShieldCheck size={12} /> ENCRYPTED_PROTOCOL_ACTIVE
           </div>
           <span style={{ fontSize: "10px", opacity: 0.3 }}>V0.7.0_SECURE</span>
        </div>
      </motion.div>

      <style jsx>{`
        .modal-overlay {
           position: fixed;
           inset: 0;
           background: rgba(0,0,0,0.6);
           backdrop-filter: blur(8px);
           z-index: 10000;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        .share-modal {
           width: 100%;
           max-width: 480px;
           background: rgba(13, 16, 23, 0.95) !important;
           border: 1px solid var(--border-active);
           border-radius: 20px;
           overflow: hidden;
        }
        .modal-header {
           padding: 20px 24px;
           border-bottom: 1px solid var(--border);
           display: flex;
           align-items: center;
           justify-content: space-between;
        }
        .share-icon-container {
           width: 36px;
           height: 36px;
           background: var(--primary);
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        .close-btn {
           background: transparent;
           border: none;
           color: var(--text-muted);
           cursor: pointer;
           padding: 4px;
        }
        .info-box {
           background: rgba(139, 61, 255, 0.05);
           border: 1px solid rgba(139, 61, 255, 0.1);
           border-radius: 12px;
           padding: 16px;
        }
        .url-container {
           display: flex;
           align-items: center;
           gap: 12px;
           background: rgba(0,0,0,0.2);
           border: 1px solid var(--border);
           border-radius: 12px;
           padding: 6px 6px 6px 16px;
        }
        .url-input {
           flex: 1;
           background: transparent;
           border: none;
           color: white;
           font-size: 13px;
           font-family: monospace;
           outline: none;
        }
        .copy-btn {
           height: 36px;
           padding: 0 16px;
           background: var(--primary);
           border: none;
           border-radius: 8px;
           color: white;
           font-size: 11px;
           font-weight: 800;
           display: flex;
           align-items: center;
           gap: 8px;
           cursor: pointer;
           transition: 0.2s;
        }
        .copy-btn.success { background: var(--success); }
        .dispatch-btn {
           flex: 1;
           height: 40px;
           background: rgba(255,255,255,0.03);
           border: 1px solid var(--border);
           border-radius: 10px;
           color: white;
           font-size: 13px;
           font-weight: 700;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 10px;
           cursor: pointer;
           transition: 0.2s;
        }
        .dispatch-btn:hover { background: rgba(255,255,255,0.08); }
        .modal-footer {
           height: 48px;
           background: rgba(0,0,0,0.1);
           border-top: 1px solid var(--border);
           padding: 0 24px;
           display: flex;
           align-items: center;
           justify-content: space-between;
        }
      `}</style>
    </div>
  );
}
