import { jsonOk } from "../../../../lib/api";
import { processDuePublishJobs } from "../../../../lib/publishing-service";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await processDuePublishJobs();

  return jsonOk({
    ok: true,
    processed: result.processed,
    found: result.found,
    message: "Scheduled publishing run completed."
  });
}