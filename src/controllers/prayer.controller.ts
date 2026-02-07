import type { Context } from "hono";
import { getPrayerTimesFromEquran } from "../services/equranShalat.service";

function todayJakartaISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

function assertDate(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid "date". Use format YYYY-MM-DD');
  }
}

export async function getPrayerTimes(c: Context) {
  // ✅ default values
  const provinsi = c.req.query("provinsi") ?? "DKI Jakarta";
  const kabkota = c.req.query("kabkota") ?? "Kota Jakarta";
  const date = c.req.query("date") ?? todayJakartaISO();

  assertDate(date);

  const data = await getPrayerTimesFromEquran({
    provinsi,
    kabkota,
    date,
  });

  return c.json(data);
}
