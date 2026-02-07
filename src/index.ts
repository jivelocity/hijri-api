import { Hono } from "hono";
import moment from "moment-hijri";
import "moment/locale/id.js"; // ✅ FIX untuk Vercel (Node ESM)

type ErrorResponse = { status: "error"; message: string };

type HijriItem = {
  date: string; // YYYY-MM-DD
  day_name: string; // Senin, Selasa, Ahad
  gregorian_formatted: string; // 07 Februari 2026
  hijri_year: number;
  hijri_month: number;
  hijri_day: number;
  hijri_formatted: string; // Latin
  hijri_arabic: string; // Arab digits + arab month
};

// set default locale indonesia
moment.locale("id");

function toArabicIndicDigits(input: string): string {
  const map: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
  };
  return input.replace(/[0-9]/g, (d) => map[d] ?? d);
}

function normalizeDayName(dayName: string): string {
  return dayName.toLowerCase() === "minggu" ? "Ahad" : dayName;
}

function buildHijriItem(m: moment.Moment): HijriItem {
  const g = m.clone().locale("id");
  const hLatin = m.clone().locale("en");
  const hArabic = m.clone().locale("ar-sa");

  return {
    date: g.format("YYYY-MM-DD"),
    day_name: normalizeDayName(g.format("dddd")),
    gregorian_formatted: g.format("DD MMMM YYYY"),
    hijri_year: Number(hLatin.format("iYYYY")),
    hijri_month: Number(hLatin.format("iMM")),
    hijri_day: Number(hLatin.format("iDD")),
    hijri_formatted: hLatin.format("iDD iMMMM iYYYY"),
    hijri_arabic: toArabicIndicDigits(hArabic.format("iDD iMMMM iYYYY")),
  };
}

const app = new Hono();

app.get("/hijri", (c) => {
  const dateStr = c.req.query("date");
  const m = dateStr ? moment(dateStr, "YYYY-MM-DD", true) : moment();

  if (!m.isValid()) {
    const res: ErrorResponse = {
      status: "error",
      message: 'Invalid "date". Use format YYYY-MM-DD (contoh: 2026-02-07).',
    };
    return c.json(res, 400);
  }

  return c.json([buildHijriItem(m)]);
});

// ✅ untuk Vercel: export app (jangan export { port, fetch } ala Bun)
export default app;
