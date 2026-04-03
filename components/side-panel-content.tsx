import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import { listAssets, uploadAsset } from "../lib/studio-client";
import { ReviewPanel } from "./review-panel";
import { LayersPanel } from "./layers-panel";
import { BrandKit } from "./brand-kit";
import { PRESET_TEMPLATES } from "../lib/templates-data";
import { CodeExportPanel } from "./code-export-panel";
import { LogicPanel } from "./logic-panel";
import { AIOrchestratorPanel } from "./ai-orchestrator-panel";
import { MotionStudioPanel } from "./motion-studio-panel";
import { useToast } from "./strategic-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  ArrowRight, 
  Type, 
  Heading1, 
  Heading2, 
  Type as BodyIcon, 
  CloudUpload, 
  Image as ImageIcon, 
  PenTool, 
  Palette, 
  Layers, 
  MessageSquare, 
  Code,
  Search,
  Zap,
  Plus,
  NotebookPen
} from "lucide-react";

type SidebarTab = "content" | "protocols" | "elements" | "text" | "brand" | "uploads" | "draw" | "layers" | "review" | "export" | "ai" | "scratchpad" | "motion";

interface SidePanelContentProps {
  activeTab: SidebarTab;
  designId: string;
  workspaceId?: string;
  canvas: Canvas | null;
  onAddRect: () => void;
  onAddCircle: () => void;
  onAddShape: (type: "star" | "triangle" | "arrow" | "hexagon") => void;
  onAddText: (type: "heading" | "subheading" | "body") => void;
  onAddImageUrl: (url: string) => void;
  onPushHistory: () => void;
  onLoadTemplate: (json: any) => void;
  brandColors?: { primary: string; secondary: string; accent: string; fontFamily: string } | null;
  isLinking: boolean;
  setIsLinking: (linking: boolean) => void;
}

export function SidePanelContent({
  activeTab,
  designId,
  workspaceId,
  canvas,
  onAddRect,
  onAddCircle,
  onAddShape,
  onAddText,
  onAddImageUrl,
  onPushHistory,
  onLoadTemplate,
  brandColors,
  isLinking,
  setIsLinking
}: SidePanelContentProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#8b3dff");
  const [brushWidth, setBrushWidth] = useState(5);

  useEffect(() => {
    if (activeTab === "uploads" && workspaceId) {
      loadAssets();
    }
    if (activeTab !== "draw" && canvas?.isDrawingMode) {
      canvas.isDrawingMode = false;
      setIsDrawing(false);
    }
  }, [activeTab, workspaceId, canvas]);

  const toggleDrawing = () => {
    if (!canvas) return;
    const next = !isDrawing;
    setIsDrawing(next);
    canvas.isDrawingMode = next;
    if (next && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  };

  useEffect(() => {
    if (canvas?.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  }, [brushColor, brushWidth, canvas]);

  async function loadAssets() {
    if (!workspaceId) return;
    try {
      setLoadingAssets(true);
      const data = await listAssets(workspaceId);
      setAssets(data);
    } catch (err) {
      console.error("Failed to load assets", err);
    } finally {
      setLoadingAssets(false);
    }
  }

  return (
    <aside className="panel-container glass-panel">
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <div className="badge">{activeTab}</div>
          <h3 style={{ marginTop: "12px", textTransform: "capitalize" }}>{activeTab} Management</h3>
          <p className="muted-text">Strategize and refine your design elements.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "elements" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="glass-card mini-card-pro" onClick={onAddRect}>
                  <Square size={24} color="var(--primary)" />
                  <span>Square</span>
                </div>
                <div className="glass-card mini-card-pro" onClick={onAddCircle}>
                  <Circle size={24} color="var(--primary)" />
                  <span>Circle</span>
                </div>
                <div className="glass-card mini-card-pro" onClick={() => onAddShape("triangle")}>
                  <Triangle size={24} color="var(--primary)" />
                  <span>Triangle</span>
                </div>
                <div className="glass-card mini-card-pro" onClick={() => onAddShape("star")}>
                  <Star size={24} color="var(--primary)" />
                  <span>Star</span>
                </div>
                <div className="glass-card mini-card-pro" onClick={() => onAddShape("arrow")}>
                  <ArrowRight size={24} color="var(--primary)" />
                  <span>Arrow</span>
                </div>
              </div>
            )}

            {activeTab === "text" && (
              <div className="stack" style={{ gap: "12px" }}>
                <button className="btn-pro btn-secondary" style={{ width: "100%", justifyContent: "flex-start", padding: "16px" }} onClick={() => onAddText("heading")}>
                  <Heading1 size={20} style={{ marginRight: "12px" }} /> Add a heading
                </button>
                <button className="btn-pro btn-secondary" style={{ width: "100%", justifyContent: "flex-start", padding: "16px" }} onClick={() => onAddText("subheading")}>
                  <Heading2 size={18} style={{ marginRight: "12px" }} /> Add a subheading
                </button>
                <button className="btn-pro btn-secondary" style={{ width: "100%", justifyContent: "flex-start", padding: "16px" }} onClick={() => onAddText("body")}>
                  <BodyIcon size={16} style={{ marginRight: "12px" }} /> Add body text
                </button>
              </div>
            )}

            {activeTab === "uploads" && (
              <div className="stack" style={{ gap: "24px" }}>
                <div>
                   <div className="badge">Digital Assets</div>
                   <h4 style={{ marginTop: "12px", fontSize: "16px", fontWeight: "700" }}>Strategic Asset Library</h4>
                   <p className="muted-text" style={{ fontSize: "12px" }}>Managed high-fidelity assets for your professional designs.</p>
                </div>

                <div className={`glass-card panelCard upload-area ${uploading ? 'scanning' : ''}`} onClick={() => !uploading && fileInputRef.current?.click()}>
                   {uploading && <div className="holographic-line" />}
                   <div style={{ background: "rgba(139, 61, 255, 0.1)", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <CloudUpload size={20} color="var(--primary)" />
                   </div>
                   <p style={{ fontWeight: "800", fontSize: "11px", letterSpacing: "1px" }}>
                      {uploading ? "HOLOGRAPHIC_SCAN_IN_PROGRESS..." : "DISPATCH_STRATEGIC_ASSET"}
                   </p>
                   <p className="muted-text" style={{ fontSize: "10px", marginTop: "4px" }}>
                      {uploading ? "ANALYZING_NODE_DNA..." : "PNG, JPG, SVG PREFERRED"}
                   </p>
                   <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*" 
                      style={{ display: "none" }} 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && workspaceId) {
                          setUploading(true);
                          try {
                            await uploadAsset(workspaceId, file);
                            showToast("Asset successfully integrated into strategic storage.", "success");
                            loadAssets();
                          } catch (err: any) {
                             showToast(err.message || "Failed to dispatch asset.", "error");
                             console.error("Upload failure", err);
                          } finally { setUploading(false); }
                        }
                      }}
                   />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {loadingAssets ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
                       <div className="animate-spin" style={{ width: "20px", height: "20px", border: "2px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto" }} />
                    </div>
                  ) : assets.length === 0 ? (
                    <p className="muted-text" style={{ gridColumn: "1 / -1", textAlign: "center", fontSize: "12px" }}>Zero assets in strategic storage.</p>
                  ) : (
                    assets.map((asset) => (
                      <motion.div 
                        key={asset.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="asset-item-pro glass-card" 
                        onClick={() => onAddImageUrl(asset.file_url)}
                        style={{ cursor: "pointer", aspectRatio: "1/1", padding: "8px" }}
                      >
                        <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.02)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                           <img src={asset.file_url} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "protocols" && (
              <div className="stack" style={{ gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                   <div className="badge">Protocol Library</div>
                   <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.5 }}>UNIFIED_V0.5</span>
                </div>
                <div className="protocol-grid">
                  {PRESET_TEMPLATES.map((template) => (
                    <motion.div 
                      key={template.id} 
                      whileHover={{ scale: 1.02 }}
                      className="protocol-node glass-card"
                    >
                      <div className="protocol-thumb-container">
                        <img src={template.thumbnail} alt={template.title} className="protocol-thumb" />
                        <div className="protocol-overlay">
                           <button 
                             onClick={() => onLoadTemplate(template.json)}
                             className="btn-pro btn-primary"
                             style={{ padding: "8px 16px", fontSize: "11px" }}
                           >
                              LAUNCH_PROTOCOL
                           </button>
                        </div>
                      </div>
                      <div style={{ padding: "12px" }}>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "white" }}>{template.title.toUpperCase()}</h4>
                            <Zap size={12} color="var(--primary)" />
                         </div>
                         <div style={{ fontSize: "10px", fontWeight: "700", color: "var(--primary)", opacity: 0.7 }}>
                            {(template as any).category || "Strategic Deployment"}
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "review" && <ReviewPanel designId={designId} />}
            {activeTab === "layers" && <LayersPanel canvas={canvas} />}
            {activeTab === "brand" && <BrandKit canvas={canvas} onPushHistory={onPushHistory} />}
            {activeTab === "export" && <CodeExportPanel canvas={canvas} />}
            {activeTab === "content" && <LogicPanel canvas={canvas} isLinking={isLinking} setIsLinking={setIsLinking} />}
            {activeTab === "ai" && <AIOrchestratorPanel canvas={canvas} brandColors={brandColors} onPushHistory={onPushHistory} />}
            {activeTab === "motion" && <MotionStudioPanel workspaceId={workspaceId} />}
            
            {activeTab === "scratchpad" && (
              <div className="stack" style={{ gap: "24px" }}>
                 <div>
                    <div className="badge">Drafting Protocol</div>
                    <h4 style={{ marginTop: "12px", fontSize: "16px", fontWeight: "700" }}>Architect's Scratchpad</h4>
                    <p className="muted-text" style={{ fontSize: "12px" }}>Raw strategic thoughts. Bridge the gap to structured synthesis.</p>
                 </div>
                 
                 <div className="glass-panel" style={{ padding: "0", background: "rgba(0,0,0,0.2) !important", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                    <textarea 
                       className="scratchpad-area"
                       placeholder="Enter raw strategic insights here (e.g. Targeting high-net-worth individuals in APAC with a focus on sustainable luxury)..."
                    />
                    <div style={{ padding: "12px", borderTop: "1px solid var(--border)", background: "rgba(139, 61, 255, 0.03)" }}>
                       <button 
                         className="btn-pro btn-primary" 
                         style={{ width: "100%", height: "40px", fontSize: "11px", letterSpacing: "1px", fontWeight: "800" }}
                         onClick={() => showToast("Draft dispatched to AI_CORE for synthesis.", "success")}
                       >
                          DISPATCH_DRAFT_TO_AI_CORE
                       </button>
                    </div>
                 </div>

                 <div className="stack" style={{ gap: "10px" }}>
                    <div className="badge-mini">DRAFT_STATUS: RAW</div>
                    <p className="muted-text" style={{ fontSize: "10px" }}>Neural layers are sensitized to your drafting inputs. Protocol ready.</p>
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <style jsx>{`
        .mini-card-pro {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          cursor: pointer;
        }
        .mini-card-pro span {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .upload-area {
           padding: 32px 20px;
           border: 1px dashed var(--border);
           text-align: center;
           cursor: pointer;
           position: relative;
           overflow: hidden;
           transition: 0.3s;
        }
        .upload-area:hover { border-color: var(--primary); background: rgba(139, 61, 255, 0.03); }
        .upload-area.scanning { border-style: solid; border-color: var(--primary); }
        
        .holographic-line {
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 2px;
           background: var(--primary);
           box-shadow: 0 0 15px var(--primary-glow);
           animation: h-scan 2s infinite ease-in-out;
           z-index: 10;
        }
        @keyframes h-scan {
           0% { top: 0%; opacity: 0; }
           50% { opacity: 1; }
           100% { top: 100%; opacity: 0; }
        }
        .scratchpad-area {
           width: 100%;
           height: 300px;
           background: transparent;
           border: none;
           padding: 24px;
           color: white;
           font-size: 14px;
           font-family: inherit;
           line-height: 1.6;
           resize: none;
           outline: none;
        }
        .badge-mini {
           font-size: 8px;
           font-weight: 900;
           padding: 4px 10px;
           background: rgba(255,255,255,0.05);
           border-radius: 4px;
           width: fit-content;
        }
        .protocol-grid {
           display: grid;
           grid-template-columns: 1fr;
           gap: 20px;
        }
        .protocol-node {
           background: rgba(255,255,255,0.02);
           border: 1px solid var(--border);
           border-radius: 12px;
           overflow: hidden;
           transition: 0.2s;
        }
        .protocol-node:hover {
           border-color: var(--primary-glow);
           background: rgba(255,255,255,0.04);
        }
        .protocol-thumb-container {
           position: relative;
           aspect-ratio: 16/9;
           overflow: hidden;
           border-bottom: 1px solid var(--border);
        }
        .protocol-thumb {
           width: 100%;
           height: 100%;
           object-fit: cover;
           transition: 0.5s;
        }
        .protocol-node:hover .protocol-thumb {
           transform: scale(1.05);
           filter: blur(2px) brightness(0.5);
        }
        .protocol-overlay {
           position: absolute;
           inset: 0;
           display: flex;
           align-items: center;
           justify-content: center;
           opacity: 0;
           transition: 0.3s;
        }
        .protocol-node:hover .protocol-overlay {
           opacity: 1;
        }
      `}</style>
    </aside>
  );
}
