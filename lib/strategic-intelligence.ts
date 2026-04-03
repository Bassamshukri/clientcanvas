import { Canvas, FabricObject } from "fabric";

export interface StrategicInsight {
   id: string;
   type: "warning" | "success" | "info";
   message: string;
   frameworkId?: string;
}

export function calculateStrategicDNA(canvas: Canvas | null): { score: number; insights: StrategicInsight[] } {
   if (!canvas) return { score: 0, insights: [] };

   const objects = canvas.getObjects();
   const logicNodes = objects.filter(o => (o as any).isPrimaryLogic);
   const connectors = objects.filter(o => o.type === "line" && ((o as any).anchorFromId || (o as any).anchorToId));

   let score = 0;
   const insights: StrategicInsight[] = [];

   // Factor 1: Node Density
   if (logicNodes.length > 0) score += Math.min(40, logicNodes.length * 5);
   else insights.push({ id: "no-nodes", type: "warning", message: "Initialize a Strategic Protocol to begin." });

   // Factor 2: Connectivity (Logic Moat)
   const connectivityRatio = logicNodes.length > 0 ? connectors.length / logicNodes.length : 0;
   score += Math.min(30, connectivityRatio * 20);
   if (connectivityRatio < 0.5 && logicNodes.length > 2) {
      insights.push({ id: "low-connect", type: "info", message: "Connectivity is low. Bridge nodes to form a 'Logic Moat'." });
   }

   // Factor 3: Framework Specific Checks (Mocked logic for common frameworks)
   const swotNodes = logicNodes.filter(n => n.id?.includes('swot'));
   const porterNodes = logicNodes.filter(n => n.id?.includes('porter'));

   if (swotNodes.length > 0) {
      if (swotNodes.length < 4) {
         insights.push({ id: "swot-incomplete", type: "warning", message: "SWOT analysis requires at least 4 quadrants for balanced evaluation." });
      } else {
         score += 30;
         insights.push({ id: "swot-verified", type: "success", message: "SWOT Protocol: Quadrants Balanced." });
      }
   }

   if (porterNodes.length >= 5) {
      score += 30;
      insights.push({ id: "porter-verified", type: "success", message: "Porter's 5 Forces: Full Industrial Coverage." });
   }

   return { 
      score: Math.min(100, Math.round(score)), 
      insights: insights.slice(0, 3) // Return top 3 insights
   };
}
