import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import { listAssets, uploadAsset } from "../lib/studio-client";
import { ReviewPanel } from "./review-panel";
import { LayersPanel } from "./layers-panel";
import { BrandKit } from "./brand-kit";
import { PRESET_TEMPLATES } from "../lib/templates-data";
import { CodeExportPanel } from "./code-export-panel";
import { StructuredInputPanel } from "./structured-input-panel";
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
  Plus
} from "lucide-react";

type SidebarTab = "content" | "templates" | "elements" | "text" | "brand" | "uploads" | "draw" | "layers" | "review" | "export";

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
  brandColors
}: SidePanelContentProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
              <div className="stack" style={{ gap: "20px" }}>
                <button className="btn-pro btn-primary" style={{ width: "100%" }} onClick={() => fileInputRef.current?.click()}>
                   <CloudUpload size={18} style={{ marginRight: "10px" }} /> Upload files
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {loadingAssets && <p className="muted-text">Syncing library...</p>}
                  {assets.map((asset) => (
                    <div key={asset.id} className="asset-item glass-card" onClick={() => onAddImageUrl(asset.file_url)}>
                      <img src={asset.file_url} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "templates" && (
              <div className="stack" style={{ gap: "16px" }}>
                {PRESET_TEMPLATES.map((tmpl) => (
                  <div key={tmpl.id} className="glass-card" style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => onLoadTemplate(tmpl.json)}>
                    <img src={tmpl.thumbnail} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                    <div style={{ padding: "12px" }}>
                       <strong>{tmpl.title}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "review" && <ReviewPanel designId={designId} />}
            {activeTab === "layers" && <LayersPanel canvas={canvas} />}
            {activeTab === "brand" && <BrandKit canvas={canvas} onPushHistory={onPushHistory} />}
            {activeTab === "export" && <CodeExportPanel canvas={canvas} />}
            {activeTab === "content" && <StructuredInputPanel canvas={canvas} brandColors={brandColors} />}
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
      `}</style>
    </aside>
  );
}
