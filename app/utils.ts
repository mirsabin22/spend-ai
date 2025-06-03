export function getTodayKey(timezone: string = 'Asia/Jakarta'): string {
    const date = new Date().toLocaleDateString('sv-SE', { timeZone: timezone });
    return `conversion_rates_${date}`;
}
  
export function getBestLocale(): string {
    if (typeof navigator !== "undefined" && navigator.language) {
      return navigator.language; // misalnya: "id-ID", "en-US"
    }
    return "en-US"; // fallback default
  }