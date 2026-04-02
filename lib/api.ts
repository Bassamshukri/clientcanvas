import { NextResponse } from "next/server";

export function jsonOk(data: unknown = {}, init: ResponseInit = {}) {
  return NextResponse.json(data, {
    status: 200,
    ...init
  });
}

export function jsonError(
  message: string,
  status = 400,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json(
    {
      error: String(message || "Unexpected error."),
      ...extra
    },
    { status }
  );
}