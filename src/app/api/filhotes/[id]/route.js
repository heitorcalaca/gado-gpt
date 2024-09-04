// src/app/api/filhotes/[id]/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectToDatabase();
  const filhote = await Filhote.findById(params.id).populate("matriz").lean();

  if (!filhote) {
    return NextResponse.json(
      { message: "Filhote não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(filhote);
}

export async function PUT(request, { params }) {
  await connectToDatabase();
  const data = await request.json();
  const filhote = await Filhote.findByIdAndUpdate(params.id, data, {
    new: true,
  });

  if (!filhote) {
    return NextResponse.json(
      { message: "Filhote não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(filhote);
}
