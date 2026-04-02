import { jsonError, jsonOk } from "../../../lib/api";
import { generateReviewToken } from "../../../lib/review-links";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = generateReviewToken();

    return jsonOk({
      ok: true,
      reviewLink: {
        id: `review_${Date.now()}`,
        designId: body?.designId || null,
        token,
        status: "active",
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Failed to create review link.");
  }
}