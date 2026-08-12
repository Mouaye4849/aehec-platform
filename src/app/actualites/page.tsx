import { prisma } from "@/lib/prisma";
import { NewsList } from "@/app/actualites/NewsList";

export default async function NewsPage() {
    const news = await prisma.news.findMany({
        orderBy: { publishedAt: "desc" },
    });

    return <NewsList news={news} />;
}
