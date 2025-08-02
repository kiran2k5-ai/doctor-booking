import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      userType?: 'patient' | 'doctor'
    }
  }

  interface User {
    userType?: 'patient' | 'doctor'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType?: 'patient' | 'doctor'
  }
}
