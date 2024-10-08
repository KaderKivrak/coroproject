import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt'; // Importer typen for JWT
import { Session } from 'next-auth'; // Importer typen for Session

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && bcrypt.compareSync(credentials?.password || '', user.password)) {
          return {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.sub as string; // Sikrer at sub er en string
      session.user.role = token.role as string; // Sikrer at role er en string
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: { id: string; role: string } }) {
      if (user) {
        token.sub = user.id; // Dette burde allerede være en string
        token.role = user.role; // Dette burde allerede være en string
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
