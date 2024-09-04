"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FilhoteDetails({ initialData }) {
  const [form, setForm] = useState({
    ...initialData,
    dataNascimento: new Date(initialData.dataNascimento)
      .toISOString()
      .split("T")[0],
    previsaoDesmama: new Date(initialData.previsaoDesmama)
      .toISOString()
      .split("T")[0],
  });
  const router = useRouter();

  useEffect(() => {
    const dataNascimento = new Date(form.dataNascimento);
    const previsaoDesmama = new Date(
      dataNascimento.setMonth(dataNascimento.getMonth() + 9)
    );
    setForm((prevForm) => ({
      ...prevForm,
      previsaoDesmama: previsaoDesmama.toISOString().split("T")[0],
    }));
  }, [form.dataNascimento]);

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
      await fetch(`/api/filhotes/${form._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      router.push("/filhotes");
    } catch (error) {
      console.error("Failed to update filhote", error);
    }
  };

  const handleBack = () => {
    router.push("/filhotes");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalhes do Filhote</h1>
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Voltar para a Listagem
        </button>
      </div>
      <form onSubmit={handleSubmit}>
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
          Atualizar Filhote
        </button>
      </form>
    </div>
  );
}
