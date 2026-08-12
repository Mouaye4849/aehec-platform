import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsDetail } from "@/app/actualites/[slug]/NewsDetail";

export default async function NewsDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const article = await prisma.news.findUnique({ where: { slug } });

    if (!article) {
        notFound();
    }

    return <NewsDetail article={article} />;
}
