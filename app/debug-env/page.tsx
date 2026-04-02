
import { createClient } from "./lib/supabase/server";

export default async function TestPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  return (
    <pre>
      URL: {url ? "SET" : "MISSING"}
      KEY: {key ? "SET" : "MISSING"}
      APP_URL: {appUrl || "MISSING"}
    </pre>
  );
}
