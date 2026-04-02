export async function register() {
  console.info("[instrumentation] server instance started", {
    runtime: process.env.NEXT_RUNTIME || "nodejs",
    nodeEnv: process.env.NODE_ENV || "development"
  });
}