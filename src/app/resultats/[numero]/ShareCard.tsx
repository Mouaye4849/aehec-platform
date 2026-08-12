"use client";

import { forwardRef } from "react";
import Image from "next/image";
import type { Result } from "@prisma/client";
import { localize, type Locale } from "@/lib/locale";

const TEXT = {
    fr: {
        brand: "AEHEC",
        tagline: "Association des Étudiants du Hodh Ech Chargui",
        successStatus: "Admis 🎉",
        encouragementStatus: "Résultat d'examen",
        moyenne: "Moyenne",
        serie: "Série",
    },
    en: {
        brand: "AEHEC",
        tagline: "Association of Students of Hodh Ech Chargui",
        successStatus: "Admitted 🎉",
        encouragementStatus: "Exam result",
        moyenne: "Average",
        serie: "Series",
    },
    ar: {
        brand: "رابطة طلاب الحوض الشرقي",
        tagline: "رابطة طلاب الحوض الشرقي",
        successStatus: "ناجح 🎉",
        encouragementStatus: "نتيجة الامتحان",
        moyenne: "المعدل",
        serie: "الشعبة",
    },
} as const;

// Purpose-built for screenshot/share (WhatsApp, Facebook): fixed 4:5 portrait
// canvas — the standard optimal ratio for both feed posts and story crops —
// rasterized via html-to-image, never rendered live in normal page flow.
export const ShareCard = forwardRef<
    HTMLDivElement,
    { result: Result; locale: Locale; isSuccess: boolean; message: string }
>(function ShareCard({ result, locale, isSuccess, message }, ref) {
    const t = TEXT[locale];
    const status = isSuccess ? t.successStatus : t.encouragementStatus;

    return (
        <div
            ref={ref}
            style={{ width: 1000, height: 1250 }}
            className={`relative flex flex-col items-center justify-between overflow-hidden p-14 ${
                isSuccess
                    ? "bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary"
                    : "bg-gradient-to-b from-brand-surface to-white"
            }`}
        >
            {/* Soft decorative glows for depth — brand colors only. */}
            <div
                className={`pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full blur-3xl ${
                    isSuccess ? "bg-brand-accent/25" : "bg-brand-primary/10"
                }`}
            />
            <div
                className={`pointer-events-none absolute -start-24 -bottom-24 h-80 w-80 rounded-full blur-3xl ${
                    isSuccess ? "bg-white/10" : "bg-brand-secondary/10"
                }`}
            />

            <div className="relative flex flex-col items-center gap-3">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                    <Image
                        src="/logo.png"
                        alt=""
                        width={52}
                        height={52}
                        className="h-[52px] w-[52px] object-contain"
                        priority
                    />
                </span>
                <p
                    className={`font-heading text-lg font-extrabold tracking-wide ${
                        isSuccess ? "text-white" : "text-brand-primary"
                    }`}
                >
                    {t.brand}
                </p>
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-center gap-8 text-center">
                <span
                    className={`rounded-full px-6 py-2 text-lg font-bold uppercase tracking-wide ${
                        isSuccess
                            ? "bg-white/15 text-brand-accent"
                            : "bg-brand-primary/10 text-brand-primary"
                    }`}
                >
                    {status}
                </span>

                {/* Student name — the card's primary focus. */}
                <p
                    className={`font-heading max-w-3xl text-6xl font-extrabold leading-tight ${
                        isSuccess ? "text-white" : "text-brand-primary"
                    }`}
                >
                    {localize(locale, result.nomFr, result.nomAr)}
                </p>

                {result.moyenne != null && (
                    <div className="flex flex-col items-center gap-3 rounded-[2.5rem] bg-white px-16 py-8 shadow-2xl">
                        <span className="font-heading text-8xl font-extrabold text-brand-primary">
                            {result.moyenne.toFixed(2)}
                            <span className="text-3xl font-semibold text-zinc-400">
                                /20
                            </span>
                        </span>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-brand-secondary">
                            {t.moyenne}
                        </span>
                    </div>
                )}

                {result.serie && (
                    <span
                        className={`rounded-full px-6 py-2 text-lg font-semibold ${
                            isSuccess
                                ? "bg-white/10 text-white/90"
                                : "bg-brand-secondary/10 text-brand-primary"
                        }`}
                    >
                        {t.serie}: {result.serie}
                    </span>
                )}
            </div>

            <div className="relative flex flex-col items-center gap-3">
                <div
                    className={`h-1 w-20 rounded-full ${
                        isSuccess ? "bg-brand-accent" : "bg-brand-primary/30"
                    }`}
                />
                <p
                    className={`max-w-lg text-center text-lg leading-relaxed ${
                        isSuccess ? "text-white/90" : "text-brand-primary/80"
                    }`}
                >
                    {message}
                </p>
                <p
                    className={`text-sm ${
                        isSuccess ? "text-white/60" : "text-zinc-500"
                    }`}
                >
                    {t.tagline}
                </p>
            </div>
        </div>
    );
});
