import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/app/HomeContent";

export default async function Home() {
    const committeePreview = await prisma.executiveMember.findMany({
        orderBy: { ordre: "asc" },
        take: 6,
    });

    return <HomeContent committeePreview={committeePreview} />;
}
