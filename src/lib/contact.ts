// Verified association contact facts, sourced directly from real posters and
// announcements already in the project (see prisma/seed.ts Activity/News
// entries for the source images). Do not add anything here that isn't
// independently verifiable from that content — no invented numbers/emails.
//
// - Phone "48 48 14 84": printed in the official contact bar (next to the
//   Facebook page name) on /activities/Rv1.jpeg, and again independently on
//   Rv5/Rv6/Rv7.
// - WhatsApp "41 89 99 71": printed as the WhatsApp-join contact on
//   Rv1/Rv3/Rv4.
// - Location "Néma": the wilaya capital named in /activities/Pub1.jpeg's
//   official statement ("بالعاصمة النعمة") and in the "revision-ete-2026"
//   News article.
//
// No verified email address exists anywhere in the project's real content —
// EMAIL_ADDRESS is intentionally left null rather than guessing one.

export const FACEBOOK_URL =
    "https://www.facebook.com/profile.php?id=100083315438426";

export const PHONE_NUMBER = "48481484";
export const PHONE_DISPLAY = "48 48 14 84";
export const PHONE_URL = `tel:+222${PHONE_NUMBER}`;

export const WHATSAPP_NUMBER = "41899971";
export const WHATSAPP_DISPLAY = "41 89 99 71";
export const WHATSAPP_URL = `https://wa.me/222${WHATSAPP_NUMBER}`;

export const EMAIL_ADDRESS: string | null = null;

export const LOCATION = {
    fr: "Néma, Hodh Ech Chargui, Mauritanie",
    en: "Néma, Hodh Ech Chargui, Mauritania",
    ar: "النعمة، ولاية الحوض الشرقي، موريتانيا",
} as const;
