import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // Redireciona para a página de login se o usuário não estiver autenticado
  },
});

// Protegendo rotas específicas
export const config = {
  matcher: ["/matrizes/:path*", "/filhotes/:path*", "/dashboard/:path*"], // Adicione aqui as páginas que você quer proteger
};
