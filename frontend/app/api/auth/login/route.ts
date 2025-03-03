import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${process.env.USER_SERVICE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("Auth service response:", data)

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Login failed" }, { status: response.status })
    }

    // Pass through the token and message from the auth service
    return NextResponse.json({
      token: data.token,
      message: data.message,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

