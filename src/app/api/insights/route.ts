import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// GET: Fetch recent insights (optionally filtered by team)
export async function GET(req: NextRequest) {
  const team = req.nextUrl.searchParams.get("team");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30");

  const db = getServiceSupabase();

  let query = db
    .from("shared_insights")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (team) {
    query = query.contains("relevance_teams", [team]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ insights: data });
}
