import mongoose from "mongoose";

const PesagemSchema = new mongoose.Schema({
  data: { type: Date, required: true },
  peso: { type: Number, required: true }, // Peso em Kg
});

const MachoSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  lote: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  situacao: { type: String, enum: ["NO", "MO", "SU", "VE"], default: "NO" },
  caracteristicas: [{ type: String }],
  observacao: String,
  pesagens: [PesagemSchema], // Histórico de pesagens
  nomePai: { type: String, required: true }, // Adicionando nome do pai
  nomeMae: { type: String, required: true }, // Adicionando nome da mãe
  proprietario: { type: String, required: true }, // Adicionando proprietário
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Macho || mongoose.model("Macho", MachoSchema);
