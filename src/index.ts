import { Hono } from "hono";
import moment from "moment-hijri";
import "moment/locale/id.js";

/* =====================
   Helpers
===================== */

moment.locale("id");

function todayJakartaISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

function parseDateParam(dateStr?: string): moment.Moment {
  const iso = dateStr ?? todayJakartaISO();
  const m = moment(iso, "YYYY-MM-DD", true);
  if (!m.isValid()) {
    throw new Error('Invalid "date". Use format YYYY-MM-DD');
  }
  return m;
}

function normalizeDayNameId(day: string): string {
  return day.toLowerCase() === "minggu" ? "Ahad" : day;
}

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

/* =====================
   App
===================== */

const app = new Hono();

/* =====================
   GET /hijri
===================== */

app.get("/hijri", (c) => {
  const m = parseDateParam(c.req.query("date"));

  const g = m.clone().locale("id");
  const hLatin = m.clone().locale("en");
  const hArabic = m.clone().locale("ar-sa");

  return c.json([
    {
      date: g.format("YYYY-MM-DD"),
      day_name: normalizeDayNameId(g.format("dddd")),
      gregorian_formatted: g.format("DD MMMM YYYY"),

      hijri_year: Number(hLatin.format("iYYYY")),
      hijri_month: Number(hLatin.format("iMM")),
      hijri_day: Number(hLatin.format("iDD")),
      hijri_formatted: hLatin.format("iDD iMMMM iYYYY"),
      hijri_arabic: toArabicIndicDigits(hArabic.format("iDD iMMMM iYYYY")),
    },
  ]);
});

/* =====================
   GET /prayer-times
   (EQuran API)
===================== */

app.get("/prayer-times", async (c) => {
  const provinsi = c.req.query("provinsi") ?? "DKI Jakarta";
  const kabkota = c.req.query("kabkota") ?? "Kota Jakarta";
  const dateMoment = parseDateParam(c.req.query("date"));
  const date = dateMoment.format("YYYY-MM-DD");

  const [year, month] = date.split("-").map(Number);

  const res = await fetch("https://equran.id/api/v2/shalat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provinsi,
      kabkota,
      bulan: month,
      tahun: year,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch prayer times");
  }

  const json = await res.json();

  const row = json?.data?.jadwal?.find((x: any) => x.tanggal_lengkap === date);

  if (!row) {
    throw new Error("Prayer times not found for this date");
  }

  return c.json([
    {
      date,
      day_name: normalizeDayNameId(row.hari),
      imsak: row.imsak,
      subuh: row.subuh,
      dhuha: row.dhuha ?? "-",
      dzuhur: row.dzuhur ?? row.dhuhr,
      ashar: row.ashar ?? row.asr,
      maghrib: row.maghrib,
      isya: row.isya,
    },
  ]);
});

/* =====================
   Error Handler
===================== */

app.onError((err, c) => {
  return c.json({ status: "error", message: err.message }, 400);
});

export default app;
