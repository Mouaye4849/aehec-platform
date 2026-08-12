import "dotenv/config";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const workbook = XLSX.readFile("data/results.xlsx");

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    console.log("Feuille:", sheetName);
    console.log("Nombre de lignes Excel:", rows.length);
    console.log("Première ligne:", rows[0]);

    const results = rows
        .map((row) => ({
            numero: String(row["Num_Bac"] ?? "").trim(),

            nomFr: String(row["Nom_FR"] ?? "").trim(),
            nomAr: row["NOM_AR"] ?? null,

            decision: String(row["Decision"] ?? "").trim(),

            moyenne:
                row["Moy_Bac"] !== undefined &&
                    row["Moy_Bac"] !== null &&
                    row["Moy_Bac"] !== ""
                    ? Number(row["Moy_Bac"])
                    : null,

            serie: row["SERIE"] ?? null,

            dateNaissance: row["Date Naiss"]
                ? String(row["Date Naiss"])
                : null,

            lieuNaissanceFr: row["Lieun_FR"] ?? null,
            lieuNaissanceAr: row["Lieun_AR"] ?? null,

            wilayaFr: row["Wilaya_FR"] ?? null,
            wilayaAr: row["Wilaya_AR"] ?? null,

            centreExamenFr: row["Centre Examen  FR"] ?? null,
            centreExamenAr: row["Centre Examen  AR"] ?? null,

            etablissementFr: row["Etablissement_FR"] ?? null,
            etablissementAr: row["Etablissement_AR"] ?? null,
        }))
        .filter((r) => r.numero !== "");

    console.log("Nombre de résultats valides:", results.length);

    if (results.length === 0) {
        console.log("Aucun résultat valide à importer.");
        return;
    }

    const before = await prisma.result.count();
    console.log("Avant import:", before);

    const chunkSize = 1000;

    for (let i = 0; i < results.length; i += chunkSize) {
        const chunk = results.slice(i, i + chunkSize);

        const inserted = await prisma.result.createMany({
            data: chunk,
            skipDuplicates: true,
        });

        console.log(
            `Imported ${i + chunk.length}/${results.length} (${inserted.count} rows)`
        );
    }

    const after = await prisma.result.count();
    console.log("Après import:", after);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });