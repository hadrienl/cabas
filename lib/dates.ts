export const getDistributionTimeRange = (
  startAt: Date | string,
  closeAt: Date | string
) => {
  const now = new Date();
  const s = new Date(startAt);
  const c = new Date(closeAt);
  if (now > s && now < c) {
    return 'current';
  }
  if (now < s) {
    return 'future';
  }
  return 'past';
};
