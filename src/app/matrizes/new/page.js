"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function NewMatrizForm() {
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
  const [errors, setErrors] = useState({});
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
    setErrors({ ...errors, [name]: null }); // Limpa o erro ao modificar o valor
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nome) {
      newErrors.nome = "Nome é obrigatório.";
    }
    if (!form.numero || form.numero.length < 3) {
      newErrors.numero =
        "Número é obrigatório e deve ter no mínimo 3 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Envia os dados para o backend
      const matrizRes = await fetch("/api/matrizes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const resData = await matrizRes.json();

      if (matrizRes.ok) {
        if (filhoteId) {
          await fetch(`/api/filhotes/${filhoteId}/desmamar`, {
            method: "PUT",
          });
        }

        window.dispatchEvent(new Event("matrizAdded"));

        router.push("/matrizes");
      } else {
        setErrors(resData.errors || {});
      }
    } catch (error) {
      console.error("Erro ao salvar matriz", error);
    }
  };

  const handleBack = () => {
    router.push("/matrizes");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Nova Matriz
          </h1>
        </div>
      </header>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div>
            <label className="form-label">Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.nome && <p className="text-red-500">{errors.nome}</p>}
          </div>

          <div>
            <label className="form-label">Número</label>
            <input
              name="numero"
              value={form.numero}
              onChange={handleChange}
              className="form-input"
              required
            />
            {errors.numero && <p className="text-red-500">{errors.numero}</p>}
          </div>

          <div>
            <label className="form-label">Características</label>
            <input
              name="caracteristicas"
              value={form.caracteristicas}
              onChange={handleChange}
              className="form-input"
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
            />
          </div>

          <div>
            <label className="form-label">Proprietário</label>
            <input
              name="proprietario"
              value={form.proprietario}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Situação</label>
            <select
              name="situacao"
              value={form.situacao}
              onChange={handleChange}
              className="form-input"
            >
              <option value="NO">Normal</option>
              <option value="MO">Morta</option>
              <option value="SU">Sumiu</option>
              <option value="VE">Vendida</option>
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

          <div>
            <label className="form-label">Nome da Mãe</label>
            <input
              name="nomeMae"
              value={form.nomeMae}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Situação da Mãe</label>
            <select
              name="situacaoMae"
              value={form.situacaoMae}
              onChange={handleChange}
              className="form-input"
            >
              <option value="NO">Normal</option>
              <option value="MO">Morta</option>
              <option value="SU">Sumiu</option>
              <option value="VE">Vendida</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex gap-4">
            <button type="submit" className="form-button-primary">
              Cadastrar
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

export default function NewMatrizPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NewMatrizForm />
    </Suspense>
  );
}
