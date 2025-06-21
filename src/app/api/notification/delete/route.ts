import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");
    if (!token) throw new Error("no token provided");

    const body = await request.json();
    const response = await fetch(
      `${process.env.MAIN_API_URL}/notification/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    const responseObj = NextResponse.json(data, { status: response.status });
    return responseObj;
  } catch (error) {
    console.error("Toggle notification read status proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
