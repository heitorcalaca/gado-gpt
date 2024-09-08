"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

export default function FilhoteDetails({ initialData }) {
  const [form, setForm] = useState({
    matriz: initialData.matriz || "",
    dataNascimento: initialData.dataNascimento
      ? new Date(initialData.dataNascimento).toISOString().split("T")[0]
      : "",
    previsaoDesmama: initialData.previsaoDesmama
      ? new Date(initialData.previsaoDesmama).toISOString().split("T")[0]
      : "",
    sexo: initialData.sexo || "", // Campo de sexo
    nomePai: initialData.nomePai || "", // Campo de nome do pai
    caracteristicas: initialData.caracteristicas || "",
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

    // Atualizando a previsão de desmama quando a data de nascimento mudar
    if (name === "dataNascimento") {
      const dataNascimento = new Date(value);
      if (!isNaN(dataNascimento)) {
        const previsaoDesmama = new Date(dataNascimento);
        previsaoDesmama.setMonth(dataNascimento.getMonth() + 9); // Adiciona 9 meses
        setForm({
          ...form,
          [name]: value,
          previsaoDesmama: previsaoDesmama.toISOString().split("T")[0],
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
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
      const res = await fetch(`/api/filhotes/${initialData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.replace("/filhotes");
        router.reload();
      } else {
        const errorData = await res.json();
        console.error("Erro ao atualizar filhote:", errorData.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar filhote", error);
    }
  };

  const handleBack = () => {
    router.push("/filhotes");
  };

  return (
    <div className="container mx-auto p-4">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Detalhes do Filhote
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mx-auto"
        >
          <div>
            <label className="form-label">Matriz (Mãe)</label>
            <Select
              options={matrizes}
              onChange={handleSelectChange}
              classNamePrefix="react-select"
              value={matrizes.find((option) => option.value === form.matriz)}
              placeholder="Selecione uma matriz..."
              isSearchable
            />
          </div>
          <div>
            <label className="form-label">Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={form.dataNascimento}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Previsão de Desmama</label>
            <input
              type="date"
              name="previsaoDesmama"
              value={form.previsaoDesmama}
              className="form-input"
              readOnly
            />
          </div>
          <div>
            <label className="form-label">Sexo</label>
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Selecione o sexo...</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>
          </div>
          <div>
            <label className="form-label">Nome do Pai</label>
            <input
              name="nomePai"
              value={form.nomePai}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Características</label>
            <textarea
              name="caracteristicas"
              value={form.caracteristicas}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>
          <div className="sm:col-span-2 flex gap-4">
            <button type="submit" className="form-button-primary">
              Atualizar Filhote
            </button>
            <button
              type="button"
              onClick={() => router.push("/filhotes")}
              className="form-button-secondary"
            >
              Voltar para a Listagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
