import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");
        if (!token) throw new Error("no token provided");

        const { pathname } = new URL(request.url);
        const id = pathname.split("/").pop();
        console.log(id)
        const response = await fetch(
            `${process.env.MAIN_API_URL}/post/fetch/user/${id}`,
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

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Post fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
