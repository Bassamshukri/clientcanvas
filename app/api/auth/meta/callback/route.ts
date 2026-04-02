import { jsonOk } from "../../../../../lib/api";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return jsonOk({
    ok: true,
    provider: "meta",
    code: url.searchParams.get("code"),
    message: "Meta callback scaffold received."
  });
}