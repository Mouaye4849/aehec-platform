"use client";

import type { ExecutiveMember } from "@prisma/client";
import { localize, useLocale, type Locale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Comité exécutif",
        empty: "Les membres du comité seront bientôt annoncés.",
        tierBureau: "Bureau exécutif",
        tierHeads: "Responsables de pôles",
    },
    en: {
        title: "Executive Committee",
        empty: "Committee members will be announced soon.",
        tierBureau: "Executive Bureau",
        tierHeads: "Department Heads",
    },
    ar: {
        title: "المكتب التنفيذي",
        empty: "سيتم الإعلان قريبًا عن أعضاء المكتب.",
        tierBureau: "المكتب التنفيذي",
        tierHeads: "مسؤولو الأقسام",
    },
} as const;

export function CommitteeList({ members }: { members: ExecutiveMember[] }) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    // Mirrors the committee's own visual hierarchy: the president, then the
    // bureau (deputies + council/relations/projects/media heads), then the
    // remaining department heads — grouped by position in the ordre-sorted
    // list, matching how the association's own org chart is laid out.
    const president = members[0];
    const bureau = members.slice(1, 7);
    const heads = members.slice(7);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
            <h1 className="font-heading text-3xl font-bold text-brand-primary">
                {t.title}
            </h1>

            {members.length === 0 ? (
                <p className="mt-6 text-zinc-600 dark:text-zinc-400">{t.empty}</p>
            ) : (
                <div className="mt-10 flex flex-col items-center gap-12">
                    <MemberCard member={president} locale={locale} featured />

                    {bureau.length > 0 && (
                        <section className="w-full">
                            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-brand-secondary">
                                {t.tierBureau}
                            </h2>
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {bureau.map((member) => (
                                    <MemberCard
                                        key={member.id}
                                        member={member}
                                        locale={locale}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {heads.length > 0 && (
                        <section className="w-full">
                            <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-brand-secondary">
                                {t.tierHeads}
                            </h2>
                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {heads.map((member) => (
                                    <MemberCard
                                        key={member.id}
                                        member={member}
                                        locale={locale}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function MemberCard({
    member,
    locale,
    featured = false,
}: {
    member: ExecutiveMember;
    locale: Locale;
    featured?: boolean;
}) {
    return (
        <div
            className={`overflow-hidden rounded-3xl bg-brand-surface text-center shadow-lg
  ${featured
                    ? "w-full max-w-[320px] sm:max-w-md border-brand-accent/50 ring-2 ring-brand-accent/30"
                    : "flex h-full flex-col border border-black/10"
                }`}
        >
            {/* Medium portrait photo area — sized and cropped to stay the
                card's visual focus without dominating it, upper body kept
                in frame via a balanced portrait aspect ratio. The featured
                (President) card uses a shorter, ~35%-less-tall ratio than
                regular cards so it doesn't dominate the page height. */}
            <div
                className={`relative w-full overflow-hidden bg-brand-primary/5 dark:bg-white/5 ${featured
                    ? "h-[240px] sm:h-[280px]"
                    : "h-[180px] sm:h-[220px]"
                    }`}
            >
                {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={member.photoUrl}
                        alt={localize(locale, member.nomFr, member.nomAr)}
                        className="h-full w-full object-contain object-center"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center p-8">
                        <PlaceholderAvatar />
                    </div>
                )}
            </div>

            <div
                className={
                    featured
                        ? "p-5 sm:p-6"
                        : "flex flex-1 flex-col justify-center p-5"
                }
            >
                <h2
                    className={`font-semibold text-brand-primary ${featured ? "text-xl" : ""
                        }`}
                >
                    {localize(locale, member.nomFr, member.nomAr)}
                </h2>
                <p
                    className={`text-brand-secondary ${featured ? "text-sm font-semibold" : "text-sm"
                        }`}
                >
                    {localize(locale, member.posteFr, member.posteAr)}
                </p>

            </div>
        </div>
    );
}

function PlaceholderAvatar() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-16 w-16 text-brand-primary/20"
        >
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
        </svg>
    );
}
