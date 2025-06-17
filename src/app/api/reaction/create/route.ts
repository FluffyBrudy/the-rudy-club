import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");
    if (!token) throw new Error("no token provided");

    const body = await request.json();
    const { reactionOnId, reactionOnType, reactionType } = body;

    const response = await fetch(
      `${process.env.MAIN_API_URL}/reaction/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ reactionOnId, reactionOnType, reactionType }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Reaction create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
