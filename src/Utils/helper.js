// helper exports
export const apiKey = import.meta.env.VITE_REACT_APP_BASE_URL;

export function truncateText(text, length, more) {
  if (text.length <= length) {
    return text;
  }

  return `${text.substring(0, length)} ...`;
}
// return date in this formla 02/03/2024
export function formateDate(date) {
  // "2024-04-17T12:05:16.728Z"
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  return `${day}/${month}/${year}`;
}
export const generateYears = (
  startYear = new Date().getFullYear(),
  endYear = 1900
) => {
  const years = [];
  for (let year = startYear; year >= endYear; year--) {
    years.push({
      name: year.toString(),
      value: year,
    });
  }
  return years;
};

export const convertYearToISOString = (year) => {
  const date = new Date(Date.UTC(year, 0, 1, 0, 0, 2, 24));

  return date.toISOString();
};
