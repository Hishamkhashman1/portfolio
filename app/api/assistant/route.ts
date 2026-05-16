import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    {
      error: "assistant_moved",
      message: "Use the standalone FastAPI assistant service instead."
    },
    { status: 410 }
  );
}
