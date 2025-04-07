import sendOTP from "@/helper/sendOtp";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        // TODO: Add zod validation for email and password
        const { email, password } = credentials;


        try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (user) {

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) throw new Error("Invalid email or password");

            return user;
          }

         
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashedPassword, 
            },
          });

          const OTPSent = await sendOTP(email);
          if (!OTPSent.success) throw new Error("Failed to send OTP. Please try again.");

          return newUser;

        } catch (error: any) {
          console.error("Authorize error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.verified = user.verified;
        if ("username" in user) {
          token.username = user.username;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.verified = token.verified as boolean;
        if (token.username) {
          session.user.username = token.username as string;
        }
      }
      return session;
    },
  },
};
