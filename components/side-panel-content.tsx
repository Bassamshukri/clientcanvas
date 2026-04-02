import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import { listAssets, uploadAsset } from "../lib/studio-client";
import { ReviewPanel } from "./review-panel";
import { LayersPanel } from "./layers-panel";
import { BrandKit } from "./brand-kit";
import { PRESET_TEMPLATES } from "../lib/templates-data";
import { CodeExportPanel } from "./code-export-panel";
import { StructuredInputPanel } from "./structured-input-panel";

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
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#8b3dff");
  const [brushWidth, setBrushWidth] = useState(5);

  useEffect(() => {
    if (activeTab === "uploads" && workspaceId) {
      loadAssets();
    }
    // Cleanup drawing mode if switching tabs
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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !workspaceId) return;

    try {
      setUploading(true);
      const newAsset = await uploadAsset(workspaceId, file);
      setAssets((prev) => [newAsset, ...prev]);
    } catch (err) {
      alert("Upload failed. Make sure your Supabase Storage is configured.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <aside className="sidePanelContent">
      <div style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px", textTransform: "capitalize" }}>
          {activeTab}
        </h2>

        {activeTab === "elements" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div
              className="miniCard"
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "80px" }}
              onClick={onAddRect}
            >
              <div style={{ width: "30px", height: "30px", background: "var(--primary)", borderRadius: "4px" }} />
              <span style={{ fontSize: "12px", fontWeight: "500" }}>Square</span>
            </div>
            <div
              className="miniCard"
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "80px" }}
              onClick={onAddCircle}
            >
              <div style={{ width: "30px", height: "30px", background: "var(--primary)", borderRadius: "50%" }} />
              <span style={{ fontSize: "12px", fontWeight: "500" }}>Circle</span>
            </div>
            {/* New Shapes */}
            <div
              className="miniCard"
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "80px" }}
              onClick={() => onAddShape("triangle")}
            >
              <div style={{ width: "0", height: "0", borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderBottom: "30px solid var(--primary)" }} />
              <span style={{ fontSize: "12px", fontWeight: "500" }}>Triangle</span>
            </div>
            <div
              className="miniCard"
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "80px" }}
              onClick={() => onAddShape("star")}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style={{ fontSize: "12px", fontWeight: "500" }}>Star</span>
            </div>
            <div
              className="miniCard"
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "80px" }}
              onClick={() => onAddShape("arrow")}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              <span style={{ fontSize: "12px", fontWeight: "500" }}>Arrow</span>
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              className="secondaryButton"
              style={{ justifyContent: "flex-start", padding: "12px", height: "auto" }}
              onClick={() => onAddText("heading")}
            >
              <span style={{ fontSize: "20px", fontWeight: "800" }}>Add a heading</span>
            </button>
            <button
              className="secondaryButton"
              style={{ justifyContent: "flex-start", padding: "12px", height: "auto" }}
              onClick={() => onAddText("subheading")}
            >
              <span style={{ fontSize: "16px", fontWeight: "600" }}>Add a subheading</span>
            </button>
            <button
              className="secondaryButton"
              style={{ justifyContent: "flex-start", padding: "12px", height: "auto" }}
              onClick={() => onAddText("body")}
            >
              <span style={{ fontSize: "14px" }}>Add a little bit of body text</span>
            </button>
          </div>
        )}

        {activeTab === "uploads" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept="image/*"
            />
            <button 
              className="primaryButton" 
              style={{ width: "100%" }}
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Uploading..." : "Upload files"}
            </button>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
              {loadingAssets ? <p style={{ fontSize: "12px", color: "var(--muted)", gridColumn: "1/-1", textAlign: "center" }}>Loading library...</p> : null}
              {assets.map((asset) => (
                <div 
                  key={asset.id} 
                  className="miniCard" 
                  style={{ padding: "0", overflow: "hidden", cursor: "pointer", aspectRatio: "1/1" }}
                  onClick={() => onAddImageUrl(asset.file_url)}
                >
                  <img src={asset.file_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>

            <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center", marginTop: "10px" }}>
              Or paste a URL:
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input 
                placeholder="https://..." 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onAddImageUrl((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "draw" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
             <button 
               className={isDrawing ? "primaryButton" : "secondaryButton"}
               style={{ width: "100%" }}
               onClick={toggleDrawing}
             >
               {isDrawing ? "Disable Drawing" : "Enable Freehand Drawing"}
             </button>
             
             {isDrawing && (
               <>
                 <div>
                   <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Brush Color</label>
                   <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                     {(brandColors ? [brandColors.primary, brandColors.secondary, brandColors.accent, "#000000"] : ["#0e1217", "#8b3dff", "#ff4d4d", "#00c896", "#ffb800"]).map(c => (
                       <button
                         key={c}
                         onClick={() => setBrushColor(c)}
                         style={{ width: "24px", height: "24px", background: c, border: brushColor === c ? "2px solid var(--text)" : "1px solid var(--border)", borderRadius: "50%", cursor: "pointer" }}
                       />
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label style={{ fontSize: "12px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Brush Size: {brushWidth}px</label>
                   <input 
                     type="range" 
                     min="1" 
                     max="50" 
                     value={brushWidth} 
                     onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                     style={{ width: "100%" }}
                   />
                 </div>
               </>
             )}
          </div>
        )}

        {activeTab === "templates" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {PRESET_TEMPLATES.map((tmpl) => (
              <div 
                key={tmpl.id} 
                className="miniCard" 
                style={{ padding: "0", overflow: "hidden", position: "relative", cursor: "pointer", transition: "transform 0.2s ease" }}
                onClick={() => onLoadTemplate(tmpl.json)}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                 <div style={{ height: "136px", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={tmpl.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 </div>
                 <div style={{ padding: "12px", background: "var(--panel)" }}>
                   <p style={{ fontSize: "13px", fontWeight: "600", margin: "0" }}>{tmpl.title}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "review" && (
           <ReviewPanel designId={designId} />
        )}
        
        {activeTab === "layers" && (
           <LayersPanel canvas={canvas} />
        )}
        
        {activeTab === "brand" && (
           <BrandKit canvas={canvas} onPushHistory={onPushHistory} />
        )}
        
        {activeTab === "export" && (
           <CodeExportPanel canvas={canvas} />
        )}
        
        {activeTab === "content" && (
           <StructuredInputPanel canvas={canvas} brandColors={brandColors} />
        )}
      </div>
    </aside>
  );
}
