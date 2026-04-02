import { jsonOk } from "../../../../lib/api";
import { publishToInstagram } from "../../../../lib/publish";

export async function POST() {
  return jsonOk(await publishToInstagram());
}