import { Hono } from "hono";
import moment from "moment-hijri"; // ✅ penting: ambil moment dari package ini (bukan moment biasa)

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
    arabic: string; // Arab
  };
};

// ✅ pastikan default locale tidak kebawa arab
moment.locale("en");

function buildSuccessResponse(m: moment.Moment): SuccessResponse {
  // pakai clone + set locale biar tidak saling “nular”
  const g = m.clone().locale("en");

  const hijriLatin = m.clone().locale("en");
  const hijriArabic = m.clone().locale("ar-sa");

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
      formatted: hijriLatin.format("iDD iMMMM iYYYY"),
      arabic: hijriArabic.format("iDD iMMMM iYYYY"),
    },
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

  return c.json(buildSuccessResponse(m));
});

// Bun server entry
export default {
  port: 3000,
  fetch: app.fetch,
};
