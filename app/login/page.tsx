import { LoginForm } from "../../components/login-form";
import { getCurrentUser } from "../../lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign In — ClientCanvas",
  description: "Sign in to your ClientCanvas design workspace."
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <LoginForm />;
}