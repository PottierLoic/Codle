export const getTodayString = () => new Date().toISOString().slice(0, 10);
export const getYesterdayString = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}; 