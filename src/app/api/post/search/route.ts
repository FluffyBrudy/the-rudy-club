import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");
    if (!token) throw new Error("no token provided");

    const param = request.nextUrl.searchParams.get("q")
    if (!param) {
      return NextResponse.json({ error: "improper query" }, { status: 400 })
    }
    const response = await fetch(`${process.env.MAIN_API_URL}/post/search?q=${encodeURIComponent(param)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      credentials: "include",
    });
    console.log(response.status)
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Post fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
