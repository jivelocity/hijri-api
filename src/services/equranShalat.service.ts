import type {
  PrayerTimesItem,
  EquranMonthlyResponse,
} from "../types/prayer.ts";

function normalizeDayNameId(day: string) {
  // kalau EQuran suatu saat pakai "Minggu", kamu tetep mau "Ahad"
  return day.toLowerCase() === "minggu" ? "Ahad" : day;
}

export async function getPrayerTimesFromEquran(params: {
  provinsi: string;
  kabkota: string;
  date: string; // YYYY-MM-DD
}): Promise<PrayerTimesItem[]> {
  const [yStr, mStr] = params.date.split("-");
  const tahun = Number(yStr);
  const bulan = Number(mStr);

  const res = await fetch("https://equran.id/api/v2/shalat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provinsi: params.provinsi,
      kabkota: params.kabkota,
      bulan,
      tahun,
    }),
  });

  if (!res.ok) {
    throw new Error(`EQuran API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as EquranMonthlyResponse;

  if (json.code !== 200 || !json.data?.jadwal) {
    throw new Error(
      `EQuran API invalid response: ${json.message || "unknown"}`,
    );
  }

  const row = json.data.jadwal.find((x) => x.tanggal_lengkap === params.date);
  if (!row) {
    throw new Error(`Jadwal tidak ditemukan untuk tanggal ${params.date}`);
  }
  const dhuha = row.dhuha;

  // handle perbedaan key yang mungkin muncul
  const dzuhur = (row.dzuhur ?? row.dhuhr) as string | undefined;
  const ashar = (row.ashar ?? row.asr) as string | undefined;

  if (!dzuhur || !ashar) {
    throw new Error("Field dzuhur/ashar tidak ditemukan pada response EQuran");
  }

  return [
    {
      date: row.tanggal_lengkap,
      day_name: normalizeDayNameId(row.hari),
      imsak: row.imsak,
      subuh: row.subuh,
      dhuha,
      dzuhur,
      ashar,
      maghrib: row.maghrib,
      isya: row.isya,
    },
  ];
}
