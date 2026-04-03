import { redirect } from "next/navigation";
import { requireUser } from "../../lib/auth";

export default async function EditorRootPage() {
  await requireUser();
  
  // By default, the editor requires a designId. 
  // If the user lands here, we redirect them to the dashboard to select one.
  redirect("/dashboard");
}
