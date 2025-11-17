import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔑 Authorize called with credentials:", credentials);
        try {
          const res = await fetch(
            "http://frotinix.eastus2.cloudapp.azure.com/api/v1/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          const response = await res.json();
          console.log("🔎 Backend response:", response);

          // ✅ Verifica o token corretamente
          if (!res.ok || !response?.access_token) {
            console.error("Credenciais inválidas:", response);
            return null;
          }

          // ✅ Retorna o usuário autenticado
          return {
            id: credentials?.email ?? "no-id",
            email: credentials?.email,
            accessToken: response.access_token,
            tokenType: response.token_type,
            expiresIn: response.expires_in,
          };
        } catch (error) {
          console.error("Erro no authorize:", error);
          return null;
        }
      },
    }),
  ],

  // ✅ Persiste o token na sessão
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email || "";
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        id: token.email || "no-id",
        email: token.email || "",
      };
      session.expiresAt = token.expiresAt;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
