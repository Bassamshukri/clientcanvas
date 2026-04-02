export const PRESET_TEMPLATES = [
  {
    id: "porters-five-forces",
    title: "Porter's Five Forces",
    category: "Market Analysis",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    json: {
      version: "6.0.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 1080, fill: "#080809", selectable: false },
        { type: "textbox", left: 240, top: 100, width: 600, text: "PORTER'S FIVE FORCES", fontSize: 42, fontWeight: "900", fill: "#ffffff", textAlign: "center", fontFamily: "Inter" },
        // Threatened Entrants (Top)
        { type: "rect", id: "logic-entrants", left: 340, top: 200, width: 400, height: 120, fill: "rgba(139,61,255,0.1)", stroke: "#8b3dff", rx: 12 },
        { type: "textbox", left: 340, top: 240, width: 400, text: "THREAT OF NEW ENTRANTS", fontSize: 16, fontWeight: "800", fill: "#8b3dff", textAlign: "center", fontFamily: "Inter" },
        // Rivalry (Center)
        { type: "rect", id: "logic-rivalry", left: 340, top: 480, width: 400, height: 120, fill: "rgba(0,200,150,0.1)", stroke: "#00c896", rx: 12 },
        { type: "textbox", left: 340, top: 520, width: 400, text: "COMPETITIVE RIVALRY", fontSize: 18, fontWeight: "900", fill: "#00c896", textAlign: "center", fontFamily: "Inter" },
        // Buyers (Right)
        { type: "rect", id: "logic-buyers", left: 800, top: 480, width: 220, height: 120, fill: "rgba(255,255,255,0.03)", stroke: "rgba(255,255,255,0.1)", rx: 12 },
        { type: "textbox", left: 800, top: 520, width: 220, text: "BUYER POWER", fontSize: 14, fontWeight: "700", fill: "white", textAlign: "center", fontFamily: "Inter" },
        // Suppliers (Left)
        { type: "rect", id: "logic-suppliers", left: 60, top: 480, width: 220, height: 120, fill: "rgba(255,255,255,0.03)", stroke: "rgba(255,255,255,0.1)", rx: 12 },
        { type: "textbox", left: 60, top: 520, width: 220, text: "SUPPLIER POWER", fontSize: 14, fontWeight: "700", fill: "white", textAlign: "center", fontFamily: "Inter" },
        // Substitutes (Bottom)
        { type: "rect", id: "logic-substitutes", left: 340, top: 760, width: 400, height: 120, fill: "rgba(255,77,77,0.1)", stroke: "#ff4d4d", rx: 12 },
        { type: "textbox", left: 340, top: 800, width: 400, text: "THREAT OF SUBSTITUTES", fontSize: 16, fontWeight: "800", fill: "#ff4d4d", textAlign: "center", fontFamily: "Inter" }
      ]
    }
  },
  {
    id: "pestel-analysis",
    title: "PESTEL Surveillance",
    category: "Macro Audit",
    thumbnail: "https://images.unsplash.com/photo-1454165833767-024040624c9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    json: {
      version: "6.0.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 1080, fill: "#080809", selectable: false },
        { type: "textbox", left: 240, top: 80, width: 600, text: "PESTEL SURVEILLANCE", fontSize: 38, fontWeight: "900", fill: "#ffffff", textAlign: "center", fontFamily: "Inter" },
        { type: "rect", id: "p", left: 100, top: 200, width: 400, height: 200, fill: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.1)", rx: 16 },
        { type: "textbox", left: 120, top: 220, width: 360, text: "POLITICAL", fontSize: 24, fontWeight: "800", fill: "var(--primary)", fontFamily: "Inter" },
        { type: "rect", id: "e", left: 580, top: 200, width: 400, height: 200, fill: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.1)", rx: 16 },
        { type: "textbox", left: 600, top: 220, width: 360, text: "ECONOMIC", fontSize: 24, fontWeight: "800", fill: "var(--success)", fontFamily: "Inter" }
        // ... more nodes can be added or generated via AI reflow
      ]
    }
  },
  {
    id: "gtm-roadmap",
    title: "Go-To-Market Flow",
    category: "Growth Orchestration",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    json: {
      version: "6.0.0",
      objects: [
        { type: "rect", left: 0, top: 0, width: 1080, height: 540, fill: "#080809", selectable: false },
        { type: "textbox", left: 100, top: 100, width: 800, text: "GTM_ROADMAP_V1", fontSize: 52, fontWeight: "900", fill: "white", fontFamily: "Inter" }
      ]
    }
  }
];
