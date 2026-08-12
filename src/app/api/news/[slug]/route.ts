import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const article = await prisma.news.findUnique({
        where: { slug },
    });

    if (!article) {
        return NextResponse.json(
            { message: "Article introuvable" },
            { status: 404 }
        );
    }

    return NextResponse.json(article);
}
