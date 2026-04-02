import { jsonOk } from "../../../../lib/api";
import { publishToLinkedIn } from "../../../../lib/publish";

export async function POST() {
  return jsonOk(await publishToLinkedIn());
}