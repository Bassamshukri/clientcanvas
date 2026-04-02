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
  porters_five: {
    name: "Porter's Five Forces",
    description: "Industrial analysis for competitive positioning.",
    blocks: [
      { type: "title", content: "Competitive Landscape Analysis" },
      { type: "subtitle", content: "1. Threat of New Entrants" },
      { type: "bullet", content: "High barriers due to technical complexity." },
      { type: "subtitle", content: "2. Bargaining Power of Buyers" },
      { type: "bullet", content: "Enterprise clients demand deep integration." },
      { type: "subtitle", content: "3. Bargaining Power of Suppliers" },
      { type: "bullet", content: "Low dependency on single tech vendors." },
      { type: "subtitle", content: "4. Threat of Substitutes" },
      { type: "bullet", content: "Basic tools are not logically structural." },
      { type: "subtitle", content: "5. Rivalry among Competitors" },
      { type: "bullet", content: "Focus on 'Logical Moat' to win market share." }
    ]
  },
  pestel: {
    name: "PESTEL Analysis",
    description: "Macro-environmental surveillance protocol.",
    blocks: [
      { type: "title", content: "Global Market Surveillance" },
      { type: "subtitle", content: "Political" },
      { type: "bullet", content: "Data sovereignty and regional AI regulations." },
      { type: "subtitle", content: "Economic" },
      { type: "bullet", content: "Shifting enterprise budgets toward AI efficiency." },
      { type: "subtitle", content: "Social" },
      { type: "bullet", content: "Remote collaboration as the primary work standard." },
      { type: "subtitle", content: "Technological" },
      { type: "bullet", content: "Hyper-automation of design-to-code bridges." },
      { type: "subtitle", content: "Environmental" },
      { type: "bullet", content: "Sustainable server-less infrastructure." },
      { type: "subtitle", content: "Legal" },
      { type: "bullet", content: "IP rights for AI-orchestrated design assets." }
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
