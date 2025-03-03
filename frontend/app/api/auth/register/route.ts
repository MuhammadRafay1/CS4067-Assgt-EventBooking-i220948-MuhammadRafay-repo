import { NextResponse } from "next/server"

// Mock user data - in a real app, this would be in a database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
]

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: `${users.length + 1}`,
      name,
      email,
      password,
    }

    // In a real app, you would add the user to the database
    // and hash the password before storing it

    // Create a user object without the password
    const userWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    // In a real app, you would generate a JWT here
    const token = `mock-jwt-token-${newUser.id}`

    return NextResponse.json({
      message: "Registration successful",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

