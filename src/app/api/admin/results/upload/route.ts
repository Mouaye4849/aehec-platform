import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { Prisma } from "@prisma/client";
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
    numero: ["NUM_BAC", "Num_Bac", "NODOSS", "Numero"],

    nomFr: ["NOM_FR", "Nom_FR", "Nom"],

    nomAr: ["NOM_AR"],

    decision: ["DECISION", "Decision"],

    moyenne: ["MOY_BAC_SESSION", "Moy_Bac", "Moy Bac_Session", "Moyenne"],

    dateNaissance: ["DATN", "Date Naiss"],

    lieuNaissanceAr: ["LIEU_AR", "Lieun_AR", "LIEUNN_AR"],
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
    } catch (error) {
        console.error("[admin/results/upload] Excel parse error:", error);
        return NextResponse.json(
            { success: false, message: "Fichier Excel invalide ou illisible." },
            { status: 400 }
        );
    }

    console.log(`[admin/results/upload] Lignes lues dans le fichier: ${rows.length}`);

    const results = rows
        .map((row) => ({
            numero: str(pick(row, ALIASES.numero))?.trim() ?? "",

            nomFr: str(pick(row, ALIASES.nomFr))?.trim() ?? "",
            nomAr: str(pick(row, ALIASES.nomAr)),

            decision: str(pick(row, ALIASES.decision))?.trim() ?? "",

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

    console.log(`[admin/results/upload] Lignes valides (numero non vide): ${results.length}`);

    if (results.length === 0) {
        const total = await prisma.result.count();
        return NextResponse.json({
            success: true,
            imported: 0,
            skipped: 0,
            total,
            reason:
                rows.length === 0
                    ? "Le fichier Excel ne contient aucune ligne."
                    : "Aucune ligne valide : la colonne du numéro de dossier (numero) est introuvable ou vide sur toutes les lignes. Vérifiez les en-têtes de colonnes du fichier.",
        });
    }

    let imported = 0;

    try {
        if (replaceAll) {
            const deleted = await prisma.result.deleteMany({});
            console.log(`[admin/results/upload] Mode remplacement: ${deleted.count} ligne(s) supprimée(s).`);
        }

        for (let i = 0; i < results.length; i += CHUNK_SIZE) {
            const chunk = results.slice(i, i + CHUNK_SIZE);
            const inserted = await prisma.result.createMany({
                data: chunk,
                skipDuplicates: true,
            });
            imported += inserted.count;

            console.log(
                `[admin/results/upload] Lot ${i / CHUNK_SIZE + 1}: ${inserted.count}/${chunk.length} insérées (cumul: ${imported}/${results.length}).`
            );
        }
    } catch (error) {
        // Log the full Prisma error (code, meta, message) for real debugging,
        // not just a generic message to the client.
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(
                "[admin/results/upload] Prisma error:",
                error.code,
                error.message,
                error.meta
            );
        } else {
            console.error("[admin/results/upload] Import error:", error);
        }
        return NextResponse.json(
            {
                success: false,
                message: "Échec de l'import en base de données.",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }

    const skipped = results.length - imported;
    const total = await prisma.result.count();

    console.log(
        `[admin/results/upload] Terminé — importées: ${imported}, ignorées (doublons): ${skipped}, total en base: ${total}.`
    );

    return NextResponse.json({
        success: true,
        imported,
        skipped,
        total,
        ...(imported === 0
            ? {
                  reason:
                      "Aucune ligne insérée : tous les numéros de dossier de ce fichier existent déjà en base (skipDuplicates a tout ignoré).",
              }
            : {}),
    });
}
