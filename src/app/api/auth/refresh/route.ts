import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        if (!process.env.MAIN_API_URL) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }
        const response = await fetch(`${process.env.MAIN_API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: request.cookies as unknown as string,
            },
            body: JSON.stringify({}),
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 })
        } else {
            const data = await response.json();

            const responseObj = NextResponse.json(data, { status: response.status });
            return responseObj;
        }
    } catch (error) {
        console.error("token refresh proxy error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
