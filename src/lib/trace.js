import { path as p } from "ramda";

export function trace(label = "", path = false) {
  return function logToConsolAndReturnArgs(value) {
    if (path) {
      console.debug(label, p(path, value));
    } else {
      console.debug(label, value);
    }
    return value;
  };
}
