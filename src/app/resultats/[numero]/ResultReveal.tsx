"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import type { Result } from "@prisma/client";
import { localize, useLocale } from "@/lib/locale";
import { Confetti } from "@/components/magicui/confetti";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { ShareCard } from "@/app/resultats/[numero]/ShareCard";

const CONFETTI_START_DELAY_MS = 500; // let the card's own entrance animation settle first
const CONFETTI_RUN_DURATION_MS = 4000; // stays within the requested 3-5s window

const CONFETTI_COLORS = ["#1c4d33", "#c7a76b", "#ffffff", "#6fa37a"];

// Real device detection, not feature detection — desktop browsers
// increasingly implement navigator.share() too, but we only want the
// native share sheet on mobile; desktop always copies the link instead.
function isMobileDevice(): boolean {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

const TEXT = {
    fr: {
        fields: {
            decision: "Décision",
            moyenne: "Moyenne",
            serie: "Série",
        },
        success: {
            headline: "Félicitations 🎉",
            message:
                "L'Association des Étudiants du Hodh Ech Chargui vous adresse ses plus sincères félicitations pour votre réussite et vous souhaite un avenir académique et professionnel brillant.",
        },
        encouragement: {
            headline: "Merci pour votre engagement",
            message:
                "Ce résultat n'est qu'une étape. L'AEHEC croit en votre potentiel et vous encourage à persévérer : la réussite se construit avec du travail et de la détermination. Nous restons à vos côtés pour la suite de votre parcours.",
        },
        back: "← Rechercher un autre numéro",
        congrats: "🎉 Félicitations",
        share: "Partager le résultat",
        backAction: "Retour",
        shareSuccess: "Résultat partagé !",
        copySuccess: "Lien copié dans le presse-papiers",
        totalCandidates: "Candidats",
        totalSuccessful: "Admis",
        successRate: "Taux de réussite",
        school: "Établissement",
        wilaya: "Wilaya",
        download: "Télécharger l'image",
        downloading: "Préparation…",
    },
    en: {
        fields: {
            decision: "Decision",
            moyenne: "Average",
            serie: "Series",
        },
        success: {
            headline: "Congratulations 🎉",
            message:
                "The Association of Students of Hodh Ech Chargui extends its warmest congratulations on your success and wishes you a bright academic and professional future.",
        },
        encouragement: {
            headline: "Thank you for your dedication",
            message:
                "This result is only one step. AEHEC believes in your potential and encourages you to persevere: success is built through work and determination. We remain by your side for the rest of your journey.",
        },
        back: "← Search another number",
        congrats: "🎉 Congratulations",
        share: "Share Result",
        backAction: "Back",
        shareSuccess: "Result shared!",
        copySuccess: "Link copied to clipboard",
        totalCandidates: "Candidates",
        totalSuccessful: "Successful",
        successRate: "Success rate",
        school: "School",
        wilaya: "Wilaya",
        download: "Download Image",
        downloading: "Preparing…",
    },
    ar: {
        fields: {
            decision: "القرار",
            moyenne: "المعدل",
            serie: "الشعبة",
        },
        success: {
            headline: "مبروك النجاح 🎉",
            message:
                "تتقدم رابطة طلاب الحوض الشرقي بأحر التهاني والتبريكات بمناسبة نجاحكم، ونتمنى لكم مزيداً من التألق والنجاح في مسيرتكم الأكاديمية والمهنية.",
        },
        encouragement: {
            headline: "شكرًا لجهودكم",
            message:
                "هذه النتيجة ليست سوى محطة في مسيرتكم. تؤمن رابطة طلاب الحوض الشرقي بقدراتكم وتشجعكم على المثابرة، فالنجاح يُبنى بالعمل والإصرار. نحن معكم في مواصلة مسيرتكم العلمية.",
        },
        back: "← البحث عن رقم آخر",
        congrats: "🎉 مبروك",
        share: "مشاركة النتيجة",
        backAction: "رجوع",
        shareSuccess: "تمت مشاركة النتيجة!",
        copySuccess: "تم نسخ الرابط إلى الحافظة",
        totalCandidates: "المترشحون",
        totalSuccessful: "الناجحون",
        successRate: "نسبة النجاح",
        school: "المؤسسة",
        wilaya: "الولاية",
        download: "تحميل الصورة",
        downloading: "جارٍ التحضير…",
    },
} as const;

export function ResultReveal({
    result,
    totalCandidates,
    totalSuccessful,
}: {
    result: Result;
    totalCandidates: number;
    totalSuccessful: number;
}) {
    const { locale } = useLocale();
    const router = useRouter();
    const t = TEXT[locale];
    const f = t.fields;
    const isSuccess = /admis/i.test(result.decision);
    const copy = isSuccess ? t.success : t.encouragement;

    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiNonce, setConfettiNonce] = useState(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shareCardRef = useRef<HTMLDivElement>(null);

    const successRate =
        totalCandidates > 0
            ? Math.round((totalSuccessful / totalCandidates) * 100)
            : 0;

    // Fires (or re-fires) the confetti burst for CONFETTI_RUN_DURATION_MS.
    // Bumping the nonce forces a fresh Confetti instance each time, so
    // repeated clicks always replay the burst instead of being a no-op.
    const fireConfetti = useCallback(() => {
        setConfettiNonce((n) => n + 1);
        setShowConfetti(true);
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        stopTimerRef.current = setTimeout(() => {
            setShowConfetti(false);
        }, CONFETTI_RUN_DURATION_MS);
    }, []);

    useEffect(() => {
        return () => {
            if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        };
    }, []);

    // Auto-fire once per result per browser session — not on a page
    // revisit/back navigation to a result already celebrated, only for a
    // genuinely new one.
    useEffect(() => {
        if (!isSuccess) return;

        const storageKey = `aehec-confetti-shown-${result.id}`;
        if (window.sessionStorage.getItem(storageKey)) return;

        const startTimer = setTimeout(() => {
            window.sessionStorage.setItem(storageKey, "1");
            fireConfetti();
        }, CONFETTI_START_DELAY_MS);

        return () => clearTimeout(startTimer);
    }, [isSuccess, result.id, fireConfetti]);

    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => setToastMessage(null), 2800);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    async function handleShare() {
        const url = window.location.href;
        const shareText = `${copy.headline} — ${localize(locale, result.nomFr, result.nomAr)}`;

        try {
            if (isMobileDevice() && navigator.share) {
                await navigator.share({ title: t.share, text: shareText, url });
                setToastMessage(t.shareSuccess);
            } else {
                await navigator.clipboard.writeText(url);
                setToastMessage(t.copySuccess);
            }
        } catch (error) {
            if ((error as Error)?.name !== "AbortError") {
                try {
                    await navigator.clipboard.writeText(url);
                    setToastMessage(t.copySuccess);
                } catch {
                    // Clipboard unavailable too — silently give up rather
                    // than show a jarring error for a non-critical action.
                }
            }
        }
    }

    async function handleDownload() {
        if (!shareCardRef.current || isDownloading) return;
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(shareCardRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            });
            const link = document.createElement("a");
            link.download = `aehec-resultat-${result.numero}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Result image download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div
            className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 ${
                isSuccess
                    ? "bg-gradient-to-br from-brand-primary to-brand-secondary"
                    : "bg-gradient-to-b from-brand-surface to-white dark:to-black"
            }`}
        >
            {isSuccess && (
                <>
                    <GridPattern
                        width={36}
                        height={36}
                        className="fill-white/[0.03] stroke-white/[0.06]"
                    />
                    <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-accent/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
                </>
            )}

            {isSuccess && showConfetti && (
                <Confetti
                    key={`${result.id}-${confettiNonce}`}
                    className="pointer-events-none fixed inset-0 z-50 h-full w-full"
                    options={{
                        particleCount: 120,
                        spread: 90,
                        origin: { y: 0.3 },
                        colors: CONFETTI_COLORS,
                        ticks: 240,
                    }}
                />
            )}

            <div className="relative flex w-full max-w-2xl flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
                    <Image
                        src="/logo.png"
                        alt=""
                        width={34}
                        height={34}
                        className="h-[34px] w-[34px] object-contain"
                    />
                </span>

                <span
                    className={`mt-6 flex h-24 w-24 animate-[scale-in_0.5s_ease-out_both] items-center justify-center rounded-full shadow-lg sm:h-28 sm:w-28 ${
                        isSuccess
                            ? "bg-gradient-to-br from-brand-accent to-brand-secondary"
                            : "bg-brand-primary"
                    }`}
                >
                    {isSuccess ? <CheckIcon /> : <BookIcon />}
                </span>

                <h1
                    className={`font-heading mt-6 animate-[fade-in-up_0.5s_ease-out_both] text-3xl font-extrabold sm:text-4xl ${
                        isSuccess ? "text-white" : "text-brand-primary"
                    }`}
                    style={{ animationDelay: "120ms" }}
                >
                    {copy.headline}
                </h1>
                <p
                    className={`font-heading mt-2 animate-[fade-in-up_0.5s_ease-out_both] text-xl sm:text-2xl ${
                        isSuccess ? "text-white/95" : "text-brand-primary"
                    }`}
                    style={{ animationDelay: "200ms" }}
                >
                    {localize(locale, result.nomFr, result.nomAr)}
                </p>

                <div
                    className="mt-8 flex animate-[fade-in-up_0.5s_ease-out_both] flex-col items-center"
                    style={{ animationDelay: "280ms" }}
                >
                    <div className="rounded-full bg-white/90 p-3 shadow-md dark:bg-black/30">
                        <AnimatedCircularProgressBar
                            value={
                                result.moyenne != null
                                    ? Math.max(
                                          0,
                                          Math.min(100, (result.moyenne / 20) * 100)
                                      )
                                    : 0
                            }
                            gaugePrimaryColor={
                                isSuccess
                                    ? "var(--brand-accent)"
                                    : "var(--brand-secondary)"
                            }
                            gaugeSecondaryColor="rgba(28, 77, 51, 0.12)"
                            className="size-32"
                            label={
                                <span className="flex flex-col items-center">
                                    <span className="font-heading text-2xl font-extrabold text-brand-primary">
                                        {result.moyenne != null
                                            ? result.moyenne.toFixed(2)
                                            : "—"}
                                    </span>
                                    <span className="text-xs font-normal text-zinc-500">
                                        /20
                                    </span>
                                </span>
                            }
                        />
                    </div>
                    <p
                        className={`mt-2 text-xs font-medium uppercase tracking-wide ${
                            isSuccess ? "text-white/80" : "text-zinc-500"
                        }`}
                    >
                        {f.moyenne}
                    </p>
                </div>

                <dl
                    className="mt-10 grid w-full max-w-md animate-[fade-in-up_0.5s_ease-out_both] grid-cols-2 gap-4 rounded-2xl bg-white/95 p-6 text-start shadow-md dark:bg-black/40 sm:grid-cols-3"
                    style={{ animationDelay: "360ms" }}
                >
                    <ResultField label={f.decision} value={result.decision} />
                    <ResultField label={f.serie} value={result.serie} />
                    <ResultField
                        label={t.school}
                        value={localize(
                            locale,
                            result.etablissementFr ?? "",
                            result.etablissementAr
                        )}
                    />
                    <ResultField
                        label={t.wilaya}
                        value={localize(
                            locale,
                            result.wilayaFr ?? "",
                            result.wilayaAr
                        )}
                    />
                </dl>

                {totalCandidates > 0 && (
                    <div
                        className="mt-6 grid w-full max-w-md animate-[fade-in-up_0.5s_ease-out_both] grid-cols-3 gap-3"
                        style={{ animationDelay: "400ms" }}
                    >
                        <StatCell
                            value={totalCandidates}
                            label={t.totalCandidates}
                            isSuccess={isSuccess}
                        />
                        <StatCell
                            value={totalSuccessful}
                            label={t.totalSuccessful}
                            isSuccess={isSuccess}
                        />
                        <StatCell
                            value={`${successRate}%`}
                            label={t.successRate}
                            isSuccess={isSuccess}
                        />
                    </div>
                )}

                <div
                    className={`mt-8 animate-[fade-in-up_0.5s_ease-out_both] rounded-xl p-5 text-sm leading-relaxed sm:text-base ${
                        isSuccess
                            ? "bg-white/15 text-white"
                            : "bg-brand-surface text-brand-primary dark:bg-white/5"
                    }`}
                    style={{ animationDelay: "440ms" }}
                >
                    {copy.message}
                </div>

                <div
                    className="mt-8 flex w-full max-w-md animate-[fade-in-up_0.5s_ease-out_both] flex-wrap items-center justify-center gap-3"
                    style={{ animationDelay: "520ms" }}
                >
                    {isSuccess && (
                        <button
                            type="button"
                            onClick={fireConfetti}
                            className="rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-primary transition-transform hover:opacity-90 active:scale-95"
                        >
                            {t.congrats}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleShare}
                        className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-transform active:scale-95 ${
                            isSuccess
                                ? "border-white/40 text-white hover:bg-white/10"
                                : "border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5"
                        }`}
                    >
                        {t.share}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-transform active:scale-95 ${
                            isSuccess
                                ? "text-white/80 hover:text-white"
                                : "text-brand-primary/70 hover:text-brand-primary"
                        }`}
                    >
                        {t.backAction}
                    </button>
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-transform active:scale-95 disabled:opacity-60 ${
                            isSuccess
                                ? "border-white/40 text-white hover:bg-white/10"
                                : "border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5"
                        }`}
                    >
                        {isDownloading ? t.downloading : t.download}
                    </button>
                </div>

                <Link
                    href="/resultats"
                    className={`mt-6 text-sm font-semibold hover:underline ${
                        isSuccess ? "text-white" : "text-brand-secondary"
                    }`}
                >
                    {t.back}
                </Link>
            </div>

            {/* Off-screen, purpose-built card rasterized to PNG on download —
                kept out of normal flow visually but still laid out (not
                display:none) so html-to-image can capture it. */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed left-0 top-0 -z-50 opacity-0"
            >
                <ShareCard
                    ref={shareCardRef}
                    result={result}
                    locale={locale}
                    isSuccess={isSuccess}
                    message={copy.message}
                />
            </div>

            {toastMessage && (
                <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
                    <div className="animate-[fade-in-up_0.3s_ease-out_both] rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                        {toastMessage}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCell({
    value,
    label,
    isSuccess,
}: {
    value: string | number;
    label: string;
    isSuccess: boolean;
}) {
    return (
        <div
            className={`rounded-xl p-3 text-center ${
                isSuccess ? "bg-white/10" : "bg-white/80 shadow-sm dark:bg-black/20"
            }`}
        >
            <p
                className={`font-heading text-lg font-extrabold ${
                    isSuccess ? "text-white" : "text-brand-primary"
                }`}
            >
                {value}
            </p>
            <p
                className={`mt-0.5 text-[11px] uppercase tracking-wide ${
                    isSuccess ? "text-white/70" : "text-zinc-500"
                }`}
            >
                {label}
            </p>
        </div>
    );
}

function ResultField({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    if (!value) return null;
    return (
        <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">
                {label}
            </dt>
            <dd className="mt-0.5 font-semibold text-zinc-800 dark:text-zinc-200">
                {value}
            </dd>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-11 w-11 text-white">
            <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-white">
            <path
                d="M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.83-.67-1.5-1.5-1.5H13v16h5.5c.83 0 1.5-.67 1.5-1.5v-13Z"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
        </svg>
    );
}
