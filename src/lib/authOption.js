import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User"; // Verifique se o caminho está correto
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongoose";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Conectar ao banco de dados
        await connectToDatabase();

        // Verificar se o usuário existe no banco de dados
        const user = await User.findOne({ email: credentials.email });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          // Retorna os dados do usuário, incluindo o nome
          return { id: user._id, email: user.email, name: user.name };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar o nome do usuário ao token JWT
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar o nome do usuário à sessão
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
