import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import NextAuth, { type DefaultSession, type Session, type User } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "SUPER_ADMIN" | "USER" | "EMPLOYEE";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "USER" | "EMPLOYEE";
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) throw new Error("User not found");
        const valid = await compare(credentials!.password, user.password);
        if (!valid) throw new Error("Invalid password");
        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "SUPER_ADMIN" | "USER" | "EMPLOYEE";
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow any URL that starts with the base URL
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Default to base URL
      return baseUrl;
    },
  },
};
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
