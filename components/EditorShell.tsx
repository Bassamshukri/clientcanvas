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
  Activity,
  Sparkles,
  Rocket,
  Share2,
  Cpu,
  NotebookPen,
  Zap,
  MessageSquare,
  Flame
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
import { ShareModal } from "./share-modal";
import { AppHeader } from "./app-header";
import { StrategyMatrix } from "./strategy-matrix";
import { NeuralHeatmap } from "./neural-heatmap";
import { calculateStrategicDNA } from "../lib/strategic-intelligence";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

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

type SidebarTab = "content" | "protocols" | "elements" | "text" | "brand" | "uploads" | "draw" | "layers" | "review" | "export" | "ai" | "scratchpad";

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
  const [activeTab, setActiveTab] = useState<SidebarTab>("ai");
  const [zoom, setZoom] = useState(0.8);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isSidebarOpen] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const { score: dnaScore } = calculateStrategicDNA(fabricRef.current);
  
  // Pillar 1: Logic Engine State
  const [isLinking, setIsLinking] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isHeatmapActive, setIsHeatmapActive] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  
  // Phase 23.4: Ghost Suggestions Engine
  const { sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/intelligence" }),
    onFinish: ({ message }) => {
       if (message.parts && fabricRef.current) {
          message.parts.forEach((part: any) => {
             if (part.type === 'tool-invocation' && part.toolInvocation.toolName === 'executeStrategicAction') {
                const { action, data } = part.toolInvocation.args;
                if (action === 'add_logic_node' && data) {
                   const canvas = fabricRef.current!;
                   addTextbox(canvas, { 
                      left: data.left || 300, 
                      top: data.top || 300, 
                      text: data.text || "AI_SUGGESTION",
                   } as any);
                   // Set 0.3 opacity to the newly created object
                   const objects = canvas.getObjects();
                   const lastObj = objects[objects.length - 1];
                   if (lastObj) {
                      lastObj.set({ opacity: 0.3 });
                      canvas.renderAll();
                   }
                   setSaveMessage("NEURAL_GHOST_MATERIALIZED");
                }
             }
          });
       }
    }
  });

  const isGhosting = status === 'streaming' || status === 'submitted';

  const triggerNeuralGhosting = useCallback(() => {
     if (!fabricRef.current || isGhosting) return;
     const currentJson = JSON.stringify(serializeCanvas(fabricRef.current));
     sendMessage({
        text: `Analyze current strategy and suggest ONE logical next-step node. JSON: ${currentJson.substring(0, 500)}`
     });
  }, [sendMessage, isGhosting]);
  
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
    <div className="app-container" style={{ padding: "20px" }}>
<style jsx>{`
  .strategic-actions {
     margin-bottom: 20px;
     height: 56px;
     display: flex;
     align-items: center;
     justify-content: flex-end;
     padding: 0 20px;
     background: rgba(13, 16, 23, 0.4) !important;
     border-radius: 12px;
     border: 1px solid rgba(255,255,255,0.05);
  }
  .sidebar-icon:hover {
    color: var(--primary);
    background: rgba(139, 61, 255, 0.05);
  }
  .sidebar-icon.active {
    color: var(--primary);
    background: rgba(139, 61, 255, 0.1);
    border-left: 2px solid var(--primary);
  }
  .glow-matrix {
     color: var(--primary) !important;
     box-shadow: inset 0 0 10px var(--primary-glow);
     animation: matrix-pulse 2s infinite;
  }
  .glow-heatmap {
     color: var(--danger) !important;
     box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.4);
     animation: heatmap-pulse 2s infinite;
  }
  @keyframes matrix-pulse {
     0%, 100% { opacity: 1; }
     50% { opacity: 0.6; }
  }
  @keyframes heatmap-pulse {
     0%, 100% { transform: scale(1); opacity: 1; }
     50% { transform: scale(1.1); opacity: 0.8; }
  }
  .sidebar-divider {
    width: 20px;
    height: 1px;
    background: var(--border);
    margin: 8px 0;
  }
`}</style>
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading-overlay" style={{ position: "fixed", inset: 0, zIndex: 9991, background: "#0a0a0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 40, height: 40, border: "3px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%" }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AppHeader 
        title={title} 
        subtitle="EDITING_PROTOCOL_ACTIVE" 
        showBackHome={true} 
        dnaScore={dnaScore}
      />

      <div className="strategic-actions glass-panel">
         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="muted-text" style={{ fontSize: "11px" }}>{saveMessage}</span>
            <button onClick={undo} className="sidebar-icon" title="Undo"><Undo2 size={18} /></button>
            <button onClick={redo} className="sidebar-icon" title="Redo"><Redo2 size={18} /></button>
            <button onClick={triggerNeuralGhosting} className={`sidebar-icon ${isGhosting ? 'active animate-pulse' : ''}`} title="Trigger Ghost Suggestion"><Sparkles size={18} /></button>
            <button onClick={saveNow} className="btn-pro btn-primary">Save Strategy</button>
            <button onClick={() => setIsShareModalOpen(true)} className="btn-pro btn-secondary" style={{ gap: "8px" }}><Share2 size={16} /> Share</button>
            <button onClick={() => setIsPresenting(true)} className="btn-pro btn-secondary"><Maximize size={16} /> Present</button>
         </div>
      </div>

      <div className="main-layout">
         <aside className="sidebar-minimal">
            <button onClick={() => setActiveTab("ai")} className={`sidebar-icon ${activeTab === 'ai' ? 'active' : ''}`} title="AI Orchestrator">
               <Cpu size={20} />
            </button>
            <button onClick={() => setActiveTab("scratchpad")} className={`sidebar-icon ${activeTab === 'scratchpad' ? 'active' : ''}`} title="Drafting Scratchpad">
               <NotebookPen size={20} />
            </button>
            <button onClick={() => setIsMatrixActive(!isMatrixActive)} className={`sidebar-icon ${isMatrixActive ? 'active glow-matrix' : ''}`} title="Neural Matrix">
               <Activity size={20} />
            </button>
            <button onClick={() => setIsHeatmapActive(!isHeatmapActive)} className={`sidebar-icon ${isHeatmapActive ? 'active glow-heatmap' : ''}`} title="Strategic Tension">
               <Flame size={20} />
            </button>
            <div className="sidebar-divider" />
            <button onClick={() => setActiveTab("elements")} className={`sidebar-icon ${activeTab === "elements" ? "active" : ""}`} title="Elements"><Square size={20} /></button>
            <button onClick={() => setActiveTab("text")} className={`sidebar-icon ${activeTab === "text" ? "active" : ""}`} title="Typography"><Type size={20} /></button>
            <button onClick={() => setActiveTab("uploads")} className={`sidebar-icon ${activeTab === "uploads" ? "active" : ""}`} title="Strategic Assets"><CloudUpload size={20} /></button>
            <button onClick={() => setActiveTab("protocols")} className={`sidebar-icon ${activeTab === "protocols" ? "active" : ""}`} title="Protocol Library"><Zap size={20} /></button>
            <button onClick={() => setActiveTab("brand")} className={`sidebar-icon ${activeTab === "brand" ? "active" : ""}`} title="Brand Kit"><Settings size={20} /></button>
            <div style={{ flex: 1 }} />
            <button onClick={() => setActiveTab("layers")} className={`sidebar-icon ${activeTab === "layers" ? "active" : ""}`} title="Scene Tree"><Layers size={20} /></button>
            <button onClick={() => setActiveTab("review")} className={`sidebar-icon ${activeTab === "review" ? "active" : ""}`} title="Approval Workflows"><MessageSquare size={20} /></button>
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
            <div className="canvas-viewport" id="canvas-container">
              <canvas id="fabric-canvas" ref={canvasElementRef} />
              <StrategyMatrix canvas={fabricRef.current} active={isMatrixActive} />
              <NeuralHeatmap canvas={fabricRef.current} active={isHeatmapActive} />
            </div>
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
        {isShareModalOpen && (
          <ShareModal 
            designId={designId} 
            designTitle={title} 
            onClose={() => setIsShareModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}