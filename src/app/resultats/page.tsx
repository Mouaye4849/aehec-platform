import { prisma } from "@/lib/prisma";
import { ResultsSearch } from "@/app/resultats/ResultsSearch";
import { StatsCards, type ResultStats } from "@/app/resultats/StatsCards";
import {
    TopInstitutions,
    type InstitutionStat,
} from "@/app/resultats/TopInstitutions";
import { ResultsByWilaya, type WilayaStat } from "@/app/resultats/ResultsByWilaya";
import {
    TopStudents,
    type LeaderboardStudent,
    type SerieLeaderboard,
} from "@/app/resultats/TopStudents";

const TOP_PER_SERIE = 3;

function toSerieLeaderboards(
    rows: {
        numero: string;
        nomFr: string;
        nomAr: string | null;
        moyenne: number | null;
        serie: string | null;
        etablissementFr: string | null;
        etablissementAr: string | null;
        wilayaFr: string | null;
        wilayaAr: string | null;
    }[]
): SerieLeaderboard[] {
    const bySerie = new Map<string, LeaderboardStudent[]>();

    // `rows` is already sorted by moyenne desc, so taking the first
    // TOP_PER_SERIE seen per serie naturally yields the correct ranking.
    // The where clause already guarantees moyenne/serie are non-null; this
    // filter only narrows the type for TypeScript.
    for (const row of rows) {
        if (row.moyenne == null || !row.serie) continue;
        const student: LeaderboardStudent = { ...row, moyenne: row.moyenne, serie: row.serie };
        const group = bySerie.get(student.serie) ?? [];
        if (group.length < TOP_PER_SERIE) {
            group.push(student);
            bySerie.set(student.serie, group);
        }
    }

    return Array.from(bySerie.entries())
        .map(([serie, group]) => ({ serie, students: group }))
        .sort((a, b) => b.students[0].moyenne - a.students[0].moyenne);
}

function admittedFilter() {
    return { decision: { contains: "admis", mode: "insensitive" as const } };
}

function toInstitutionStats(
    totals: {
        etablissementFr: string | null;
        etablissementAr: string | null;
        _count: number;
        _max: { moyenne: number | null };
    }[],
    admittedRows: { etablissementFr: string | null; _count: number }[]
): InstitutionStat[] {
    const admittedMap = new Map<string, number>();
    for (const row of admittedRows) {
        if (row.etablissementFr) admittedMap.set(row.etablissementFr, row._count);
    }

    return totals
        .filter((row): row is typeof row & { etablissementFr: string } =>
            Boolean(row.etablissementFr)
        )
        .map((row) => {
            const admittedCount = admittedMap.get(row.etablissementFr) ?? 0;
            return {
                nameFr: row.etablissementFr,
                nameAr: row.etablissementAr,
                admittedCount,
                totalCount: row._count,
                successRate: row._count > 0 ? (admittedCount / row._count) * 100 : 0,
                bestAverage: row._max.moyenne,
            };
        })
        .sort((a, b) => b.admittedCount - a.admittedCount)
        .slice(0, 5);
}

function toWilayaStats(
    totals: { wilayaFr: string | null; wilayaAr: string | null; _count: number }[],
    admittedRows: { wilayaFr: string | null; _count: number }[]
): WilayaStat[] {
    const admittedMap = new Map<string, number>();
    for (const row of admittedRows) {
        if (row.wilayaFr) admittedMap.set(row.wilayaFr, row._count);
    }

    return totals
        .filter((row): row is typeof row & { wilayaFr: string } =>
            Boolean(row.wilayaFr)
        )
        .map((row) => {
            const admittedCount = admittedMap.get(row.wilayaFr) ?? 0;
            return {
                nameFr: row.wilayaFr,
                nameAr: row.wilayaAr,
                totalCount: row._count,
                admittedCount,
                successRate: row._count > 0 ? (admittedCount / row._count) * 100 : 0,
            };
        })
        .sort((a, b) => b.totalCount - a.totalCount);
}

export default async function ResultsPage() {
    const [
        total,
        admitted,
        failed,
        institutionTotals,
        institutionAdmitted,
        wilayaTotals,
        wilayaAdmitted,
        topStudents,
    ] = await Promise.all([
        prisma.result.count(),
        prisma.result.count({ where: admittedFilter() }),
        prisma.result.count({
            where: { decision: { contains: "ajourn", mode: "insensitive" } },
        }),
        prisma.result.groupBy({
            by: ["etablissementFr", "etablissementAr"],
            where: { etablissementFr: { not: null } },
            _count: true,
            _max: { moyenne: true },
        }),
        prisma.result.groupBy({
            by: ["etablissementFr"],
            where: { etablissementFr: { not: null }, ...admittedFilter() },
            _count: true,
        }),
        prisma.result.groupBy({
            by: ["wilayaFr", "wilayaAr"],
            where: { wilayaFr: { not: null } },
            _count: true,
        }),
        prisma.result.groupBy({
            by: ["wilayaFr"],
            where: { wilayaFr: { not: null }, ...admittedFilter() },
            _count: true,
        }),
        prisma.result.findMany({
            where: { moyenne: { not: null }, serie: { not: null } },
            orderBy: { moyenne: "desc" },
            select: {
                numero: true,
                nomFr: true,
                nomAr: true,
                moyenne: true,
                serie: true,
                etablissementFr: true,
                etablissementAr: true,
                wilayaFr: true,
                wilayaAr: true,
            },
        }),
    ]);

    const stats: ResultStats = {
        total,
        admitted,
        failed,
        totalInstitutions: institutionTotals.length,
    };
    const institutions = toInstitutionStats(institutionTotals, institutionAdmitted);
    const wilayas = toWilayaStats(wilayaTotals, wilayaAdmitted);
    const serieLeaderboards = toSerieLeaderboards(topStudents);

    return (
        <div>
            <ResultsSearch />

            <div className="mx-auto w-full max-w-6xl space-y-12 px-4 pb-16 sm:px-6">
                <StatsCards stats={stats} />
                <TopInstitutions items={institutions} />
                <ResultsByWilaya items={wilayas} />
                <TopStudents groups={serieLeaderboards} />
            </div>
        </div>
    );
}
