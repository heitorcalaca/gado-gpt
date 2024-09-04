"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMatrizes = async () => {
      const res = await fetch("/api/matrizes");
      const data = await res.json();
      const formattedMatrizes = data.map((matriz) => ({
        value: matriz._id,
        label: `${matriz.nome} - ${matriz.numero}`,
      }));
      setMatrizes(formattedMatrizes);
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
      try {
        const dataNascimento = new Date(value);
        if (isNaN(dataNascimento.getTime())) {
          throw new Error("Invalid date");
        }
        const previsaoDesmama = new Date(
          dataNascimento.setMonth(dataNascimento.getMonth() + 9)
        );
        setForm((prevForm) => ({
          ...prevForm,
          previsaoDesmama: previsaoDesmama.toISOString().split("T")[0],
        }));
        setErrorMessage("");
        setIsSubmitDisabled(false);
      } catch (error) {
        setErrorMessage("Data inválida. Por favor, insira uma data válida.");
        setIsSubmitDisabled(true);
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
    if (isSubmitDisabled) return;

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
          <Select
            options={matrizes}
            onChange={handleSelectChange}
            className="border p-2 w-full"
            placeholder="Selecione uma matriz..."
            isSearchable
            required
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
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isSubmitDisabled}
        >
          Adicionar Filhote
        </button>
      </form>
    </div>
  );
}
