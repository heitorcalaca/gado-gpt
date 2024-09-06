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
          // Se a senha estiver correta, retorna os dados do usuário
          return { id: user._id, email: user.email };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};
