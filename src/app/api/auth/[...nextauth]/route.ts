import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Here you can add logic to determine if user is patient or doctor
      // For now, we'll default to patient
      return true
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user?.email) {
        // Check if email matches doctor emails to determine user type
        const doctorEmails = [
          'sarah.wilson@hospital.com',
          'michael.chen@hospital.com', 
          'emily.davis@hospital.com',
          'james.brown@hospital.com',
          'lisa.johnson@hospital.com'
        ]
        
        const isDoctor = doctorEmails.includes(session.user.email)
        
        session.user.userType = isDoctor ? 'doctor' : 'patient'
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userType = user.userType || 'patient'
      }
      return token
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
