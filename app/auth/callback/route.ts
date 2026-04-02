export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  
  // Dynamic host detection from headers
  const headerList = await headers();
  // Force HTTPS in production to prevent cookie loss
  const host = headerList.get("host");
  const isLocal = host?.includes("localhost");
  const protocol = isLocal ? "http" : "https";
  const origin = `${protocol}://${host}`;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set({ name, value, ...options })
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Clean up the redirect URL to avoid double slashes
      const baseUrl = origin.replace(/\/$/, "");
      const targetNext = next.startsWith("/") ? next : `/${next}`;
      return NextResponse.redirect(`${baseUrl}${targetNext}`);
    }
  }

  // Redirect to login with error if something went wrong
  return NextResponse.redirect(`${origin}/login?auth_error=callback_failed`);
}
