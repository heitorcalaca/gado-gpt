"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fazer chamada para a API de registro
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/auth/login");
    } else {
      console.error("Erro ao criar a conta");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Seção da esquerda - Login */}
      <div className="w-1/2 bg-green-400 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-2 text-white">
          Bem-vindo de Volta!
        </h2>
        <p className="text-lg text-white mb-4">
          Faça login com suas informações pessoais
        </p>
        <button
          className="bg-white text-green-500 py-2 px-6 rounded-full"
          onClick={() => router.push("/auth/login")}
        >
          Entrar
        </button>
      </div>

      {/* Seção da direita - Registro */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-6">Criar Conta</h2>

        {/* Formulário de Registro */}
        <form onSubmit={handleSubmit} className="w-2/3">
          <div className="flex flex-col mb-4">
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-3 w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-3 w-full"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-md mb-3 w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-full w-full"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
