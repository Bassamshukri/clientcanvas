import { jsonOk } from "../../../../lib/api";
import { publishToFacebook } from "../../../../lib/publish";

export async function POST() {
  return jsonOk(await publishToFacebook());
}