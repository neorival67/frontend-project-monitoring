/**
 * Utility: Format Rupiah
 * Fungsi murni untuk format mata uang Rupiah.
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Utility: Format Tanggal
 * Fungsi murni untuk format tanggal Indonesia.
 */
export function formatTanggal(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Utility: Format Persentase
 */
export function formatPersentase(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Utility: Kalkulasi EVM (Earned Value Management)
 * Fungsi murni untuk menghitung metrik EVM proyek.
 */
export interface EVMResult {
  pv: number;   // Planned Value
  ev: number;   // Earned Value
  ac: number;   // Actual Cost
  sv: number;   // Schedule Variance (EV - PV)
  cv: number;   // Cost Variance (EV - AC)
  spi: number;  // Schedule Performance Index (EV / PV)
  cpi: number;  // Cost Performance Index (EV / AC)
}

export function kalkulasiEVM(
  plannedValue: number,
  earnedValue: number,
  actualCost: number
): EVMResult {
  return {
    pv: plannedValue,
    ev: earnedValue,
    ac: actualCost,
    sv: earnedValue - plannedValue,
    cv: earnedValue - actualCost,
    spi: plannedValue !== 0 ? earnedValue / plannedValue : 0,
    cpi: actualCost !== 0 ? earnedValue / actualCost : 0,
  };
}

/**
 * Utility: Hitung Progres Total
 * Menghitung progres total berdasarkan bobot dan progres setiap aktivitas.
 */
export function hitungProgesTotal(
  aktivitas: Array<{ bobot: number; progres: number }>
): number {
  const totalBobot = aktivitas.reduce((sum, a) => sum + a.bobot, 0);
  if (totalBobot === 0) return 0;

  const weightedProgress = aktivitas.reduce(
    (sum, a) => sum + (a.bobot / totalBobot) * a.progres,
    0
  );
  return Math.round(weightedProgress * 100) / 100;
}
