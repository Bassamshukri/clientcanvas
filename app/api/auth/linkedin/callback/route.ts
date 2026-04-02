import { jsonOk } from "../../../../../lib/api";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return jsonOk({
    ok: true,
    provider: "linkedin",
    code: url.searchParams.get("code"),
    message: "LinkedIn callback scaffold received."
  });
}