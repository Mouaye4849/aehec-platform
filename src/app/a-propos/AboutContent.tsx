"use client";

import { useLocale } from "@/lib/locale";

const TEXT = {
    fr: {
        title: "À propos de l'AEHEC",
        aboutTitle: "Qui sommes-nous",
        about:
            "L'Association des Étudiants du Hodh Ech Chargui (AEHEC) a été fondée au début de l'année 2022 par un groupe d'étudiants universitaires originaires de la wilaya du Hodh Ech Chargui. Rassemblés par la volonté de rendre à leur région ce qu'elle leur a donné, ils ont uni leurs efforts pour créer une association au service des étudiants de leur wilaya.",
        historyTitle: "Historique",
        history:
            "Le 30 juin 2022, l'association a tenu sa deuxième assemblée générale, au cours de laquelle ont été discutés les objectifs fondamentaux qui orientent son action : la lutte contre l'ignorance et l'analphabétisme, et le soutien aux élèves désireux d'apprendre. Depuis sa fondation, l'AEHEC appelle l'ensemble des étudiants de la wilaya, en particulier les nouveaux bacheliers, à la rejoindre afin d'unir les efforts au service d'une génération éduquée et consciente.",
        visionTitle: "Notre vision",
        vision:
            "Une société du Hodh Ech Chargui libérée des chaînes de l'ignorance, portée par une génération éduquée, cultivée et consciente, capable de contribuer au développement de sa région et de réduire durablement le chômage qui la touche.",
        missionTitle: "Notre mission",
        missions: [
            "Combattre l'ignorance et l'analphabétisme.",
            "Tendre la main aux élèves désireux d'apprendre et les accompagner.",
            "Mobiliser les étudiants de la wilaya, en particulier les titulaires du Baccalauréat, autour d'un objectif commun.",
            "Unir les efforts et les initiatives pour construire une génération éduquée, cultivée et consciente.",
            "Contribuer à la réduction de l'ignorance et du chômage parmi les jeunes de la région.",
            "Mettre en œuvre tous les moyens nécessaires pour atteindre ces objectifs.",
        ],
    },
    en: {
        title: "About AEHEC",
        aboutTitle: "Who we are",
        about:
            "The Association of Students of Hodh Ech Chargui (AEHEC) was founded at the beginning of 2022 by a group of university students originally from the Hodh Ech Chargui region. United by the desire to give back to their region, they combined their efforts to create an association serving the students of their region.",
        historyTitle: "History",
        history:
            "On June 30, 2022, the association held its second general assembly, during which it discussed the fundamental objectives guiding its action: fighting ignorance and illiteracy, and supporting students eager to learn. Since its founding, AEHEC has called on all students of the region, particularly new Baccalauréat graduates, to join in order to unite efforts in service of an educated and conscious generation.",
        visionTitle: "Our vision",
        vision:
            "A Hodh Ech Chargui society freed from the chains of ignorance, driven by an educated, cultured, and conscious generation, capable of contributing to the development of its region and durably reducing the unemployment affecting it.",
        missionTitle: "Our mission",
        missions: [
            "Fight ignorance and illiteracy.",
            "Reach out to students eager to learn and support them.",
            "Mobilize the region's students, particularly Baccalauréat holders, around a common goal.",
            "Unite efforts and initiatives to build an educated, cultured, and conscious generation.",
            "Contribute to reducing ignorance and unemployment among the region's youth.",
            "Implement all means necessary to achieve these objectives.",
        ],
    },
    ar: {
        title: "من نحن - رابطة طلاب الحوض الشرقي",
        aboutTitle: "من نحن",
        about:
            "تأسست رابطة طلاب الحوض الشرقي مطلع عام 2022 على يد نخبة من الطلاب الجامعيين الذين درسوا وترعرعوا بولاية الحوض الشرقي، اجتمعوا ووحّدوا جهودهم ليردّوا الجميل لوطنهم.",
        historyTitle: "تاريخ الرابطة",
        history:
            "بتاريخ 2022-06-30 عقدت الرابطة اجتماعها العام الثاني، الذي تمت خلاله مناقشة الأهداف الأساسية التي تقوم عليها الرابطة: محاربة الجهل، وتقديم يد العون للتلاميذ الراغبين في التعلّم. ومنذ تأسيسها، تدعو الرابطة جميع طلاب الولاية، وخاصة الحاصلين منهم على شهادة الباكالوريا، إلى الانتساب إليها لتكثيف الجهود وتوحيد المساعي.",
        visionTitle: "رؤيتنا",
        vision:
            "مجتمع في الحوض الشرقي متحرر من أغلال الجهل، يقوده جيل متعلم ومثقف وواعٍ، قادر على المساهمة في تنمية منطقته والحد من البطالة التي تعاني منها.",
        missionTitle: "مهمتنا",
        missions: [
            "محاربة الجهل ومحو الأمية.",
            "تقديم يد العون للتلاميذ الراغبين بالتعلم ومرافقتهم.",
            "تعبئة طلاب الولاية، وخاصة حاملي شهادة الباكالوريا، حول هدف مشترك.",
            "توحيد الجهود والمساعي لبناء جيل متعلم ومثقف وواعٍ.",
            "المساهمة في الحد من الجهل والبطالة في صفوف شباب المنطقة.",
            "اتخاذ كافة التدابير اللازمة لتحقيق هذه الأهداف.",
        ],
    },
} as const;

export function AboutContent() {
    const { locale } = useLocale();
    const t = TEXT[locale];

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
            <h1 className="font-heading text-3xl font-bold text-brand-primary">
                {t.title}
            </h1>

            <section className="mt-10">
                <h2 className="font-heading text-xl font-semibold text-brand-primary">
                    {t.aboutTitle}
                </h2>
                <p className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {t.about}
                </p>
            </section>

            <section className="mt-10">
                <h2 className="font-heading text-xl font-semibold text-brand-primary">
                    {t.historyTitle}
                </h2>
                <p className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {t.history}
                </p>
            </section>

            <section className="mt-10">
                <h2 className="font-heading text-xl font-semibold text-brand-primary">
                    {t.visionTitle}
                </h2>
                <p className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {t.vision}
                </p>
            </section>

            <section className="mt-10">
                <h2 className="font-heading text-xl font-semibold text-brand-primary">
                    {t.missionTitle}
                </h2>
                <ul className="mt-3 list-inside list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
                    {t.missions.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
