import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      verified: boolean;
    
    }& DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    verified: boolean;
    
  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     email: string;

//   }
// }
