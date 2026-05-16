import { NextResponse } from "next/server";
import { getGithubContributionDays } from "@/lib/github-activity";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const contributions = await getGithubContributionDays(username);
    return NextResponse.json({ contributions });
  } catch {
    return NextResponse.json(
      { error: "failed_to_load_contributions" },
      { status: 502 }
    );
  }
}
