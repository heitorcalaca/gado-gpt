"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

function NewMachoForm() {
  const [form, setForm] = useState({
    numero: "",
    lote: "",
    dataNascimento: "",
    nomePai: "",
    nomeMae: "",
    proprietario: "",
    caracteristicas: "",
    observacao: "",
  });
  const [errors, setErrors] = useState({});
  const [filhoteId, setFilhoteId] = useState(null); // Guarda o ID do filhote
  const [dataDesmama, setDataDesmama] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pega os parâmetros de query enviados da página de desmama
    const nomeMae = searchParams.get("nomeMae");
    const nomePai = searchParams.get("nomePai");
    const dataNascimento = searchParams.get("dataNascimento");
    const numeroMatriz = searchParams.get("numeroMatriz");
    const proprietario = searchParams.get("proprietario");
    const filhoteIdParam = searchParams.get("filhoteId"); // Pega o ID do filhote

    // Preenche o formulário com os dados do filhote
    setForm({
      nomeMae: nomeMae || "",
      nomePai: nomePai || "",
      dataNascimento: dataNascimento
        ? new Date(dataNascimento).toISOString().split("T")[0]
        : "",
      numero: numeroMatriz || "",
      proprietario: proprietario || "",
      caracteristicas: [],
      observacao: "",
    });

    if (filhoteIdParam) {
      setFilhoteId(filhoteIdParam); // Salva o ID do filhote para futura atualização
    }

    setDataDesmama(new Date().toISOString().split("T")[0]);
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.numero) {
      newErrors.numero = "Número é obrigatório.";
    }
    if (!form.lote) {
      newErrors.lote = "Lote é obrigatório.";
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
      // Envia os dados para criar um novo macho
      const machoRes = await fetch("/api/machos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const resData = await machoRes.json();

      if (machoRes.ok) {
        if (filhoteId) {
          // Marca o filhote como desmamado e envia a data de desmama
          const desmamarRes = await fetch(
            `/api/filhotes/${filhoteId}/desmamar`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ dataDesmama }), // Aqui garantimos que a data está sendo enviada
            }
          );

          if (!desmamarRes.ok) {
            console.error("Erro ao marcar filhote como desmamado");
          }
        }

        // Redireciona para a lista de machos
        router.push("/machos");
      } else {
        setErrors(resData.errors || {});
      }
    } catch (error) {
      console.error("Erro ao salvar macho", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Cadastrar Macho</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <input
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          {errors.numero && (
            <p className="text-red-500 mt-1">{errors.numero}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lote
          </label>
          <input
            name="lote"
            value={form.lote}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          {errors.lote && <p className="text-red-500 mt-1">{errors.lote}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Pai
          </label>
          <input
            name="nomePai"
            value={form.nomePai}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome da Mãe
          </label>
          <input
            name="nomeMae"
            value={form.nomeMae}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Proprietário
          </label>
          <input
            name="proprietario"
            value={form.proprietario}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Características
          </label>
          <input
            name="caracteristicas"
            value={form.caracteristicas}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            name="observacao"
            value={form.observacao}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data de Desmama
          </label>
          <input
            type="date"
            name="dataDesmama"
            value={dataDesmama}
            onChange={(e) => setDataDesmama(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cadastrar Macho
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewMachoPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewMachoForm />
    </Suspense>
  );
}
