import moment from "moment-hijri";
import "moment/locale/id.js";
import type { HijriItem } from "../types/hijri";
import { normalizeDayNameId, toArabicIndicDigits } from "../utils/digits.ts";

moment.locale("id");

export function buildHijriItem(m: moment.Moment): HijriItem {
  const g = m.clone().locale("id");
  const hLatin = m.clone().locale("en");
  const hArabic = m.clone().locale("ar-sa");

  return {
    date: g.format("YYYY-MM-DD"),
    day_name: normalizeDayNameId(g.format("dddd")),
    gregorian_formatted: g.format("DD MMMM YYYY"),

    hijri_year: Number(hLatin.format("iYYYY")),
    hijri_month: Number(hLatin.format("iMM")),
    hijri_day: Number(hLatin.format("iDD")),
    hijri_formatted: hLatin.format("iDD iMMMM iYYYY"),
    hijri_arabic: toArabicIndicDigits(hArabic.format("iDD iMMMM iYYYY")),
  };
}
