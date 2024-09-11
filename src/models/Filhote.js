// src/models/Filhote.js
import mongoose from "mongoose";
import Matriz from "./Matriz";

const FilhoteSchema = new mongoose.Schema({
  matriz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Matriz",
    required: true,
  },
  dataNascimento: { type: Date, required: true },
  previsaoDesmama: { type: Date, required: true },
  dataDesmama: Date,
  caracteristicas: String,
  situacao: {
    type: String,
    enum: ["NO", "MO", "SU", "VE", "DE"],
    default: "NO",
  },
  sexo: { type: String, enum: ["Macho", "Fêmea"], required: true }, // Novo campo
  nomePai: { type: String }, // Novo campo
  observacao: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Adiciona o campo userId
});

export default mongoose.models.Filhote ||
  mongoose.model("Filhote", FilhoteSchema);
