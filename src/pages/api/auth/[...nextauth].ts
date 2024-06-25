import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (user && await compare(credentials.password, user.password)) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name ?? null,
            isAdmin: user.isAdmin
          };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          isAdmin: token.isAdmin
        };
      }
      console.log('Session:', session);
      return session;
    }
  },
  secret: process.env.SECRET_KEY,
  pages: {
    signIn: '/login'
  }
});