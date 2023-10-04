export function ToLocalTime(date: Date) {
  date.setUTCHours(date.getUTCHours() + 5);
  date.setUTCMinutes(date.getUTCMinutes() + 30);
  return date;
}

export function FormatDate(Date1: Date) {
  const now = new Date();
  const date1 = new Date(Date1);
  const nowYear = now.getUTCFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = date1.getUTCDate();
  const month = monthNames[date1.getMonth()];
  const day = days[date1.getDay()];
  const year = date1.getUTCFullYear();
  var formattedDate: string;
  if (nowYear === year) {
    formattedDate = date + " " + month + ", " + day;
  } else {
    formattedDate = date + " " + month + ", " + year;
  }
  return formattedDate;
}