import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { Adapter } from 'next-auth/adapters'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)
          
          const user = await db.user.findUnique({
            where: { email }
          })
          
          if (!user || !user.password) {
            return null
          }
          
          const isPasswordValid = await bcrypt.compare(password, user.password)
          
          if (!isPasswordValid) {
            return null
          }
          
          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('Please verify your email before signing in.')
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.plan = user.plan || 'FREE'
      }
      
      // Store GitHub username if signing in with GitHub
      if (account?.provider === 'github' && account.providerAccountId) {
        try {
          await db.user.update({
            where: { id: token.id as string },
            data: { githubUsername: account.providerAccountId }
          })
        } catch (error) {
          console.error('Error updating GitHub username:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.plan = token.plan as string
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Set emailVerified for OAuth users automatically
      if (user.email) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        })
      }
    },
  },
}

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface User {
    plan?: string
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      plan?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan: string
  }
} 