export function log(...args) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] [Frogzz]`, ...args);
}