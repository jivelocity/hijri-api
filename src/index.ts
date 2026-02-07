import { Hono } from "hono";
import moment from "moment-hijri";

type ErrorResponse = {
  status: "error";
  message: string;
};

type SuccessResponse = {
  status: "success";
  gregorian: {
    iso: string;
    dayName: string;
    formatted: string;
  };
  hijri: {
    iYYYY: number;
    iMM: number;
    iDD: number;
    formatted: string; // Latin
    arabic: string; // Arab (dengan angka Arab-Indic)
  };
};

moment.locale("en");

// ✅ konversi angka 0-9 ke Arab-Indic (٠١٢٣٤٥٦٧٨٩)
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

function buildSuccessResponse(m: moment.Moment): SuccessResponse {
  const g = m.clone().locale("en");

  const hijriLatin = m.clone().locale("en");
  const hijriArabicLocale = m.clone().locale("ar-sa");

  const latinHijriText = hijriLatin.format("iDD iMMMM iYYYY");

  // Nama bulan Arab dari locale ar-sa, tapi angkanya kita pastikan Arab-Indic
  const arabicHijriTextRaw = hijriArabicLocale.format("iDD iMMMM iYYYY");
  const arabicHijriText = toArabicIndicDigits(arabicHijriTextRaw);

  return {
    status: "success",
    gregorian: {
      iso: g.format("YYYY-MM-DD"),
      dayName: g.format("dddd"),
      formatted: g.format("DD MMMM YYYY"),
    },
    hijri: {
      iYYYY: Number(hijriLatin.format("iYYYY")),
      iMM: Number(hijriLatin.format("iMM")),
      iDD: Number(hijriLatin.format("iDD")),
      formatted: latinHijriText,
      arabic: arabicHijriText,
    },
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

  return c.json(buildSuccessResponse(m));
});

export default {
  port: 3000,
  fetch: app.fetch,
};
