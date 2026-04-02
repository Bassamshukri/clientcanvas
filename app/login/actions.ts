"use server";

import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type LoginState = {
  ok: boolean;
  error: string;
  message: string;
};

async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`.replace(/\/$/, "");
}

export async function signInWithOtp(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  if (!email) {
    return { ok: false, error: "Email is required.", message: "" };
  }

  const APP_URL = await getBaseUrl();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${APP_URL}/auth/callback?next=/`
    }
  });

  if (error) {
    return { ok: false, error: error.message, message: "" };
  }

  return {
    ok: true,
    error: "",
    message: "Check your email for a login link."
  };
}

export async function signInWithPassword(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { ok: false, error: "Email and password are required.", message: "" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { ok: false, error: error.message, message: "" };
  }

  redirect("/");
}

export async function signUp(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters.", message: "" };
  }

  const APP_URL = await getBaseUrl();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${APP_URL}/auth/callback?next=/`
    }
  });

  if (error) {
    return { ok: false, error: error.message, message: "" };
  }

  return {
    ok: true,
    error: "",
    message: "Check your email to confirm your account."
  };
}

export async function signInWithOAuth(provider: "google" | "github") {
  const APP_URL = await getBaseUrl();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${APP_URL}/auth/callback?next=/`,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error || !data.url) {
    return { error: error?.message ?? "OAuth failed." };
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}