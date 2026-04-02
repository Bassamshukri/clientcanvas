import { jsonOk } from "../../../../lib/api";

export async function POST() {
  return jsonOk({
    ok: false,
    channel: "linkedin-image",
    message: "LinkedIn image upload scaffold is present but not fully configured."
  });
}