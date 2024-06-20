export function getFormatedDate(dateStr: number) {
  // Преобразуем строку в объект Date
  const date = new Date(dateStr);

  // Получаем день, месяц и год
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
  const year = date.getUTCFullYear();

  // Получаем часы и минуты
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  // Форматируем дату и время в нужный формат
  const formattedDate = `${day}.${month}.${year} at ${hours}:${minutes}`;

  return formattedDate;
}
