// src/models/Filhote.js
import mongoose from "mongoose";

const FilhoteSchema = new mongoose.Schema({
  matriz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Matriz",
    required: true,
  },
  dataNascimento: { type: Date, required: true },
  previsaoDesmama: { type: Date, required: true },
  caracteristicas: String,
  situacao: {
    type: String,
    enum: ["NO", "MO", "SU", "VE", "DE"],
    default: "NO",
  },
  sexo: { type: String, enum: ["Macho", "Fêmea"], required: true }, // Novo campo
  nomePai: { type: String }, // Novo campo
  observacao: String,
});

export default mongoose.models.Filhote ||
  mongoose.model("Filhote", FilhoteSchema);
