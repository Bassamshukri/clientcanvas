export interface LinkedInAccountSummary {
  id: string;
  name: string;
}

export async function getLinkedInAccountSummary(): Promise<LinkedInAccountSummary> {
  return {
    id: "linkedin-demo-account",
    name: "LinkedIn Demo Account"
  };
}