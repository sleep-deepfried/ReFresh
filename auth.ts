/* eslint-disable @typescript-eslint/no-unused-vars */
import Google from "next-auth/providers/google";
import NextAuth from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Extend type definitions to match your schema
declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }

  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth" {
  interface JWT {
    id: number;
  }
}

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    Google({
      // Optional: Add any specific Google provider configurations
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Perform any custom sign-in validations
      if (!user.email) {
        console.error('No email provided during sign-in')
        return false
      }

      // Optional: Additional email domain restrictions
      // if (!user.email.endsWith('@yourcompany.com')) {
      //   return false
      // }

      return true
    },
    async jwt({ token, user, account }) {
      // Persist the user ID in the token
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token, user }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.id || user.id
      }
      return session
    }
  },
  events: {
    async signIn(message) {
      // Log successful sign-ins
      console.log('User signed in:', message.user.email)
    },
    async createUser(message) {
      // Log user creation
      console.log('New user created:', message.user.email)
    },
    async signOut(message) {
      console.log('User signed out:', message.user?.email);

      // Custom logic to reset the session if needed
      // You can optionally clear cookies or perform other actions here
      // NextAuth automatically clears cookies, so you usually don't need to do this manually
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    // Optional: Add other custom pages
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  // Optional: Configure session handling
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  }
})