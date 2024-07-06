import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.SECRET_KEY || 'default_secret_key';

export const authOptions = {
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
          const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, secret, { expiresIn: '1h' });
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name ?? null,
            isAdmin: user.isAdmin,
            accessToken: token
          };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token && token.id) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email as string,
          name: token.name as string | null,
          isAdmin: token.isAdmin,
          accessToken: token.accessToken as string,
        };
        const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60); // Unix timestamp for 1 hour from now
        session.expires = new Date(expiresIn * 1000).toISOString(); // Convert Unix timestamp to ISO string
      }
      return session;
    }
  },
  secret,
  pages: {
    signIn: '/login'
  }
};

export default NextAuth(authOptions);