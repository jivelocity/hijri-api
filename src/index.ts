import { Hono } from "hono";
import moment from "moment-hijri";
import "moment/locale/id";

type ErrorResponse = {
  status: "error";
  message: string;
};

type HijriItem = {
  date: string; // YYYY-MM-DD
  day_name: string; // Senin, Selasa, Ahad
  gregorian_formatted: string; // 07 Februari 2026

  hijri_year: number; // 1447
  hijri_month: number; // 8
  hijri_day: number; // 19
  hijri_formatted: string; // Latin
  hijri_arabic: string; // Arab
};

// Default locale Indonesia
moment.locale("id");

// Konversi digit 0–9 ke Arab-Indic (٠١٢٣٤٥٦٧٨٩)
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

// Mapping hari: Minggu → Ahad
function normalizeDayName(dayName: string): string {
  if (dayName.toLowerCase() === "minggu") {
    return "Ahad";
  }
  return dayName;
}

function buildHijriItem(m: moment.Moment): HijriItem {
  const g = m.clone().locale("id");
  const hLatin = m.clone().locale("en");
  const hArabic = m.clone().locale("ar-sa");

  const dayNameId = normalizeDayName(g.format("dddd"));
  const arabicRaw = hArabic.format("iDD iMMMM iYYYY");

  return {
    date: g.format("YYYY-MM-DD"),
    day_name: dayNameId,
    gregorian_formatted: g.format("DD MMMM YYYY"),

    hijri_year: Number(hLatin.format("iYYYY")),
    hijri_month: Number(hLatin.format("iMM")),
    hijri_day: Number(hLatin.format("iDD")),
    hijri_formatted: hLatin.format("iDD iMMMM iYYYY"),
    hijri_arabic: toArabicIndicDigits(arabicRaw),
  };
}

const app = new Hono();

/**
 * GET /hijri
 * ?date=YYYY-MM-DD (optional)
 */
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

  const result: HijriItem[] = [buildHijriItem(m)];
  return c.json(result);
});

// Bun server entry
export default {
  port: 3000,
  fetch: app.fetch,
};
