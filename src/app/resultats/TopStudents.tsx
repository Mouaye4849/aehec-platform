"use client";

import Link from "next/link";
import { localize, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Meilleurs Bacheliers",
        lead: "Le trio de tête de chaque série, classé par moyenne.",
        serie: "Série",
        empty: "Aucune donnée disponible pour le moment.",
    },
    en: {
        title: "Top Baccalauréat Students",
        lead: "The top three of each series, ranked by average.",
        serie: "Series",
        empty: "No data available yet.",
    },
    ar: {
        title: "أوائل البكالوريا",
        lead: "الثلاثة الأوائل في كل شعبة، مرتبين حسب المعدل.",
        serie: "الشعبة",
        empty: "لا توجد بيانات متاحة حاليًا.",
    },
} as const;

const MEDALS = ["🥇", "🥈", "🥉"];

export type LeaderboardStudent = {
    numero: string;
    nomFr: string;
    nomAr: string | null;
    moyenne: number;
    serie: string;
    etablissementFr: string | null;
    etablissementAr: string | null;
    wilayaFr: string | null;
    wilayaAr: string | null;
};

export type SerieLeaderboard = {
    serie: string;
    students: LeaderboardStudent[];
};

export function TopStudents({ groups }: { groups: SerieLeaderboard[] }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <section>
            <h2 className="font-heading text-xl font-bold text-brand-primary sm:text-2xl">
                {t.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t.lead}
            </p>

            {groups.length === 0 ? (
                <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
                    {t.empty}
                </p>
            ) : (
                <div className="mt-6 flex flex-col gap-6 sm:gap-8">
                    {groups.map((group) => (
                        <div key={group.serie}>
                            <h3 className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary sm:px-4 sm:text-sm">
                                {t.serie} {group.serie}
                            </h3>

                            <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-4">
                                {group.students.map((student, index) => (
                                    <StudentCard
                                        key={student.numero}
                                        student={student}
                                        rank={index}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function StudentCard({
    student,
    rank,
}: {
    student: LeaderboardStudent;
    rank: number;
}) {
    const { locale } = useLocale();
    const isFirst = rank === 0;

    return (
        <Link
            href={`/resultats/${encodeURIComponent(student.numero)}`}
            className={`flex flex-col gap-2.5 rounded-2xl border bg-white p-4 text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-black sm:gap-3 sm:p-5 ${
                isFirst
                    ? "border-brand-accent/60 ring-1 ring-brand-accent/40"
                    : "border-black/10 dark:border-white/10"
            }`}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-2xl leading-none sm:text-3xl">
                    {MEDALS[rank]}
                </span>
                <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-bold text-brand-primary sm:px-3 sm:text-sm">
                    {student.moyenne.toFixed(2)}
                    <span className="font-normal text-brand-primary/60">/20</span>
                </span>
            </div>

            <p className="line-clamp-2 text-sm font-semibold leading-snug text-brand-primary sm:text-base">
                {localize(locale, student.nomFr, student.nomAr ?? undefined)}
            </p>

            <div className="text-xs leading-snug text-zinc-500">
                <p className="truncate">
                    {student.etablissementFr
                        ? localize(
                              locale,
                              student.etablissementFr,
                              student.etablissementAr ?? undefined
                          )
                        : "—"}
                </p>
                {student.wilayaFr && (
                    <p className="mt-0.5 truncate">
                        {localize(locale, student.wilayaFr, student.wilayaAr ?? undefined)}
                    </p>
                )}
            </div>
        </Link>
    );
}
