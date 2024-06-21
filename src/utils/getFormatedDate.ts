export function getFormatedDate(dateStr: number) {
  const date = new Date(dateStr);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  const formattedDate = `${day}.${month}.${year} at ${hours}:${minutes}`;

  return formattedDate;
}
