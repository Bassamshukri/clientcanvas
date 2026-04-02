export function getMetaOauthUrl() {
  const appId = process.env.META_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/meta/callback`;

  if (!appId) {
    throw new Error("Missing META_APP_ID.");
  }

  const url = new URL("https://www.facebook.com/v22.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish");
  return url.toString();
}