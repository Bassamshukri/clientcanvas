import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabase/server";

interface RouteContext {
  params: Promise<{
    archiveId: string;
  }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { archiveId } = await context.params;
  const supabase = await createClient();

  const { data: archive } = await supabase
    .from("export_archives")
    .select("id,workspace_id,status,created_at")
    .eq("id", archiveId)
    .single();

  if (!archive) {
    return new NextResponse("Archive not found.", { status: 404 });
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id,name")
    .eq("id", archive.workspace_id)
    .single();

  const { data: designs } = await supabase
    .from("designs")
    .select("id,title,status,updated_at")
    .eq("workspace_id", archive.workspace_id)
    .order("updated_at", { ascending: false });

  const lines = [
    `Archive ID: ${archive.id}`,
    `Workspace: ${workspace?.name || archive.workspace_id}`,
    `Status: ${archive.status}`,
    `Created At: ${archive.created_at || ""}`,
    "",
    "Designs:"
  ];

  for (const design of designs || []) {
    lines.push(
      `- ${design.title || design.id} | ${design.status} | ${design.updated_at || ""}`
    );
  }

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="archive-${archive.id}.txt"`
    }
  });
}