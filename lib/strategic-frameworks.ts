import { StructureBlock } from "../components/structured-input-panel";

export interface StrategicFramework {
  name: string;
  description: string;
  blocks: Omit<StructureBlock, "id">[];
}

export const STRATEGIC_FRAMEWORKS: Record<string, StrategicFramework> = {
  swot: {
    name: "SWOT Analysis",
    description: "Evaluates Strengths, Weaknesses, Opportunities, and Threats for a strategic case.",
    blocks: [
      { type: "title", content: "Strategic SWOT Analysis" },
      { type: "subtitle", content: "Internal Factors" },
      { type: "bullet", content: "Strength: Proprietary logic-first engine architecture." },
      { type: "bullet", content: "Weakness: Initial learning curve for legacy designers." },
      { type: "subtitle", content: "External Factors" },
      { type: "bullet", content: "Opportunity: High-stakes consulting market expansion." },
      { type: "bullet", content: "Threat: Rapid AI integration in entry-level tools." }
    ]
  },
  okr: {
    name: "Objectives & Key Results (OKR)",
    description: "Aligns organizational goals with measurable outcomes.",
    blocks: [
      { type: "title", content: "Q4 Strategic Objectives" },
      { type: "subtitle", content: "Objective: Dominate Professional Design Workflows" },
      { type: "bullet", content: "KR1: Zero manual overlap errors via Cascading Reflow." },
      { type: "bullet", content: "KR2: 80% reduction in slide-deck formatting time." },
      { type: "bullet", content: "KR3: Integration with 10 top-tier strategy firms." }
    ]
  },
  problem_solution: {
    name: "Problem-Solution Framework",
    description: "Identifies a core market gap and proposes a logical remedy.",
    blocks: [
      { type: "title", content: "Market Gap Identification" },
      { type: "paragraph", content: "The current design market is split between 'complex' tools like Figma and 'simple' tools like Canva, leaving professionals with no 'logical' middle ground." },
      { type: "subtitle", content: "The Solution" },
      { type: "bullet", content: "A dynamic logic canvas that prioritizes structure over pixels." },
      { type: "bullet", content: "Automated brand guardrails and real-time code export." }
    ]
  },
  product_hunt: {
    name: "Product Hunt Pitch",
    description: "A high-impact narrative for product launches.",
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
