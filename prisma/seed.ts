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
        nomFr: "Khadeijtne Mohamed Taghioullah",
        nomAr: "اخديجتن محمد تقي الله",
        posteFr: "Responsable des Finances",
        photoUrl: "/RDF.jpg",
        posteAr: "مسؤولة المالية",
        ordre: 12,
    },
    {
        id: 13,
        nomFr: "Ajouad Ould Nasser",
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

    await prisma.news.upsert({
        where: { slug: "revision-ete-2026" },
        update: {},
        create: {
            slug: "revision-ete-2026",
            titleFr: "Lancement de la révision estivale 2026",
            titleAr: "انطلاق المراجعة الصيفية 2026",
            categoryFr: "Annonce",
            categoryAr: "إعلان",
            excerptFr:
                "L'Association des Étudiants du Hodh Ech Chargui annonce le lancement de la révision estivale pour les élèves du Baccalauréat, encadrée par des enseignants distingués et couvrant l'ensemble des filières.",
            excerptAr:
                "تعلن رابطة طلاب الحوض الشرقي عن انطلاق المراجعة الصيفية لفائدة طلاب البكالوريا بإشراف أساتذة متميزين ومراجعة شاملة لمختلف الشعب.",
            contentFr:
                "L'Association des Étudiants du Hodh Ech Chargui annonce le lancement de sa révision estivale ce mercredi, une initiative que l'association organise chaque année pour accompagner les étudiants du Hodh Ech Chargui et les aider à bien se préparer afin d'obtenir les meilleurs résultats à l'examen du Baccalauréat.\n\n📚 La révision couvre l'ensemble des filières du Baccalauréat, à travers une révision complète et des cours intensifs et organisés, encadrés par des enseignants distingués.\n\n🎯 Pour bénéficier de cette révision et en savoir plus, veuillez nous contacter au numéro :\n📞 42223329\n\nAssociation des Étudiants du Hodh Ech Chargui\nSolidarité · Excellence · Créativité",
            contentAr:
                "تعلن رابطة طلاب الحوض الشرقي عن انطلاق المراجعة الصيفية يوم الأربعاء، وهي المراجعة التي دأبت الرابطة على تنظيمها لصالح طلاب الحوض الشرقي، حرصًا منها على دعمهم ومساعدتهم على الاستعداد الجيد وتحقيق أفضل النتائج في امتحان البكالوريا.\n📚 وتشمل المراجعة مختلف شعب البكالوريا، من خلال مراجعة شاملة ودروس مكثفة ومنظمة، بإشراف أساتذة متميزين.\n🎯 للاستفادة من هذه المراجعة ومعرفة تفاصيلها، يرجى التواصل على الرقم:\n📞 42223329\nرابطة طلاب الحوض الشرقي\nتضامن • تميز • إبداع",
            imageUrl: "/news/revision-ete-2026.jpg",
            featured: true,
            publishedAt: new Date("2026-08-18"),
        },
    });

    await prisma.motivationalMessage.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            messageFr:
                "La réussite est la somme de petits efforts répétés jour après jour. Bonne continuation !",
            messageAr: "امن جدّ وجد ومن سار على الدرب وصل.",
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
