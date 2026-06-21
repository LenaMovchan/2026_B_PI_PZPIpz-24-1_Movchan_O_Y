const getInterval = (remainingTimeInMillis:number):number => {
  const twoHoursInMillis = 7200000;
  const oneHourInMillis = 3600000;
  const twoMinInMillis = 120000;
  const oneMinInMillis = 60000;
  const secondInMillis = 1000;

  if (remainingTimeInMillis >= twoHoursInMillis) return oneHourInMillis;

  if (remainingTimeInMillis >= twoMinInMillis) return oneMinInMillis;

  return secondInMillis;
};
export default getInterval;
