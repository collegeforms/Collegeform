// Polyfill window/document/localStorage for react-snap
if (typeof window === "undefined") {
  global.window = {};
}
if (typeof document === "undefined") {
  global.document = {
    createElement: () => ({ style: {} }),
    getElementById: () => null,
    querySelector: () => null,
    body: {},
  };
}
if (typeof window.localStorage === "undefined") {
  window.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
}
