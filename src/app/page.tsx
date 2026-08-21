import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/app/HomeContent";

export default async function Home() {
    const committeePreview = await prisma.executiveMember.findMany({
        orderBy: { ordre: "asc" },
        take: 6,
    });

    const featuredNews = await prisma.news.findFirst({
        where: { featured: true },
        orderBy: { publishedAt: "desc" },
    });

    const activities = await prisma.activity.findMany({
        orderBy: [{ date: { sort: "desc", nulls: "last" } }, { order: "asc" }],
    });

    return (
        <HomeContent
            committeePreview={committeePreview}
            featuredNews={featuredNews}
            activities={activities}
        />
    );
}
