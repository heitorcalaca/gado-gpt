"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewMachoForm() {
  const [form, setForm] = useState({
    numero: "",
    lote: "",
    dataNascimento: "",
    nomePai: "",
    nomeMae: "",
    proprietario: "",
    caracteristicas: [],
    observacao: "",
  });
  const [errors, setErrors] = useState({});
  const [filhoteId, setFilhoteId] = useState(null); // Guarda o ID do filhote
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
          // Marca o filhote como desmamado
          await fetch(`/api/filhotes/${filhoteId}/desmamar`, {
            method: "PUT",
          });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número
        </label>
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
        <label className="block text-sm font-medium text-gray-700">Lote</label>
        <input
          name="lote"
          value={form.lote}
          onChange={handleChange}
          className="form-input"
          required
        />
        {errors.lote && <p className="text-red-500">{errors.lote}</p>}
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
          className="form-input"
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
          className="form-input"
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
          className="form-input"
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
          className="form-input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Características
        </label>
        <input
          name="caracteristicas"
          value={form.caracteristicas}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          name="observacao"
          value={form.observacao}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Cadastrar Macho
      </button>
    </form>
  );
}
