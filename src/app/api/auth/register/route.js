import { hash } from "bcryptjs";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User"; // Presumo que você tenha um modelo de usuário

export async function POST(request) {
  const { name, email, password } = await request.json();

  await connectToDatabase();

  // Verificar se o usuário já existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "Usuário já existe" }), {
      status: 400,
    });
  }

  // Hash da senha
  const hashedPassword = await hash(password, 10);

  // Criar um novo usuário
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return new Response(
    JSON.stringify({ message: "Usuário criado com sucesso!" }),
    {
      status: 201,
    }
  );
}
