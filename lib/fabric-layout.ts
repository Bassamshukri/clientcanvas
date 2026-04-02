import { Canvas, Textbox, Line, FabricObject, Point } from "fabric";
import { StructureBlock } from "../components/structured-input-panel";

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

export function generateSmartLayout(canvas: Canvas, blocks: StructureBlock[], brandColors: any) {
  const existingObjects = canvas.getObjects();
  
  // Retain manual user drawings/arrows
  const retainedCustomShapes = existingObjects.filter(o => !o.isPrimaryLogic && !o.isPageSeam);
  
  canvas.clear();
  canvas.backgroundColor = "#ffffff";
  
  let currentY = 120;
  let currentPageOffset = 0;
  
  const newObjects: FabricObject[] = [];

  for (const block of blocks) {
    let fontSize = 18;
    let fontWeight: "normal" | "bold" | 600 | 800 = "normal";
    let leftX = 100;
    
    switch (block.type) {
      case "title":
        fontSize = 48;
        fontWeight = 800;
        break;
      case "subtitle":
        fontSize = 28;
        fontWeight = 600;
        break;
      case "bullet":
        fontSize = 18;
        leftX = 140; // Intentionally indented
        break;
      case "paragraph":
      default:
        fontSize = 16;
        break;
    }

    const tb = new Textbox(block.content, {
      left: leftX,
      top: currentY + currentPageOffset,
      width: CANVAS_DYNAMIC_WIDTH - leftX - 100, // Leave right margin
      fontSize,
      fontWeight,
      fill: brandColors ? brandColors.secondary : "#0e1217",
      fontFamily: brandColors ? brandColors.fontFamily : "Inter",
      splitByGrapheme: false,
    });
    
    tb.id = block.id;
    tb.isPrimaryLogic = true;
    tb._logicReflowHeight = tb.height! * tb.scaleY!;
    
    // Smart Seam Detection (Page Breaks)
    const computedHeight = tb.height! * tb.scaleY!;
    if ((currentY + computedHeight) > SEAM_THRESHOLD) {
      currentPageOffset += PAGE_HEIGHT;
      currentY = PAGE_PADDING;
      tb.set("top", currentY + currentPageOffset);
      
      // Draw visible page seam
      const seam = new Line([0, currentPageOffset, canvas.width || 1200, currentPageOffset], {
        stroke: "rgba(0,0,0,0.2)",
        strokeWidth: 2,
        strokeDashArray: [10, 10],
        selectable: false,
        evented: false
      });
      seam.isPageSeam = true;
      newObjects.push(seam);
    }

    newObjects.push(tb);
    currentY += computedHeight + (block.type === "title" ? 40 : 20);
  }

  // Handle retained manual shapes (Collisions and Ghosts)
  retainedCustomShapes.forEach(shape => {
    if (shape.anchoredToId) {
      const target = newObjects.find(o => o.id === shape.anchoredToId);
      if (target) {
        // Shift custom annotation to strictly follow its anchored text block
        const topDelta = target.top! - (shape.top || 0);
        shape.set({ top: (shape.top || 0) + topDelta });
        shape.set({ opacity: 1, strokeDashArray: null });
      } else {
        // The block it was pointing to was deleted from the structural sidebar
        // Shift into heavily ghosted state to preserve manual UI intent
        shape.set({ opacity: 0.3 });
        if (!shape.strokeDashArray) shape.set({ strokeDashArray: [5, 5] });
      }
    }
    newObjects.push(shape);
  });

  canvas.add(...newObjects);
  
  // Expand Canvas Bounds if it spilled over pages
  const totalRequiredHeight = currentPageOffset + PAGE_HEIGHT;
  if (totalRequiredHeight > (canvas.height || 0)) {
    canvas.setDimensions({ width: canvas.width || CANVAS_DYNAMIC_WIDTH, height: totalRequiredHeight });
  }

  setupCascadingReflowTracker(canvas);
  canvas.requestRenderAll();
}

/**
 * Ensures "Logic-First" Physics vs standard Drag-and-Drop
 */
export function setupCascadingReflowTracker(canvas: Canvas) {
  canvas.off("text:changed");
  
  canvas.on("text:changed", (opt: any) => {
    const target = opt.target as FabricObject;
    if (!target) return;
    
    // We force recomputation of dimensions after text edit
    target.setCoords();
    
    const newHeight = target.height! * target.scaleY!;
    const oldHeight = target._logicReflowHeight || newHeight;
    const deltaY = newHeight - oldHeight;
    
    if (Math.abs(deltaY) > 1) {
      cascadeReflow(canvas, target, deltaY);
      target._logicReflowHeight = newHeight;
      
      // Auto-expand canvas if pushing content off the bottom edge
      const lowestPoint = getLowestObjectBound(canvas);
      if (lowestPoint > (canvas.height || 0) - 100) {
        canvas.setDimensions({ width: canvas.width!, height: lowestPoint + 500 });
      }
    }
  });
}

function cascadeReflow(canvas: Canvas, origin: FabricObject, deltaY: number) {
  const allObjects = canvas.getObjects();
  
  allObjects.forEach(obj => {
    if (obj === origin || obj.isPageSeam) return;
    
    // Only push objects strictly visually beneath the editing element
    // Threshold gives it a slight leniency buffer
    if (obj.top !== undefined && obj.top > origin.top! + 10) {
      obj.set("top", obj.top + deltaY);
      obj.setCoords();
    }
  });

  // Second pass: Update dynamic connectors (Lines)
  allObjects.forEach(obj => {
    if (obj.type === "line" && (obj.anchorFromId || obj.anchorToId)) {
      const line = obj as Line;
      const fromObj = allObjects.find(o => o.id === line.anchorFromId);
      const toObj = allObjects.find(o => o.id === line.anchorToId);
      
      if (fromObj) {
        line.set({ x1: fromObj.left || 0, y1: fromObj.top || 0 });
      }
      if (toObj) {
        line.set({ x2: toObj.left || 0, y2: toObj.top || 0 });
      }
      line.setCoords();
    }
  });

  canvas.requestRenderAll();
}

function getLowestObjectBound(canvas: Canvas): number {
  let max = 0;
  canvas.getObjects().forEach(o => {
    if (o.type !== "line") {
      const bottom = (o.top || 0) + (o.height! * o.scaleY!);
      if (bottom > max) max = bottom;
    }
  });
  return max;
}

/**
 * Returns an array of Y-coordinates representing slide starts.
 * Always includes Y=0 as the first slide.
 */
export function getSlideBoundaries(canvas: Canvas): number[] {
  const seams = canvas.getObjects()
    .filter(o => o.isPageSeam)
    .map(o => o.top || 0)
    .sort((a, b) => a - b);
    
  return [0, ...seams];
}
