"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, Textbox, Point } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Maximize, 
  Undo2, 
  Redo2, 
  Layout, 
  Square, 
  Circle, 
  Type, 
  Layers, 
  Settings, 
  CloudUpload,
  MousePointer2,
  Hand,
  Trash2,
  Copy,
  Activity
} from "lucide-react";

import {
  addCircle,
  addImageFromUrl,
  addRectangle,
  addShape,
  addTextbox,
  alignObject,
  createEditorCanvas,
  createLogicConnector,
  duplicateSelectedObject,
  loadCanvasJson,
  removeSelectedObject,
  serializeCanvas,
  toggleObjectLock,
  updateLogicConnectors
} from "../lib/fabric";

import { getDesignById, isUuid, updateDesignById } from "../lib/studio-client";
import { CanvasHeader } from "./canvas-header";
import { EditorSidebar } from "./editor-sidebar";
import { SidePanelContent } from "./side-panel-content";
import { PresentationMode } from "./presentation-mode";

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

export default function EditorShell({ designId }: EditorShellProps) {
  const useRemote = isUuid(designId);
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(useRemote);
  const [activeTab, setActiveTab] = useState<SidebarTab>("elements");
  const [zoom, setZoom] = useState(0.8);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isSidebarOpen] = useState(true);
  
  // Pillar 1: Logic Engine State
  const [isLinking, setIsLinking] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  
  const [pages, setPages] = useState<Array<{ id: string; json: any }>>([{ id: "page-1", json: null }]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // History & Serialization
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
    const prevState = undoStack[undoStack.length - 1];
    const { pages: prevPages, activePageIndex: prevIndex } = JSON.parse(prevState);
    setUndoStack(prev => prev.slice(0, -1));
    setPages(prevPages);
    setActivePageIndex(prevIndex);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    const { pages: nextPages, activePageIndex: nextIndex } = JSON.parse(nextState);
    setRedoStack(prev => prev.slice(0, -1));
    setPages(nextPages);
    setActivePageIndex(nextIndex);
  };

  // Async Load
  useEffect(() => {
    if (!useRemote) return;
    async function load() {
      try {
        const row = await getDesignById(designId);
        setTitle(row.title || "Untitled");
        if (row.canvas_json) setPages(Array.isArray(row.canvas_json) ? row.canvas_json : [{ id: "page-1", json: row.canvas_json }]);
        setDocumentState(prev => ({ ...prev, workspaceId: row.workspace_id }));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [designId, useRemote]);

  // Canvas Init
  useEffect(() => {
    if (!canvasElementRef.current || !containerRef.current) return;

    const canvas = createEditorCanvas(
      canvasElementRef.current,
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );

    fabricRef.current = canvas;
    
    const currentPage = pages[activePageIndex];
    if (currentPage?.json) void loadCanvasJson(canvas, currentPage.json);

    canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoomValue = canvas.getZoom();
      zoomValue *= 0.999 ** delta;
      if (zoomValue > 20) zoomValue = 20;
      if (zoomValue < 0.01) zoomValue = 0.01;
      canvas.zoomToPoint(new Point(opt.e.offsetX, opt.e.offsetY), zoomValue);
      setZoom(zoomValue);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    let isPanning = false;
    canvas.on('mouse:down', (opt) => {
      const evt = opt.e as MouseEvent;
      if (evt.altKey || evt.button === 1) {
        isPanning = true;
        canvas.selection = false;
        return;
      }

      // Pillar 1: Logic Linking
      if (isLinking && opt.target) {
        const targetId = (opt.target as any).id;
        if (!targetId) return;

        if (!linkSource) {
          setLinkSource(targetId);
          setSaveMessage("Source Protocol Selected");
        } else if (linkSource !== targetId) {
          createLogicConnector(canvas, linkSource, targetId);
          setLinkSource(null);
          setIsLinking(false);
          setSaveMessage("Protocol Established");
          pushToHistory();
        }
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (isPanning && opt.e) {
        const e = opt.e as MouseEvent;
        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += e.movementX;
          vpt[5] += e.movementY;
          canvas.requestRenderAll();
        }
      }
    });

    canvas.on('mouse:up', () => {
      isPanning = false;
      canvas.selection = true;
    });

    // Strategic Snap-to-Grid
    const grid = 20;
    canvas.on('object:moving', (options) => {
      if (!options.target) return;
      options.target.set({
        left: Math.round(options.target.left! / grid) * grid,
        top: Math.round(options.target.top! / grid) * grid
      });
      // Pillar 1: Update Connectors
      updateLogicConnectors(canvas);
    });

    canvas.on('object:scaling', () => {
      updateLogicConnectors(canvas);
    });

    canvas.on("object:modified", pushToHistory);

    // Strategic Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        removeSelectedObject(canvas);
        pushToHistory();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelectedObject(canvas);
        pushToHistory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const resizeObserver = new ResizeObserver(() => {
       if (containerRef.current && fabricRef.current) {
         fabricRef.current.setDimensions({
           width: containerRef.current.clientWidth,
           height: containerRef.current.clientHeight
         });
       }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      canvas.dispose();
      fabricRef.current = null;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePageIndex, pushToHistory]);

  const saveNow = async () => {
    if (!fabricRef.current) return;
    setSaveMessage("Optimizing Strategy...");
    try {
      const currentJson = serializeCanvas(fabricRef.current);
      const updatedPages = [...pages];
      updatedPages[activePageIndex].json = currentJson;
      if (useRemote) await updateDesignById(designId, { canvas_json: updatedPages, title });
      setSaveMessage("Strategy Optimized");
    } catch { setSaveMessage("Sync Failed"); }
  };

  return (
    <div className="app-container">
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-overlay" style={{ position: "fixed", inset: 0, zIndex: 9991, background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 40, height: 40, border: "3px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%" }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="header-glass glass-panel">
         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: 32, height: 32, background: "var(--primary)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><Layout size={18} color="white" /></div>
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ background: "transparent", border: "none", color: "white", fontSize: 16, fontWeight: 700, width: 240, outline: "none" }} />
         </div>
         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="muted-text">{saveMessage}</span>
            <button onClick={undo} className="sidebar-icon" title="Undo"><Undo2 size={18} /></button>
            <button onClick={redo} className="sidebar-icon" title="Redo"><Redo2 size={18} /></button>
            <button onClick={saveNow} className="btn-pro btn-primary">Save Strategy</button>
            <button onClick={() => setIsPresenting(true)} className="btn-pro btn-secondary"><Maximize size={16} /> Present</button>
         </div>
      </div>

      <div className="main-layout">
         <aside className="sidebar-minimal">
            <button onClick={() => setActiveTab("elements")} className={`sidebar-icon ${activeTab === "elements" ? "active" : ""}`}><Square size={20} /></button>
            <button onClick={() => setActiveTab("text")} className={`sidebar-icon ${activeTab === "text" ? "active" : ""}`}><Type size={20} /></button>
            <button onClick={() => setActiveTab("uploads")} className={`sidebar-icon ${activeTab === "uploads" ? "active" : ""}`}><CloudUpload size={20} /></button>
            <button onClick={() => setActiveTab("content")} className={`sidebar-icon ${activeTab === "content" ? "active" : ""}`} title="Logic Layer"><Activity size={20} /></button>
            <button onClick={() => setActiveTab("brand")} className={`sidebar-icon ${activeTab === "brand" ? "active" : ""}`}><Settings size={20} /></button>
            <div style={{ flex: 1 }} />
            <button onClick={() => setActiveTab("layers")} className={`sidebar-icon ${activeTab === "layers" ? "active" : ""}`}><Layers size={20} /></button>
         </aside>

         <AnimatePresence>
            {isSidebarOpen && (
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="panel-container glass-panel">
                  <SidePanelContent 
                    activeTab={activeTab}
                    canvas={fabricRef.current}
                    workspaceId={documentState.workspaceId}
                    designId={designId}
                    isLinking={isLinking}
                    setIsLinking={setIsLinking}
                    onPushHistory={pushToHistory}
                    onAddRect={() => fabricRef.current && addRectangle(fabricRef.current)}
                    onAddCircle={() => fabricRef.current && addCircle(fabricRef.current)}
                    onAddText={(type) => fabricRef.current && addTextbox(fabricRef.current, undefined, type)}
                    onAddShape={(type) => fabricRef.current && addShape(fabricRef.current, type)}
                    onAddImageUrl={(url) => fabricRef.current && addImageFromUrl(fabricRef.current, url)}
                    onLoadTemplate={(json) => fabricRef.current && loadCanvasJson(fabricRef.current, json)}
                 />
              </motion.div>
            )}
         </AnimatePresence>

         <section ref={containerRef} className="canvas-viewport">
            <div className="canvas-grid" />
            <canvas ref={canvasElementRef} />
            <div className="floating-tools glass-panel">
               <button onClick={() => fabricRef.current?.setZoom(1)} className="sidebar-icon" title="Pointer"><MousePointer2 size={18} /></button>
               <button onClick={() => fabricRef.current && removeSelectedObject(fabricRef.current)} className="sidebar-icon" title="Delete"><Trash2 size={18} /></button>
               <button onClick={() => fabricRef.current && duplicateSelectedObject(fabricRef.current)} className="sidebar-icon" title="Duplicate"><Copy size={18} /></button>
            </div>
            <div className="zoom-controls glass-panel">
               <button onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))} className="sidebar-icon"><Minus size={14} /></button>
               <span style={{ fontSize: 13, fontWeight: 600, minWidth: 40, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
               <button onClick={() => setZoom(prev => Math.min(5, prev + 0.1))} className="sidebar-icon"><Plus size={14} /></button>
            </div>
         </section>
      </div>

      <AnimatePresence>
        {isPresenting && <PresentationMode canvas={fabricRef.current} onClose={() => setIsPresenting(false)} />}
      </AnimatePresence>
    </div>
  );
}