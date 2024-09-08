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
    sexo: "",
    nomePai: "",
    observacao: "",
    filhoteAvulso: false, // Define se o filhote será avulso ou relacionado a uma matriz
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
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value, // Atualiza checkbox para filhote avulso
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
      matriz: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Se filhote avulso estiver marcado, limpa o campo matriz
      const filhoteData = { ...form };
      if (form.filhoteAvulso) {
        filhoteData.matriz = null;
      }

      const res = await fetch("/api/filhotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filhoteData),
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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Novo Filhote
          </h1>
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="form-grid form-grid-2-cols">
          <div>
            <label className="form-label">Matriz (Mãe)</label>
            <Select
              options={matrizes}
              onChange={handleSelectChange}
              value={matrizes.find((option) => option.value === form.matriz)}
              placeholder="Selecione uma matriz..."
              isSearchable
              isDisabled={form.filhoteAvulso}
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="form-label">Filhote Avulso</label>
            <input
              type="checkbox"
              name="filhoteAvulso"
              checked={form.filhoteAvulso}
              onChange={handleChange}
              className="form-input h-4 w-4"
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
            <input
              name="caracteristicas"
              value={form.caracteristicas}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="form-label">Observações</label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="sm:col-span-2 flex gap-4">
            <button type="submit" className="form-button-primary">
              Cadastrar Filhote
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="form-button-secondary"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
