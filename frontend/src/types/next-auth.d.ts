import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      verified: boolean;
      provider: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    verified: boolean;
    provider: string;
    
  }
}