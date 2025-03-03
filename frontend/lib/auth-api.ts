export const authAPI = {
    login: async (email: string, password: string) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
  
        const data = await response.json()
        console.log("Server response:", data)
  
        if (!response.ok) {
          throw new Error(data.message || "Login failed")
        }
  
        // Create a user object from the token payload
        const token = data.token
        // Decode the JWT token to get user information
        const payload = JSON.parse(atob(token.split(".")[1]))
  
        const user = {
          id: payload.id,
          email: payload.email,
          name: payload.name || email.split("@")[0], // Fallback to email username if name not provided
        }
  
        return {
          token,
          user,
          message: data.message,
        }
      } catch (error) {
        console.error("Login API error:", error)
        throw error
      }
    },
  }
  
  