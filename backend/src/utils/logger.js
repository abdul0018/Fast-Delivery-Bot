/**
 * Oddiy logger: vaqt belgisi + daraja.
 * LOG_LEVEL=debug|info|warn|error (default: info)
 */
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const current = LEVELS[process.env.LOG_LEVEL] || LEVELS.info;

const write = (level, args) => {
  if (LEVELS[level] < current) return;
  const line = `[${new Date().toISOString()}] ${level.toUpperCase().padEnd(5)}`;
  // eslint-disable-next-line no-console
  (level === 'error' ? console.error : console.log)(line, ...args);
};

module.exports = {
  debug: (...args) => write('debug', args),
  info: (...args) => write('info', args),
  warn: (...args) => write('warn', args),
  error: (...args) => write('error', args),
};
