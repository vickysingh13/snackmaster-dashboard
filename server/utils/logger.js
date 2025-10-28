const isTest = process.env.NODE_ENV === "test";

function formatArgs(args) {
  const ts = new Date().toISOString();
  return [ts, ...args];
}

export const info = (...args) => {
  if (isTest) return;
  console.info(...formatArgs(args));
};

export const warn = (...args) => {
  if (isTest) return;
  console.warn(...formatArgs(args));
};

export const error = (...args) => {
  // always print errors even in tests
  console.error(...formatArgs(args));
};

export default { info, warn, error };