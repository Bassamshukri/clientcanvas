export interface PublishResult {
  ok: boolean;
  channel: string;
  message: string;
  externalId?: string;
}

export async function publishToLinkedIn() {
  return {
    ok: false,
    channel: "linkedin",
    message: "LinkedIn publishing scaffold is present but not fully configured."
  } satisfies PublishResult;
}

export async function publishToFacebook() {
  return {
    ok: false,
    channel: "facebook",
    message: "Facebook publishing scaffold is present but not fully configured."
  } satisfies PublishResult;
}

export async function publishToInstagram() {
  return {
    ok: false,
    channel: "instagram",
    message: "Instagram publishing scaffold is present but not fully configured."
  } satisfies PublishResult;
}