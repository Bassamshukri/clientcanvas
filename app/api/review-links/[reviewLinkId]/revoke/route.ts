import { jsonOk } from "../../../../../lib/api";

interface RouteContext {
  params: Promise<{
    reviewLinkId: string;
  }>;
}

export async function POST(_: Request, context: RouteContext) {
  const { reviewLinkId } = await context.params;

  return jsonOk({
    ok: true,
    reviewLink: {
      id: reviewLinkId,
      status: "revoked"
    }
  });
}