import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Login API route called with email:", email);
    console.log("MAIN_API_URL:", process.env.MAIN_API_URL);

    if (!process.env.MAIN_API_URL) {
      console.error("MAIN_API_URL environment variable is not set");
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

    console.log("External API response status:", response.status);

    const data = await response.json();
    console.log("External API response data:", data);

    const responseObj = NextResponse.json(data, { status: response.status });

    if (response.ok && data.data?.accessToken) {
      console.log("Setting cookie with token");
      responseObj.cookies.set({
        name: "accessToken",
        value: data.data.accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return responseObj;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
