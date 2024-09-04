// src/app/filhotes/new/page.js
"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";

export default function NewFilhotePage() {
  const [form, setForm] = useState({
    matriz: "",
    dataNascimento: "",
    previsaoDesmama: "",
    caracteristicas: "",
    situacao: "NO",
    sexo: "", // Novo campo
    nomePai: "", // Novo campo
  });
  const [matrizes, setMatrizes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMatrizes = async () => {
      try {
        const res = await fetch("/api/matrizes");
        const data = await res.json();
        setMatrizes(
          data.map((matriz) => ({
            value: matriz._id,
            label: `${matriz.nome} - ${matriz.numero}`,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar matrizes:", error);
      }
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
      if (!isNaN(dataNascimento.getTime())) {
        const previsaoDesmama = new Date(
          dataNascimento.setMonth(dataNascimento.getMonth() + 9)
        );
        setForm((prevForm) => ({
          ...prevForm,
          previsaoDesmama: previsaoDesmama.toISOString().split("T")[0],
        }));
      }
    }
  };

  const handleSelectChange = (selectedOption) => {
    setForm({
      ...form,
      matriz: selectedOption.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/filhotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/filhotes");
      } else {
        console.error("Erro ao cadastrar filhote:", res.statusText);
      }
    } catch (error) {
      console.error("Erro ao cadastrar filhote:", error);
    }
  };

  const handleBack = () => {
    router.push("/filhotes");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Novo Filhote</h1>
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Voltar para a Listagem
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Matriz (Mãe)</label>
          <Select
            options={matrizes}
            onChange={handleSelectChange}
            className="border p-2 w-full"
            value={matrizes.find((option) => option.value === form.matriz)}
            placeholder="Selecione uma matriz..."
            isSearchable
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
          <label className="block text-gray-700">Sexo</label>
          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Selecione o sexo...</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
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
          <label className="block text-gray-700">Características</label>
          <textarea
            name="caracteristicas"
            value={form.caracteristicas}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Cadastrar Filhote
        </button>
      </form>
    </div>
  );
}
