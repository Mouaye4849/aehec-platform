"use client";

import type { LucideIcon } from "lucide-react";
import { Award, Handshake, Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import { useLocale } from "@/lib/locale";

// "primary" = dark-green badge / gold ring+dot. "accent" = gold badge /
// dark-green ring+dot. Only these two brand colors (plus white/beige from
// the surrounding page) are used anywhere in this component. Excellence is
// the accent (gold) node — a medal color for a value about excellence —
// but it is the SAME size as the other two: the distinction is color only,
// never scale, so the row reads as three equal, connected values rather
// than one "hero" item with two smaller supporting ones.
type Tone = "primary" | "accent";

const TEXT = {
    fr: {
        eyebrow: "Nos valeurs",
        title: "Les valeurs qui nous guident",
        subtitle: "Trois piliers qui définissent l'esprit de la Rabita.",
        values: [
            {
                icon: Handshake,
                tone: "primary" as Tone,
                title: "Solidarité",
                description:
                    "Une entraide sincère entre tous les étudiants de la wilaya, sans distinction.",
            },
            {
                icon: Award,
                tone: "accent" as Tone,
                title: "Excellence",
                description:
                    "Une exigence constante dans nos actions et un accompagnement académique de qualité.",
            },
            {
                icon: Lightbulb,
                tone: "primary" as Tone,
                title: "Créativité",
                description:
                    "Des idées neuves et des initiatives audacieuses au service des étudiants.",
            },
        ],
    },
    en: {
        eyebrow: "Our values",
        title: "The values that guide us",
        subtitle: "Three pillars that define the spirit of the Rabita.",
        values: [
            {
                icon: Handshake,
                tone: "primary" as Tone,
                title: "Solidarity",
                description:
                    "Sincere mutual support among all students of the region, without distinction.",
            },
            {
                icon: Award,
                tone: "accent" as Tone,
                title: "Excellence",
                description:
                    "A constant commitment to quality in our actions and academic support.",
            },
            {
                icon: Lightbulb,
                tone: "primary" as Tone,
                title: "Creativity",
                description:
                    "Fresh ideas and bold initiatives in service of students.",
            },
        ],
    },
    ar: {
        eyebrow: "قيمنا",
        title: "القيم التي توجهنا",
        subtitle: "ثلاث ركائز تحدد روح الرابطة.",
        values: [
            {
                icon: Handshake,
                tone: "primary" as Tone,
                title: "تضامن",
                description: "تعاضد صادق بين جميع طلاب الولاية دون تمييز.",
            },
            {
                icon: Award,
                tone: "accent" as Tone,
                title: "تميز",
                description:
                    "الالتزام الدائم بالجودة في أعمالنا ومرافقة أكاديمية متميزة.",
            },
            {
                icon: Lightbulb,
                tone: "primary" as Tone,
                title: "إبداع",
                description: "أفكار جديدة ومبادرات جريئة في خدمة الطلاب.",
            },
        ],
    },
} as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const TONE_CLASSES: Record<
    Tone,
    { badge: string; ring: string; dot: string; glow: string }
> = {
    primary: {
        badge: "bg-brand-primary text-white",
        ring: "ring-brand-accent/50",
        dot: "bg-brand-accent",
        glow: "bg-brand-primary/35",
    },
    accent: {
        badge: "bg-brand-accent text-brand-primary",
        ring: "ring-brand-primary/30",
        dot: "bg-brand-primary",
        glow: "bg-brand-accent/45",
    },
};

export function OurValues() {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div>
            <div className="flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                    {t.eyebrow}
                </span>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-brand-primary sm:text-3xl">
                    {t.title}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
                    {t.subtitle}
                </p>
            </div>

            <div className="mt-7 sm:mt-12">
                {/* Icon band — one continuous line spans from the first
                icon's center to the last icon's center (16.67%–83.33% of
                the row, since each icon is centered inside an equal-width
                third of the row), with the icons layered on top of it via
                z-10. This is the actual "timeline" — a single connected
                element, not three cards with a short dash between each. */}
                <div className="relative flex flex-row items-center">
                    <motion.div
                        aria-hidden
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
                        style={{
                            transformOrigin: "center",
                            background:
                                "linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-accent) 50%, var(--brand-primary) 100%)",
                            boxShadow:
                                "0 0 1px 0 rgba(28,77,51,0.4), 0 0 14px 1px rgba(199,167,107,0.4)",
                        }}
                        className="absolute left-[16.6667%] right-[16.6667%] top-1/2 z-0 h-[2px] -translate-y-1/2 rounded-full opacity-90 sm:h-[3px]"
                    />
                    {t.values.map((value, index) => (
                        <IconNode key={value.title} value={value} index={index} />
                    ))}
                </div>

                {/* Label band — a separate row directly below, using the
                same equal-thirds columns so each label sits centered under
                its icon. */}
                <div className="mt-3 flex flex-row sm:mt-5">
                    {t.values.map((value) => (
                        <LabelNode key={value.title} value={value} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function IconNode({
    value,
    index,
}: {
    value: { icon: LucideIcon; tone: Tone; title: string };
    index: number;
}) {
    const Icon = value.icon;
    const tone = TONE_CLASSES[value.tone];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: index * 0.15 }}
            className="group relative z-10 flex flex-1 basis-0 items-center justify-center py-0.5 sm:py-1"
        >
            {/* Ambient glow — tinted to each node's own tone (green or
            gold), so together they read as a soft green/gold halo running
            along the timeline rather than a generic shadow. */}
            <span
                aria-hidden
                className={`absolute inset-0 m-auto h-14 w-14 scale-90 rounded-full opacity-40 blur-xl transition-all duration-300 group-hover:scale-125 group-hover:opacity-70 sm:h-28 sm:w-28 ${tone.glow}`}
            />
            <span
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-[0_4px_10px_-4px_rgba(28,77,51,0.30)] ring-2 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_16px_-6px_rgba(28,77,51,0.35)] sm:h-24 sm:w-24 sm:shadow-[0_10px_24px_-8px_rgba(28,77,51,0.45)] sm:ring-[6px] sm:group-hover:-translate-y-1.5 sm:group-hover:shadow-[0_18px_36px_-10px_rgba(28,77,51,0.55)] ${tone.badge} ${tone.ring}`}
            >
                <Icon
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
                    strokeWidth={1.6}
                />
            </span>
        </motion.div>
    );
}

function LabelNode({
    value,
}: {
    value: { tone: Tone; title: string; description: string };
}) {
    const tone = TONE_CLASSES[value.tone];

    return (
        <div className="flex flex-1 basis-0 flex-col items-center gap-1 px-0.5 text-center sm:gap-2 sm:px-2">
            <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${tone.dot}`} />
            <h3 className="font-heading text-[13px] font-bold tracking-tight text-brand-primary sm:text-xl sm:tracking-normal">
                {value.title}
            </h3>
            <p className="mx-auto hidden max-w-[190px] text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:block">
                {value.description}
            </p>
        </div>
    );
}
