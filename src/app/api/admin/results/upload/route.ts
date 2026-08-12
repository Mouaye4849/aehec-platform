import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

const CHUNK_SIZE = 1000;

// Same column mapping as scripts/import-results.ts, kept in sync by hand.
function str(value: unknown): string | null {
    if (value === undefined || value === null || value === "") return null;
    return String(value);
}

function num(value: unknown): number | null {
    if (value === undefined || value === null || value === "") return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
}

// Some columns appear under different names depending on which export
// produced the workbook. Each list is tried in order; the first alias
// present on the row wins.
const ALIASES = {
    numero: ["Num_Bac", "NODOSS", "Numero"],
    nomFr: ["Nom_FR", "NOM_FR", "Nom"],
    nomAr: ["NOM_AR"],
    moyenne: ["Moy_Bac", "Moy Bac_Session", "Moyenne"],
    dateNaissance: ["Date Naiss", "DATN"],
    lieuNaissanceAr: ["Lieun_AR", "LIEUNN_AR"],
} as const;

function pick(row: Record<string, unknown>, keys: readonly string[]): unknown {
    for (const key of keys) {
        const value = row[key];
        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }
    return undefined;
}

export async function POST(request: Request) {
    const formData = await request.formData();

    const password = formData.get("password");
    if (
        !process.env.ADMIN_PASSWORD ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return NextResponse.json(
            { success: false, message: "Mot de passe invalide." },
            { status: 401 }
        );
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json(
            { success: false, message: "Aucun fichier fourni." },
            { status: 400 }
        );
    }

    const replaceAll = formData.get("mode") === "replace";

    let rows: Record<string, unknown>[];
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
    } catch {
        return NextResponse.json(
            { success: false, message: "Fichier Excel invalide ou illisible." },
            { status: 400 }
        );
    }

    const results = rows
        .map((row) => ({
            numero: str(pick(row, ALIASES.numero))?.trim() ?? "",

            nomFr: str(pick(row, ALIASES.nomFr))?.trim() ?? "",
            nomAr: str(pick(row, ALIASES.nomAr)),

            decision: str(row["Decision"])?.trim() ?? "",

            moyenne: num(pick(row, ALIASES.moyenne)),

            serie: str(row["SERIE"]),

            dateNaissance: str(pick(row, ALIASES.dateNaissance)),

            lieuNaissanceFr: str(row["Lieun_FR"]),
            lieuNaissanceAr: str(pick(row, ALIASES.lieuNaissanceAr)),

            wilayaFr: str(row["Wilaya_FR"]),
            wilayaAr: str(row["Wilaya_AR"]),

            centreExamenFr: str(row["Centre Examen  FR"]),
            centreExamenAr: str(row["Centre Examen  AR"]),

            etablissementFr: str(row["Etablissement_FR"]),
            etablissementAr: str(row["Etablissement_AR"]),
        }))
        .filter((r) => r.numero !== "");


    let imported = 0;

    try {
        if (replaceAll) {
            await prisma.result.deleteMany({});
        }

        for (let i = 0; i < results.length; i += CHUNK_SIZE) {
            const chunk = results.slice(i, i + CHUNK_SIZE);
            const inserted = await prisma.result.createMany({
                data: chunk,
                skipDuplicates: true,
            });
            imported += inserted.count;

            const after = await prisma.result.count();
            console.log("After:", after);
            console.log("Imported:", imported);
        }
    } catch {
        return NextResponse.json(
            { success: false, message: "Échec de l'import en base de données." },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true, imported });
}
