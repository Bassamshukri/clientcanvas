import { jsonOk } from "../../../lib/api";

export async function POST() {
  return jsonOk({
    ok: true,
    archive: {
      id: `archive_${Date.now()}`,
      status: "queued"
    }
  });
}