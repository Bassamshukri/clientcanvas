"use client";

import { useActionState, useState, useTransition } from "react";
import {
  signInWithOtp,
  signInWithPassword,
  signUp,
  signInWithOAuth
} from "../app/login/actions";

const initialState = { ok: false, error: "", message: "" };

type AuthMode = "social" | "magic" | "password" | "signup";

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("social");
  const [oauthPending, startOAuth] = useTransition();
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | null>(null);

  const [magicState, magicAction, magicPending] = useActionState(signInWithOtp, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(signInWithPassword, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signUp, initialState);

  const handleOAuth = (provider: "google" | "github") => {
    setOauthProvider(provider);
    startOAuth(async () => {
      await signInWithOAuth(provider);
    });
  };

  const isLoading = oauthPending || magicPending || passwordPending || signupPending;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0e1217 0%, #1a0a2e 50%, #0e1217 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Ambient glow effects */}
      <div style={{
        position: "absolute", top: "20%", left: "10%",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(139,61,255,0.15) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "10%",
        width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(0,200,150,0.1) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        zIndex: 1
      }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px", height: "52px",
            background: "linear-gradient(135deg, #8b3dff, #00c896)",
            borderRadius: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 8px 32px rgba(139,61,255,0.4)"
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: "800", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            ClientCanvas
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            Your professional design workspace
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)"
        }}>
          {mode === "social" && (
            <>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 6px 0" }}>
                Sign in to your account
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "0 0 28px 0" }}>
                Choose your preferred sign-in method
              </p>

              {/* Google */}
              <button
                onClick={() => handleOAuth("google")}
                disabled={isLoading}
                id="btn-google-signin"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "13px 20px",
                  background: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1f1f1f",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  marginBottom: "12px",
                  opacity: isLoading && oauthProvider !== "google" ? 0.5 : 1,
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {oauthPending && oauthProvider === "google" ? (
                  <div style={{ width: "20px", height: "20px", border: "2px solid #ccc", borderTopColor: "#8b3dff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </button>

              {/* GitHub */}
              <button
                onClick={() => handleOAuth("github")}
                disabled={isLoading}
                id="btn-github-signin"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "13px 20px",
                  background: "#24292e",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#fff",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  marginBottom: "24px",
                  opacity: isLoading && oauthProvider !== "github" ? 0.5 : 1,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {oauthPending && oauthProvider === "github" ? (
                  <div style={{ width: "20px", height: "20px", border: "2px solid #555", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                Continue with GitHub
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontWeight: "500" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              </div>

              {/* Email Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={() => setMode("password")}
                  id="btn-email-password"
                  style={{
                    width: "100%",
                    padding: "13px 20px",
                    background: "rgba(139,61,255,0.15)",
                    border: "1px solid rgba(139,61,255,0.4)",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#c084fc",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,61,255,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,61,255,0.15)"; }}
                >
                  📧 Sign in with Email & Password
                </button>
                <button
                  onClick={() => setMode("magic")}
                  id="btn-magic-link"
                  style={{
                    width: "100%",
                    padding: "13px 20px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "rgba(255,255,255,0.55)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                >
                  ✨ Send me a magic link
                </button>
              </div>

              <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
                New here?{" "}
                <button onClick={() => setMode("signup")} style={{ background: "none", border: "none", color: "#8b3dff", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
                  Create an account →
                </button>
              </p>
            </>
          )}

          {mode === "magic" && (
            <>
              <button onClick={() => setMode("social")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "14px", marginBottom: "16px", padding: 0 }}>
                ← Back
              </button>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 6px 0" }}>Magic Link Sign In</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "0 0 24px 0" }}>We'll email you a secure, one-click link.</p>
              <form action={magicAction} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
                <button type="submit" disabled={magicPending} style={primaryBtnStyle}>
                  {magicPending ? "Sending..." : "Send Magic Link"}
                </button>
              </form>
              {magicState?.error && <p style={errorStyle}>{magicState.error}</p>}
              {magicState?.message && <p style={successStyle}>{magicState.message}</p>}
            </>
          )}

          {mode === "password" && (
            <>
              <button onClick={() => setMode("social")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "14px", marginBottom: "16px", padding: 0 }}>
                ← Back
              </button>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 6px 0" }}>Sign In</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "0 0 24px 0" }}>Enter your email and password.</p>
              <form action={passwordAction} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input name="email" type="email" placeholder="you@example.com" required style={inputStyle} />
                <input name="password" type="password" placeholder="Password" required style={inputStyle} />
                <button type="submit" disabled={passwordPending} style={primaryBtnStyle}>
                  {passwordPending ? "Signing in..." : "Sign In"}
                </button>
              </form>
              {passwordState?.error && <p style={errorStyle}>{passwordState.error}</p>}
              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
                No account?{" "}
                <button onClick={() => setMode("signup")} style={{ background: "none", border: "none", color: "#8b3dff", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
                  Sign up →
                </button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <>
              <button onClick={() => setMode("social")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "14px", marginBottom: "16px", padding: 0 }}>
                ← Back
              </button>
              <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 6px 0" }}>Create Account</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "0 0 24px 0" }}>Start designing for free today.</p>
              <form action={signupAction} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input name="email" type="email" placeholder="you@example.com" required style={inputStyle} />
                <input name="password" type="password" placeholder="Password (min. 8 chars)" required minLength={8} style={inputStyle} />
                <button type="submit" disabled={signupPending} id="btn-create-account" style={{
                  ...primaryBtnStyle,
                  background: "linear-gradient(135deg, #00c896, #0097a7)"
                }}>
                  {signupPending ? "Creating..." : "Create Free Account"}
                </button>
              </form>
              {signupState?.error && <p style={errorStyle}>{signupState.error}</p>}
              {signupState?.message && <p style={successStyle}>{signupState.message}</p>}

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>OR sign up with</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleOAuth("google")} disabled={isLoading} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  padding: "11px", background: "#fff", border: "none", borderRadius: "10px",
                  fontWeight: "600", fontSize: "13px", color: "#1f1f1f", cursor: "pointer"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button onClick={() => handleOAuth("github")} disabled={isLoading} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  padding: "11px", background: "#24292e", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "10px", fontWeight: "600", fontSize: "13px", color: "#fff", cursor: "pointer"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  fontSize: "14px",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s"
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  background: "linear-gradient(135deg, #8b3dff, #6d28d9)",
  border: "none",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: "700",
  color: "#fff",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(139,61,255,0.4)",
  transition: "all 0.2s ease"
};

const errorStyle: React.CSSProperties = {
  marginTop: "12px",
  padding: "10px 14px",
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.3)",
  borderRadius: "8px",
  color: "#fca5a5",
  fontSize: "13px"
};

const successStyle: React.CSSProperties = {
  marginTop: "12px",
  padding: "10px 14px",
  background: "rgba(0,200,150,0.1)",
  border: "1px solid rgba(0,200,150,0.3)",
  borderRadius: "8px",
  color: "#6ee7b7",
  fontSize: "13px"
};