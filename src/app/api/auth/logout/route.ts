import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MAIN_API_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = request.headers.get("Authorization");
    if (!token) throw new Error("no token provided");
    console.log(token);

    const response = await fetch(`${process.env.MAIN_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    console.log(response.status);
    const setCookie = response.headers.get("Set-Cookie");

    if (setCookie) {
      return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Set-Cookie": setCookie,
          "Content-Type": "application/json",
        },
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("logout proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
