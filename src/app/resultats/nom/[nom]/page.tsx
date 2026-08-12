import { prisma } from "@/lib/prisma";
import { NomResults } from "@/app/resultats/nom/[nom]/NomResults";

export default async function NomPage({
    params,
}: {
    params: Promise<{ nom: string }>;
}) {
    const { nom } = await params;
    const query = decodeURIComponent(nom);

    const results = await prisma.result.findMany({
        where: {
            OR: [
                { nomFr: { contains: query, mode: "insensitive" } },
                { nomAr: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: { moyenne: "desc" },
        select: {
            numero: true,
            nomFr: true,
            nomAr: true,
            decision: true,
            moyenne: true,
            etablissementFr: true,
            etablissementAr: true,
        },
    });

    return <NomResults query={query} results={results} />;
}
