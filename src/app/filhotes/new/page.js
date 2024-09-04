"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewFilhotePage() {
  const [form, setForm] = useState({
    matriz: "",
    dataNascimento: "",
    previsaoDesmama: "",
    caracteristicas: "",
    situacao: "NO",
    observacao: "",
  });

  const [matrizes, setMatrizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchMatrizes = async () => {
      const res = await fetch("/api/matrizes");
      const data = await res.json();
      setMatrizes(data);
    };

    fetchMatrizes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === "dataNascimento") {
      const dataNascimento = new Date(value);
      const previsaoDesmama = new Date(
        dataNascimento.setMonth(dataNascimento.getMonth() + 9)
      );
      setForm((prevForm) => ({
        ...prevForm,
        previsaoDesmama: previsaoDesmama.toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/filhotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      router.push("/filhotes");
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };

  const handleBack = () => {
    router.push("/filhotes");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMatrizes = matrizes.filter((matriz) =>
    matriz.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Adicionar Novo Filhote</h1>
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Voltar para a Listagem
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Matriz (Mãe)</label>
          <input
            type="text"
            placeholder="Buscar matriz por nome..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 w-full mb-2"
          />
          <select
            name="matriz"
            value={form.matriz}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Selecione a Matriz</option>
            {filteredMatrizes.map((matriz) => (
              <option key={matriz._id} value={matriz._id}>
                {matriz.nome} - {matriz.numero}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Data de Nascimento</label>
          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Previsão de Desmama</label>
          <input
            type="date"
            name="previsaoDesmama"
            value={form.previsaoDesmama}
            className="border p-2 w-full"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Características</label>
          <textarea
            name="caracteristicas"
            value={form.caracteristicas}
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
            required
          >
            <option value="NO">Normal (NO)</option>
            <option value="MO">Morto (MO)</option>
            <option value="SU">Sumiu (SU)</option>
            <option value="VE">Vendido (VE)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Observação</label>
          <textarea
            name="observacao"
            value={form.observacao}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Adicionar Filhote
        </button>
      </form>
    </div>
  );
}
