import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const results = await prisma.result.findMany();

    return NextResponse.json(results);
}