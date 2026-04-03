import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const dynamic = "force-dynamic";

/**
 * STRATOSPHERE_INTELLIGENCE_GATEWAY (v3.0.0 Alpha)
 * Unified gateway for ubiquitous AI integrations (Commands, Expansions, Ghost Suggestions).
 */
export async function POST(req: Request) {
  const { prompt, context, intent } = await req.json();

  const result = await (streamText as any)({
    model: google("gemini-1.5-pro"),
    system: `
      You are the UBIQUITOUS_STRATOSPHERE_AI. You are embedded into every layer of the Strategic Operating System.
      
      INTENT: ${intent || 'GENERAL_HELP'}
      CONTEXT: ${JSON.stringify(context || {})}
      
      RESPONSIBILITIES:
      - COMMAND: Execute user natural language requests by calling the appropriate strategic tools.
      - EXPAND: Take raw input and turn it into professional, high-fidelity strategic content.
      - SUGGEST: Anticipate the user's logical next steps and propose "Ghost Nodes" on the canvas.
      
      RULES:
      1. Always bridge logic moats.
      2. Maintain the 'Sentient OS' tone (tactical, professional, and slightly futuristic/architectural).
      3. For COMMANDS, always call 'executeStrategicAction' to modify the canvas.
    `,
    prompt: prompt || "Listening for strategic intent...",
    maxSteps: 5,
    tools: {
      executeStrategicAction: {
        description: "Executes a strategic action directly on the canvas.",
        parameters: z.object({
          action: z.enum(["generate_swot", "generate_porters", "generate_pestel", "add_logic_node", "reflow_layout", "generate_motion_design"]),
          data: z.any().optional(),
          reasoning: z.string().describe("Explain why this action is the logical next step.")
        }),
        execute: async (args: any) => {
          return { status: "ACTION_DEPLOYED", ...args };
        }
      },
      generateMotionDesign: {
        description: "Creates a generative motion design configuration based on a style prompt.",
        parameters: z.object({
          style: z.string().describe("The design style (e.g. ribbonSplit, botanicalDrift, islamicStar)"),
          palette: z.string().describe("The color palette (e.g. solar, sky, ukraine, neon)"),
          choice: z.number().describe("Variations from 1-1000"),
          seed: z.string().describe("The global seed string"),
          reasoning: z.string().describe("Explain the artistic and strategic rationale for this design.")
        }),
        execute: async (args: any) => {
            return { status: "MOTION_DESIGN_CONFIG_GENERATED", ...args };
        }
      }
    }
  });

  return (result as any).toDataStreamResponse();
}
