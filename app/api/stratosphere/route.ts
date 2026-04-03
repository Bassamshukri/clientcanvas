import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const dynamic = "force-dynamic";

/**
 * STRATOSPHERE_AI_SINGULARITY (v2.0.0 Alpha)
 * The primary Generative Intelligence loop for the Strategic Operating System.
 */
export async function POST(req: Request) {
  const { prompt, canvasJson } = await req.json();

  const result = (streamText as any)({
    model: google("gemini-1.5-pro"),
    system: `
      You are the STRATOSPHERE_AI, a specialized Strategic Architect 'Brain' within a high-fidelity Strategic Operating System.
      
      Your CORE OBJECTIVE is to synthesize raw strategic drafting into structured, logical, and visually impactful frameworks (SWOT, Porters, PESTEL).
      
      PRINCIPLES:
      1. LOGIC_MOAT: Every insight must be logically connected. No floating nodes.
      2. NARRATIVE_FLOW: Strategy is a story. Organize nodes from Top-To-Bottom (narrative time) and Left-To-Right (categorical focus).
      3. TACTICAL_PRECISION: Avoid generic advice. Use industry-specific terminology and actionable architectural insights.
      
      CANVAS_REALITY:
      The current canvas state is: ${JSON.stringify(canvasJson?.substring(0, 500) || "EMPTY")}.
      
      Output format: Provide structured strategic reasoning in high-fidelity 'Neural Logs'.
    `,
    prompt: prompt || "Initialize strategic synthesis protocol.",
    maxSteps: 5,
    tools: {
      generateStrategicLayout: {
        description: "Generates a structured strategic layout (SWOT, Porters, PESTEL) on the canvas.",
        parameters: z.object({
          framework: z.enum(["swot", "porters", "pestel", "vertical"]),
          nodes: z.array(z.object({
            type: z.enum(["title", "subtitle", "bullet"]),
            content: z.string()
          }))
        }),
        execute: async (args: any) => {
          return { status: "ARCHITECT_PROPOSAL_GENERATED", ...args };
        }
      }
    }
  });

  return (result as any).toDataStreamResponse();
}
