"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { MotivationalMessage } from "@prisma/client";
import { localize, useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "Résultats du baccalauréat 2026 (session de rattrapage)",
        lead: "Entrez votre numéro de candidat pour consulter votre résultat.",
        leadEtablissement:
            "Entrez le nom de votre établissement pour consulter les résultats.",
        leadNom: "Entrez votre nom pour rechercher votre résultat.",
        placeholder: "Numéro de candidat",
        placeholderEtablissement: "Nom de l'établissement",
        placeholderNom: "Nom et prénom",
        submit: "Rechercher",
        modeNumero: "Numéro",
        modeEtablissement: "Établissement",
        modeNom: "Nom",
    },
    en: {
        title: "2026 Baccalaureate Results (Supplementary Session)",
        lead: "Enter your candidate number to check your result.",
        leadEtablissement: "Enter your institution name to check its results.",
        leadNom: "Enter your name to search for your result.",
        placeholder: "Candidate number",
        placeholderEtablissement: "Institution name",
        placeholderNom: "Full name",
        submit: "Search",
        modeNumero: "Number",
        modeEtablissement: "Institution",
        modeNom: "Name",
    },
    ar: {
        title: "نتائج الباكالوريا 2026 ( الدورة التكميلية)",
        lead: "ابحث برقم الترشح للاطلاع على نتيجتك.",
        leadEtablissement: "أدخل اسم مؤسستك للاطلاع على نتائجها.",
        leadNom: "أدخل اسمك للبحث عن نتيجتك.",
        placeholder: "رقم المترشح",
        placeholderEtablissement: "اسم المؤسسة",
        placeholderNom: "الاسم الكامل",
        submit: "بحث",
        modeNumero: "الرقم",
        modeEtablissement: "المؤسسة",
        modeNom: "الاسم",
    },
} as const;

type Mode = "numero" | "etablissement" | "nom";

const ROUTE_PREFIX: Record<Exclude<Mode, "numero">, string> = {
    etablissement: "/resultats/etablissement",
    nom: "/resultats/nom",
};

export function ResultsSearch() {
    const { locale } = useLocale();
    const t = TEXT[locale];
    const router = useRouter();

    const [mode, setMode] = useState<Mode>("numero");
    const [query, setQuery] = useState("");
    const [message, setMessage] = useState<MotivationalMessage | null>(null);

    useEffect(() => {
        fetch("/api/motivational-message")
            .then((res) => res.json())
            .then(setMessage)
            .catch(() => setMessage(null));
    }, []);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        if (mode === "numero") {
            router.push(`/resultats/${encodeURIComponent(trimmed)}`);
        } else {
            router.push(`${ROUTE_PREFIX[mode]}/${encodeURIComponent(trimmed)}`);
        }
    }

    const lead =
        mode === "numero" ? t.lead : mode === "etablissement" ? t.leadEtablissement : t.leadNom;
    const placeholder =
        mode === "numero"
            ? t.placeholder
            : mode === "etablissement"
                ? t.placeholderEtablissement
                : t.placeholderNom;

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
            <h1 className="font-heading text-3xl font-bold text-brand-primary">
                {t.title}
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">{lead}</p>

            {message && (
                <p className="mt-6 rounded-lg bg-brand-surface p-4 text-sm italic text-brand-secondary">
                    {localize(locale, message.messageFr, message.messageAr)}
                </p>
            )}

            <div
                dir="ltr"
                className="mt-8 grid w-full grid-cols-3 gap-0.5 rounded-full border border-brand-primary/25 bg-white p-0.5 dark:bg-black/20 sm:inline-grid sm:w-auto"
            >
                {(
                    [
                        ["numero", t.modeNumero],
                        ["etablissement", t.modeEtablissement],
                        ["nom", t.modeNom],
                    ] as const
                ).map(([value, label]) => {
                    const active = value === mode;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => {
                                setMode(value);
                                setQuery("");
                            }}
                            aria-pressed={active}
                            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors sm:px-4 ${active
                                ? "bg-brand-primary text-white"
                                : "text-brand-primary/60 hover:text-brand-primary"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full flex-1 rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-brand-primary dark:border-white/20"
                />
                <button
                    type="submit"
                    className="w-full shrink-0 rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
                >
                    {t.submit}
                </button>
            </form>
        </div>
    );
}
