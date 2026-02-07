export type EquranMonthlyResponse = {
  code: number;
  message: string;
  data: {
    provinsi: string;
    kabkota: string;
    bulan: number;
    tahun: number;
    jadwal: Array<{
      tanggal: number;
      tanggal_lengkap: string; // YYYY-MM-DD
      hari: string; // "Kamis", "Jumat", dst
      imsak: string;
      subuh: string;
      dhuha: string;
      dzuhur?: string;
      dhuhr?: string; // kadang API pakai "dhuhr" (cek nyata response)
      ashar?: string;
      asr?: string; // kadang "asr"
      maghrib: string;
      isya: string;
      // ada field lain: terbit, dhuha, dll
      [k: string]: unknown;
    }>;
  };
};

export type PrayerTimesItem = {
  date: string;
  day_name: string;
  imsak: string;
  subuh: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
};
