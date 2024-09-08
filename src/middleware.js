import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // Redireciona para a página de login se o usuário não estiver autenticado
  },
});

// Protegendo rotas específicas
export const config = {
  matcher: ["/((?!_next|icon-cow.svg|auth/login|auth/register).*)"], // Adicione aqui as páginas que você quer proteger
};
