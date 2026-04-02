"use client";

import { useActionState, useState, useTransition } from "react";
import {
  signInWithOtp,
  signInWithPassword,
  signUp,
  signInWithOAuth
} from "../app/login/actions";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layout, 
  Mail, 
  Lock, 
  Globe, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft
} from "lucide-react";

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
    startOAuth(async () => { await signInWithOAuth(provider); });
  };

  const isLoading = oauthPending || magicPending || passwordPending || signupPending;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", backgroundImage: "var(--bg-dots)", backgroundSize: "32px 32px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: 56, height: 56, background: "var(--primary)", borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 0 30px var(--primary-glow)" }}>
            <Layout size={28} color="white" />
          </div>
          <h1 style={{ marginBottom: 8 }}>ClientCanvas</h1>
          <p className="muted-text">Professional Strategic Operating System</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card panelCard" style={{ border: "1px solid var(--border-active)" }}>
          <AnimatePresence mode="wait">
            {mode === "social" && (
              <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 style={{ marginBottom: 8 }}>Initialize Core</h3>
                <p className="muted-text" style={{ marginBottom: 32 }}>Choose your authentication perimeter.</p>

                <div className="stack" style={{ gap: "12px" }}>
                  <button onClick={() => handleOAuth("google")} disabled={isLoading} className="btn-pro btn-secondary" style={{ background: "white", color: "black", width: "100%" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 10 }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button onClick={() => handleOAuth("github")} disabled={isLoading} className="btn-pro btn-secondary" style={{ width: "100%" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 10 }}>
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </div>

                <div className="stack" style={{ gap: "12px" }}>
                   <button onClick={() => setMode("password")} className="btn-pro btn-primary" style={{ width: "100%" }}>
                      <Lock size={16} style={{ marginRight: 10 }} /> Enter with Credentials
                   </button>
                   <button onClick={() => setMode("magic")} className="btn-pro btn-secondary" style={{ width: "100%", border: "1px dashed var(--border)" }}>
                      <Zap size={16} style={{ marginRight: 10 }} /> Request Magic Link
                   </button>
                </div>
                
                <p style={{ textAlign: "center", marginTop: 24, fontSize: 13 }} className="muted-text">
                  New strategist? <button onClick={() => setMode("signup")} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "700", cursor: "pointer" }}>Incept account →</button>
                </p>
              </motion.div>
            )}

            {mode === "password" && (
              <motion.div key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setMode("social")} className="muted-text" style={{ cursor: "pointer", border: "none", background: "none", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                   <ChevronLeft size={16} /> Back to Choice
                </button>
                <h3 style={{ marginBottom: 32 }}>Enter Perimeter</h3>
                <form action={passwordAction} className="stack" style={{ gap: 16 }}>
                  <input name="email" type="email" placeholder="strategic@command.com" required style={inputStyle} />
                  <input name="password" type="password" placeholder="••••••••" required style={inputStyle} />
                  <button type="submit" disabled={passwordPending} className="btn-pro btn-primary" style={{ width: "100%" }}>
                    {passwordPending ? "Syncing..." : "Initialize Session"} <ArrowRight size={16} style={{ marginLeft: 10 }} />
                  </button>
                </form>
                {passwordState?.error && <p style={errorStyle}>{passwordState.error}</p>}
              </motion.div>
            )}

            {mode === "signup" && (
              <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setMode("social")} className="muted-text" style={{ cursor: "pointer", border: "none", background: "none", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                   <ChevronLeft size={16} /> Back to Choice
                </button>
                <h3 style={{ marginBottom: 32 }}>Incept Strategist</h3>
                <form action={signupAction} className="stack" style={{ gap: 16 }}>
                  <input name="email" type="email" placeholder="new@strategist.com" required style={inputStyle} />
                  <input name="password" type="password" placeholder="Choose master key" required minLength={8} style={inputStyle} />
                  <button type="submit" disabled={signupPending} className="btn-pro btn-primary" style={{ width: "100%", background: "linear-gradient(135deg, var(--accent), #0097a7)" }}>
                    {signupPending ? "Incepting..." : "Begin Strategic Journey"}
                  </button>
                </form>
                {signupState?.error && <p style={errorStyle}>{signupState.error}</p>}
                {signupState?.message && <p style={successStyle}>{signupState.message}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <style jsx>{`
         input:focus {
           border-color: var(--primary) !important;
           box-shadow: 0 0 0 3px var(--primary-glow) !important;
         }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "white",
  outline: "none"
};

const errorStyle = { marginTop: 16, padding: 12, background: "rgba(239,68,68,0.1)", borderRadius: 8, color: "#fca5a5", fontSize: 13, border: "1px solid rgba(239,68,68,0.2)" };
const successStyle = { marginTop: 16, padding: 12, background: "rgba(0,200,150,0.1)", borderRadius: 8, color: "#86efac", fontSize: 13, border: "1px solid rgba(0,200,150,0.2)" };