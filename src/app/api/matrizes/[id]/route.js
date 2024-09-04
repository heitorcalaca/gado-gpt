// src/app/api/matrizes/[id]/route.js
import connectToDatabase from "@/lib/mongoose";
import Matriz from "@/models/Matriz";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectToDatabase();

  try {
    const matriz = await Matriz.findById(new ObjectId(params.id)).lean();
    if (!matriz) {
      return NextResponse.json(
        { message: "Matriz não encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json(matriz);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar matriz", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await connectToDatabase();

  try {
    const data = await request.json();
    const updatedMatriz = await Matriz.findByIdAndUpdate(
      new ObjectId(params.id),
      data,
      { new: true, lean: true }
    );
    if (!updatedMatriz) {
      return NextResponse.json(
        { message: "Matriz não encontrada" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Matriz atualizada com sucesso",
      matriz: updatedMatriz,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar matriz", error: error.message },
      { status: 500 }
    );
  }
}
