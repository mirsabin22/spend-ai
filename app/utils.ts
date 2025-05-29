export function getTodayKey(timezone: string = 'Asia/Jakarta'): string {
    const date = new Date().toLocaleDateString('sv-SE', { timeZone: timezone });
    return `conversion_rates_${date}`;
}
  