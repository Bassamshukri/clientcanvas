"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, Textbox } from "fabric";
import {
  addCircle,
  addImageFromUrl,
  addRectangle,
  addShape,
  addTextbox,
  alignObject,
  applyCanvasBackground,
  clearGuides,
  createEditorCanvas,
  downloadDataUrl,
  duplicateSelectedObject,
  exportCanvasDataUrl,
  groupSelectedObjects,
  handleObjectSnapping,
  loadCanvasJson,
  moveBackward,
  moveForward,
  removeSelectedObject,
  renderAllPagesToPdf,
  serializeCanvas,
  setSelectionBold,
  setSelectionColor,
  setSelectionItalic,
  toggleDrawingMode,
  ungroupSelectedObjects,
  toggleObjectLock
} from "../lib/fabric";
import { getDesignById, isUuid, updateDesignById } from "../lib/studio-client";
import { CanvasHeader } from "./canvas-header";
import { EditorSidebar } from "./editor-sidebar";
import { SidePanelContent } from "./side-panel-content";
import { ContextualToolbar } from "./contextual-toolbar";
import { PresentationMode } from "./presentation-mode";
import { getSlideBoundaries } from "../lib/fabric-layout";

interface EditorShellProps {
  designId: string;
}

interface LocalDesignRecord {
  id: string;
  title: string;
  width: number;
  height: number;
  status: "draft" | "in_review" | "needs_changes" | "approved";
  canvasJson: unknown | null;
  updatedAt: string;
  workspaceId?: string;
}

type SidebarTab = "content" | "templates" | "elements" | "text" | "brand" | "uploads" | "draw" | "layers" | "review" | "export";

function designStorageKey(designId: string) {
  return `clientcanvas-design-${designId}`;
}

export default function EditorShell({ designId }: EditorShellProps) {
  const useRemote = isUuid(designId);
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const [documentState, setDocumentState] = useState<LocalDesignRecord>({
    id: designId,
    title: "Untitled design",
    width: 1080,
    height: 1080,
    status: "draft",
    canvasJson: null,
    updatedAt: new Date().toISOString()
  });

  const [title, setTitle] = useState(documentState.title);
  const [status, setStatus] = useState(documentState.status);
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(useRemote);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<SidebarTab>("elements");
  const [zoom, setZoom] = useState(0.5); 
  const [isPresenting, setIsPresenting] = useState(false);
  
  // Multi-page state
  const [pages, setPages] = useState<Array<{ id: string; json: any }>>([{ id: "page-1", json: null }]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // History state
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Selection state
  const [selectedObject, setSelectedObject] = useState<{
    type: string;
    isBold: boolean;
    isItalic: boolean;
    color: string;
    isLocked: boolean;
  } | null>(null);

  const [brandKit, setBrandKit] = useState<{
    primary: string;
    secondary: string;
    accent: string;
    fontFamily: string;
  } | null>(null);

  useEffect(() => {
    if (!documentState.workspaceId) return;
    try {
      const raw = window.localStorage.getItem(`clientcanvas-brandkit-${documentState.workspaceId}`);
      if (raw) {
        setBrandKit(JSON.parse(raw));
      } else {
        setBrandKit({
          primary: "#6d5efc",
          secondary: "#111827",
          accent: "#19c29b",
          fontFamily: "Inter"
        });
      }
    } catch {
      // ignorable
    }
  }, [documentState.workspaceId]);

  useEffect(() => {
    let active = true;

    async function loadRemote() {
      if (!useRemote) return;
      try {
        setLoading(true);
        setError("");
        const row = await getDesignById(designId);
        if (!active) return;

        const next: LocalDesignRecord = {
          id: row.id,
          title: row.title || "Untitled design",
          width: row.width || 1080,
          height: row.height || 1080,
          status: row.status || "draft",
          canvasJson: row.canvas_json || null,
          updatedAt: row.updated_at || new Date().toISOString(),
          workspaceId: row.workspace_id
        };

        setDocumentState(next);
        setTitle(next.title);
        setStatus(next.status);

        if (Array.isArray(row.canvas_json)) {
          setPages(row.canvas_json);
        } else if (row.canvas_json) {
          setPages([{ id: "page-1", json: row.canvas_json }]);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadRemote();
    return () => { active = false; };
  }, [designId, useRemote]);

  const pushToHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const currentJson = serializeCanvas(canvas);
    const updatedPages = [...pages];
    updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], json: currentJson };
    
    const state = JSON.stringify({ pages: updatedPages, activePageIndex });
    setUndoStack(prev => [...prev.slice(-49), state]);
    setRedoStack([]);
  }, [pages, activePageIndex]);

  const undo = () => {
    if (undoStack.length === 0) return;
    const canvas = fabricRef.current;
    if (!canvas) return;

    const currentJson = serializeCanvas(canvas);
    const updatedPages = [...pages];
    updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], json: currentJson };
    const currentState = JSON.stringify({ pages: updatedPages, activePageIndex });

    const prevState = undoStack[undoStack.length - 1];
    const { pages: prevPages, activePageIndex: prevIndex } = JSON.parse(prevState);

    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));

    setPages(prevPages);
    setActivePageIndex(prevIndex);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const canvas = fabricRef.current;
    if (!canvas) return;

    const currentJson = serializeCanvas(canvas);
    const updatedPages = [...pages];
    updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], json: currentJson };
    const currentState = JSON.stringify({ pages: updatedPages, activePageIndex });

    const nextState = redoStack[redoStack.length - 1];
    const { pages: nextPages, activePageIndex: nextIndex } = JSON.parse(nextState);

    setUndoStack(prev => [...prev, currentState]);
    setRedoStack(prev => prev.slice(0, -1));

    setPages(nextPages);
    setActivePageIndex(nextIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "g") {
        e.preventDefault();
        if (fabricRef.current) {
          pushToHistory();
          if (e.shiftKey) ungroupSelectedObjects(fabricRef.current);
          else groupSelectedObjects(fabricRef.current);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack, pages, activePageIndex, pushToHistory]);

  useEffect(() => {
    if (!canvasElementRef.current) return;

    if (fabricRef.current) {
      fabricRef.current.dispose();
      fabricRef.current = null;
    }

    const canvas = createEditorCanvas(
      canvasElementRef.current,
      documentState.width,
      documentState.height
    );

    fabricRef.current = canvas;
    
    const currentPage = pages[activePageIndex];
    if (currentPage?.json) {
      void loadCanvasJson(canvas, currentPage.json);
    }
    
    canvas.setZoom(zoom);

    const updateSelection = () => {
      const active = canvas.getActiveObject();
      if (!active) {
        setSelectedObject(null);
        return;
      }
      const isTextbox = active.isType("textbox") || active.isType("i-text") || active.isType("text");
      setSelectedObject({
        type: active.get("type") || "object",
        isBold: isTextbox ? (active as Textbox).fontWeight === "bold" : false,
        isItalic: isTextbox ? (active as Textbox).fontStyle === "italic" : false,
        color: (active.fill as string) || "#000000",
        isLocked: !!active.lockMovementX
      });
    };

    let timeout: any;
    const debouncedPush = () => {
      clearTimeout(timeout);
      timeout = setTimeout(pushToHistory, 500);
    };

    let isPanning = false;
    let lastX = 0, lastY = 0;

    const handleMouseDown = (opt: any) => {
      const evt = opt.e;
      if (evt.altKey === true || evt.button === 1) { 
        isPanning = true;
        canvas.selection = false;
        lastX = evt.clientX;
        lastY = evt.clientY;
      }
    };

    const handleMouseMove = (opt: any) => {
      if (isPanning) {
        const evt = opt.e;
        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += evt.clientX - lastX;
          vpt[5] += evt.clientY - lastY;
          canvas.requestRenderAll();
          lastX = evt.clientX;
          lastY = evt.clientY;
        }
      }
    };

    const handleMouseUp = () => {
      isPanning = false;
      canvas.selection = true;
      clearGuides(canvas);
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("object:moving", (e) => {
       if (e.target) handleObjectSnapping(canvas, e.target);
    });
    canvas.on("selection:created", updateSelection);
    canvas.on("selection:updated", updateSelection);
    canvas.on("selection:cleared", updateSelection);
    canvas.on("object:modified", () => {
      updateSelection();
      debouncedPush();
      clearGuides(canvas);
    });
    canvas.on("object:added", (e) => {
      if (!e.target?.get("isHistoryUpdate")) debouncedPush();
    });

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("selection:created", updateSelection);
      canvas.off("selection:updated", updateSelection);
      canvas.off("selection:cleared", updateSelection);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [activePageIndex, documentState.height, documentState.width, pushToHistory]);

  useEffect(() => {
    if (fabricRef.current) fabricRef.current.setZoom(zoom);
  }, [zoom]);

  const addPage = () => {
    pushToHistory();
    const newPage = { id: `page-${Date.now()}`, json: null };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) return;
    pushToHistory();
    const nextPages = pages.filter((_, i) => i !== index);
    setPages(nextPages);
    setActivePageIndex(Math.max(0, activePageIndex - 1));
  };

  async function saveNow() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const currentJson = serializeCanvas(canvas);
    const updatedPages = pages.map((p, i) => i === activePageIndex ? { ...p, json: currentJson } : p);
    setPages(updatedPages);
    const next: LocalDesignRecord = { ...documentState, title, status, canvasJson: updatedPages, updatedAt: new Date().toISOString() };
    try {
      setSaveMessage("Saving...");
      if (useRemote) {
        const row = await updateDesignById(designId, { title: next.title, status: next.status, canvas_json: next.canvasJson });
        setSaveMessage(`Last saved at ${new Date(row.updated_at).toLocaleTimeString()}`);
      } else {
        window.localStorage.setItem(designStorageKey(designId), JSON.stringify(next));
        setSaveMessage(`Saved locally at ${new Date().toLocaleTimeString()}`);
      }
      setDocumentState(next);
    } catch (err) { setError("Failed to save."); }
  }

  const exportPng = () => {
    if (!fabricRef.current) return;
    const url = exportCanvasDataUrl(fabricRef.current, "png");
    downloadDataUrl(url, `${title}.png`);
  };

  const exportPdf = () => {
    if (!fabricRef.current) return;
    saveNow().then(() => { void renderAllPagesToPdf(pages, documentState.width, documentState.height, title); });
  };

  return (
    <div className="appContainer">
      <CanvasHeader 
        title={title} 
        onTitleChange={setTitle} 
        onSave={saveNow} 
        onExportPng={exportPng} 
        onExportPdf={exportPdf} 
        onPresent={() => setIsPresenting(true)}
        saveMessage={saveMessage} 
        onUndo={undo} 
        onRedo={redo} 
        canUndo={undoStack.length > 0} 
        canRedo={redoStack.length > 0} 
      />
      <main className="editorMainLayout">
        <EditorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidePanelContent
          activeTab={activeTab}
          designId={designId}
          workspaceId={documentState.workspaceId}
          canvas={fabricRef.current}
          onPushHistory={pushToHistory}
          onLoadTemplate={(json) => {
             if (fabricRef.current) {
               pushToHistory();
               void loadCanvasJson(fabricRef.current, json);
             }
          }}
          onAddRect={() => { if (fabricRef.current) { pushToHistory(); addRectangle(fabricRef.current); } }} onAddCircle={() => { if (fabricRef.current) { pushToHistory(); addCircle(fabricRef.current); } }} onAddShape={(type) => { if (fabricRef.current) { pushToHistory(); addShape(fabricRef.current, type); } }} onAddText={(type) => { if (fabricRef.current) { pushToHistory(); addTextbox(fabricRef.current, undefined, type); } }} onAddImageUrl={(url) => { if (fabricRef.current) { pushToHistory(); addImageFromUrl(fabricRef.current, url); } }}
          brandColors={brandKit}
        />
        <section className="canvasWorkspace">
          <ContextualToolbar
            selectedType={selectedObject?.type || null}
            isBold={selectedObject?.isBold}
            isItalic={selectedObject?.isItalic}
            currentColor={selectedObject?.color}
            isLocked={selectedObject?.isLocked}
            brandColors={brandKit}
            onToggleLock={(locked) => {
               if (fabricRef.current) {
                 pushToHistory();
                 toggleObjectLock(fabricRef.current, locked);
               }
            }}
            onGroup={() => {
               if (fabricRef.current) {
                 pushToHistory();
                 groupSelectedObjects(fabricRef.current);
               }
            }}
            onUngroup={() => {
               if (fabricRef.current) {
                 pushToHistory();
                 ungroupSelectedObjects(fabricRef.current);
               }
            }}
            onDelete={() => { if (fabricRef.current) { pushToHistory(); removeSelectedObject(fabricRef.current); } }} onDuplicate={() => { if (fabricRef.current) { pushToHistory(); duplicateSelectedObject(fabricRef.current); } }} onBringForward={() => fabricRef.current && moveForward(fabricRef.current)} onSendBackward={() => fabricRef.current && moveBackward(fabricRef.current)} onAlign={(pos) => { if (fabricRef.current) { pushToHistory(); alignObject(fabricRef.current, pos); } }} onBold={(bold) => { if (fabricRef.current) { pushToHistory(); setSelectionBold(fabricRef.current, bold); } }} onItalic={(italic) => { if (fabricRef.current) { pushToHistory(); setSelectionItalic(fabricRef.current, italic); } }} onColorChange={(color) => { if (fabricRef.current) { pushToHistory(); setSelectionColor(fabricRef.current, color); } }} />
          <div className="canvasShadowWrapper">
            <div style={{ width: documentState.width * zoom, height: documentState.height * zoom, background: "#ffffff", lineHeight: 0, transition: "width 0.1s ease, height 0.1s ease" }}>
              <canvas ref={canvasElementRef} />
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", background: "var(--panel)", padding: "6px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", zIndex: 100 }}>
             {pages.map((_, i) => ( <button key={i} onClick={() => { if (fabricRef.current) { const currentJson = serializeCanvas(fabricRef.current); const updated = [...pages]; updated[activePageIndex].json = currentJson; setPages(updated); } setActivePageIndex(i); }} style={{ width: "32px", height: "32px", borderRadius: "8px", border: activePageIndex === i ? "2px solid var(--primary)" : "1px solid var(--border)", background: activePageIndex === i ? "var(--bg)" : "transparent", color: activePageIndex === i ? "var(--primary)" : "var(--muted)", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>{i + 1}</button> ))}
             <button onClick={addPage} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px dashed var(--border)", background: "transparent", color: "var(--muted)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
             {pages.length > 1 && ( <button onClick={() => deletePage(activePageIndex)} style={{ width: "32px", height: "32px", background: "transparent", border: "none", cursor: "pointer", color: "var(--danger)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button> )}
          </div>
          <div style={{ position: "absolute", bottom: "20px", right: "20px", background: "var(--panel)", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", zIndex: 100 }}>
             <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--muted)" }}>-</button>
             <span style={{ fontSize: "13px", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--muted)" }}>+</button>
             <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
             <button onClick={() => setZoom(0.5)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>Fit</button>
          </div>
          {loading && ( <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}><p>Loading your masterpiece...</p></div> )}
        </section>
      </main>
      
      {isPresenting && (
        <PresentationMode 
          canvas={fabricRef.current} 
          onClose={() => {
            setIsPresenting(false);
            if (fabricRef.current) fabricRef.current.setZoom(zoom);
          }} 
        />
      )}
    </div>
  );
}