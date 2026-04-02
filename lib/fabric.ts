import { Canvas, Circle, Rect, Textbox, FabricImage, Polygon, Group, Line, FabricObject, Point } from "fabric";
import { jsPDF } from "jspdf";

// Augment Fabric types for Logic-First connectors
declare module "fabric" {
  interface FabricObject {
    id?: string;
    isPrimaryLogic?: boolean;
    isPageSeam?: boolean;
    anchoredToId?: string; 
    anchorFromId?: string; // Logic ID of the 'start' object
    anchorToId?: string;   // Logic ID of the 'end' object
    _logicReflowHeight?: number;
  }
}

// --- Grouping ---

export function groupSelectedObjects(canvas: Canvas) {
  const activeSelection = canvas.getActiveObject();
  if (!activeSelection || activeSelection.type !== "activeSelection") return;

  const objects = (activeSelection as any).getObjects();
  const group = new Group(objects, {
    left: activeSelection.left,
    top: activeSelection.top
  });

  objects.forEach((obj: any) => canvas.remove(obj));
  canvas.add(group);
  canvas.setActiveObject(group);
  canvas.requestRenderAll();
}

export function ungroupSelectedObjects(canvas: Canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject || activeObject.type !== "group") return;

  const group = activeObject as Group;
  const objects = group.getObjects();
  
  canvas.remove(group);
  
  objects.forEach((obj: any) => {
    canvas.add(obj);
  });
  
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

// --- Smart Snapping ---

const SNAP_THRESHOLD = 5;

export function handleObjectSnapping(canvas: Canvas, obj: FabricObject) {
  const objects = canvas.getObjects().filter(o => o !== obj && !(o as any).isGuide);
  const objCenter = obj.getCenterPoint();
  
  let snappedX = false;
  let snappedY = false;

  // Clear previous guide lines
  canvas.getObjects().filter(o => (o as any).isGuide).forEach(o => canvas.remove(o));

  objects.forEach(other => {
    const otherCenter = other.getCenterPoint();
    
    if (Math.abs(objCenter.x - otherCenter.x) < SNAP_THRESHOLD) {
      obj.set({ left: otherCenter.x - (obj.getScaledWidth()) / 2 });
      snappedX = true;
      showGuideLine(canvas, otherCenter.x, 0, otherCenter.x, canvas.height!, "v");
    }

    if (Math.abs(objCenter.y - otherCenter.y) < SNAP_THRESHOLD) {
      obj.set({ top: otherCenter.y - (obj.getScaledHeight()) / 2 });
      snappedY = true;
      showGuideLine(canvas, 0, otherCenter.y, canvas.width!, otherCenter.y, "h");
    }
  });

  return { snappedX, snappedY };
}

function showGuideLine(canvas: Canvas, x1: number, y1: number, x2: number, y2: number, orient: "h" | "v") {
  const line = new Line([x1, y1, x2, y2], {
    stroke: "#8b3dff",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.5
  });
  (line as any).isGuide = true;
  canvas.add(line);
}

export function clearGuides(canvas: Canvas) {
  canvas.getObjects().filter(o => (o as any).isGuide).forEach(o => canvas.remove(o));
  canvas.requestRenderAll();
}

export function toggleObjectLock(canvas: Canvas, locked: boolean) {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set({
      lockMovementX: locked,
      lockMovementY: locked,
      lockRotation: locked,
      lockScalingX: locked,
      lockScalingY: locked,
      hasControls: !locked,
      lockScalingFlip: locked,
      lockSkewingX: locked,
      lockSkewingY: locked
    });
    canvas.requestRenderAll();
  }
}

// --- Utilities ---

export function addShape(canvas: Canvas, type: "star" | "triangle" | "arrow" | "hexagon") {
  let object;
  const common = { left: 150, top: 150, fill: "#8b3dff" };

  switch (type) {
    case "triangle":
      object = new Polygon([
        { x: 0, y: 100 },
        { x: 50, y: 0 },
        { x: 100, y: 100 }
      ], { ...common, width: 100, height: 100 });
      break;
    case "star":
      const points = [];
      const outerRadius = 60;
      const innerRadius = 25;
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / 5) * i;
        points.push({ x: radius * Math.sin(angle) + outerRadius, y: radius * Math.cos(angle) + outerRadius });
      }
      object = new Polygon(points, common);
      break;
    case "arrow":
      object = new Polygon([
        { x: 0, y: 40 }, { x: 60, y: 40 }, { x: 60, y: 0 }, { x: 100, y: 60 },
        { x: 60, y: 120 }, { x: 60, y: 80 }, { x: 0, y: 80 }
      ], { ...common, scaleX: 0.8, scaleY: 0.8 });
      break;
    case "hexagon":
      const hexPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        hexPoints.push({ x: 60 * Math.cos(angle) + 60, y: 60 * Math.sin(angle) + 60 });
      }
      object = new Polygon(hexPoints, common);
      break;
  }

  if (object) {
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  }
}

export function toggleDrawingMode(canvas: Canvas, enabled: boolean, color: string = "#000000", width: number = 2) {
  canvas.isDrawingMode = enabled;
  if (enabled && canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = width;
  }
}

export interface EditorDocument {
  id: string;
  title: string;
  width: number;
  height: number;
  status: "draft" | "in_review" | "needs_changes" | "approved";
  canvasJson: unknown | null;
  updatedAt: string;
}

export function createEditorCanvas(element: HTMLCanvasElement, width: number, height: number) {
  const canvas = new Canvas(element, {
    width,
    height,
    backgroundColor: "transparent",
    preserveObjectStacking: true,
    selectionColor: "rgba(139, 61, 255, 0.15)",
    selectionBorderColor: "#8b3dff",
    selectionLineWidth: 1
  });

  // Global Object Defaults for 'Strategic OS'
  FabricObject.prototype.set({
    transparentCorners: false,
    cornerColor: "#ffffff",
    cornerStrokeColor: "#8b3dff",
    cornerSize: 8,
    cornerStyle: "circle",
    borderColor: "#8b3dff",
    borderScaleFactor: 1.5,
    borderDashArray: [4, 4],
    padding: 8
  });

  return canvas;
}

export function addTextbox(canvas: Canvas, text?: string, type: "heading" | "subheading" | "body" = "body") {
  const defaults = {
    heading: { text: "Add a heading", fontSize: 56, fontWeight: "800" },
    subheading: { text: "Add a subheading", fontSize: 32, fontWeight: "600" },
    body: { text: "Add a little bit of body text", fontSize: 18, fontWeight: "400" }
  };

  const textbox = new Textbox(text || defaults[type].text, {
    left: 100,
    top: 100,
    width: 400,
    fontSize: defaults[type].fontSize,
    fill: "#0e1217",
    fontFamily: "Inter, sans-serif",
    fontWeight: defaults[type].fontWeight,
    lineHeight: 1.2,
    id: `logic-${Math.random().toString(36).substring(2, 9)}`
  });

  canvas.add(textbox);
  canvas.setActiveObject(textbox);
  canvas.requestRenderAll();
}

export function addRectangle(canvas: Canvas) {
  const rect = new Rect({
    left: 120,
    top: 120,
    width: 260,
    height: 160,
    rx: 18,
    ry: 18,
    fill: "#6d5efc",
    id: `logic-${Math.random().toString(36).substring(2, 9)}`
  });

  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
}

export function addCircle(canvas: Canvas) {
  const circle = new Circle({
    left: 150,
    top: 150,
    radius: 90,
    fill: "#19c29b",
    id: `logic-${Math.random().toString(36).substring(2, 9)}`
  });

  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
}

export async function addImageFromUrl(canvas: Canvas, url: string) {
  const image = await FabricImage.fromURL(url, {
    crossOrigin: "anonymous"
  });

  image.set({
    left: 140,
    top: 140,
    scaleX: 0.4,
    scaleY: 0.4
  });

  canvas.add(image);
  canvas.setActiveObject(image);
  canvas.requestRenderAll();
}

/**
 * Creates a connector line that is logically bound to two object IDs.
 */
export function createLogicConnector(canvas: Canvas, fromId: string, toId: string) {
  const fromObj = canvas.getObjects().find(o => o.id === fromId);
  const toObj = canvas.getObjects().find(o => o.id === toId);
  if (!fromObj || !toObj) return;

  const line = new Line([
    fromObj.left || 0, fromObj.top || 0,
    toObj.left || 0, toObj.top || 0
  ], {
    stroke: "#8b3dff",
    strokeWidth: 2,
    selectable: true,
    evented: true,
    strokeDashArray: [5, 5],
    opacity: 0.8
  });

  line.anchorFromId = fromId;
  line.anchorToId = toId;
  (line as any).isLogicConnector = true;
  
  canvas.add(line);
  canvas.requestRenderAll();
  return line;
}

export function updateLogicConnectors(canvas: Canvas) {
  const objects = canvas.getObjects();
  const connectors = objects.filter(o => (o as any).isLogicConnector) as Line[];
  
  connectors.forEach(line => {
    const from = objects.find(o => o.id === line.anchorFromId);
    const to = objects.find(o => o.id === line.anchorToId);
    
    if (from && to) {
      const fromCenter = from.getCenterPoint();
      const toCenter = to.getCenterPoint();
      line.set({
        x1: fromCenter.x,
        y1: fromCenter.y,
        x2: toCenter.x,
        y2: toCenter.y
      });
      line.setCoords();
    } else {
      canvas.remove(line);
    }
  });
  canvas.requestRenderAll();
}

export function removeSelectedObject(canvas: Canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  canvas.remove(activeObject);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

export function duplicateSelectedObject(canvas: Canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  activeObject.clone().then((cloned) => {
    cloned.set({
      left: (activeObject.left || 0) + 24,
      top: (activeObject.top || 0) + 24
    });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.requestRenderAll();
  });
}

export function moveForward(canvas: Canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  canvas.bringObjectForward(activeObject);
  canvas.requestRenderAll();
}

export function moveBackward(canvas: Canvas) {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;
  canvas.sendObjectBackwards(activeObject);
  canvas.requestRenderAll();
}

export function applyCanvasBackground(canvas: Canvas, color: string) {
  canvas.backgroundColor = color;
  canvas.requestRenderAll();
}

export async function loadCanvasJson(canvas: Canvas, json: unknown) {
  if (!json) {
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.requestRenderAll();
    return;
  }

  await canvas.loadFromJSON(json as object);
  canvas.requestRenderAll();
}

export function serializeCanvas(canvas: Canvas) {
  return canvas.toObject([
    "lockMovementX",
    "lockMovementY",
    "lockRotation",
    "lockScalingX",
    "lockScalingY",
    "lockScalingFlip",
    "lockSkewingX",
    "lockSkewingY",
    "hasControls"
  ]);
}

export function setSelectionBold(canvas: Canvas, isBold: boolean) {
  const activeObject = canvas.getActiveObject();
  if (activeObject instanceof Textbox) {
    activeObject.set("fontWeight", isBold ? "bold" : "normal");
    canvas.requestRenderAll();
  }
}

export function setSelectionItalic(canvas: Canvas, isItalic: boolean) {
  const activeObject = canvas.getActiveObject();
  if (activeObject instanceof Textbox) {
    activeObject.set("fontStyle", isItalic ? "italic" : "normal");
    canvas.requestRenderAll();
  }
}

export function setSelectionColor(canvas: Canvas, color: string) {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.set("fill", color);
    canvas.requestRenderAll();
  }
}

export function rotateSelection(canvas: Canvas, angle: number) {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.rotate(angle);
    canvas.requestRenderAll();
  }
}

export function alignObject(canvas: Canvas, position: "left" | "center" | "right" | "top" | "middle" | "bottom") {
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const canvasWidth = canvas.width || 0;
  const canvasHeight = canvas.height || 0;
  const objWidth = activeObject.width! * activeObject.scaleX!;
  const objHeight = activeObject.height! * activeObject.scaleY!;

  switch (position) {
    case "left":
      activeObject.set({ left: 0 });
      break;
    case "center":
      activeObject.set({ left: (canvasWidth - objWidth) / 2 });
      break;
    case "right":
      activeObject.set({ left: canvasWidth - objWidth });
      break;
    case "top":
      activeObject.set({ top: 0 });
      break;
    case "middle":
      activeObject.set({ top: (canvasHeight - objHeight) / 2 });
      break;
    case "bottom":
      activeObject.set({ top: canvasHeight - objHeight });
      break;
  }
  activeObject.setCoords();
  canvas.requestRenderAll();
}

export function exportCanvasDataUrl(canvas: Canvas, format: "png" | "jpeg" = "png") {
  return canvas.toDataURL({
    format,
    multiplier: 1
  });
}

export async function renderAllPagesToPdf(pages: any[], width: number, height: number, title: string) {
  const pdf = new jsPDF({
    orientation: width >= height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height]
  });

  const offScreenElement = document.createElement("canvas");
  const canvas = new Canvas(offScreenElement, { width, height });

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      pdf.addPage([width, height], width >= height ? "landscape" : "portrait");
    }
    
    await canvas.loadFromJSON(pages[i].json || {});
    canvas.requestRenderAll();
    
    const dataUrl = canvas.toDataURL({ 
      format: "png",
      multiplier: 1
    });
    
    pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
  }

  pdf.save(`${title}.pdf`);
  canvas.dispose();
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}