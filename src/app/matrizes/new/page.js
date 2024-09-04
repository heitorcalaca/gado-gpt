// src/app/matrizes/new/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewMatrizPage() {
  const [form, setForm] = useState({
    nome: "",
    numero: "",
    caracteristicas: "",
    dataNascimento: "",
    proprietario: "",
    situacao: "NO",
    nomePai: "",
    nomeMae: "",
    situacaoMae: "NO",
    observacao: "",
  });
  const [filhoteId, setFilhoteId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const nomeMae = searchParams.get("nomeMae");
    const nomePai = searchParams.get("nomePai");
    const dataNascimento = searchParams.get("dataNascimento");
    const numeroMatriz = searchParams.get("numeroMatriz");
    const proprietario = searchParams.get("proprietario");
    const filhoteIdParam = searchParams.get("filhoteId");

    if (nomeMae || nomePai || dataNascimento || numeroMatriz || proprietario) {
      setForm((prevForm) => ({
        ...prevForm,
        nomeMae: nomeMae || "",
        nomePai: nomePai || "",
        dataNascimento: dataNascimento
          ? new Date(dataNascimento).toISOString().split("T")[0]
          : "",
        numero: numeroMatriz || "",
        proprietario: proprietario || "",
      }));
    }

    if (filhoteIdParam) {
      setFilhoteId(filhoteIdParam); // Salva o ID do filhote para futura atualização
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Salva a nova matriz
      const matrizRes = await fetch("/api/matrizes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (matrizRes.ok) {
        // Agora que a matriz foi criada, marca o filhote como desmamado
        if (filhoteId) {
          await fetch(`/api/filhotes/${filhoteId}/desmamar`, {
            method: "PUT",
          });
        }
        router.push("/matrizes");
      } else {
        console.error("Erro ao cadastrar matriz");
      }
    } catch (error) {
      console.error("Erro ao salvar matriz", error);
    }
  };

  const handleBack = () => {
    router.push("/matrizes");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nova Matriz</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Número</label>
          <input
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Características</label>
          <input
            name="caracteristicas"
            value={form.caracteristicas}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Data de Nascimento</label>
          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Proprietário</label>
          <input
            name="proprietario"
            value={form.proprietario}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Situação</label>
          <select
            name="situacao"
            value={form.situacao}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="NO">Normal (NO)</option>
            <option value="MO">Morta (MO)</option>
            <option value="SU">Sumiu (SU)</option>
            <option value="VE">Vendida (VE)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nome do Pai</label>
          <input
            name="nomePai"
            value={form.nomePai}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nome da Mãe</label>
          <input
            name="nomeMae"
            value={form.nomeMae}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Situação da Mãe</label>
          <select
            name="situacaoMae"
            value={form.situacaoMae}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="NO">Normal (NO)</option>
            <option value="MO">Morta (MO)</option>
            <option value="SU">Sumiu (SU)</option>
            <option value="VE">Vendida (VE)</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Cadastrar
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Voltar para a Listagem
        </button>
      </form>
    </div>
  );
}
