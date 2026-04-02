"use client";

import { useActionState, useRef } from "react";
import { uploadAssetAction } from "../app/actions/assets";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, FileImage, Trash2, ExternalLink, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

interface AssetLibraryProps {
  workspaceId: string;
  assets: Array<{
    id: string;
    name: string;
    type: string;
    file_url: string;
    created_at?: string;
  }>;
  onUseAsset?: (url: string) => void;
}

const initialState = {
  ok: false,
  error: "",
  message: ""
};

export function AssetLibrary({
  workspaceId,
  assets,
  onUseAsset
}: AssetLibraryProps) {
  const [state, action, pending] = useActionState(uploadAssetAction, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="asset-library-pro" style={{ padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <div className="badge">Digital Assets</div>
        <h2 style={{ marginTop: 12 }}>Strategic Asset Library</h2>
        <p className="muted-text">Managed high-fidelity assets for your professional designs.</p>
      </div>

      <motion.form 
        action={action}
        className="glass-card panelCard"
        style={{ marginBottom: 32, border: "1px dashed var(--border-active)" }}
      >
        <input type="hidden" name="workspaceId" value={workspaceId} />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            cursor: "pointer", textAlign: "center", padding: "40px 20px", 
            background: "rgba(255, 255, 255, 0.02)", borderRadius: 12 
          }}
        >
          <CloudUpload size={48} color="var(--primary)" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 600, margin: 0 }}>Drag or click to upload</p>
          <p className="muted-text" style={{ fontSize: 12, marginTop: 4 }}>High-resolution SVG, PNG, JPG supported</p>
          <input 
            ref={fileInputRef} 
            name="file" 
            type="file" 
            accept="image/*" 
            required 
            style={{ display: "none" }} 
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <button 
            className="btn-pro btn-primary" 
            type="submit" 
            disabled={pending}
            style={{ width: "100%" }}
          >
            {pending ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", marginRight: 8 }}
                />
                Optimizing Asset...
              </>
            ) : "Upload Strategic Asset"}
          </button>
        </div>

        <AnimatePresence>
          {state?.error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="error-toast"
              style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: 8, marginTop: 16, border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: 10 }}
            >
              <AlertCircle size={16} color="var(--danger)" />
              <p style={{ color: "#fca5a5", fontSize: 13, margin: 0 }}>{state.error}</p>
            </motion.div>
          )}

          {state?.message && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="success-toast"
              style={{ padding: "12px", background: "rgba(0, 200, 150, 0.1)", borderRadius: 8, marginTop: 16, border: "1px solid rgba(0, 200, 150, 0.2)", display: "flex", alignItems: "center", gap: 10 }}
            >
              <CheckCircle2 size={16} color="var(--success)" />
              <p style={{ color: "#86efac", fontSize: 13, margin: 0 }}>{state.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {assets.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
             <p className="muted-text">Zero assets in strategic storage.</p>
          </div>
        ) : (
          assets.map((asset, index) => (
            <motion.article 
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="asset-item"
            >
              <img src={asset.file_url} alt={asset.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="asset-overlay">
                 <div style={{ display: "flex", gap: 8 }}>
                    <button 
                      onClick={() => onUseAsset?.(asset.file_url)}
                      className="sidebar-icon active" 
                      title="Use Asset"
                    >
                      <Plus size={20} />
                    </button>
                    <a 
                      href={asset.file_url} 
                      target="_blank" 
                      className="sidebar-icon" 
                      title="Direct Link"
                      rel="noreferrer"
                    >
                      <ExternalLink size={18} />
                    </a>
                 </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}