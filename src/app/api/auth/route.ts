import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

// Simple team auth: email + access code
// For MVP — upgrade to Supabase Auth for production

export async function POST(req: NextRequest) {
  try {
    const { email, accessCode } = await req.json();

    // Validate access code
    if (accessCode !== process.env.TEAM_ACCESS_CODE) {
      return NextResponse.json(
        { error: "Invalid access code" },
        { status: 401 }
      );
    }

    // Look up team member
    const db = getServiceSupabase();
    const { data: member } = await db
      .from("team_members")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (!member) {
      return NextResponse.json(
        { error: "Email not found. Ask an admin to add you to the team." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        is_admin: member.is_admin,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Auth failed" },
      { status: 500 }
    );
  }
}
