// src/app/api/filhotes/route.js
import connectToDatabase from "@/lib/mongoose";
import Filhote from "@/models/Filhote";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const filhotes = await Filhote.find({}).populate("matriz").lean();

  return NextResponse.json(filhotes);
}

export async function POST(request) {
  await connectToDatabase();
  const data = await request.json();
  const filhote = await Filhote.create(data);

  return NextResponse.json(filhote);
}
