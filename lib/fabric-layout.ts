import { Canvas, Textbox, Line, FabricObject, Point, Rect, Circle } from "fabric";
import { StrategicFramework } from "./strategic-frameworks";
import { createLogicConnector } from "./fabric";

// Augment Fabric types for our logic engine
declare module "fabric" {
  interface FabricObject {
    id?: string;
    isPrimaryLogic?: boolean;
    isPageSeam?: boolean;
    anchoredToId?: string; 
    anchorFromId?: string; 
    anchorToId?: string;
    _logicReflowHeight?: number; 
  }
}

const PAGE_HEIGHT = 1080;
const PAGE_PADDING = 100;
const SEAM_THRESHOLD = PAGE_HEIGHT * 0.9;
const CANVAS_DYNAMIC_WIDTH = 800; // Base width for template

export function generateSmartLayout(canvas: Canvas, blocks: any[], brandColors: any, framework?: StrategicFramework) {
   const existingObjects = canvas.getObjects();
   
   // Retain manual user drawings/arrows
   const retainedCustomShapes = existingObjects.filter(o => !o.isPrimaryLogic && !o.isPageSeam);
   
   canvas.clear();
   canvas.backgroundColor = "transparent";

   const newObjects: FabricObject[] = [];

   if (framework?.layout === "swot") {
      generateSwotLayout(canvas, blocks, newObjects);
   } else if (framework?.layout === "porters") {
      generatePortersLayout(canvas, blocks, newObjects);
   } else if (framework?.layout === "pestel") {
      generatePestelLayout(canvas, blocks, newObjects);
   } else {
      generateVerticalLayout(canvas, blocks, newObjects, brandColors);
   }

   // Process retained custom shapes
   retainedCustomShapes.forEach(shape => {
     if (shape.anchoredToId) {
       const target = newObjects.find(o => o.id === shape.anchoredToId);
       if (target) {
         const topDelta = target.top! - (shape.top || 0);
         shape.set({ top: (shape.top || 0) + topDelta });
         shape.set({ opacity: 1, strokeDashArray: null });
       } else {
         shape.set({ opacity: 0.3, strokeDashArray: [5, 5] });
       }
     }
     newObjects.push(shape);
   });

   canvas.add(...newObjects);
   
   // Apply autonomous connections for 2D layouts
   if (framework?.layout === "swot" || framework?.layout === "porters") {
      applyAutonomousConnections(canvas, framework.layout);
   }

   setupCascadingReflowTracker(canvas);
   canvas.requestRenderAll();
}

function generateVerticalLayout(canvas: Canvas, blocks: any[], objects: FabricObject[], brandColors: any) {
  let currentY = 120;
  let currentPageOffset = 0;

  for (const block of blocks) {
    let fontSize = 18;
    let fontWeight: any = "normal";
    let leftX = 100;
    
    switch (block.type) {
      case "title": fontSize = 48; fontWeight = 800; break;
      case "subtitle": fontSize = 28; fontWeight = 600; break;
      case "bullet": fontSize = 18; leftX = 140; break;
      default: fontSize = 16; break;
    }

    const tb = new Textbox(block.content, {
      left: leftX,
      top: currentY + currentPageOffset,
      width: CANVAS_DYNAMIC_WIDTH - leftX - 100,
      fontSize,
      fontWeight,
      fill: brandColors ? (brandColors.secondary || "#0e1217") : "#0e1217",
      fontFamily: brandColors ? (brandColors.fontFamily || "Inter") : "Inter",
    });
    
    tb.id = block.id;
    tb.isPrimaryLogic = true;
    tb._logicReflowHeight = tb.height! * tb.scaleY!;
    
    const computedHeight = tb.height! * tb.scaleY!;
    if ((currentY + computedHeight) > SEAM_THRESHOLD) {
      currentPageOffset += PAGE_HEIGHT;
      currentY = PAGE_PADDING;
      tb.set("top", currentY + currentPageOffset);
      
      const seam = new Line([0, currentPageOffset, canvas.width || 1200, currentPageOffset], {
        stroke: "rgba(255,255,255,0.1)",
        strokeWidth: 2,
        strokeDashArray: [10, 10],
        selectable: false,
        evented: false
      });
      seam.isPageSeam = true;
      objects.push(seam);
    }

    objects.push(tb);
    currentY += computedHeight + (block.type === "title" ? 40 : 20);
  }

  const totalRequiredHeight = currentPageOffset + PAGE_HEIGHT;
  if (totalRequiredHeight > (canvas.height || 0)) {
    canvas.setDimensions({ width: canvas.width!, height: totalRequiredHeight });
  }
}

function generateSwotLayout(canvas: Canvas, blocks: any[], objects: FabricObject[]) {
   const centerX = (canvas.width || 1200) / 2;
   const centerY = (canvas.height || 1080) / 2;
   const quadSize = 300;

   const positions = [
      { x: centerX - quadSize - 20, y: centerY - quadSize - 20, color: "rgba(16,185,129,0.1)", label: "STRENGTHS" },
      { x: centerX + 20, y: centerY - quadSize - 20, color: "rgba(245,158,11,0.1)", label: "WEAKNESSES" },
      { x: centerX - quadSize - 20, y: centerY + 20, color: "rgba(59,130,246,0.1)", label: "OPPORTUNITIES" },
      { x: centerX + 20, y: centerY + 20, color: "rgba(239,68,68,0.1)", label: "THREATS" }
   ];

   blocks.filter(b => b.type === "subtitle").forEach((block, i) => {
      if (i > 3) return;
      const pos = positions[i];
      const rect = new Rect({
         left: pos.x, top: pos.y, width: quadSize, height: quadSize,
         fill: pos.color, rx: 16, ry: 16, selectable: false, id: `swot-bg-${i}`
      });
      objects.push(rect);

      const tb = new Textbox(block.content, {
         left: pos.x + 20, top: pos.y + 20, width: quadSize - 40,
         fontSize: 24, fontWeight: "800", fill: "white", id: block.id
      });
      tb.isPrimaryLogic = true;
      objects.push(tb);
   });
}

function generatePortersLayout(canvas: Canvas, blocks: any[], objects: FabricObject[]) {
   const centerX = (canvas.width || 1200) / 2;
   const centerY = (canvas.height || 1080) / 2;
   
   const layoutMap: Record<number, { x: number, y: number, id: string }> = {
      0: { x: centerX - 150, y: centerY - 60, id: "rivalry" }, 
      1: { x: centerX - 150, y: centerY - 350, id: "entrants" }, 
      2: { x: centerX + 300, y: centerY - 60, id: "buyers" }, 
      3: { x: centerX - 600, y: centerY - 60, id: "suppliers" }, 
      4: { x: centerX - 150, y: centerY + 230, id: "substitutes" }
   };

   blocks.filter(b => b.type === "subtitle").forEach((block, i) => {
      const pos = layoutMap[i];
      if (!pos) return;

      const rect = new Rect({
         left: pos.x, top: pos.y, width: 300, height: 120,
         fill: "rgba(139,61,255,0.05)", stroke: "rgba(139,61,255,0.2)", rx: 12, ry: 12, id: `porter-bg-${pos.id}`
      });
      objects.push(rect);

      const tb = new Textbox(block.content, {
         left: pos.x + 20, top: pos.y + 45, width: 260,
         fontSize: 18, fontWeight: "900", fill: "white", textAlign: "center", id: block.id
      });
      tb.isPrimaryLogic = true;
      objects.push(tb);
   });
}

function generatePestelLayout(canvas: Canvas, blocks: any[], objects: FabricObject[]) {
   let startX = 100;
   let startY = 200;
   blocks.filter(b => b.type === "subtitle").forEach((block, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + (col * 500);
      const y = startY + (row * 240);

      const rect = new Rect({
         left: x, top: y, width: 450, height: 200,
         fill: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.1)", rx: 16, id: `pestel-bg-${i}`
      });
      objects.push(rect);

      const tb = new Textbox(block.content, {
         left: x + 24, top: y + 24, width: 400,
         fontSize: 22, fontWeight: "800", fill: "#8b3dff", id: block.id
      });
      tb.isPrimaryLogic = true;
      objects.push(tb);
   });
}

function applyAutonomousConnections(canvas: Canvas, layout: string) {
   const objects = canvas.getObjects();
   const logicNodes = objects.filter(o => o.isPrimaryLogic);
   
   if (layout === "porters" && logicNodes.length >= 5) {
      const rivalry = logicNodes[0];
      for (let i = 1; i < 5; i++) {
         createLogicConnector(canvas, logicNodes[i].id!, rivalry.id!);
      }
   } else if (layout === "swot" && logicNodes.length >= 4) {
      createLogicConnector(canvas, logicNodes[0].id!, logicNodes[1].id!);
      createLogicConnector(canvas, logicNodes[1].id!, logicNodes[3].id!);
      createLogicConnector(canvas, logicNodes[3].id!, logicNodes[2].id!);
      createLogicConnector(canvas, logicNodes[2].id!, logicNodes[0].id!);
   }
}

export function setupCascadingReflowTracker(canvas: Canvas) {
  canvas.off("text:changed");
  canvas.on("text:changed", (opt: any) => {
    const target = opt.target as FabricObject;
    if (!target) return;
    target.setCoords();
    const newHeight = target.height! * target.scaleY!;
    const oldHeight = target._logicReflowHeight || newHeight;
    const deltaY = newHeight - oldHeight;
    if (Math.abs(deltaY) > 1) {
      cascadeReflow(canvas, target, deltaY);
      target._logicReflowHeight = newHeight;
    }
  });
}

function cascadeReflow(canvas: Canvas, origin: FabricObject, deltaY: number) {
  const allObjects = canvas.getObjects();
  allObjects.forEach(obj => {
    if (obj === origin || obj.isPageSeam) return;
    if (obj.top !== undefined && obj.top > origin.top! + 10) {
      obj.set("top", obj.top + deltaY);
      obj.setCoords();
    }
  });
  canvas.requestRenderAll();
}

export function getSlideBoundaries(canvas: Canvas): number[] {
  const seams = canvas.getObjects()
    .filter(o => o.isPageSeam)
    .map(o => o.top || 0)
    .sort((a, b) => a - b);
  return [0, ...seams];
}

export function getStrategicSequence(canvas: Canvas | null): FabricObject[] {
  if (!canvas) return [];
  const objects = canvas.getObjects();
  // Filter for primary logic nodes
  const nodes = objects.filter(o => o.isPrimaryLogic);
  // Narrative Sort: Top-to-Bottom, then Left-to-Right
  return nodes.sort((a, b) => {
     const topDiff = (a.top || 0) - (b.top || 0);
     if (Math.abs(topDiff) < 50) return (a.left || 0) - (b.left || 0);
     return topDiff;
  });
}

/**
 * RECALIBRATE_PROTOCOL (v1.3.0)
 * Performs a global optimization sweep to fix overlaps and refine narrative flow.
 */
export function recalibrateStrategicLayout(canvas: Canvas | null) {
  if (!canvas) return;
  const nodes = getStrategicSequence(canvas);
  if (nodes.length === 0) return;

  let currentY = nodes[0].top || 120;
  
  nodes.forEach((node, i) => {
     if (i === 0) {
        node._logicReflowHeight = node.height! * node.scaleY!;
        return;
     }
     
     const prev = nodes[i-1];
     const prevBottom = (prev.top || 0) + (prev._logicReflowHeight || (prev.height! * prev.scaleY!));
     
     // Ensure at least 40px margin between blocks
     const idealTop = prevBottom + 40;
     
     if (Math.abs((node.top || 0) - idealTop) > 2) {
        node.set("top", idealTop);
        node.setCoords();
        node._logicReflowHeight = node.height! * node.scaleY!;
     }
  });

  canvas.requestRenderAll();
}

/**
 * LOGIC_MOAT_DENSITY (v1.3.0)
 * Calculates a connectivity score based on semantic proximity and logical anchors.
 */
export function calculateLogicMoatDensity(canvas: Canvas | null): number {
  if (!canvas) return 0;
  const objects = canvas.getObjects();
  const logicNodes = objects.filter(o => o.isPrimaryLogic);
  if (logicNodes.length < 2) return 100;

  let score = 85; // Base stability
  
  // Rule 1: High density penalty (overlaps)
  let overlaps = 0;
  for (let i = 0; i < logicNodes.length; i++) {
     for (let j = i + 1; j < logicNodes.length; j++) {
        if (logicNodes[i].intersectsWithObject(logicNodes[j])) overlaps++;
     }
  }
  score -= (overlaps * 15);

  // Rule 2: Floating node penalty (not anchored)
  const floating = logicNodes.filter(n => !n.anchoredToId && !n.anchorToId).length;
  score -= (floating * 5);

  return Math.max(0, Math.min(100, score));
}
