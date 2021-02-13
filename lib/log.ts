export const DEBUG_ENABLED = process.env.NEXT_PUBLIC_DEBUG;

export const log = (...args: any[]) => {
  if (!DEBUG_ENABLED) return;
  console.log(...args);
};
