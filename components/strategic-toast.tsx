"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Zap } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
              className={`strategic-toast glass-panel ${toast.type}`}
            >
               <div className="toast-icon">
                  {toast.type === "success" && <CheckCircle2 size={16} color="var(--success)" />}
                  {toast.type === "error" && <AlertCircle size={16} color="var(--danger)" />}
                  {toast.type === "info" && <Zap size={16} color="var(--primary)" />}
               </div>
               <div className="toast-content">
                  <div className="toast-badge">{toast.type.toUpperCase()}_PROTOCOL_ACTIVE</div>
                  <div className="toast-message">{toast.message}</div>
               </div>
               <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="toast-close">
                  <X size={14} />
               </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .toast-container {
           position: fixed;
           bottom: 32px;
           right: 32px;
           display: flex;
           flex-direction: column;
           gap: 12px;
           z-index: 20000;
           pointer-events: none;
        }
        .strategic-toast {
           width: 380px;
           background: rgba(13, 16, 23, 0.9) !important;
           border: 1px solid var(--border);
           border-radius: 12px;
           padding: 16px;
           display: flex;
           align-items: center;
           gap: 16px;
           pointer-events: auto;
           box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }
        .strategic-toast.error { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05) !important; }
        .strategic-toast.success { border-color: rgba(0, 200, 150, 0.3); background: rgba(0, 200, 150, 0.05) !important; }
        
        .toast-icon {
           width: 32px;
           height: 32px;
           background: rgba(255,255,255,0.03);
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        .toast-content {
           flex: 1;
           display: flex;
           flex-direction: column;
           gap: 4px;
        }
        .toast-badge {
           font-size: 8px;
           font-weight: 900;
           letter-spacing: 1px;
           opacity: 0.5;
        }
        .toast-message {
           font-size: 13px;
           font-weight: 700;
           color: white;
           line-height: 1.4;
        }
        .toast-close {
           background: transparent;
           border: none;
           color: var(--text-muted);
           cursor: pointer;
           padding: 4px;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
