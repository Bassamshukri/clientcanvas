export type ReviewDecision = "approved" | "needs_changes";
export type DesignStatus = "draft" | "in_review" | "needs_changes" | "approved";

export interface WorkspaceRecord {
  id: string;
  name: string;
  description: string;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  font_family?: string | null;
}

export interface DesignRecord {
  id: string;
  workspace_id: string;
  title: string;
  status: DesignStatus;
  width: number;
  height: number;
  canvas_json?: unknown;
  thumbnail_url?: string | null;
  created_at?: string;
  updated_at?: string;
}