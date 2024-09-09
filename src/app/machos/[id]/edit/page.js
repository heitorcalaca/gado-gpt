"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditMachoForm() {
  const { id } = useParams(); // Obtém o ID do macho a partir da URL
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Buscar os dados do macho para preencher o formulário
    const fetchMacho = async () => {
      try {
        const res = await fetch(`/api/machos/${id}`);
        const data = await res.json();
        setForm({
          numero: data.numero,
          lote: data.lote,
          dataNascimento: new Date(data.dataNascimento)
            .toISOString()
            .split("T")[0],
          nomePai: data.nomePai,
          nomeMae: data.nomeMae,
          proprietario: data.proprietario,
          caracteristicas: data.caracteristicas,
          observacao: data.observacao,
        });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do macho:", error);
        setLoading(false);
      }
    };

    fetchMacho();
  }, [id]);

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
    if (!form.nomePai) {
      newErrors.nomePai = "Nome do pai é obrigatório.";
    }
    if (!form.nomeMae) {
      newErrors.nomeMae = "Nome da mãe é obrigatório.";
    }
    if (!form.proprietario) {
      newErrors.proprietario = "Proprietário é obrigatório.";
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
      const res = await fetch(`/api/machos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(`/machos/${id}`);
      } else {
        const errorData = await res.json();
        setErrors(errorData.errors || {});
      }
    } catch (error) {
      console.error("Erro ao atualizar macho", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
        {errors.nomePai && <p className="text-red-500">{errors.nomePai}</p>}
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
        {errors.nomeMae && <p className="text-red-500">{errors.nomeMae}</p>}
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
        {errors.proprietario && (
          <p className="text-red-500">{errors.proprietario}</p>
        )}
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

      <button type="submit" className="bg-yellow-500 text-white p-2 rounded">
        Atualizar Macho
      </button>
    </form>
  );
}
