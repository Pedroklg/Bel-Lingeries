import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string | null;
    isAdmin: boolean;
    accessToken: string;
  }

  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      name: string | null;
      email: string;
      accessToken: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
}