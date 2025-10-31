const isTest = process.env.NODE_ENV === "test";

function formatArgs(args) {
  const ts = new Date().toISOString();
  return [ts, ...args];
}

export const info = (...args) => {
  if (isTest) return;
  // eslint-disable-next-line no-console
  console.info(...formatArgs(args));
};

export const warn = (...args) => {
  if (isTest) return;
  // eslint-disable-next-line no-console
  console.warn(...formatArgs(args));
};

export const error = (...args) => {
  // always print errors
  // eslint-disable-next-line no-console
  console.error(...formatArgs(args));
};

export default { info, warn, error };