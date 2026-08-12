"use client";

import type { Resource } from "@prisma/client";
import { localize, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Ressources d'accompagnement",
        empty: "Aucune ressource disponible pour le moment.",
        uncategorized: "Général",
        link: "Consulter →",
    },
    en: {
        title: "Support Resources",
        empty: "No resources available at the moment.",
        uncategorized: "General",
        link: "View →",
    },
    ar: {
        title: "موارد الدعم",
        empty: "لا توجد موارد متاحة حاليًا.",
        uncategorized: "عام",
        link: "الاطلاع ←",
    },
} as const;

export function ResourcesList({ resources }: { resources: Resource[] }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    const groups = new Map<string, Resource[]>();
    for (const resource of resources) {
        const key = resource.category ?? t.uncategorized;
        const group = groups.get(key) ?? [];
        group.push(resource);
        groups.set(key, group);
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
            <h1 className="font-heading text-3xl font-bold text-brand-primary">
                {t.title}
            </h1>

            {resources.length === 0 ? (
                <p className="mt-6 text-zinc-600 dark:text-zinc-400">{t.empty}</p>
            ) : (
                <div className="mt-8 flex flex-col gap-10">
                    {Array.from(groups.entries()).map(([category, items]) => (
                        <section key={category}>
                            <h2 className="text-lg font-semibold text-brand-secondary">
                                {category}
                            </h2>
                            <div className="mt-4 flex flex-col gap-4">
                                {items.map((item) => (
                                    <article
                                        key={item.id}
                                        className="rounded-xl border border-black/10 bg-brand-surface p-5 dark:border-white/10"
                                    >
                                        <h3 className="font-semibold text-brand-primary">
                                            {localize(locale, item.titleFr, item.titleAr)}
                                        </h3>
                                        {(item.descriptionFr || item.descriptionAr) && (
                                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                {localize(
                                                    locale,
                                                    item.descriptionFr ?? "",
                                                    item.descriptionAr
                                                )}
                                            </p>
                                        )}
                                        {(item.link || item.fileUrl) && (
                                            <a
                                                href={item.link ?? item.fileUrl ?? "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-block text-sm font-semibold text-brand-secondary hover:underline"
                                            >
                                                {t.link}
                                            </a>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
