import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const executiveMembers = [
    {
        id: 1,
        nomFr: "Eddi Cheikhna Ethaleb",
        nomAr: "الدي شيخن الطالب",
        posteFr: "Président",
        posteAr: "الرئيس",
        photoUrl: "/president.jpg",
        ordre: 1,
    },
    {
        id: 2,
        nomFr: "Isselmou Saadna El Hadj Ahmed",
        nomAr: "اسلم سعدن الحاج أحمد",
        posteFr: "Premier Vice-Président",
        posteAr: "نائب أول",
        photoUrl: "/vice-president-1.jpg",
        ordre: 2,
    },
    {
        id: 3,
        nomFr: "Soukeina Mohamed Mohamed Sidi",
        nomAr: "سكينة محمد محمد سيدي",
        posteFr: "Deuxième Vice-Présidente",
        posteAr: "نائب ثاني",
        photoUrl: "/vice-president-2.jpg",
        ordre: 3,
    },
    {
        id: 4,
        nomFr: "Mohamed Lemine Adab",
        nomAr: "محمد لامين آدب",
        posteFr: "Président du Conseil Étudiant",
        posteAr: "رئيس المجلس الطلابي",
        photoUrl: "/MLA.jpg",
        ordre: 4,
    },
    {
        id: 5,
        nomFr: "Mohamed Seghair Cheikh Battar",
        nomAr: "محمدالصغير الشيخ بتار",
        posteFr: "Responsable des Relations Extérieures",
        posteAr: "مسؤول العلاقات الخارجية",
        photoUrl: "/MSCB.jpg",
        ordre: 5,
    },
    {
        id: 6,
        nomFr: "Aminetou Mohamed El Amine Eddah",
        nomAr: "آمنة محمد الامين الداه",
        posteFr: "Responsable des Projets et Initiatives",
        posteAr: "مسؤولة المشاريع والمبادرات",
        photoUrl: "/AMAE.jpg",
        ordre: 6,
    },
    {
        id: 7,
        nomFr: "Lehbib Mohamed Lehbib",
        nomAr: "لحبيب محمد لحبيب",
        posteFr: "Responsable Communication et Médias",
        posteAr: "مسؤول الإعلام والتواصل",
        photoUrl: "/LML.jpg",
        ordre: 7,
    },
    {
        id: 8,
        nomFr: "El Houssein Eddi Abye",
        nomAr: "الحسين الدي ابي",
        posteFr: "Coordinateur Général des Cours",
        posteAr: "المنسق العام للدروس",
        photoUrl: "/CGC.jpg",
        ordre: 8,
    },
    {
        id: 9,
        nomFr: "Sidaty Ahmed Seghair",
        nomAr: "سيداتي أحمد الصغير",
        posteFr: "Responsable des Adhésions",
        posteAr: "مسؤول الانتساب",
        photoUrl: "/RDA.jpg",
        ordre: 9,
    },
    {
        id: 10,
        nomFr: "Amaali Mohamed Abdallah Abderrahmane",
        nomAr: "اماغل محمد عبد الله عبد الرحمن",
        posteFr: "Responsable Culture et Activités",
        posteAr: "مسؤول الثقافة والأنشطة",
        photoUrl: "/RCA.jpg",
        ordre: 10,
    },
    {
        id: 11,
        nomFr: "Ahmedou Mohamed Yahya",
        nomAr: "أحمدو محمد يحي",
        posteFr: "Responsable du Bénévolat",
        posteAr: "مسؤول العمل التطوعي",
        photoUrl: "/RDB.jpg",
        ordre: 11,
    },
    {
        id: 12,
        nomFr: "Khadijetou Mohamed Taghioullah",
        nomAr: "اخديجتن محمد تقي الله",
        posteFr: "Responsable des Finances",
        photoUrl: "/RDF.jpg",
        posteAr: "مسؤولة المالية",
        ordre: 12,
    },
    {
        id: 13,
        nomFr: "Ajoud Ould Nasser",
        nomAr: "أجود ابن ناصر",
        posteFr: "Responsable Formation et Développement",
        posteAr: "مسؤول التكوين والتطوير",
        photoUrl: "/RFD.jpg",
        ordre: 13,
    },
    {
        id: 14,
        nomFr: "Fatimetou Ettayeb Mini",
        nomAr: "فاطمة الطيب ميني",
        posteFr: "Responsable de l'Organisation",
        posteAr: "مسؤولة التنظيم",
        ordre: 14,
    },
];

async function main() {
    for (const member of executiveMembers) {
        await prisma.executiveMember.upsert({
            where: { id: member.id },
            update: member,
            create: member,
        });
    }

    await prisma.news.upsert({
        where: { slug: "assemblee-generale-2026" },
        update: {},
        create: {
            slug: "assemblee-generale-2026",
            titleFr: "Assemblée générale annuelle de l'AEHEC",
            titleAr: "الجمعية العامة السنوية لأيحك",
            excerptFr:
                "L'AEHEC a tenu son assemblée générale annuelle pour dresser le bilan de l'année et élire le nouveau comité.",
            excerptAr:
                "عقدت جمعية أيحك جمعيتها العامة السنوية لتقييم حصيلة السنة وانتخاب المكتب الجديد.",
            contentFr:
                "L'Association des Étudiants du Hodh Ech Chargui a organisé son assemblée générale annuelle, réunissant des dizaines d'étudiants membres. Cette rencontre a permis de dresser le bilan des activités de l'année écoulée et de définir les priorités pour la prochaine.",
            contentAr:
                "نظمت جمعية طلاب الحوض الشرقي جمعيتها العامة السنوية التي جمعت العشرات من الطلاب الأعضاء. سمح هذا اللقاء بتقييم حصيلة أنشطة السنة المنقضية وتحديد أولويات السنة القادمة.",
        },
    });
    await prisma.news.upsert({
        where: { slug: "campagne-soutien-scolaire" },
        update: {},
        create: {
            slug: "campagne-soutien-scolaire",
            titleFr: "Lancement d'une campagne de soutien scolaire",
            titleAr: "انطلاق حملة للدعم المدرسي",
            excerptFr:
                "Une nouvelle campagne de soutien scolaire est lancée pour accompagner les étudiants en difficulté.",
            excerptAr: "انطلقت حملة جديدة للدعم المدرسي لمرافقة الطلاب الذين يواجهون صعوبات.",
            contentFr:
                "Dans le cadre de sa mission d'accompagnement, l'AEHEC lance une campagne de soutien scolaire destinée aux étudiants en difficulté, avec des séances de tutorat organisées par des étudiants avancés.",
            contentAr:
                "في إطار مهمتها في المرافقة، أطلقت جمعية أيحك حملة للدعم المدرسي موجهة للطلاب الذين يواجهون صعوبات، من خلال حصص دعم ينظمها طلاب متقدمون.",
        },
    });

    await prisma.scholarship.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            titleFr: "Bourse d'excellence académique",
            titleAr: "منحة التفوق الأكاديمي",
            descriptionFr:
                "Bourse destinée aux étudiants originaires du Hodh Ech Chargui ayant obtenu d'excellents résultats académiques.",
            descriptionAr: "منحة موجهة لطلاب الحوض الشرقي الحاصلين على نتائج أكاديمية ممتازة.",
            deadline: new Date("2026-10-31"),
            link: "https://example.org/bourse-excellence",
            active: true,
        },
    });

    await prisma.resource.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            titleFr: "Guide d'inscription universitaire",
            titleAr: "دليل التسجيل الجامعي",
            descriptionFr:
                "Un guide pratique pour accompagner les nouveaux étudiants dans leurs démarches d'inscription.",
            descriptionAr: "دليل عملي لمرافقة الطلاب الجدد في إجراءات التسجيل.",
            category: "Démarches administratives",
            link: "https://example.org/guide-inscription",
        },
    });

    await prisma.motivationalMessage.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            messageFr:
                "La réussite est la somme de petits efforts répétés jour après jour. Bonne continuation !",
            messageAr: "النجاح هو مجموع مجهودات صغيرة تتكرر يوما بعد يوم. بالتوفيق!",
            active: true,
        },
    });

    console.log("Seed terminé.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
