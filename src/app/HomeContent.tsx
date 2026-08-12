"use client";

import Link from "next/link";
import type { ExecutiveMember } from "@prisma/client";
import { useLocale } from "@/lib/locale";
import {
    AnnouncementsCarousel,
    type Announcement,
} from "@/components/AnnouncementsCarousel";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { cn } from "@/lib/utils";
import { HomeStats } from "@/app/HomeStats";
import { CommitteePreview } from "@/app/CommitteePreview";

function CommitteeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c0-3.31 2.69-6 6-6s6 2.69 6 6M16 8.5c1.1 0 2-.9 2-2s-.9-2-2-2M14.5 20c0-2.6-1.7-4.8-4.05-5.58M18 14c2.21 0 4 1.79 4 4v2"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ResourcesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M6 4.5C6 3.67 6.67 3 7.5 3H15l4 4v13.5c0 .83-.67 1.5-1.5 1.5h-10c-.83 0-1.5-.67-1.5-1.5v-16Z"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <path
                d="M9 12h6M9 16h6"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
            />
        </svg>
    );
}

function ResultsIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M4 20V10M12 20V4M20 20v-6"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const EXPLORE_ICONS: Record<string, React.ElementType> = {
    "/resultats": ResultsIcon,
    "/comite": CommitteeIcon,
    "/ressources": ResourcesIcon,
};

const TEXT = {
    fr: {
        eyebrow: "Association des Étudiants du Hodh Ech Chargui",
        titlePrefix: "Ensemble pour la ",
        titleHighlight: "réussite",
        titleSuffix: " des étudiants du Hodh Ech Chargui",
        lead: "Une association étudiante qui accompagne les enfants du Hodh Ech Chargui dans leur parcours académique, leur ouvre des opportunités, les oriente et cultive un esprit de solidarité et d'excellence.",
        ctaResults: "Résultats des examens",
        ctaAbout: "Découvrir la Rabita",
        ctaAnnouncements: "Voir les annonces ↓",
        announcementsTitle: "Annonces et activités",
        announcementsLead:
            "Suivez les dernières actualités et initiatives de l'association.",
        announcementsPrev: "Précédent",
        announcementsNext: "Suivant",
        announcements: [
            {
                tone: "accent",
                badge: "Avis important",
                title: "Ouverture des adhésions",
                excerpt:
                    "Nous invitons tous les étudiants du Hodh Ech Chargui souhaitant nous rejoindre à contacter la Rabita via ses canaux officiels.",
            },
            {
                tone: "primary",
                badge: "Activité",
                title: "Assemblée générale annuelle",
                excerpt:
                    "Une rencontre périodique réunissant les membres pour dresser le bilan des actions et définir les priorités à venir.",
            },
            {
                tone: "secondary",
                badge: "Soutien académique",
                title: "Campagne de soutien scolaire",
                excerpt:
                    "Une initiative pour accompagner les élèves motivés à travers des séances de tutorat et un suivi personnalisé.",
            },
            {
                tone: "accent",
                badge: "Annonce",
                title: "Résultats du Baccalauréat disponibles",
                excerpt:
                    "Consultez dès maintenant votre résultat directement sur la plateforme de l'association.",
            },
        ] as Announcement[],
        missionTitle: "Notre mission",
        missionText:
            "Nous œuvrons pour accompagner les étudiants dans leur parcours académique, combattre l'ignorance et bâtir une génération éduquée, cultivée et consciente, capable de contribuer au développement de sa région.",
        missionLink: "En savoir plus sur notre vision ←",
        exploreTitle: "Explorer",
        exploreSubtitle: "Accédez rapidement aux services et espaces clés de la Rabita.",
        exploreCta: "En savoir plus",
        exploreLinks: [
            {
                href: "/resultats",
                label: "Résultats d'examens",
                description: "Consultez votre résultat du Baccalauréat en toute simplicité.",
            },
            {
                href: "/comite",
                label: "Comité exécutif",
                description: "Découvrez les membres qui portent les projets de la Rabita.",
            },
            {
                href: "/ressources",
                label: "Ressources",
                description: "Documents utiles et accompagnement pour les étudiants.",
            },
        ],
    },
    en: {
        eyebrow: "Association of Students of Hodh Ech Chargui",
        titlePrefix: "Together for the ",
        titleHighlight: "success",
        titleSuffix: " of Hodh Ech Chargui students",
        lead: "A student association supporting the children of Hodh Ech Chargui throughout their academic journey, opening opportunities, providing guidance, and cultivating a spirit of solidarity and excellence.",
        ctaResults: "Exam results",
        ctaAbout: "Discover the Rabita",
        ctaAnnouncements: "See announcements ↓",
        announcementsTitle: "Announcements & Activities",
        announcementsLead:
            "Follow the association's latest news and initiatives.",
        announcementsPrev: "Previous",
        announcementsNext: "Next",
        announcements: [
            {
                tone: "accent",
                badge: "Important notice",
                title: "Membership now open",
                excerpt:
                    "We invite all students of Hodh Ech Chargui who wish to join us to contact the Rabita through its official channels.",
            },
            {
                tone: "primary",
                badge: "Activity",
                title: "Annual general assembly",
                excerpt:
                    "A periodic meeting bringing members together to review achievements and set priorities for the period ahead.",
            },
            {
                tone: "secondary",
                badge: "Academic support",
                title: "School support campaign",
                excerpt:
                    "An initiative to support motivated students through tutoring sessions and personalized follow-up.",
            },
            {
                tone: "accent",
                badge: "Announcement",
                title: "Baccalauréat results available",
                excerpt:
                    "Check your result now directly on the association's platform.",
            },
        ] as Announcement[],
        missionTitle: "Our mission",
        missionText:
            "We work to support students throughout their academic journey, fight ignorance, and build an educated, cultured, and conscious generation capable of contributing to the development of its region.",
        missionLink: "Learn more about our vision ←",
        exploreTitle: "Explore",
        exploreSubtitle: "Quick access to the Rabita's key services and spaces.",
        exploreCta: "Learn more",
        exploreLinks: [
            {
                href: "/resultats",
                label: "Exam results",
                description: "Check your Baccalauréat result with ease.",
            },
            {
                href: "/comite",
                label: "Executive committee",
                description: "Meet the members who drive the Rabita's projects.",
            },
            {
                href: "/ressources",
                label: "Resources",
                description: "Useful documents and support for students.",
            },
        ],
    },
    ar: {
        eyebrow: "رابطة طلاب الحوض الشرقي",
        titlePrefix: "معًا من أجل ",
        titleHighlight: "نجاح",
        titleSuffix: " طلاب الحوض الشرقي",
        lead: "رابطة طلابية ترافق أبناء الحوض الشرقي في مسيرتهم الأكاديمية، وتفتح أمامهم آفاق الفرص والتوجيه، وترسخ روح التضامن والتميز داخل مجتمع طلابي واحد.",
        ctaResults: "نتائج الامتحانات",
        ctaAbout: "تعرف على الرابطة",
        ctaAnnouncements: "شاهد الإعلانات ↓",
        announcementsTitle: "الإعلانات والأنشطة",
        announcementsLead: "تابعوا آخر مستجدات الرابطة ومبادراتها.",
        announcementsPrev: "السابق",
        announcementsNext: "التالي",
        announcements: [
            {
                tone: "accent",
                badge: "إعلان هام",
                title: "فتح باب الانتساب للرابطة",
                excerpt:
                    "ندعو جميع طلاب الحوض الشرقي الراغبين في الانضمام إلينا إلى التواصل معنا عبر القنوات الرسمية للرابطة.",
            },
            {
                tone: "primary",
                badge: "نشاط",
                title: "الجمعية العامة السنوية",
                excerpt:
                    "لقاء دوري يجمع أعضاء الرابطة لتقييم الإنجازات وتحديد أولويات المرحلة القادمة.",
            },
            {
                tone: "secondary",
                badge: "دعم أكاديمي",
                title: "حملة الدعم المدرسي",
                excerpt:
                    "مبادرة لمرافقة التلاميذ الراغبين في التفوق عبر حصص دعم ومتابعة شخصية.",
            },
            {
                tone: "accent",
                badge: "إعلان",
                title: "نتائج البكالوريا متاحة الآن",
                excerpt: "بإمكانكم الاطلاع على نتيجتكم مباشرة عبر منصة الرابطة.",
            },
        ] as Announcement[],
        missionTitle: "رسالتنا",
        missionText:
            "نسعى في رابطة طلاب الحوض الشرقي إلى مرافقة الطلاب في مسيرتهم الأكاديمية، ومحاربة الجهل، وبناء جيل متعلم ومثقف وواعٍ قادر على المساهمة في تنمية منطقته ووطنه.",
        missionLink: "اقرأ المزيد عن رؤيتنا ←",
        exploreTitle: "استكشف",
        exploreSubtitle: "الوصول السريع إلى أهم خدمات ومساحات الرابطة.",
        exploreCta: "المزيد",
        exploreLinks: [
            {
                href: "/resultats",
                label: "نتائج الامتحانات",
                description: "اطلعوا على نتيجة البكالوريا بكل سهولة.",
            },
            {
                href: "/comite",
                label: "المكتب التنفيذي",
                description: "تعرفوا على الأعضاء الذين يقودون مشاريع الرابطة.",
            },
            {
                href: "/ressources",
                label: "الموارد",
                description: "وثائق ومصادر مفيدة لمرافقة الطلاب.",
            },
        ],
    },
} as const;

export function HomeContent({
    committeePreview,
}: {
    committeePreview: ExecutiveMember[];
}) {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div className="flex flex-1 flex-col">
            <section
                className="relative overflow-hidden"
                style={{
                    background:
                        "radial-gradient(ellipse 120% 80% at 14% -10%, #ffffff 0%, #f7f4ec 60%)",
                }}
            >
                {/* Asymmetric green/gold glows, blended (not stacked) with a fade-to-cream
                    wash in one composited background — different sizes and corners so
                    they read as organic light sources rather than mirrored stickers. */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(620px 380px at 88% 10%, rgba(28,77,51,0.24), transparent 70%), radial-gradient(560px 340px at 8% 90%, rgba(199,167,107,0.22), transparent 72%), linear-gradient(180deg, rgba(247,244,236,0) 0%, rgba(247,244,236,0.55) 100%)",
                    }}
                />

                {/* Dot Pattern texture, masked so it's concentrated behind the headline
                    and fades toward the section edges instead of a flat uniform grid. */}
                <DotPattern
                    width={26}
                    height={26}
                    cr={1.6}
                    className="text-brand-primary/25"
                    style={{
                        maskImage:
                            "radial-gradient(circle at 50% 35%, black 0%, black 35%, transparent 80%)",
                        WebkitMaskImage:
                            "radial-gradient(circle at 50% 35%, black 0%, black 35%, transparent 80%)",
                    }}
                />

                <BlurFade inView inViewMargin="-80px" direction="up" offset={16}>
                    <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 sm:py-20">
                        <p className="text-sm font-semibold uppercase tracking-wide text-brand-secondary">
                            {t.eyebrow}
                        </p>
                        <h1 className="font-heading max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-brand-primary sm:text-5xl lg:text-6xl">
                            {t.titlePrefix}
                            <AnimatedGradientText
                                colorFrom="var(--brand-accent)"
                                colorTo="var(--brand-primary)"
                                speed={0.6}
                                className="font-extrabold"
                            >
                                {t.titleHighlight}
                            </AnimatedGradientText>
                            {t.titleSuffix}
                        </h1>
                        <p className="max-w-xl text-lg text-brand-primary/80">
                            {t.lead}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="relative overflow-hidden rounded-full">
                                <Link
                                    href="/resultats"
                                    className="relative block rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-primary transition-opacity hover:opacity-90"
                                >
                                    {t.ctaResults}
                                </Link>
                                <BorderBeam
                                    size={50}
                                    duration={8}
                                    colorFrom="var(--brand-accent)"
                                    colorTo="var(--brand-primary)"
                                />
                            </div>
                            <Link
                                href="/a-propos"
                                className="rounded-full border border-brand-primary/30 px-6 py-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5"
                            >
                                {t.ctaAbout}
                            </Link>
                            <a
                                href="#announcements"
                                className="text-sm font-semibold text-brand-primary/70 hover:text-brand-primary hover:underline"
                            >
                                {t.ctaAnnouncements}
                            </a>
                        </div>
                    </div>
                </BlurFade>
            </section>

            <section id="announcements" className="relative overflow-hidden">
                <DotPattern
                    width={26}
                    height={26}
                    cr={1.6}
                    className="text-brand-primary/25"
                />
                <BlurFade inView inViewMargin="-80px" direction="up" offset={16}>
                    <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
                        <h2 className="font-heading text-2xl font-bold text-brand-primary">
                            {t.announcementsTitle}
                        </h2>
                        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                            {t.announcementsLead}
                        </p>
                        <div className="mt-6">
                            <AnnouncementsCarousel
                                items={t.announcements}
                                prevLabel={t.announcementsPrev}
                                nextLabel={t.announcementsNext}
                            />
                        </div>
                    </div>
                </BlurFade>
            </section>

            <section className="bg-brand-surface">
                <BlurFade inView inViewMargin="-80px" direction="up" offset={16}>
                    <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 sm:py-16">
                        <h2 className="font-heading text-2xl font-bold text-brand-primary">
                            {t.missionTitle}
                        </h2>
                        <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {t.missionText}
                        </p>
                        <Link
                            href="/a-propos"
                            className="mt-4 inline-block text-sm font-semibold text-brand-secondary hover:underline"
                        >
                            {t.missionLink}
                        </Link>
                    </div>
                </BlurFade>
            </section>

            <section className="relative overflow-hidden">
                <DotPattern
                    width={26}
                    height={26}
                    cr={1.6}
                    className="text-brand-primary/25"
                />
                <BlurFade inView inViewMargin="-80px" direction="up" offset={16}>
                    <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
                        <HomeStats />
                    </div>
                </BlurFade>
            </section>

            <section className="bg-brand-surface">
                <BlurFade inView inViewMargin="-80px" direction="up" offset={16}>
                    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="font-heading text-3xl font-bold text-brand-primary">
                                {t.exploreTitle}
                            </h2>
                            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                                {t.exploreSubtitle}
                            </p>
                        </div>
                        <BentoGrid className="mt-12 grid-cols-1 auto-rows-[11rem] gap-4 md:grid-cols-3">
                            {t.exploreLinks.map((link, index) => {
                                const Icon = EXPLORE_ICONS[link.href];
                                return (
                                    <BentoCard
                                        key={link.href}
                                        name={link.label}
                                        description={link.description}
                                        href={link.href}
                                        cta={t.exploreCta}
                                        Icon={Icon}
                                        className={cn(
                                            "col-span-1",
                                            index === 0 && "md:row-span-2"
                                        )}
                                        background={
                                            <div
                                                className={cn(
                                                    "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl",
                                                    index === 0
                                                        ? "bg-brand-accent/20"
                                                        : "bg-brand-secondary/15"
                                                )}
                                            />
                                        }
                                    />
                                );
                            })}
                        </BentoGrid>
                    </div>
                </BlurFade>
            </section>

            <section className="relative overflow-hidden">
                <BlurFade inView inViewMargin="-80px" direction="up" offset={16}>
                    <CommitteePreview members={committeePreview} />
                </BlurFade>
            </section>
        </div>
    );
}
