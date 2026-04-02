import { jsonOk } from "../../../../lib/api";

interface RouteContext {
  params: Promise<{
    archiveId: string;
  }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { archiveId } = await context.params;

  return jsonOk({
    ok: true,
    archive: {
      id: archiveId,
      status: "ready"
    }
  });
}