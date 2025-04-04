export const getTodayDateString = () => new Date().toISOString().slice(0, 10);
export const getYesterdayDateString = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};