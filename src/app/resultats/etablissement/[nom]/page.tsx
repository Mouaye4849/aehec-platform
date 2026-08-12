import { prisma } from "@/lib/prisma";
import { EtablissementResults } from "@/app/resultats/etablissement/[nom]/EtablissementResults";

export default async function EtablissementPage({
    params,
}: {
    params: Promise<{ nom: string }>;
}) {
    const { nom } = await params;
    const query = decodeURIComponent(nom);

    const results = await prisma.result.findMany({
        where: { etablissementFr: { contains: query, mode: "insensitive" } },
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

    return <EtablissementResults query={query} results={results} />;
}
