import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /** Campos extras que o authorize() e callbacks adicionam ao User */
  interface User extends DefaultUser {
    id: string;
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
  }

  /** Sessão acessível no front (useSession) */
  interface Session extends DefaultSession {
    accessToken?: string;
    tokenType?: string;
    expiresAt?: number;
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** JWT armazenado nos callbacks */
  interface JWT {
    id?: string;
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    expiresAt?: number;
    email?: string;
  }
}
