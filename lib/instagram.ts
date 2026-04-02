export interface InstagramPublishPayload {
  caption: string;
  imageUrl?: string;
}

export async function createInstagramMediaContainer(payload: InstagramPublishPayload) {
  return {
    ok: false,
    message: "Instagram container creation scaffold only.",
    payload
  };
}