import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResultReveal } from "@/app/resultats/[numero]/ResultReveal";

export default async function ResultPage({
    params,
}: {
    params: Promise<{ numero: string }>;
}) {
    const { numero } = await params;

    const result = await prisma.result.findUnique({ where: { numero } });

    if (!result) {
        notFound();
    }

    const [totalCandidates, totalSuccessful] = await Promise.all([
        prisma.result.count(),
        prisma.result.count({
            where: { decision: { contains: "admis", mode: "insensitive" } },
        }),
    ]);

    return (
        <ResultReveal
            result={result}
            totalCandidates={totalCandidates}
            totalSuccessful={totalSuccessful}
        />
    );
}
