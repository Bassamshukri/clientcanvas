"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

type LoginState = {
  ok: boolean;
  error: string;
  message: string;
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function signInWithOtp(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    return { ok: false, error: "Email is required.", message: "" };
  }

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

  return { ok: true, error: "", message: "✉️ Check your email for the magic link." };
}

export async function signInWithPassword(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required.", message: "" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: error.message, message: "" };
  }

  redirect("/");
}

export async function signUpWithPassword(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required.", message: "" };
  }

  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters.", message: "" };
  }

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

  return { ok: true, error: "", message: "🎉 Account created! Check your email to confirm." };
}

export async function signInWithOAuth(provider: "google" | "github") {
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