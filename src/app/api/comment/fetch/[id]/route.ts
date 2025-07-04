import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("Authorization");
    const { id } = await params;

    if (!token) throw new Error("no token provided");

    const response = await fetch(
      `${process.env.MAIN_API_URL}/comment/fetch/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log(data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Post fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
