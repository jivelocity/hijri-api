import type { Context } from "hono";
import { getPrayerTimesFromEquran } from "../services/equranShalat.service";
import { parseDateParam } from "../utils/date.ts";

export async function getPrayerTimes(c: Context) {
  // ✅ default values
  const provinsi = c.req.query("provinsi") ?? "DKI Jakarta";
  const kabkota = c.req.query("kabkota") ?? "Kota Jakarta";
  const dateMoment = parseDateParam(c.req.query("date"));
  const date = dateMoment.format("YYYY-MM-DD");

  const data = await getPrayerTimesFromEquran({
    provinsi,
    kabkota,
    date,
  });

  return c.json(data);
}
