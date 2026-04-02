import { StructureBlock } from "../components/structured-input-panel";

export interface StrategicFramework {
  name: string;
  description: string;
  layout?: "vertical" | "swot" | "porters" | "pestel";
  blocks: Omit<StructureBlock, "id">[];
}

export const STRATEGIC_FRAMEWORKS: Record<string, StrategicFramework> = {
  swot: {
    name: "SWOT Analysis",
    description: "Evaluates Strengths, Weaknesses, Opportunities, and Threats in a 2x2 grid.",
    layout: "swot",
    blocks: [
      { type: "title", content: "STRATEGIC_SWOT" },
      { type: "subtitle", content: "STRENGTHS" }, // Quad 1
      { type: "bullet", content: "Logic-First Architecture" },
      { type: "subtitle", content: "WEAKNESSES" }, // Quad 2
      { type: "bullet", content: "Legacy Learning Curve" },
      { type: "subtitle", content: "OPPORTUNITIES" }, // Quad 3
      { type: "bullet", content: "Consulting Market Expansion" },
      { type: "subtitle", content: "THREATS" }, // Quad 4
      { type: "bullet", content: "Commodity Design Tools" }
    ]
  },
  porters_five: {
    name: "Porter's Five Forces",
    description: "Industrial analysis via a center-focused cross layout.",
    layout: "porters",
    blocks: [
      { type: "title", content: "PORTER'S_FIVE_PROTOCOL" },
      { type: "subtitle", content: "RIVALRY" }, // Center
      { type: "subtitle", content: "ENTRANTS" }, // Top
      { type: "subtitle", content: "BUYERS" }, // Right
      { type: "subtitle", content: "SUPPLIERS" }, // Left
      { type: "subtitle", content: "SUBSTITUTES" } // Bottom
    ]
  },
  pestel: {
    name: "PESTEL Analysis",
    description: "Macro-environmental surveillance in a 6-node segmented layout.",
    layout: "pestel",
    blocks: [
      { type: "title", content: "PESTEL_SURVEILLANCE" },
      { type: "subtitle", content: "POLITICAL" },
      { type: "subtitle", content: "ECONOMIC" },
      { type: "subtitle", content: "SOCIAL" },
      { type: "subtitle", content: "TECHNOLOGICAL" },
      { type: "subtitle", content: "ENVIRONMENTAL" },
      { type: "subtitle", content: "LEGAL" }
    ]
  },
  okr: {
    name: "Objectives & Key Results (OKR)",
    description: "Aligns organizational goals with measurable outcomes (Vertical Feed).",
    layout: "vertical",
    blocks: [
      { type: "title", content: "Q4 Strategic Objectives" },
      { type: "subtitle", content: "Objective: Dominate Professional Design Workflows" },
      { type: "bullet", content: "KR1: Zero manual overlap errors via Cascading Reflow." },
      { type: "bullet", content: "KR2: 80% reduction in formatting time." },
      { type: "bullet", content: "KR3: Integration with 10 top-tier firms." }
    ]
  },
  product_hunt: {
    name: "Product Hunt Pitch",
    description: "A high-impact narrative for product launches (Vertical Story).",
    layout: "vertical",
    blocks: [
      { type: "title", content: "Introducing Client Canvas 2.0" },
      { type: "subtitle", content: "The Anti-PowerPoint for Strategists" },
      { type: "paragraph", content: "Stop fighting with boundary boxes. Focus on your logic while we handle the pixels." },
      { type: "bullet", content: "✨ Auto-Layout Strategy Engine" },
      { type: "bullet", content: "🛠 Developer-Handoff Ready" },
      { type: "bullet", content: "🔒 Enterprise Brand Safety" }
    ]
  }
};
