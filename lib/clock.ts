export const CLOCK_TIME_ZONE = "America/Los_Angeles";

/** "9:41am" and "12 March, 2025" in LA time. */
export function formatClock(date: Date, timeZone = CLOCK_TIME_ZONE): { time: string; date: string } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      day: "numeric",
      month: "long",
      year: "numeric",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return {
    time: `${parts.hour}:${parts.minute}${String(parts.dayPeriod).toLowerCase()}`,
    date: `${parts.day} ${parts.month}, ${parts.year}`,
  };
}
