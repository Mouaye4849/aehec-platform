"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";
type Mode = "normal" | "replace";

const MODES: { value: Mode; label: string; description: string }[] = [
    {
        value: "normal",
        label: "Import normal",
        description: "Ajoute les nouveaux résultats, ignore les doublons existants.",
    },
    {
        value: "replace",
        label: "Remplacer tous les résultats",
        description:
            "Supprime tous les résultats existants avant d'importer le fichier.",
    },
];

export default function AdminResultsImportPage() {
    const [password, setPassword] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [mode, setMode] = useState<Mode>("normal");
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!file) return;

        if (mode === "replace") {
            const confirmed = window.confirm(
                "Cette action va supprimer définitivement TOUS les résultats existants avant d'importer le fichier. Continuer ?"
            );
            if (!confirmed) return;
        }

        setStatus("loading");
        setMessage("");

        const formData = new FormData();
        formData.append("password", password);
        formData.append("file", file);
        formData.append("mode", mode);

        try {
            const response = await fetch("/api/admin/results/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                setStatus("error");
                setMessage(data.message ?? "Échec de l'import.");
                return;
            }

            setStatus("success");
            setMessage(
                mode === "replace"
                    ? `Anciens résultats supprimés. ${data.imported} résultat(s) importé(s) avec succès.`
                    : `${data.imported} résultat(s) importé(s) avec succès.`
            );
        } catch {
            setStatus("error");
            setMessage("Une erreur réseau est survenue.");
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16 sm:px-6">
            <div className="rounded-2xl border border-black/10 bg-brand-surface p-6 shadow-sm dark:border-white/10 sm:p-8">
                <h1 className="font-heading text-2xl font-bold text-brand-primary">
                    Import des résultats
                </h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Importer un fichier Excel (.xlsx, .xls) dans la base de
                    résultats.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-primary">
                        Mot de passe administrateur
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm text-zinc-800 outline-none focus:border-brand-primary dark:border-white/20 dark:bg-black dark:text-zinc-200"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-primary">
                        Fichier Excel
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            required
                            className="rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm text-zinc-800 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-brand-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white dark:border-white/20 dark:bg-black dark:text-zinc-200"
                        />
                    </label>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-brand-primary">
                            Mode d&apos;import
                        </span>
                        {MODES.map((option) => (
                            <label
                                key={option.value}
                                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                                    mode === option.value
                                        ? "border-brand-primary bg-brand-primary/5"
                                        : "border-black/15 dark:border-white/20"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="mode"
                                    value={option.value}
                                    checked={mode === option.value}
                                    onChange={() => setMode(option.value)}
                                    className="mt-1"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-brand-primary">
                                        {option.label}
                                    </span>
                                    <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                                        {option.description}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`mt-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 ${
                            mode === "replace" ? "bg-red-600" : "bg-brand-primary"
                        }`}
                    >
                        {status === "loading"
                            ? "Importation…"
                            : mode === "replace"
                              ? "Remplacer et importer"
                              : "Importer"}
                    </button>

                    {message && (
                        <p
                            className={`text-sm font-medium ${
                                status === "success"
                                    ? "text-green-700 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
