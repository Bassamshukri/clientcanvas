
export default async function TestPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Environment Status</h1>
      <pre>
        NEXT_PUBLIC_SUPABASE_URL: {url ? "✅ SET" : "❌ MISSING"}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: {key ? "✅ SET" : "❌ MISSING"}
        NEXT_PUBLIC_APP_URL: {appUrl || "❌ MISSING"}
      </pre>
    </div>
  );
}
