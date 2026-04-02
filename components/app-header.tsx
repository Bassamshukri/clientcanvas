import Link from "next/link";
import { signOut } from "../app/login/actions";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  email?: string;
  showBackHome?: boolean;
}

export function AppHeader({
  title = "ClientCanvas",
  subtitle = "",
  email = "",
  showBackHome = true
}: AppHeaderProps) {
  return (
    <header className="panelCard appHeader">
      <div className="appHeaderLeft">
        <div className="badge">ClientCanvas</div>
        <div>
          <h1 className="appHeaderTitle">{title}</h1>
          {subtitle ? <p className="mutedText">{subtitle}</p> : null}
          {email ? <p className="mutedText">Signed in as {email}</p> : null}
        </div>
      </div>

      <div className="heroActions">
        {showBackHome ? (
          <Link className="secondaryButton" href="/">
            Dashboard
          </Link>
        ) : null}

        <form action={signOut}>
          <button className="secondaryButton" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}