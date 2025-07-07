import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!process.env.MAIN_API_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(`${process.env.MAIN_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    const setCookie = response.headers.get('Set-Cookie');

    // Forward the Set-Cookie header as-is if present
    if (setCookie) {
      return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: {
          "Set-Cookie": setCookie,
          "Content-Type": "application/json"
        }
      });
    }

    // Fallback if no Set-Cookie header
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}