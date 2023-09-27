export function ToLocalTime(date: Date) {
  date.setUTCHours(date.getUTCHours() + 5);
  date.setUTCMinutes(date.getUTCMinutes() + 30);
  return date;
}
