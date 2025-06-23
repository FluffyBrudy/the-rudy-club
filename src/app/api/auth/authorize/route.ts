import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");
    if (!token) throw new Error("no token provided");
    const response = await fetch(`${process.env.MAIN_API_URL}/auth/authorize`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    const responseObj = NextResponse.json(data, { status: response.status });
    return responseObj;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: (error as Error)?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
