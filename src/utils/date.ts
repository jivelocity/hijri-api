import moment from "moment-hijri";

export function parseDateParam(dateStr?: string): moment.Moment {
  const m = dateStr
    ? moment(dateStr, "YYYY-MM-DD", true)
    : todayJakartaMoment();

  if (!m.isValid()) {
    throw new Error(
      'Invalid "date". Use format YYYY-MM-DD (contoh: 2026-02-07).',
    );
  }
  return m;
}

function todayJakartaMoment() {
  // Ambil tanggal hari ini berdasarkan WIB (Asia/Jakarta)
  const todayJakarta = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date()); // YYYY-MM-DD

  return moment(todayJakarta, "YYYY-MM-DD", true);
}
