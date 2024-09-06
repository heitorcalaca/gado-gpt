import NextAuth from "next-auth";

import { authOptions } from "@/lib/authOption";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
