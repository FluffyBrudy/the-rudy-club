import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");
    if (!token) throw new Error("no token provided");

    const { notificationId } = await request.json();
    const response = await fetch(
      `${process.env.MAIN_API_URL}/notification/toggle-read`,
      {
        method: "POST", // todo: change to pathch later not post, modify express router
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ notificationId: notificationId }),
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
