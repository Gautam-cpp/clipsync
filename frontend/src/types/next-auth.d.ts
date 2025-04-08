import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      verified: boolean;
     
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    verified: boolean;
    
  }
}