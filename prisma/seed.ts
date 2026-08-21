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

    // Every title/description below is transcribed (and translated to French)
    // directly from the text printed on the poster/photo at imageUrl — nothing
    // here is invented. Where a poster shows no calendar date, `date` is left
    // null rather than guessing one; the showcase omits the date badge for
    // those entries instead of displaying a fabricated value. Presenter names
    // (Mohamed Lemine Adab, El Houssein Eddi Abye) match real ExecutiveMember
    // records seeded above.
    const activities: {
        id: number;
        type: "ACTIVITY" | "EVENT" | "INITIATIVE" | "WORKSHOP" | "ACHIEVEMENT" | "COMMUNITY_PROJECT";
        titleFr: string;
        titleAr: string;
        descriptionFr: string;
        descriptionAr: string;
        imageUrl: string;
        date: Date | null;
        order: number;
    }[] = [
        {
            id: 1,
            type: "WORKSHOP",
            titleFr: "Révision de physique-chimie pour le Bac Sciences D",
            titleAr: "مراجعة في الفيزياء والكيمياء لطلاب باكالوريا العلوم D",
            descriptionFr:
                "Séance de révision en physique-chimie organisée par la Rabita pour les élèves du Baccalauréat Sciences D, encadrée par l'ingénieur Mohamed Lemine Adab, membre de l'association, sur le groupe WhatsApp de la Rabita.",
            descriptionAr:
                "مراجعة في مادة الفيزياء والكيمياء نظمتها رابطة طلاب الحوض الشرقي لصالح طلاب باكالوريا العلوم D، بإشراف عضو الرابطة المهندس محمد الأمين آدب، على مجموعة الرابطة في واتساب.",
            imageUrl: "/activities/Rv1.jpeg",
            date: null,
            order: 1,
        },
        {
            id: 2,
            type: "WORKSHOP",
            titleFr: "Révision de mathématiques pour le Bac scientifique",
            titleAr: "حصة مراجعة في الرياضيات لطلاب الباكالوريا العلمية",
            descriptionFr:
                "Séance de révision en mathématiques encadrée par Aslam El Hadj Ahmed, membre du bureau exécutif de la Rabita, le samedi à 20h sur le groupe WhatsApp de l'association.",
            descriptionAr:
                "حصة مراجعة في مادة الرياضيات، يشرف عليها عضو المكتب التنفيذي للرابطة اسلم الحاج أحمد، يوم السبت عند الساعة الثامنة مساءً على مجموعة الرابطة في واتساب.",
            imageUrl: "/activities/Rv2.jpeg",
            date: null,
            order: 2,
        },
        {
            id: 3,
            type: "WORKSHOP",
            titleFr: "Correction d'exercices de Bac SN : génétique mendélienne",
            titleAr: "تصحيح تمارين بكالوريا شعبة SN: الوراثة المندلية",
            descriptionFr:
                "Correction d'exercices du Baccalauréat SN sur la génétique mendélienne, dans le cadre du 3e Rendez-vous étudiant de la Rabita, animée par Ahmed Mohamed Mohamed Ely le 10 février 2026 à 20h30 sur WhatsApp.",
            descriptionAr:
                "حصة تصحيح تمارين بكالوريا شعبة العلوم الطبيعية في محور الوراثة المندلية، ضمن الملتقى الطلابي 3 للرابطة، بإشراف أحمد محمد محمد إيلي، يوم 10 فبراير 2026 الساعة 20:30 عبر واتساب.",
            imageUrl: "/activities/Rv3.jpeg",
            date: new Date("2026-02-10T20:30:00"),
            order: 3,
        },
        {
            id: 4,
            type: "WORKSHOP",
            titleFr: "Révision de philosophie pour les filières littéraires",
            titleAr: "مراجعة في الفلسفة لشعبتي الآداب",
            descriptionFr:
                "Séance de révision en philosophie pour les élèves des filières littéraires, dans le cadre du 3e Rendez-vous étudiant de la Rabita, animée par El Houssein Eddi Abye le dimanche à 20h sur WhatsApp.",
            descriptionAr:
                "حصة مراجعة في مادة الفلسفة لفائدة طلاب شعبتي الآداب، ضمن الملتقى الطلابي 3 للرابطة، بإشراف الحسين الدي ابي، ليلة الأحد عند الساعة الثامنة مساءً عبر واتساب.",
            imageUrl: "/activities/Rv4.jpeg",
            date: null,
            order: 4,
        },
        {
            id: 5,
            type: "WORKSHOP",
            titleFr: "Révision générale de physique pour la filière Sciences",
            titleAr: "حصة مراجعة عامة في الفيزياء لشعبة العلوم",
            descriptionFr:
                "Séance de révision générale en physique pour les élèves du Baccalauréat filière Sciences, à 22h sur les groupes WhatsApp de la Rabita.",
            descriptionAr:
                "حصة مراجعة عامة في مادة الفيزياء لصالح طلاب الباكالوريا شعبة العلوم، الساعة العاشرة مساءً على المجموعات الواتسابية للرابطة.",
            imageUrl: "/activities/Rv5.jpeg",
            date: null,
            order: 5,
        },
        {
            id: 6,
            type: "WORKSHOP",
            titleFr: "Sciences naturelles pour le Bac D : l'appareil génital féminin",
            titleAr: "حصة في العلوم الطبيعية لطلاب Bac D: الجهاز التناسلي الأنثوي",
            descriptionFr:
                "Session de sciences naturelles pour les élèves du Bac D sur la reproduction et l'appareil génital féminin, animée par Ahmedou Ab, membre de l'association, le 27 novembre à 21h.",
            descriptionAr:
                "حصة في مادة العلوم الطبيعية لطلاب الباكالوريا شعبة Bac D حول محور التكاثر والجهاز التناسلي الأنثوي، بإشراف عضو الرابطة احمدو آب، يوم 27 نوفمبر على تمام الساعة التاسعة مساءً.",
            imageUrl: "/activities/Rv6.jpeg",
            date: new Date("2025-11-27T21:00:00"),
            order: 6,
        },
        {
            id: 7,
            type: "WORKSHOP",
            titleFr: "Sciences naturelles pour le Bac SN : génétique formelle",
            titleAr: "حصة في العلوم الطبيعية لطلاب Bac SN: الوراثة الصورية",
            descriptionFr:
                "Session de sciences naturelles pour les élèves du Bac SN sur la génétique formelle, animée par Sidi Ethmane Akah, membre de l'association, le 11 novembre à 21h.",
            descriptionAr:
                "حصة في مادة العلوم الطبيعية لطلاب الباكالوريا شعبة Bac SN حول محور الوراثة الصورية، بإشراف عضو الرابطة سيدي عثمان أكاه، يوم 11 نوفمبر على تمام الساعة التاسعة مساءً.",
            imageUrl: "/activities/Rv7.jpeg",
            date: new Date("2025-11-11T21:00:00"),
            order: 7,
        },
        {
            id: 8,
            type: "ACTIVITY",
            titleFr: "Vie de la Rabita : séance d'étude sur le terrain",
            titleAr: "حياة الرابطة: حصة دراسية ميدانية",
            descriptionFr:
                "Instantané d'une des séances de cours animées par les membres de la Rabita au bénéfice des élèves.",
            descriptionAr:
                "لقطة من إحدى الحصص الدراسية التي يقدمها أعضاء رابطة طلاب الحوض الشرقي لفائدة التلاميذ.",
            imageUrl: "/activities/Rv8.jpeg",
            date: null,
            order: 8,
        },
        {
            id: 9,
            type: "INITIATIVE",
            titleFr: "Communiqué : lancement des cours d'été à Néma",
            titleAr: "بيان: انطلاق الدروس الصيفية بالعاصمة النعمة",
            descriptionFr:
                "La Rabita a lancé ses cours d'été à Néma pour les élèves préparant les concours nationaux, avec plus de 130 élèves inscrits en filière Sciences, en plus de nombreux élèves des autres filières.",
            descriptionAr:
                "أطلقت رابطة طلاب الحوض الشرقي دروسها الصيفية بالعاصمة النعمة لفائدة التلاميذ المقبلين على المسابقات الوطنية، بتسجيل أكثر من 130 طالبا في شعبة العلوم إضافة إلى عدد من تلاميذ الشعب الأخرى.",
            imageUrl: "/activities/Pub1.jpeg",
            date: new Date("2026-08-18"),
            order: 9,
        },
    ];

    for (const activity of activities) {
        await prisma.activity.upsert({
            where: { id: activity.id },
            update: activity,
            create: activity,
        });
    }

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
